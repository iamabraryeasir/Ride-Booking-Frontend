import React from "react";

const steps = [
  {
    title: "Sign Up",
    icon: "👤",
    desc: "Create your account in seconds.",
  },
  {
    title: "Choose Ride",
    icon: "🚗",
    desc: "Select the ride that suits your needs.",
  },
  {
    title: "Enjoy Trip",
    icon: "🎉",
    desc: "Sit back and enjoy a safe journey.",
  },
];

const HowItWorks: React.FC = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          How It Works
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Getting started is simple. Follow these three easy steps
        </p>
      </div>
      
      <div className="relative">
        {/* Connection line for desktop */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl">
          <div className="flex justify-between items-center">
            <div className="w-1/3"></div>
            <div className="w-1/3 h-0.5 bg-primary/20"></div>
            <div className="w-1/3 h-0.5 bg-primary/20"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, idx) => (
            <div
              className="flex flex-col items-center text-center group"
              key={step.title}
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-4xl group-hover:bg-primary/20 transition-colors duration-300">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
