import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
import Image from 'next/image';

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden py-24 md:py-32 lg:py-40 bg-background">
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
             <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Zap className="w-4 h-4 mr-2" />
              Stay Ahead of the Curve
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter text-foreground">
              Your Monthly Dose of Digital Insight
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
              Explore the frontiers of knowledge with SyncUp. We deliver cutting-edge articles on tech, science, and creativity, straight from the University Computer Club.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild>
                <a href="/newsletter" className="group">
                    Explore Content <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative group max-w-lg mx-auto">
            <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition duration-500"></div>
             <Image 
                src="https://www.bracucc.org/_next/static/media/bucc-icon.f845a68c.svg" 
                alt="Abstract digital art"
                width={700}
                height={500}
                className="relative rounded-xl shadow-2xl w-full h-auto"
                data-ai-hint="digital brain connection"
              />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
