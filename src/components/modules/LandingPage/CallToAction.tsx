import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Apple } from "lucide-react";
import { Link } from "react-router";

const CallToAction: React.FC = () => (
  <section className="py-16 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white">
    <div className="container mx-auto px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to Start Your Journey?
        </h2>
        <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
          Join thousands of satisfied users. Get your first ride with 20% off!
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <Button 
            asChild 
            size="lg" 
            variant="secondary" 
            className="text-primary hover:text-primary/80"
          >
            <Link to="/register">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          
          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
          >
            <Link to="/login">
              Sign In
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <div className="flex items-center text-white/90">
            <Smartphone className="w-5 h-5 mr-2" />
            <span className="text-sm">Available on Android & iOS</span>
          </div>
          <div className="flex items-center text-white/90">
            <Apple className="w-5 h-5 mr-2" />
            <span className="text-sm">Download from App Store</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CallToAction;
