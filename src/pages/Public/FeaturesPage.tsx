import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  Car,
  MapPin,
  CreditCard,
  Clock,
  Shield,
  BarChart3,
  Users,
  DollarSign,
  Star,
  Phone,
  Map,
  Smartphone,
  ArrowRight,
} from "lucide-react";

const riderFeatures = [
  {
    icon: MapPin,
    title: "Easy Booking",
    description:
      "Book rides with just a few taps. Set pickup and destination effortlessly.",
  },
  {
    icon: DollarSign,
    title: "Fare Estimation",
    description:
      "Get upfront pricing before booking. No surprises, no hidden fees.",
  },
  {
    icon: Map,
    title: "Live Tracking",
    description:
      "Track your ride in real-time and share your trip with loved ones.",
  },
  {
    icon: CreditCard,
    title: "Multiple Payment Options",
    description:
      "Pay with cash, card, or digital wallet. Choose what's convenient for you.",
  },
  {
    icon: Clock,
    title: "Ride History",
    description:
      "Access all your past rides with detailed receipts and trip information.",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Get help anytime with our round-the-clock customer support.",
  },
];

const driverFeatures = [
  {
    icon: Car,
    title: "Flexible Schedule",
    description:
      "Work when you want. Turn on/off availability with a single tap.",
  },
  {
    icon: BarChart3,
    title: "Earnings Tracking",
    description:
      "Monitor your earnings with detailed daily, weekly, and monthly reports.",
  },
  {
    icon: Users,
    title: "Rider Management",
    description:
      "Accept or reject ride requests based on your availability and preferences.",
  },
  {
    icon: Map,
    title: "Route Optimization",
    description: "Get the most efficient routes to maximize your earnings.",
  },
  {
    icon: Star,
    title: "Rating System",
    description:
      "Build your reputation with a transparent rating and review system.",
  },
  {
    icon: Shield,
    title: "Insurance Coverage",
    description:
      "Drive with confidence knowing you're protected during every trip.",
  },
];

const adminFeatures = [
  {
    icon: Users,
    title: "User Management",
    description:
      "Comprehensive tools to manage riders, drivers, and their accounts.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Real-time insights into platform performance and usage metrics.",
  },
  {
    icon: Shield,
    title: "Driver Verification",
    description:
      "Streamlined process to approve and verify new driver applications.",
  },
  {
    icon: DollarSign,
    title: "Revenue Tracking",
    description:
      "Monitor platform revenue, commissions, and financial performance.",
  },
  {
    icon: Map,
    title: "Ride Oversight",
    description:
      "Monitor all rides in real-time with advanced filtering and search.",
  },
  {
    icon: Smartphone,
    title: "System Control",
    description:
      "Manage platform settings, pricing, and operational parameters.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-secondary/20 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Powerful Features for Everyone
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover comprehensive tools and features designed to make
            transportation seamless for riders, profitable for drivers, and
            manageable for admins.
          </p>
        </div>
      </section>

      {/* Rider Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              For Riders
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for a comfortable and reliable ride experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {riderFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="h-full hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button asChild size="lg">
              <Link to="/register">Start Riding Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Driver Features */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              For Drivers
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful tools to maximize your earnings and manage your driving
              business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {driverFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="h-full hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button asChild size="lg">
              <Link to="/register">Become a Driver</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Admin Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              For Administrators
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive platform management and analytics tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {adminFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="h-full hover:shadow-lg transition-all duration-300"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join our growing community and discover why millions trust RideEase
            for their transportation needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/register">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
            >
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
