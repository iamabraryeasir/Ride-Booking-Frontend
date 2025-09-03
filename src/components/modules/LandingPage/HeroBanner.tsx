import { ArrowRight, MapPin, Star, Users } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import HeroImage from "@/assets/hero-image.png";

export default function HeroBanner() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Rated #1 Ride Service
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              Your Ride,
              <span className="text-primary block">Your Way</span>
            </h1>
            
            <p className="text-muted-foreground mb-8 max-w-xl text-lg leading-relaxed">
              Experience seamless transportation with RideEase. Fast, safe, and affordable rides 
              with professional drivers, available 24/7 at your fingertips.
            </p>
            
            <div className="flex w-full flex-col justify-center gap-4 sm:flex-row lg:justify-start mb-8">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/register">
                  Book Your Ride
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/register">
                  Become a Driver
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm">
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2 text-primary" />
                <span className="font-semibold">50K+</span> Happy Riders
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                <span className="font-semibold">500+</span> Cities Covered
              </div>
              <div className="flex items-center text-gray-600">
                <Star className="w-5 h-5 mr-2 text-primary fill-current" />
                <span className="font-semibold">4.8</span> Average Rating
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl transform rotate-3"></div>
            <img
              src={HeroImage}
              alt="RideEase Hero - Happy customer in a comfortable ride"
              className="relative z-10 w-full h-auto object-cover rounded-2xl shadow-2xl"
            />
            
            {/* Floating cards */}
            <Card className="absolute top-4 -left-4 z-20 p-4 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Tracking</span>
              </div>
            </Card>
            
            <Card className="absolute bottom-4 -right-4 z-20 p-4 bg-white/95 backdrop-blur-sm">
              <div className="text-sm">
                <div className="font-bold text-primary">$12.50</div>
                <div className="text-gray-600">Est. Fare</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
