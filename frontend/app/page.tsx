import DataChart from "@/components/CommunityGrowth";
import FeaturedStory from "@/components/FeaturedStory";
import Hero from "@/components/Hero";
import QuoteBlock from "@/components/QuoteBlock";
import RecentContent from "@/components/RecentContent";
import SubscriptionAim from "@/components/SubscriptionAim";
import UpcomingEvents from "@/components/UpcomingEvents";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      
      <main className="flex-grow">
        <Hero/>
        <FeaturedStory/>
        <RecentContent/>
        <DataChart/>
        <SubscriptionAim/>
        <UpcomingEvents/>
        <QuoteBlock/>
      </main>
      
    </div>
  );
}
