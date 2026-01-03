// app/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  Star,
  ChevronLeft,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import { useNotification } from "@/app/context/NotificationContext";
import useCart from "@/app/context/CartContext";
import { Product } from "@/app/types/product.types";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { addNotification } = useNotification();

  const [product, setProduct] = useState<Product | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${params.id}`);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const productData = await response.json();
        console.log("Product data:", productData);

        // Add computed fields for UI
        const enhancedProduct: Product = {
          ...productData,
          // Computed fields
          isNew: isProductNew(productData.createdAt),
          discount: productData.comparePrice
            ? Math.round(
                ((productData.comparePrice - productData.price) /
                  productData.comparePrice) *
                  100
              )
            : undefined,
          originalPrice: productData.comparePrice,
          image: productData.images?.[0] || productData.thumbnail,

          // You'll need to fetch these from related tables
          category: "Running Shoes", // Fetch from categories table using categoryId
          brand: "Adidas", // Extract from name or have a brands table
          stock: 50, // This should come from your inventory table
          // Sample specs - you can store these in metadata or have a separate specs table
          specs: {
            Weight: `${productData.weight}kg`,
            Material: "Primeknit",
            Sole: "Boost Foam",
            Closure: "Lace-up",
            Technology: "Energy Return",
          },
        };

        setProduct(enhancedProduct);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        addNotification("Failed to load product", "error");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, addNotification]);

  const isProductNew = (createdAt: string): boolean => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // Product is "new" if created within last 30 days
  };

  const handleAddToCart = () => {
    if (!product) return;

    try {
      // Create cart item with only necessary fields
      // const cartItem = {
      //   id: product.id,
      //   name: product.name,
      //   price: product.price,
      //   quantity: quantity,
      //   image: product.image,
      //   rating:product.rating,
      //   reviews:product.reviews,
      //   category:product.category,
      //    brand:product.brand
      // sku: product.sku,
      // slug: product.slug
      // };

      addToCart(product, quantity);
      addNotification(`${quantity} ${product.name} added to cart!`, "success");
    } catch (error) {
      addNotification("Failed to add to cart", "error");
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    addNotification(
      isFavorite ? "Removed from wishlist" : "Added to wishlist",
      "success"
    );
  };

  const handleQuantityChange = (value: number) => {
    if (!product || !product.stock) return;
    const newQuantity = Math.max(1, Math.min(product.stock, quantity + value));
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 bg-amber-400 px-6 py-4 rounded-md font-bold text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {images[selectedImage] ? (
                  <>
                    <Image
                      src={images[selectedImage]}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                      priority
                    />
                    {/* {product.isNew && <Badge variant="success">New</Badge>} */}
                    {product.discount && (
                      <Badge
                        variant="warning"
                        className="top-40 left-50 px-6 -rotate-45"
                      >
                        -{product.discount}%
                      </Badge>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                    >
                      {image ? (
                        
                          <Image
                            src={image}
                            alt={`${product.name} view ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-gray-500 font-medium">
                    SKU: {product.sku}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500 font-medium">
                    {product.status}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium text-gray-700">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.comparePrice &&
                  product.comparePrice > product.price && (
                    <span className="text-2xl text-gray-500 line-through">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                  )}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {product.description}
                </p>
                {product.shortDescription && (
                  <p className="text-gray-600 font-medium">
                    {product.shortDescription}
                  </p>
                )}
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Weight:</span>
                  <span className="ml-2 text-gray-900">
                    {product.weight} kg
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Brand:</span>
                  <span className="ml-2 text-gray-900">{product.brand}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="ml-2 text-gray-900">{product.category}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="ml-2 text-gray-900 capitalize">
                    {product.status}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-lg font-medium">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-medium w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={!product.stock || quantity >= product.stock}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock || 0} available
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.stock || product.stock === 0}
                  className="flex-1 py-3 text-lg"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  onClick={()=>handleFavorite}
                  className="p-3"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </Button>
              </div>

              {/* Stock Status */}
              <div className="text-lg">
                {!product.stock || product.stock === 0 ? (
                  <span className="text-red-600 font-medium">
                    ✗ Out of Stock
                  </span>
                ) : product.stock > 5 ? (
                  <span className="text-green-600 font-medium">✓ In Stock</span>
                ) : (
                  <span className="text-orange-600 font-medium">
                    ⚠ Only {product.stock} left in stock
                  </span>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-gray-700">
                  <Truck className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-gray-500">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <RotateCcw className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium">30-Day Returns</p>
                    <p className="text-sm text-gray-500">
                      Money back guarantee
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Shield className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium">2-Year Warranty</p>
                    <p className="text-sm text-gray-500">Full protection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Section */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="border-t border-gray-200 p-8">
              <h2 className="text-2xl font-bold mb-6">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-3 border-b border-gray-100"
                  >
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
