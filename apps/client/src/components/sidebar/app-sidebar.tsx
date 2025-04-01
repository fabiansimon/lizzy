import { Home, Store, Key, LogOut, Upload, Plus } from 'lucide-react';
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

type SidebarItem = {
  title: string;
  url: string;
  icon: React.ElementType;
  auth?: boolean;
};

export default function AppSidebar() {
  const { user, signIn, signOut } = useUser();

  const customerItems: SidebarItem[] = [
    {
      title: 'Home',
      url: '/',
      icon: Home,
      auth: false,
    },
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
      title: 'Home',
      url: '/',
      icon: Home,
    },
    {
      title: 'Create License',
      url: '/upload-license',
      icon: Upload,
    },
    {
      title: 'Your Licenses',
      url: '/vendor-licenses',
      icon: Plus,
    },
  ];

  const menuItems = (
    user.role === 'vendor' ? vendorItems : customerItems
  ).filter((item) => !item.auth || user.isSignedIn);

  return (
    <Sidebar className="border-slate-800">
      <SidebarContent className="bg-slate-950">
        <SidebarGroup className="gap-2 h-full flex flex-col">
          <SidebarGroupLabel className="text-white text-2xl font-bold">
            {'Lizzy'}
          </SidebarGroupLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full my-2 bg-sky-500 hover:bg-sky-600 text-slate-950 px-4 overflow-hidden text-ellipsis whitespace-nowrap">
                {user.isSignedIn
                  ? truncateAddress(user.address ?? '', [8, 6])
                  : 'Connect Wallet'}
              </Button>
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
          <SidebarGroupContent className="flex-grow">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="hover:bg-slate-800 h-10"
                    asChild
                  >
                    <a href={item.url}>
                      <item.icon className="text-white/70" />
                      <span className="text-white/70">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          {/* Logout button at the bottom */}
          {user.isSignedIn && (
            <Button
              onClick={signOut}
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
