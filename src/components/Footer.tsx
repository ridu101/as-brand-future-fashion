import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative mt-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-heading font-bold text-gradient mb-3">AS Brand</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium fashion by Mohammad Azharul Islam. Redefining style with a futuristic edge.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Shop", "Categories", "Trending", "About"].map(l => (
                <li key={l}>
                  <Link to={l === "Home" ? "/" : `/${l.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              {["Panjabi", "Shirt", "T-Shirt", "Hoodie", "Jacket"].map(c => (
                <li key={c}>
                  <Link to={`/${c.toLowerCase().replace("-", "")}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Owner: Mohammad Azharul Islam</li>
              <li>Email: support@asbrand.com</li>
              <li className="pt-2 flex gap-3">
                {["Facebook", "Instagram", "Twitter"].map(s => (
                  <a key={s} href="#" className="hover:text-primary transition-colors">{s}</a>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/30 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AS Brand. All rights reserved. Designed with ♥ by Mohammad Azharul Islam.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
