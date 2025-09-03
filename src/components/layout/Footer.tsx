import { Link } from "react-router";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Smartphone,
  Apple
} from "lucide-react";
import Logo from "@/assets/Logo";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Features", href: "/features" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" }
  ],
  services: [
    { label: "Book a Ride", href: "/register" },
    { label: "Become a Driver", href: "/register" },
    { label: "Business Solutions", href: "/contact" },
    { label: "Safety Center", href: "/faq" }
  ],
  support: [
    { label: "Help Center", href: "/faq" },
    { label: "Safety Guidelines", href: "/faq" },
    { label: "Report an Issue", href: "/contact" },
    { label: "Emergency", href: "tel:911" }
  ],
  legal: [
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Accessibility", href: "#" }
  ]
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" }
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="text-white">
                <Logo />
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              RideEase is revolutionizing urban transportation by connecting riders 
              with professional drivers through cutting-edge technology and exceptional service.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-primary" />
                <span>support@rideease.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-primary" />
                <span>123 Innovation Drive, Tech Valley, CA 94025</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('tel:') ? (
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link 
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App Download Section */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-4">Download the RideEase App</h3>
              <p className="text-gray-300 mb-6">
                Get the best ride booking experience on your mobile device.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#" 
                  className="inline-flex items-center px-4 py-2 bg-black rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Apple className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center px-4 py-2 bg-black rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Smartphone className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="lg:text-right">
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex justify-start lg:justify-end gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                      aria-label={social.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} RideEase. All rights reserved.
            </p>
            <p className="text-gray-300 text-sm mt-2 md:mt-0">
              Made with ❤️ for better transportation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
