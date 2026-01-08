// app/components/products/ProductCard/ProductCard.tsx
"use client";

import { useState } from "react";
import Card from "@/app/components/ui/Card";
import { Heart, Star } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import { Product } from "@/app/types/product.types";
import Button from "@/app/components/ui/Button";
import { useNotification } from "@/app/context/NotificationContext";
import useCart from "@/app/context/CartContext";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/app/context/WishlistContext";

const ProductCard = ({ product }: { product: Product }) => {
   const { isInWishlist, toggleWishlist, isLoading: wishlistLoading } = useWishlist();
  const [isFavorite, setIsFavorite] = useState(isInWishlist(product.id));
  const { addToCart } = useCart();
  const { addNotification } = useNotification();
  const router = useRouter();
 
  const handleAddToCart = () => {
     console.log("adding to cart");
    try {
      addToCart(product, 1);
      addNotification(`${product.name} added to cart!`, "success");
    } catch (error) {
      addNotification("Failed to add to cart", "error");
    }
  };



  const handleFavorite =async () => {
    setIsFavorite(!isFavorite);
    await toggleWishlist(product);   
  };

  

  
  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };


  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100 overflow-hidden rounded-lg mb-4">
        <div className="text-6xl flex items-center justify-center h-full group-hover:scale-110 transition-transform duration-300">

          {product && product?.images[0]?.startsWith("http") ? (
            <Image
              src={product?.images[0]}
              alt={product?.name}
              width={192} // 48 * 4 (since parent is h-48)
              height={192} // 48 * 4
              className="w-full h-full object-cover"
            />
          ) : (
           
             product?.images[0]
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {/* {product.isNew && <Badge variant="success">New</Badge>} */}
          {product.discount && (
            <Badge variant="warning" className="px-6 -mx-4 -rotate-45"  >-{product.discount}%</Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3"  >
        {/* Category */}
        <p className="text-sm text-gray-500 font-medium">{product.category}</p>

        {/* Name */}
        <h3 className="font-semibold text-lg line-clamp-2 hover:text-gray-600 cursor-pointer" onClick={handleCardClick}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-black">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="text-sm">
          {product.stock > 5 ? (
            <span className="text-green-600 font-medium">In Stock</span>
          ) : product.stock > 0 ? (
            <span className="text-orange-600 font-medium">
              Only {product.stock} left
            </span>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant={product.stock > 0 ? "default" : "secondary"}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full"
        >
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
