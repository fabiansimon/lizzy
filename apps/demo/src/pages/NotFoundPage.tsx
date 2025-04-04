import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-slate-400">Page not found</p>
      <Link
        to="/shop"
        className="mt-8 text-blue-400 hover:text-blue-300"
      >
        Return to Shop
      </Link>
    </div>
  );
}
