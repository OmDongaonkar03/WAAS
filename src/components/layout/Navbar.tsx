import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  History, 
  User,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "History", href: "/history", icon: History },
  { label: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="font-medium tracking-tight text-foreground">
            WAAS
          </Link>

          {/* Desktop Navigation */}
          {!isLanding && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-2 h-8 px-3 text-sm font-normal ${
                        isActive 
                          ? "text-foreground bg-secondary" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isLanding ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="h-8 px-3 text-sm font-normal text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="h-8 px-4 text-sm font-medium bg-foreground text-background hover:bg-foreground/90">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">J</span>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="container mx-auto px-6 py-4 space-y-1">
              {!isLanding && navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              {isLanding && (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm font-normal">Sign In</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full text-sm font-medium bg-foreground text-background">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
