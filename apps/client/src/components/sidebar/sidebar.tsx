import { Key, Storefront, Wallet } from 'react-ionicons';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';

type MenuItem = {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
};

export default function SideBar() {
  const items: MenuItem[] = [
    {
      icon: <Key color="white" />,
      text: 'Your Licenses',
      onPress: () => {},
    },
    {
      icon: <Storefront color="white" />,
      text: 'Shop Licenses',
      onPress: () => {},
    },
  ];

  return (
    <nav className="w-[220px] flex flex-col h-full bg-slate-800 pt-10 px-2 gap-4">
      <UserWallet />
      <Separator className="bg-slate-900" />
      {items.map(({ icon, text, onPress }) => (
        <Button
          variant="ghost"
          className="text-white"
        >
          {icon}
          {text}
        </Button>
      ))}
    </nav>
  );
}

function UserWallet() {
  const { address, isConnected } = useAccount();
  const { connect, error: errorConnect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <div className="rounded-full border-1 border-slate-100 py-2.5 w-full flex text-white text-sm bg-blue-700 justify-center items-center cursor-pointer hover:bg-blue-800 gap-2">
      <Wallet
        color={'white'}
        style={{ height: 16, width: 16 }}
      />
      {address ?? 'Connect Wallet'}
    </div>
  );
}
