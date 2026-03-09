'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="bg-[#faf9f7] min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[120px] sm:text-[180px] font-bold text-gray-100 leading-none select-none">404</p>
        <div className="-mt-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
          <p className="text-gray-600 leading-relaxed mb-8 max-w-sm mx-auto">
            The page you are looking for does not exist. It may have been moved or deleted.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/"
              className="bg-green-800 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/products"
              className="bg-white text-gray-700 hover:text-green-800 hover:bg-green-50 px-8 py-3 rounded-full font-bold transition-colors shadow-sm"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
