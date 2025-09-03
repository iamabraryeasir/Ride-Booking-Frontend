/**
 * Node Modules
 */

/**
 * External Components
 */
import CallToAction from "@/components/modules/LandingPage/CallToAction";
import HeroBanner from "@/components/modules/LandingPage/HeroBanner";
import HowItWorks from "@/components/modules/LandingPage/HowItWorks";
import ServiceHighlights from "@/components/modules/LandingPage/ServiceHighlights";
import Testimonials from "@/components/modules/LandingPage/Testimonials";

/**
 * Components Logic
 */
export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <HowItWorks />
      <ServiceHighlights />
      <Testimonials />
      <CallToAction />
    </>
  );
}
