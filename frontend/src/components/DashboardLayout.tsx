import { useEffect, useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, BarChart3, History, Settings, ChevronLeft, ChevronRight, LogOut, Brain, FileText, LayoutDashboard, MessageSquareText, Plane, Menu, X,
} from "lucide-react";
import Footer from "./Footer";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Upload", icon: Upload, path: "/dashboard/upload" },
  { label: "Analysis", icon: BarChart3, path: "/dashboard/analysis" },
  { label: "Question Paper", icon: FileText, path: "/dashboard/question-paper" },
  { label: "Ask Qurio AI", icon: MessageSquareText, path: "/dashboard/ask-qurio-ai" },
  { label: "Multi-Exam Layer", icon: Plane, path: "/dashboard/multi-exam-expansion" },
  { label: "History", icon: History, path: "/dashboard/history" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:flex glass-panel border-r border-border flex-col relative z-20"
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="h-16 flex items-center px-4 border-b border-border">
          <Brain className="w-7 h-7 text-primary shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3 overflow-hidden"
              >
                <p className="font-bold text-lg gradient-text whitespace-nowrap">AxisStudy AI</p>
                <p className="text-[11px] italic text-slate-400/80 whitespace-nowrap leading-tight">
                  Silence the Uncertainty
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const active = item.path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active ? "bg-primary/10 text-primary neon-border" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-border space-y-1">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              className="md:hidden fixed inset-0 bg-black/60 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              className="md:hidden fixed inset-y-0 left-0 w-72 max-w-[88vw] glass-panel border-r border-border z-40 flex flex-col"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                <div className="flex items-center gap-3 min-w-0">
                  <Brain className="w-7 h-7 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-lg gradient-text whitespace-nowrap">AxisStudy AI</p>
                    <p className="text-[11px] italic text-slate-400/80 whitespace-nowrap leading-tight">
                      Silence the Uncertainty
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const active = item.path === "/dashboard"
                    ? location.pathname === "/dashboard"
                    : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                        ${active ? "bg-primary/10 text-primary neon-border" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-2 border-t border-border">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span>Log out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto flex flex-col relative z-10">
        <header className="md:hidden sticky top-0 z-20 glass-panel border-b border-border h-14 px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <p className="font-semibold gradient-text text-sm">AxisStudy AI</p>
          <span className="w-9" />
        </header>

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto flex-1 w-full min-w-0"
        >
          <Outlet />
        </motion.div>
        <Footer />
      </main>
    </div>
  );
};

export default DashboardLayout;
