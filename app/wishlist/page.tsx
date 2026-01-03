// app/(pages)/wishlist/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Container from '@/app/components/ui/Container';
import ProductGrid from '@/app/components/products/ProductGrid';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import { useWishlist, WishlistItem } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';
import { useNotification } from '@/app/context/NotificationContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import EmptyState from '../components/ui/EmptyState';


const WishlistPage = () => {
  const { wishlist, removeFromWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const { addNotification } = useNotification();
  const { data: session, status } = useSession();
  const [isBulkAdding, setIsBulkAdding] = useState(false);

  const handleAddToCart = async (product: WishlistItem) => {
    try {
      addToCart(product, 1);
      addNotification(`${product.name} added to cart!`, 'success');
    } catch (error) {
      addNotification('Failed to add to cart', 'error');
    }
  };

  const handleAddAllToCart = async () => {
    if (wishlist.length === 0) return;

    setIsBulkAdding(true);
    try {
      for (const product of wishlist) {
        addToCart(product, 1);
      }
      addNotification(`Added ${wishlist.length} items to cart!`, 'success');
    } catch (error) {
      addNotification('Failed to add items to cart', 'error');
    } finally {
      setIsBulkAdding(false);
    }
  };

  const handleRemoveAll = async () => {
    if (wishlist.length === 0) return;

    if (confirm('Are you sure you want to remove all items from your wishlist?')) {
      const removePromises = wishlist.map(item => removeFromWishlist(item.id));
      await Promise.all(removePromises);
      addNotification('All items removed from wishlist', 'success');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <Container>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Container>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Container>
        <EmptyState
          icon={<Heart className="w-16 h-16 text-gray-400" />}
          title="Sign in to view your wishlist"
          description="Please login to save items to your wishlist"
          action={
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          }
        />
      </Container>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Container>
        <EmptyState
          icon={<Heart className="w-16 h-16 text-gray-400" />}
          title="Your wishlist is empty"
          description="Add products you love to your wishlist to save them for later"
          action={
            <Link href="/">
              <Button>
                Browse Product              
              </Button>
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-gray-600 mt-2">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleAddAllToCart}
              disabled={isBulkAdding || wishlist.length === 0}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {isBulkAdding ? 'Adding...' : 'Add All to Cart'}
            </Button>
            <Button
             
              onClick={handleRemoveAll}
              disabled={wishlist.length === 0}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Remove All
            </Button>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-4"
            >
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
              </button>

              {/* Product Image */}
              <div className="relative h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <Link href={`/products/${item.id}`}>
                  {item.images[0]?.startsWith('http') ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {item.images[0]}
                    </div>
                  )}
                </Link>
                {item.isNew && (
                  <span className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    New
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-semibold line-clamp-2 hover:text-blue-600">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-black">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 ">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {item.stock > 0 ? (
                    <span className="text-green-600">In Stock</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>

                {/* Actions */}
                <div className="gap-2 pt-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.stock === 0}
                    variant={item.stock > 0 ? 'default' : 'secondary'}   
                     className="w-full flex items-center justify-center"                                   
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-gray-600">
                Items in wishlist: <span className="font-semibold">{wishlist.length}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Items will be saved until you remove them
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/cart">
                <Button>
                  View Cart                  
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default WishlistPage;