// app/components/layout/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  RefreshCw,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = 2025;

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold">Nexamart</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop destination for premium products. We deliver quality and satisfaction right to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/products" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link 
                  href="/new-arrivals" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link 
                  href="/best-sellers" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link 
                  href="/deals" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Today's Deals
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/shipping" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/returns" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>123 Commerce Street, Suite 100<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <span>support@shopsphere.com</span>
              </li>
            </ul>
            
            {/* Newsletter Subscription */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 text-white text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges / Features */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <Truck className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-400">On orders over $50</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <RefreshCw className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-gray-400">Easy return policy</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-gray-400">100% secure checkout</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Flexible Payment</p>
                <p className="text-xs text-gray-400">Multiple options</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <h4 className="text-sm font-semibold mb-3 text-center md:text-left">We Accept</h4>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
              <div
                key={method}
                className="px-3 py-1.5 bg-gray-800 rounded-md text-xs font-medium"
              >
                {method}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Nexamart. All rights reserved.
            </div>

              {/* App Download Links */}
          <div className="mt-4 flex justify-center space-x-4">
            <a
              href="#"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-black font-bold">A</span>
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-400">Download on the</div>
                <div className="text-sm font-medium">App Store</div>
              </div>
            </a>
            
            <a
              href="#"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-400">Get it on</div>
                <div className="text-sm font-medium">Google Play</div>
              </div>
            </a>
          </div>
            
            
            
            <div className="flex-col items-center space-x-2 text-gray-400 text-sm">
              <div className='flex gap-2'>Made with <Heart className="w-4 h-4 text-red-500 fill-current" />
              by Nadeem Abbas</div>
              <a href="mailto:nadeemmeerza@gmail.com">nadeemmeerza@gmail.com</a>
            </div>
          </div>
          
        
        </div>
      </div>
    </footer>
  );
};

export default Footer;