"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const pastNewsletters = [
  { id: 1, title: 'Vol. 12: The Future of Quantum Computing', summary: 'A look into the next generation of computing and its potential impact on AI and cryptography.', issue: 12, image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg', date: 'Oct 19, 2023', aiHint: 'quantum computer' },
  { id: 2, title: 'Vol. 11: Generative AI and Art', summary: 'Exploring the intersection of creativity and algorithms, and how AI is changing the art world.', issue: 11, image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg', date: 'Oct 12, 2023', aiHint: 'abstract art' },
  { id: 3, title: 'Vol. 10: The Ethics of AI', summary: 'A discussion on the ethical considerations and moral dilemmas posed by advanced artificial intelligence.', issue: 10, image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg', date: 'Oct 05, 2023', aiHint: 'robot human' },
  { id: 4, title: 'Vol. 9: Sustainable Tech Solutions', summary: 'Innovations in green technology that are paving the way for a more sustainable future.', issue: 9, image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg', date: 'Sep 28, 2023', aiHint: 'green energy' },
  { id: 5, title: 'Vol. 8: Introduction to Neural Networks', summary: 'A beginner-friendly guide to understanding the core concepts of neural networks.', issue: 8, image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg', date: 'Sep 21, 2023', aiHint: 'brain network' },
  { id: 6, title: 'Vol. 7: The Rise of Open Source', summary: 'How collaborative coding is driving innovation and changing the software development landscape.', issue: 7, image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg', date: 'Sep 14, 2023', aiHint: 'code collaboration' },
];


const ArchiveList = () => {
    return (
        <section id="archive" className="py-10 md:py-18 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-headline text-foreground">Newsletter Archive</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Browse through our entire collection of past newsletters. Catch up on any insights you might have missed from the SyncUp community.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {pastNewsletters.map(newsletter => (
                    <Card key={newsletter.id} className="bg-card border-border overflow-hidden group flex flex-col transform transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                        <div className="overflow-hidden">
                          <Image
                              src={newsletter.image}
                              alt={newsletter.title}
                              width={600}
                              height={400}
                              className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                              data-ai-hint={newsletter.aiHint}
                          />
                        </div>
                        <CardContent className="p-6 space-y-4 flex-grow">
                            <CardTitle className="font-headline text-xl text-foreground group-hover:text-primary transition-colors duration-300">{newsletter.title}</CardTitle>
                            <p className="text-muted-foreground text-sm line-clamp-3">{newsletter.summary}</p>
                        </CardContent>
                        <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                            <span>{newsletter.date}</span>
                            <Button variant="link" className="p-0 h-auto text-primary group-hover:underline">
                                Read More <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
          </div>
        </section>
    );
};
export default ArchiveList;
