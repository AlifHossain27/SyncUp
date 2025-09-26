import Image from 'next/image';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight } from 'lucide-react';

const FeaturedStory = () => {
    return (
        <section id="featured-story" className="py-20 md:py-28 bg-[#f8f8f8]">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition duration-500"></div>
                        <Image
                            src="https://5v1v8ot8ww.ufs.sh/f/mQXMA1BQnPIaeOhmZcFuJjikVCv5RtKpyrsn8d3N4DHoGfYE"
                            alt="Featured story"
                            width={700}
                            height={500}
                            className="relative rounded-xl shadow-2xl w-full h-auto"
                            data-ai-hint="futuristic city"
                        />
                    </div>
                    <div className="space-y-6">
                        <Badge variant="outline">Featured Story</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                            The Dawn of Autonomous AI Agents
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            We're entering a new era where AI is not just a tool, but a collaborator. This month's featured story explores the rise of autonomous AI agents, their potential to reshape industries, and the ethical frameworks we need to build alongside them.
                        </p>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                            <span>Discover how agents can automate complex workflows.</span>
                          </li>
                           <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                            <span>Understand the difference between automation and autonomy.</span>
                          </li>
                           <li className="flex items-start">
                            <ArrowRight className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                            <span>Explore the societal impact and the future of work.</span>
                          </li>
                        </ul>
                        <Button size="lg" asChild>
                           <a href="#" className="group">
                                Read The Full Story <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeaturedStory;
