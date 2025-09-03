import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Users,
  Car,
  Shield,
  CreditCard,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router";

interface FAQ {
  id: string;
  category: "general" | "rider" | "driver" | "payment" | "safety";
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  // General FAQs
  {
    id: "1",
    category: "general",
    question: "What is RideEase?",
    answer:
      "RideEase is a modern ride-booking platform that connects riders with professional drivers. We offer safe, affordable, and convenient transportation services 24/7.",
  },
  {
    id: "2",
    category: "general",
    question: "How do I create an account?",
    answer:
      "Simply download our app or visit our website, click 'Sign Up', choose your role (Rider or Driver), and fill in your basic information. You'll be ready to go in minutes!",
  },
  {
    id: "3",
    category: "general",
    question: "Is RideEase available in my city?",
    answer:
      "We're currently operating in over 500 cities worldwide and expanding rapidly. Check our app or website to see if we're available in your area.",
  },

  // Rider FAQs
  {
    id: "4",
    category: "rider",
    question: "How do I book a ride?",
    answer:
      "Open the app, enter your pickup location and destination, select your preferred vehicle type, choose your payment method, and confirm your booking. A driver will be assigned to you shortly.",
  },
  {
    id: "5",
    category: "rider",
    question: "Can I cancel my ride?",
    answer:
      "Yes, you can cancel your ride before the driver arrives. However, cancellation fees may apply depending on the timing and our cancellation policy.",
  },
  {
    id: "6",
    category: "rider",
    question: "How do I track my ride?",
    answer:
      "Once your ride is confirmed, you can track your driver's location in real-time through the app. You'll also receive notifications about your driver's arrival time.",
  },
  {
    id: "7",
    category: "rider",
    question: "Can I schedule rides in advance?",
    answer:
      "Yes! You can schedule rides up to 30 days in advance. Simply select your desired date and time when booking your ride.",
  },

  // Driver FAQs
  {
    id: "8",
    category: "driver",
    question: "How do I become a RideEase driver?",
    answer:
      "Apply through our app or website by providing your personal information, vehicle details, and required documents. We'll review your application and notify you of approval status within 3-5 business days.",
  },
  {
    id: "9",
    category: "driver",
    question: "What documents do I need to become a driver?",
    answer:
      "You'll need a valid driver's license, vehicle registration, insurance proof, and vehicle inspection certificate. All documents must be current and valid.",
  },
  {
    id: "10",
    category: "driver",
    question: "How much can I earn as a driver?",
    answer:
      "Earnings vary based on location, hours worked, and demand. On average, drivers earn $15-25 per hour. You keep 80% of each fare, and we provide detailed earnings reports.",
  },
  {
    id: "11",
    category: "driver",
    question: "Can I choose my working hours?",
    answer:
      "Absolutely! One of the main benefits of driving with RideEase is complete flexibility. You can go online or offline anytime and work as much or as little as you want.",
  },

  // Payment FAQs
  {
    id: "12",
    category: "payment",
    question: "What payment methods are accepted?",
    answer:
      "We accept cash, credit/debit cards, and digital wallets. You can add multiple payment methods to your account and choose your preferred option for each ride.",
  },
  {
    id: "13",
    category: "payment",
    question: "How is the fare calculated?",
    answer:
      "Fares are calculated based on distance, time, and current demand. You'll see an upfront price estimate before confirming your ride, with no hidden fees.",
  },
  {
    id: "14",
    category: "payment",
    question: "Do I need to tip my driver?",
    answer:
      "Tipping is optional but appreciated. You can add a tip through the app after your ride is completed.",
  },

  // Safety FAQs
  {
    id: "15",
    category: "safety",
    question: "How do you ensure rider and driver safety?",
    answer:
      "We conduct thorough background checks on all drivers, provide real-time tracking, offer 24/7 support, and include safety features like emergency contacts and SOS buttons.",
  },
  {
    id: "16",
    category: "safety",
    question: "What should I do in case of an emergency during my ride?",
    answer:
      "Use the SOS button in the app to immediately alert emergency contacts and authorities. You can also call our 24/7 support line for immediate assistance.",
  },
  {
    id: "17",
    category: "safety",
    question: "Can I share my trip details with others?",
    answer:
      "Yes! You can share your real-time trip details with friends and family so they can track your journey and know when you've safely reached your destination.",
  },
];

const categories = [
  { id: "all", label: "All", icon: MessageCircle },
  { id: "general", label: "General", icon: MessageCircle },
  { id: "rider", label: "For Riders", icon: Users },
  { id: "driver", label: "For Drivers", icon: Car },
  { id: "payment", label: "Payments", icon: CreditCard },
  { id: "safety", label: "Safety", icon: Shield },
];

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-secondary/20 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Find answers to common questions about RideEase. Can't find what
            you're looking for? Feel free to contact our support team.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any FAQs matching your search. Try different
                  keywords or browse all categories.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedItems.has(faq.id);
                  return (
                    <Card key={faq.id} className="overflow-hidden">
                      <CardHeader
                        className="cursor-pointer hover:bg-secondary/50 transition-colors"
                        onClick={() => toggleExpanded(faq.id)}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-medium text-left flex-1">
                            {faq.question}
                          </CardTitle>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                      {isExpanded && (
                        <CardContent className="pt-0">
                          <div className="border-t pt-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular FAQs */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Most Popular Questions
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            {faqs.slice(0, 5).map((faq) => (
              <Card key={`popular-${faq.id}`} className="mb-4">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2 text-gray-900">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            Still Have Questions?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our support team is available 24/7 to help you with any questions or
            issues.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/contact">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="tel:+15551234567">
                <Phone className="w-4 h-4 mr-2" />
                Call Us: (555) 123-4567
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
