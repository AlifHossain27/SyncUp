"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ImSpinner2 } from "react-icons/im";
import { toast } from "sonner";
import { get_archive_newsletters } from "@/actions/newsletters";
import Link from "next/link";

const pastNewsletters = [
  { id: 1, title: 'Vol. 12: The Future of Quantum Computing', summary: 'A look into the next generation of computing and its potential impact on AI and cryptography.', issue: 12, image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg', date: 'Oct 19, 2023', aiHint: 'quantum computer' },
  { id: 2, title: 'Vol. 11: Generative AI and Art', summary: 'Exploring the intersection of creativity and algorithms, and how AI is changing the art world.', issue: 11, image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg', date: 'Oct 12, 2023', aiHint: 'abstract art' },
  { id: 3, title: 'Vol. 10: The Ethics of AI', summary: 'A discussion on the ethical considerations and moral dilemmas posed by advanced artificial intelligence.', issue: 10, image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg', date: 'Oct 05, 2023', aiHint: 'robot human' },
  { id: 4, title: 'Vol. 9: Sustainable Tech Solutions', summary: 'Innovations in green technology that are paving the way for a more sustainable future.', issue: 9, image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg', date: 'Sep 28, 2023', aiHint: 'green energy' },
  { id: 5, title: 'Vol. 8: Introduction to Neural Networks', summary: 'A beginner-friendly guide to understanding the core concepts of neural networks.', issue: 8, image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg', date: 'Sep 21, 2023', aiHint: 'brain network' },
  { id: 6, title: 'Vol. 7: The Rise of Open Source', summary: 'How collaborative coding is driving innovation and changing the software development landscape.', issue: 7, image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg', date: 'Sep 14, 2023', aiHint: 'code collaboration' },
];

interface Newsletter {
  uuid: string;
  title: string;
  slug: string;
  thumbnail?: string;
  status: string;
  published_at: string;
}

const ArchiveList = () => {
    const [archive, setArchive] = useState<Newsletter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function fetchArchives() {
      const resp = await get_archive_newsletters()
      if (resp.ok) {
        setArchive(resp.body);
      } else {
        toast.error("Failed to load Archive");
      }
      setLoading(false);
    }
    fetchArchives();
  }, []);

  

    return (
        <section id="archive" className="py-10 md:py-18 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-headline text-foreground">Newsletter Archive</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Browse through our entire collection of past newsletters. Catch up on any insights you might have missed from the SyncUp community.
              </p>
            </div>
            {loading ? (
                <div className='flex justify-center'>
                  <ImSpinner2 className="animate-spin" size="50" />
                </div>
              ) : 
            (<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {archive.length === 0 && <p>No Newsletter found.</p>}
                {archive.map(newsletter => (
                    <Card key={newsletter.uuid} className="bg-card border-border overflow-hidden group flex flex-col transform transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                        <div className="overflow-hidden">
                          <Image
                              src={newsletter.thumbnail ?? "https://www.geoface.com/wp-content/themes/u-design/assets/images/placeholders/post-placeholder.jpg"}
                              alt={newsletter.title}
                              width={600}
                              height={400}
                              className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                          />
                        </div>
                        <CardContent className="p-6 space-y-4 flex-grow">
                            <CardTitle className="font-headline text-xl text-foreground group-hover:text-primary transition-colors duration-300">{newsletter.title}</CardTitle>
                        </CardContent>
                        <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                            
                            <span>{new Date(newsletter.published_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}</span>
                            <Link href={`/newsletter/${newsletter.slug}`}>
                              <Button variant="link" className="p-0 h-auto text-primary group-hover:underline">
                                  Read More <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                              </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>)}
          </div>
        </section>
    );
};
export default ArchiveList;
