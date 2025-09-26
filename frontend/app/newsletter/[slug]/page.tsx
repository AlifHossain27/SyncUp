"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { get_newsletter } from "@/actions/newsletters";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import OnScrollProgress from "@/components/OnScrollProgress/OnScrollProgress";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

const NewsletterViewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [title, setTitle] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [date, setDate] = useState("")
  const [initialContent, setInitialContent] = useState<string | undefined>();

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
    }
    fetchNewsletter();
  }, [slug]);

  console.log(initialContent);

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


      {initialContent ? (
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
      ) : (
        <p className="text-muted-foreground">Loading content…</p>
      )}
    </div>
  );
};

export default NewsletterViewPage;