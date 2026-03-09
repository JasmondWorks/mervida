'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProduct } from '@/app/lib/store';
import type { Product } from '@/app/lib/types';
import ProductForm from '@/app/components/admin/ProductForm';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const p = getProduct(id);
    if (p) setProduct(p);
    else setNotFound(true);
  }, [id]);

  if (notFound) {
    return (
      <div className="p-6 text-center text-gray-400 mt-16">
        Product not found.
      </div>
    );
  }

  if (!product) return null;

  return <ProductForm mode="edit" initialData={product} />;
}
