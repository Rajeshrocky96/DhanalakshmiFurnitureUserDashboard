import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { fetchSections } from "@/services/api";
import { Section } from "@/types/api";

const Footer = () => {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = await fetchSections();
        setSections(data.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      }
    };
    loadSections();
  }, []);

  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "917448856172";
  const email = import.meta.env.VITE_CONTACT_EMAIL || "rocky744row@gmail.com";
  const facebookUrl = import.meta.env.VITE_SOCIAL_FACEBOOK || "#";
  const instagramUrl = import.meta.env.VITE_SOCIAL_INSTAGRAM || "#";
  const twitterUrl = import.meta.env.VITE_SOCIAL_TWITTER || "#";

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container-custom py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img src="/ds-logo.png" alt="Logo" className="w-full h-full object-cover scale-125" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl leading-tight">Dhanalakshmi</h3>
                <p className="text-sm text-muted-foreground -mt-1">Furnitures</p>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Your trusted destination for premium furniture and home appliances.
              Quality products, affordable prices, and exceptional service since 1995.
            </p>
            <div className="flex gap-3">
              <a href={facebookUrl} className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={instagramUrl} className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={twitterUrl} className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Sections Links */}
          <div className="col-span-2">
            <h4 className="font-heading font-semibold text-lg mb-4">Shop By Section</h4>
            <ul className="grid grid-cols-2 gap-2">
              {sections.filter(s => s.showOnHome).map((section) => (
                <li key={section.sectionId}>
                  <Link
                    to={`/section/${section.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {section.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${phoneNumber}`} className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors text-sm">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{phoneNumber}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-3 text-muted-foreground hover:text-primary transition-colors text-sm">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Main Road, Near Bus Stand, City Center</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-muted/20">
        <div className="container-custom py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
          <p>© 2024 Dhanalakshmi Furnitures. All rights reserved.</p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
