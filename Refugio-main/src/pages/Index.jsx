import HeroSection from "@/components/home/HeroSection";
import FeaturedPets from "@/components/home/FeaturedPets";
import HowItWorks from "@/components/home/HowItWorks";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <main>
        <HeroSection />
        <FeaturedPets />
        <HowItWorks />
        <CTASection />
      </main>
    </>
  );
};

export default Index;
