import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Shield, Heart, Clock, Lock, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const slides = [
    {
      icon: <Heart className="w-16 h-16 text-primary mx-auto mb-6" />,
      title: "Welcome to PatientPrep SL",
      description: "Prepare better for your medical consultations with your personal healthcare companion. Designed specifically for patients in Sri Lanka.",
      highlight: "Better conversations with your doctor start here"
    },
    {
      icon: <Shield className="w-16 h-16 text-primary mx-auto mb-6" />,
      title: "Your Privacy is Protected",
      description: "All your health information stays completely private on your device. We use advanced encryption and never share your personal health information.",
      highlight: "🔒 Your data never leaves your device"
    },
    {
      icon: <Clock className="w-16 h-16 text-primary mx-auto mb-6" />,
      title: "Works Offline Always",
      description: "Use all features without an internet connection. Perfect for areas with limited connectivity. Your health data is always accessible when you need it.",
      highlight: "📱 Works everywhere, anytime"
    },
    {
      icon: <Lock className="w-16 h-16 text-primary mx-auto mb-6" />,
      title: "Secure & Compliant",
      description: "Built with Sri Lankan privacy laws in mind (PDPA compliant). Your health information is encrypted and secure, giving you complete control.",
      highlight: "✓ Meets local privacy standards"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const canProceed = agreedToTerms && agreedToPrivacy;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-muted h-1">
        <div 
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col">
        {/* Slide content */}
        <div className="flex-1 flex flex-col justify-center">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0 text-center">
              {slides[currentSlide].icon}
              <h1 className="mb-4">{slides[currentSlide].title}</h1>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {slides[currentSlide].description}
              </p>
              <div className="bg-secondary/50 rounded-lg p-4 mb-8">
                <p className="text-primary font-medium">
                  {slides[currentSlide].highlight}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Consent checkboxes on last slide */}
          {currentSlide === slides.length - 1 && (
            <div className="space-y-4 mt-6">
              <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                <Checkbox
                  id="privacy"
                  checked={agreedToPrivacy}
                  onCheckedChange={(checked) => setAgreedToPrivacy(checked === true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="privacy" className="text-sm cursor-pointer">
                    I understand and agree to the Privacy Policy. My health data will be stored locally and encrypted on this device only.
                  </label>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="terms" className="text-sm cursor-pointer">
                    I agree to the Terms of Service and understand this app is not a substitute for professional medical care.
                  </label>
                </div>
              </div>

              {/* Medical disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <h4 className="text-yellow-800 mb-2">⚠️ Important Medical Disclaimer</h4>
                <p className="text-yellow-700 text-sm">
                  This app is for preparation purposes only. Always consult with qualified healthcare professionals for medical advice. In emergencies, contact your doctor or emergency services immediately.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8">
          <Button
            variant="ghost"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          {currentSlide === slides.length - 1 ? (
            <Button
              onClick={onComplete}
              disabled={!canProceed}
              className="flex items-center"
            >
              Get Started
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={nextSlide} className="flex items-center">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}