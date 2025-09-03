import React from "react";
import { Clock, DollarSign, Shield, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "24/7 Availability",
    icon: Clock,
    desc: "Book a ride anytime, day or night. Our service never sleeps.",
  },
  {
    title: "Affordable Pricing",
    icon: DollarSign,
    desc: "Competitive and transparent pricing with no hidden fees.",
  },
  {
    title: "Verified Drivers",
    icon: Shield,
    desc: "All drivers are thoroughly vetted and background checked.",
  },
  {
    title: "Secure Payments",
    icon: CreditCard,
    desc: "Multiple secure payment options for your convenience.",
  },
];

const ServiceHighlights: React.FC = () => (
  <section className="py-16 bg-secondary/20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Why Choose RideEase?
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Experience the difference with our premium ride booking service
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card key={feature.title} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.desc}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  </section>
);

export default ServiceHighlights;
