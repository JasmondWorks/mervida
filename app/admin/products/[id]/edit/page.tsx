'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchProduct } from '@/app/lib/api-client';
import type { Product } from '@/app/lib/types';
import ProductForm from '@/app/components/admin/ProductForm';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchProduct(id)
      .then(setProduct)
      .catch(() => setNotFound(true));
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
