// // app/api/cart/sync/route.ts

// import prisma from "@/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     console.log('🔄 SYNC: Starting cart sync...');
    
//     const body = await request.json();
//     const { userId, items } = body;
    
//     console.log('📥 SYNC: Request data:', { 
//       userId, 
//       itemsCount: items?.length,
//       sampleItems: items?.slice(0, 3) // Show first 3 items
//     });

//     // Validate input
//     if (!userId) {
//       return NextResponse.json({ 
//         error: 'User ID is required'
//       }, { status: 400 });
//     }

//     if (!items || !Array.isArray(items)) {
//       return NextResponse.json({ 
//         error: 'Valid items array is required'
//       }, { status: 400 });
//     }

//     // Find or create cart
//     let cart = await prisma.cart.findUnique({
//       where: { userId },
//       include: {
//         items: true,
//       },
//     });

//     if (!cart) {
//       cart = await prisma.cart.create({
//         data: { 
//           userId,
//           subtotal: 0,
//           taxAmount: 0,
//           shippingCost: 0,
//           discountAmount: 0,
//           total: 0
//         },
//         include: {
//           items: true,
//         },
//       });
//     }

//     // Convert all incoming product IDs to strings and filter valid ones
//     const validItems = items.filter(item => {
//       const productId = String(item.id);
//       // Check if it's a valid MongoDB ObjectId format (24 character hex string)
//       const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(productId);
      
//       if (!isValidObjectId) {
//         console.warn(`⚠️ SYNC: Skipping invalid product ID format: ${productId}`);
//         return false;
//       }
//       return true;
//     });

//     console.log(`📦 SYNC: ${validItems.length} valid items out of ${items.length} total`);

//     if (validItems.length === 0) {
//       console.log('🔄 SYNC: No valid items to sync, clearing cart');
//       await prisma.cartItem.deleteMany({
//         where: { cartId: cart.id },
//       });
      
//       return NextResponse.json({ 
//         success: true, 
//         items: [],
//         message: 'No valid products to sync'
//       });
//     }

//     // Get current cart items for comparison
//     const currentCartItems = cart.items || [];
    
//     // Create maps for comparison
//     const existingItemsMap = new Map(
//       currentCartItems.map(item => [item.productId, item])
//     );

//     const newItemsMap = new Map(
//       validItems.map(item => [String(item.id), item])
//     );

//     // Items to delete (exist in current cart but not in new items)
//     const itemsToDelete = currentCartItems.filter(
//       item => !newItemsMap.has(item.productId)
//     );

//     console.log('🗑️ SYNC: Items to delete:', itemsToDelete.length);

//     // Perform operations in a transaction
//     await prisma.$transaction(async (tx) => {
//       // Delete removed items
//       if (itemsToDelete.length > 0) {
//         await tx.cartItem.deleteMany({
//           where: {
//             id: {
//               in: itemsToDelete.map(item => item.id),
//             },
//           },
//         });
//       }

//       // Get all product IDs that exist in database in one query
//       const productIds = validItems.map(item => String(item.id));
//       const existingProducts = await tx.product.findMany({
//         where: {
//           id: { in: productIds }
//         },
//         select: { id: true }
//       });

//       const existingProductIds = new Set(existingProducts.map(p => p.id));
//       console.log(`✅ SYNC: Found ${existingProductIds.size} existing products in database`);

//       // Process only items that have existing products
//       for (const item of validItems) {
//         const productId = String(item.id);
//         const existingItem = existingItemsMap.get(productId);
        
//         if (!existingProductIds.has(productId)) {
//           console.warn(`⚠️ SYNC: Product ${productId} not found in database, skipping`);
//           continue;
//         }

//         if (existingItem) {
//           // Update existing item
//           await tx.cartItem.update({
//             where: { id: existingItem.id },
//             data: {
//               quantity: item.quantity,
//               price: item.price,
//               updatedAt: new Date(),
//             },
//           });
//         } else {
//           // Create new item
//           await tx.cartItem.create({
//             data: {
//               cartId: cart.id,
//               productId: productId,
//               quantity: item.quantity,
//               price: item.price,
//             },
//           });
//         }
//       }
//     });

//     // Return the updated cart with items
//     const updatedCart = await prisma.cart.findUnique({
//       where: { userId },
//       include: {
//         items: {
//           include: {
//             product: true,
//           },
//         },
//       },
//     });

//     // Format response
//     const formattedItems = updatedCart?.items.map(item => ({
//       ...item.product,
//       quantity: item.quantity,
//       price: item.price,
//     })) || [];

//     console.log('🎉 SYNC: Sync completed successfully');

//     return NextResponse.json({ 
//       success: true, 
//       items: formattedItems,
//       syncedCount: formattedItems.length
//     });

//   } catch (error) {
//     console.error('❌ SYNC: Failed to sync cart:', error);
    
//     return NextResponse.json({ 
//       error: 'Failed to sync cart',
//       details: error instanceof Error ? error.message : 'Unknown error'
//     }, { status: 500 });
//   }
// }