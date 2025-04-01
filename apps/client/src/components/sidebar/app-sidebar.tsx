import type React from 'react';
import { Store, Key, LogOut, Plus } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '../../components/ui/sidebar';
import { Button } from '../ui/button';
import { useUser } from '../../providers/user';
import { truncateAddress } from '../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

type SidebarItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  auth?: boolean;
};

export default function AppSidebar() {
  const { user, signIn, signOut } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const customerItems: SidebarItem[] = [
    {
      title: 'Shop',
      url: '/shop',
      icon: Store,
      auth: true,
    },
    {
      title: 'Your Licenses',
      url: '/user-licenses',
      icon: Key,
      auth: true,
    },
  ];

  const vendorItems: SidebarItem[] = [
    {
      title: 'Your Licenses',
      url: '/vendor-licenses',
      icon: Key,
    },
    {
      title: 'Create License',
      url: '/create-license',
      icon: Plus,
    },
  ];

  const menuItems = (
    user.role === 'vendor' ? vendorItems : customerItems
  ).filter((item) => !item.auth || user.isSignedIn);

  const isActive = (url: string) => {
    if (url === '/' && location.pathname === '/') return true;
    return url !== '/' && location.pathname.startsWith(url);
  };

  return (
    <Sidebar className="border-slate-800">
      <SidebarContent className="bg-slate-950">
        <SidebarGroup className="gap-2 h-full flex flex-col">
          <SidebarGroupLabel className="text-white text-2xl font-bold">
            {'Lizzy'}
          </SidebarGroupLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-col w-full px-2">
                {user.isSignedIn && (
                  <Badge className="self-start mb-2 bg-sky-700 text-white">
                    {user.role === 'vendor' ? 'Vendor' : 'Customer'}
                  </Badge>
                )}
                <Button className="w-full bg-sky-500 hover:bg-sky-600 text-slate-950 px-4 overflow-hidden text-ellipsis whitespace-nowrap">
                  {user.isSignedIn
                    ? truncateAddress(user.address ?? '', [8, 6])
                    : 'Connect Wallet'}
                </Button>
              </div>
            </DropdownMenuTrigger>
            {!user.isSignedIn && (
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={() => signIn('vendor')}>
                  {'Sign in as Vendor'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signIn('customer')}>
                  {'Sign in as Customer'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
          <SidebarGroupContent className="flex-grow mt-2">
            <SidebarMenu>
              {menuItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={cn(
                        'hover:bg-slate-800 h-10',
                        active && 'bg-slate-800'
                      )}
                      asChild
                    >
                      <a href={item.url}>
                        <item.icon
                          className={cn(
                            'text-white/70',
                            active && 'text-sky-500'
                          )}
                        />
                        <span
                          className={cn(
                            'text-white/70',
                            active && 'text-white font-medium'
                          )}
                        >
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>

          {/* Logout button at the bottom */}
          {user.isSignedIn && (
            <Button
              onClick={() => {
                signOut();
                navigate('/');
              }}
              // variant="ghost"
              className="mt-auto mb-4 text-white/70 hover:text-white hover:bg-slate-800"
            >
              <LogOut />
              {'Logout'}
            </Button>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
