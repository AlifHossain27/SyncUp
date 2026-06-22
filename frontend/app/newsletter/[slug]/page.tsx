"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { get_newsletter } from "@/actions/newsletters";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import OnScrollProgress from "@/components/OnScrollProgress/OnScrollProgress";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

function NewsletterSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 animate-pulse">
      <div className="h-9 sm:h-10 w-3/4 bg-muted rounded mb-4" />
      <div className="flex mb-6 items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-muted" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
      </div>
      <div className="mb-6 w-full h-64 bg-muted rounded-lg" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-5/6 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>
    </div>
  );
}

const NewsletterViewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [date, setDate] = useState("")
  const [initialContent, setInitialContent] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewsletter() {
      if (!slug) return;
      const resp = await get_newsletter(slug);
      if (resp.ok) {
        const data = resp.body;
        setTitle(data.title);
        setDate(data.published_at)
        setCoverUrl(data.thumbnail ?? "");
        setInitialContent(data.content);
      } else {
        toast.error("Failed to load newsletter data");
      }
      setLoading(false);
    }
    fetchNewsletter();
  }, [slug]);

  if (loading) {
    return (
      <>
        <OnScrollProgress/>
        <NewsletterSkeleton />
      </>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      <OnScrollProgress/>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 break-words">
        {title}
      </h1>
      <div className="flex mb-6">
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://www.bracucc.org/_next/static/media/bucc-icon.f845a68c.svg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sm">
          <p>Newsletter BUCC</p>
          <span>
            {new Date(
              date
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      

      {coverUrl && (
        <div className="mb-6 overflow-hidden shadow-sm">
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-auto object-cover block"
          />
        </div>
      )}


      {initialContent && (
        <article className="bg-white dark:bg-[#0b0b0b] ">
          <div
            className="
              prose 
              prose-base sm:prose-lg 
              max-w-none 
              leading-relaxed 
              text-justify
              prose-img:rounded-lg 
              prose-img:mx-auto 
              prose-img:max-h-96 
              prose-img:object-contain
            "
            dangerouslySetInnerHTML={{ __html: initialContent }}
          />
        </article>
      )}
    </div>
  );
};

export default NewsletterViewPage;