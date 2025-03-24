import { trpc } from '../providers/trpc';

export default function ShopPage() {
  const { data: licenses } = trpc.license.fetchAll.useQuery();
  console.log({ licenses });

  return <div>Shop</div>;
}
