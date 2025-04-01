import { trpc } from '../providers/trpc';
import { useUser } from '../providers/user';

export default function ShopPage() {
  const { user } = useUser();
  const { data: licenses } = trpc.license.fetchAll.useQuery();
  console.log({ licenses });

  return (
    <div className="text-white flex-col space-y-4">
      <div>{JSON.stringify(user)}</div>
      <div>{JSON.stringify(licenses)}</div>
    </div>
  );
}
