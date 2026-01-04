import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext'; // TODO: Enable when AuthContext is available
import {
    LayoutDashboard,
    Package,
    Image,
    FolderTree,
    Layers,
    Grid3X3,
    MessageSquare,
    LogOut,
    Menu,
    X,
    ChevronRight,
    User,
} from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
    breadcrumbs?: { label: string; href?: string }[];
    isLoading?: boolean;
}

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: Image, label: 'Banners', href: '/admin/banners' },
    { icon: FolderTree, label: 'Categories', href: '/admin/categories' },
    { icon: Layers, label: 'Subcategories', href: '/admin/subcategories' },
    { icon: Grid3X3, label: 'Sections', href: '/admin/sections' },
    { icon: MessageSquare, label: 'Enquiries', href: '/admin/enquiries' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, breadcrumbs, isLoading }) => {
    // const { user, logout } = useAuth();
    const user = { username: 'Admin' }; // Mock user
    const logout = () => { }; // Mock logout

    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (href: string) => {
        if (href === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between px-6 h-16 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-xs">
                                DF
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-lg font-semibold text-foreground leading-none">
                                    Dhanalakshmi
                                </h1>
                                <span className="text-xs text-muted-foreground mt-1">Furnitures</span>
                            </div>
                        </div>
                        <button
                            className="lg:hidden text-foreground"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 overflow-y-auto">
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <li key={item.href}>
                                        <Link
                                            to={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${active
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                                }`}
                                        >
                                            <Icon size={18} />
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Logout */}
                    <div className="p-3 border-t border-border">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-card border-b border-border">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu size={20} />
                            </button>

                            {/* Breadcrumbs */}
                            <div className="hidden sm:flex items-center gap-2 text-sm">
                                <Link to="/admin" className="text-muted-foreground hover:text-foreground">
                                    Admin
                                </Link>
                                {breadcrumbs?.map((crumb, index) => (
                                    <React.Fragment key={index}>
                                        <ChevronRight size={14} className="text-muted-foreground" />
                                        {crumb.href ? (
                                            <Link to={crumb.href} className="text-muted-foreground hover:text-foreground">
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="text-foreground font-medium">{crumb.label}</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* User info */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                                <User size={16} className="text-muted-foreground" />
                                <span className="text-sm font-medium">{user?.username || 'Admin'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
                    </div>

                    {isLoading ? (
                        <div className="flex h-[50vh] items-center justify-center">
                            <Loader size="lg" />
                        </div>
                    ) : (
                        children
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
