"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchBlogPost, type BlogPost } from "@/app/lib/api-client";
import BlogForm from "@/app/components/admin/BlogForm";

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchBlogPost(id)
      .then(setPost)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return <div className="p-6 text-center text-gray-400 mt-16">Post not found.</div>;
  }
  if (!post) return null;

  return <BlogForm mode="edit" initialData={post} />;
}
