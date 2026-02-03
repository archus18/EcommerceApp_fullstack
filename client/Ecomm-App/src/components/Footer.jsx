import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-cyan-500 to-green-500 text-white mt-14">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-3">ShopEase</h2>
          <p className="text-sm opacity-90">
            Your one-stop destination for smart shopping.  
            Discover amazing products at unbeatable prices.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-semibold mb-3">Shop</h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li><Link to="/products" className="hover:underline">All Products</Link></li>
            <li><Link to="/wishlist" className="hover:underline">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:underline">Cart</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li className="hover:underline cursor-pointer">Help Center</li>
            <li className="hover:underline cursor-pointer">Contact Us</li>
            <li className="hover:underline cursor-pointer">Returns</li>
            <li className="hover:underline cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Email: support@shopease.com</li>
            <li>Phone: +91 90000 00000</li>
            <li>India</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center py-4 border-t border-white/20 text-sm opacity-90">
        © {new Date().getFullYear()} ShopEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
