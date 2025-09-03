import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  ChevronDown
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";

import { selectCurrentUser, selectUserRole } from "@/redux/features/auth/authSlice";
import { useLogoutMutation } from "@/redux/features/auth/auth.api";
import { ROLES } from "@/constants/role";
import Logo from "@/assets/Logo";
import toast from "react-hot-toast";

// Navigation items based on user role
const getNavigationItems = (role: string) => {
  const commonItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home }
  ];

  const roleSpecificItems = {
    [ROLES.RIDER]: [
      { href: "/dashboard/book-ride", label: "Book Ride", icon: "🚗" },
      { href: "/dashboard/rides", label: "My Rides", icon: "📋" },
      { href: "/dashboard/payment-methods", label: "Payment Methods", icon: "💳" },
      { href: "/dashboard/profile", label: "Profile", icon: User },
    ],
    [ROLES.DRIVER]: [
      { href: "/dashboard/availability", label: "Availability", icon: "🟢" },
      { href: "/dashboard/rides", label: "My Rides", icon: "📋" },
      { href: "/dashboard/earnings", label: "Earnings", icon: "💰" },
      { href: "/dashboard/profile", label: "Profile", icon: User },
    ],
    [ROLES.ADMIN]: [
      { href: "/dashboard/users", label: "Users", icon: "👥" },
      { href: "/dashboard/drivers", label: "Drivers", icon: "🚗" },
      { href: "/dashboard/rides", label: "All Rides", icon: "📋" },
      { href: "/dashboard/analytics", label: "Analytics", icon: "📊" },
      { href: "/dashboard/profile", label: "Profile", icon: User },
    ]
  };

  return [...commonItems, ...(roleSpecificItems[role] || [])];
};

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  const userRole = useSelector(selectUserRole);
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();

  const navigationItems = getNavigationItems(userRole || "");

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      // Force logout on client side even if server call fails
      navigate("/");
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/" className="text-primary">
              <Logo />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {typeof item.icon === "string" ? (
                        <span className="text-lg">{item.icon}</span>
                      ) : (
                        <item.icon className="w-5 h-5" />
                      )}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user?.name}</div>
                <div className="text-xs text-gray-500 truncate capitalize">{user?.role?.toLowerCase()}</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu trigger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Search bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 border-b hover:bg-gray-50">
                      <div className="text-sm font-medium mb-1">New ride request</div>
                      <div className="text-xs text-gray-500">2 minutes ago</div>
                    </div>
                    <div className="p-4 border-b hover:bg-gray-50">
                      <div className="text-sm font-medium mb-1">Payment completed</div>
                      <div className="text-xs text-gray-500">1 hour ago</div>
                    </div>
                    <div className="p-4 hover:bg-gray-50">
                      <div className="text-sm font-medium mb-1">Profile updated</div>
                      <div className="text-xs text-gray-500">3 hours ago</div>
                    </div>
                  </div>
                  <div className="p-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* User menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block">{user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  <div className="space-y-1">
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 w-full text-left text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
