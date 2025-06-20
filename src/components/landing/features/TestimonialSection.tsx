
import React from 'react';
import { Star, Quote } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import GlassCard from '@/components/ui-custom/GlassCard';

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Dog Owner & Veterinary Nurse",
    location: "San Francisco, CA",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "MyPetID's My Pet ID system has revolutionized how I manage my dog's health records. The digital identity makes vet visits so much smoother - I can share Max's complete history instantly instead of scrambling through paperwork. As a vet nurse myself, I love how professional and comprehensive the reports are.",
    highlight: "My Pet ID system"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Cat Parent & Small Business Owner",
    location: "Austin, TX",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "Luna's My Pet ID has been a lifesaver! Last month during an emergency vet visit, I was able to pull up her vaccination history, medication allergies, and previous treatments in seconds. The vet was impressed with how organized everything was. This platform gives me such peace of mind.",
    highlight: "My Pet ID"
  },
  {
    id: 3,
    name: "Dr. Amanda Foster",
    role: "Veterinarian",
    location: "Denver, CO",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "I recommend MyPetID to all my clients. When pet owners come in with their My Pet ID, I have access to complete medical histories, vaccination records, and previous treatments instantly. It significantly improves the quality of care I can provide and reduces appointment times.",
    highlight: "My Pet ID"
  },
  {
    id: 4,
    name: "Jennifer Park",
    role: "Multi-Pet Household Manager",
    location: "Seattle, WA",
    avatar: "/api/placeholder/64/64",
    rating: 5,
    content: "Managing health records for three dogs and two cats used to be a nightmare. Now each pet has their own My Pet ID and I can track everything digitally. The reminder system has prevented us from missing vaccinations twice already. It's like having a personal pet health assistant!",
    highlight: "My Pet ID"
  }
];

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-indigo-50/40 to-blue-50/60 relative overflow-hidden" aria-labelledby="testimonials-heading">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-0 opacity-30">
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '14s', animationDelay: '0.5s' }} />
      </div>
      
      <div className="container-max relative z-10">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 
              id="testimonials-heading"
              className="text-2xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Trusted by Pet Owners & Veterinarians
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how MyPetID's digital pet identity platform is transforming pet care management 
              for families and professionals worldwide.
            </p>
          </div>
        </FadeIn>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.id} delay={index * 100}>
              <GlassCard className="h-full p-6 bg-white/90 border-blue-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                {/* Quote icon */}
                <div className="relative mb-4">
                  <Quote className="w-6 h-6 text-blue-400 opacity-60" />
                </div>
                
                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed text-sm">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm mr-3">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
        
        <FadeIn delay={400}>
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-blue-200/50 rounded-full text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium">4.9/5</span>
              <span>average rating from over 10,000+ pet owners</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default TestimonialSection;