// prisma/seed.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // First, create categories
  console.log('📁 Creating categories...')
  const categories = await prisma.category.createMany({
    data: [
      {
        id: '507f1f77bcf86cd799439021',
        name: 'Shoes',
        slug: 'shoes',
        description: 'Footwear for all occasions',
        image: 'https://example.com/images/categories/shoes.jpg',
        status: 'active',
        displayOrder: 1,
      },
      {
        id: '507f1f77bcf86cd799439022',
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest mobile phones and smartphones',
        image: 'https://example.com/images/categories/smartphones.jpg',
        status: 'active',
        displayOrder: 2,
      },
      {
        id: '507f1f77bcf86cd799439023',
        name: 'Laptops',
        slug: 'laptops',
        description: 'Computers and laptops for work and gaming',
        image: 'https://example.com/images/categories/laptops.jpg',
        status: 'active',
        displayOrder: 3,
      }
    ],
   
  })

  console.log(`✅ Created ${categories.count} categories`)

  // Then, create products
  console.log('📦 Creating products...')
  const products = await prisma.product.createMany({
    data: [
      {
        id: '507f1f77bcf86cd799439011',
        sku: 'NB-001',
        name: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        description: 'Comfortable running shoes with Air Max technology for maximum cushioning.',
        shortDescription: 'Premium running shoes with Air cushioning',
        categoryId: '507f1f77bcf86cd799439021',
        price: 129.99,
        comparePrice: 149.99,
        costPrice: 75.00,
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
        weight: 0.8,
        status: 'active',
        visibility: 'visible',
        rating: 4.5,
        reviewCount: 128,
      },
      {
        id: '507f1f77bcf86cd799439012',
        sku: 'AD-002',
        name: 'Adidas Ultraboost 21',
        slug: 'adidas-ultraboost-21',
        description: 'High-performance running shoes with Boost technology for energy return.',
        shortDescription: 'Energy-return running shoes',
        categoryId: '507f1f77bcf86cd799439021',
        price: 179.99,
        comparePrice: 199.99,
        costPrice: 95.00,
        images: [
          'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500',
          'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300',
        weight: 0.7,
        status: 'active',
        visibility: 'visible',
        rating: 4.7,
        reviewCount: 95,
      },
      {
        id: '507f1f77bcf86cd799439013',
        sku: 'AP-003',
        name: 'Apple iPhone 15 Pro',
        slug: 'apple-iphone-15-pro',
        description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
        shortDescription: 'Flagship smartphone with titanium design',
        categoryId: '507f1f77bcf86cd799439022',
        price: 999.00,
        comparePrice: 1199.00,
        costPrice: 750.00,
        images: [
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
          'https://images.unsplash.com/photo-1695048133148-8ff6c53d3643?w=500'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300',
        weight: 0.187,
        status: 'active',
        visibility: 'visible',
        rating: 4.8,
        reviewCount: 256,
      },
      {
        id: '507f1f77bcf86cd799439014',
        sku: 'SM-004',
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Premium Android smartphone with S Pen, advanced AI features, and pro-grade camera.',
        shortDescription: 'AI-powered flagship Android phone',
        categoryId: '507f1f77bcf86cd799439022',
        price: 1199.99,
        comparePrice: 1299.99,
        costPrice: 850.00,
        images: [
          'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300',
        weight: 0.232,
        status: 'active',
        visibility: 'visible',
        rating: 4.6,
        reviewCount: 187,
      },
      {
        id: '507f1f77bcf86cd799439015',
        sku: 'LP-005',
        name: 'MacBook Pro 16-inch',
        slug: 'macbook-pro-16-inch',
        description: 'Professional laptop with M3 Pro chip, Liquid Retina XDR display, and all-day battery life.',
        shortDescription: 'Professional laptop for creators',
        categoryId: '507f1f77bcf86cd799439023',
        price: 2499.00,
        comparePrice: 2699.00,
        costPrice: 1800.00,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
        ],
        thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
        weight: 2.15,
        status: 'active',
        visibility: 'visible',
        rating: 4.9,
        reviewCount: 89,
      }
    ],
    
  })

  console.log(`✅ Created ${products.count} products`)
  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })