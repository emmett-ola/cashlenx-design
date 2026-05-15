import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../atoms/Button';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: 'Track Your Expenses',
      description: 'Monitor every transaction effortlessly and stay on top of your spending habits.',
      image: 'https://images.unsplash.com/photo-1758522484692-efa6ce38a25f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBwbGFubmluZyUyMHdvbWFuJTIwc21hcnRwaG9uZXxlbnwxfHx8fDE3NzAzNzIzNTB8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      title: 'Plan Your Budgets',
      description: 'Set smart budgets and get notified when you\'re close to your limits.',
      image: 'https://images.unsplash.com/photo-1652422485224-102f6784c149?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWRnZXQlMjB0cmFja2luZyUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NzAzMTU0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      title: 'Gain Insights',
      description: 'Visualize your financial health with beautiful charts and actionable insights.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3MDI5MTc1M3ww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-white flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end p-4">
        <button 
          onClick={onComplete}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Skip
        </button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="w-full max-w-sm">
          <img 
            src={slides[step].image} 
            alt={slides[step].title}
            className="w-full h-64 object-cover rounded-2xl mb-8 shadow-lg"
          />
          
          <h1 className="text-center mb-4">{slides[step].title}</h1>
          <p className="text-center text-gray-600 mb-8">
            {slides[step].description}
          </p>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === step 
                    ? 'w-8' 
                    : 'w-2 bg-gray-300'
                }`}
                style={index === step ? { backgroundColor: 'var(--theme-color)' } : {}}
              />
            ))}
          </div>

          <Button 
            variant="primary" 
            onClick={handleNext}
            className="w-full"
            icon={<ChevronRight className="w-5 h-5" />}
          >
            {step < slides.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </div>
      </div>
    </div>
  );
}