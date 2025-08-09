"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { get_newsletter } from '@/actions/newsletters';
import { toast } from "sonner"

const NewsletterViewPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [title, setTitle] = useState("");
    const [coverUrl, setCoverUrl] = useState("")
    const [initialContent, setInitialContent] = useState<string | undefined>();

    useEffect(() => {
    async function fetchNewsletter() {
        if (!slug) return;
      const resp = await get_newsletter(slug);
      if (resp.ok) {
        const data = resp.body;
        setTitle(data.title);
        setCoverUrl(data.thumbnail ?? "");
        setInitialContent(data.content);
      } else {
        toast.error("Failed to load newsletter data");
      }
    }
    fetchNewsletter();
  }, [slug]);
  return (
    <div className="max-w-3xl mx-auto py-10">
      {coverUrl && (
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-auto mb-6"
        />
      )}

      <h1 className="text-4xl font-bold mb-6">{title}</h1>

      {initialContent && (
        <div
          className="max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{ __html: initialContent }}
        />
      )}
    </div>
  )
}

export default NewsletterViewPage