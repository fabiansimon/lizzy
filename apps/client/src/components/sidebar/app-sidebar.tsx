import { Home, Store, Key } from 'lucide-react';
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
type SidebarItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

export default function AppSidebar() {
  const { user, signIn } = useUser();

  const items: SidebarItem[] = [
    {
      title: 'Home',
      url: '#',
      icon: Home,
    },
    {
      title: 'Your Licenses',
      url: '#',
      icon: Key,
    },
    {
      title: 'Shops',
      url: '#',
      icon: Store,
    },
  ];

  const handleConnect = () => {
    signIn();
  };

  const showUser = () => {
    console.log(user);
  };

  return (
    <Sidebar className="border-slate-800">
      <SidebarContent className="bg-slate-950">
        <SidebarGroup className="gap-2">
          <SidebarGroupLabel className="text-white text-2xl font-bold">
            {'Lizzy'}
          </SidebarGroupLabel>
          <Button
            onClick={user.isSignedIn ? showUser : handleConnect}
            className="w-full my-2 bg-sky-500 hover:bg-sky-600 text-slate-950"
          >
            {user.isSignedIn ? user.address : 'Connect Wallet'}
          </Button>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
