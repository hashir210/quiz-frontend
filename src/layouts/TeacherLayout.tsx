import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import Logo from '../components/Logo';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'My Quizzes', icon: FileText, path: '/quizzes' },
  { label: 'Results', icon: BarChart3, path: '/results' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    (localStorage.getItem('theme') as 'dark' | 'light' | null) || 'dark'
  );

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const [teacherName, setTeacherName] = useState(() => localStorage.getItem('name') || 'Teacher');
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('avatar') || '');

  // Listen for profile updates from SettingsPage (no page reload needed)
  useEffect(() => {
    const handleProfileUpdate = () => {
      setTeacherName(localStorage.getItem('name') || 'Teacher');
      setAvatarUrl(localStorage.getItem('avatar') || '');
    };
    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        {/* Logo */}
        <SidebarHeader className="px-4 py-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <Logo size={28} />
            <span className="font-heading text-lg font-bold text-[var(--theme-text-main)] truncate group-data-[collapsible=icon]:hidden">
              QuizFlow
            </span>
          </div>
        </SidebarHeader>

        <SidebarSeparator />

        {/* Navigation */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + '/');
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <Link to={item.path}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

        {/* Footer — Theme toggle, user info, logout */}
        <SidebarFooter>
          {/* Theme Toggle */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={toggleTheme}
                tooltip={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* User Info */}
          <div className="flex items-center gap-3 rounded-lg p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1">
            <Avatar className="size-8 shrink-0 rounded-lg border border-[var(--theme-border)]">
              {avatarUrl ? (
                <img src={avatarUrl} alt={teacherName} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <AvatarFallback className="rounded-lg text-xs font-bold bg-primary text-white">
                  {teacherName[0]?.toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-semibold text-[var(--theme-text-main)] truncate">
                {teacherName}
              </p>
              <p className="text-[10px] text-[var(--theme-text-dim)] uppercase tracking-widest font-bold">
                Pro Plan
              </p>
            </div>
          </div>

          {/* Logout */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => { localStorage.clear(); navigate('/login'); }}
                tooltip="Logout"
                className="text-danger hover:text-danger hover:bg-danger/10"
              >
                <LogOut className="size-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main content area */}
      <SidebarInset className="bg-[var(--theme-bg-main)]">
        {/* Top bar with sidebar trigger */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--theme-border)] bg-[var(--theme-bg-main)]/80 backdrop-blur-xl px-4"
          style={{ WebkitBackdropFilter: 'blur(20px)' }}
        >
          <SidebarTrigger className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text-main)]" />
          <div className="flex items-center gap-2 md:hidden">
            <Logo size={22} />
            <span className="font-heading text-sm font-bold text-[var(--theme-text-main)]">QuizFlow</span>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
