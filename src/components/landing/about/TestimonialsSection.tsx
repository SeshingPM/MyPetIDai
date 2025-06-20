
import React from 'react';
import GlassCard from '@/components/ui-custom/GlassCard';
import { Star, Quote } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import FadeIn from '@/components/animations/FadeIn';

const testimonials = [
  {
    quote: "When my dog needed emergency surgery while we were on vacation, My Pet ID saved us valuable time. The vet had all the information they needed in seconds.",
    author: "Sarah T.",
    role: "Dog Mom to Max",
    rating: 5,
    highlight: "Emergency Surgery"
  },
  {
    quote: "As someone with multiple pets, keeping track of all their medications and appointments was overwhelming. This app has changed everything for me.",
    author: "Michael K.",
    role: "Pet Parent to 3 Cats",
    rating: 5,
    highlight: "Multiple Pets"
  },
  {
    quote: "The reminder system is perfect. I never miss a vaccination or medication dose anymore. Worth every penny for the peace of mind alone.",
    author: "Jessica R.",
    role: "Rabbit & Guinea Pig Owner",
    rating: 5,
    highlight: "Reminders"
  },
  {
    quote: "I can't imagine managing my pet's health without this platform. Their customer service is exceptional too - they helped me set up everything quickly.",
    author: "David W.",
    role: "Dog & Cat Owner",
    rating: 5,
    highlight: "Health Management"
  },
  {
    quote: "After losing my pet's vaccination records during a move, I vowed never to let that happen again. My Pet ID has been the perfect solution.",
    author: "Emma L.",
    role: "Pet Parent of 2 Dogs",
    rating: 5,
    highlight: "Record Security"
  },
  {
    quote: "As a traveling pet owner, having digital access to all my pet's documents has been invaluable. I highly recommend this to anyone with pets.",
    author: "Carlos M.",
    role: "Dog Enthusiast",
    rating: 5,
    highlight: "Travel Ready"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Featured Testimonial */}
      <FadeIn>
        <div className="mb-12">
          <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
            <Quote className="absolute top-6 left-6 h-8 w-8 text-blue-400/40" />
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="flex text-amber-400 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {testimonials[0].highlight}
                </span>
              </div>
              <blockquote className="text-xl text-gray-800 font-medium leading-relaxed mb-6">
                "{testimonials[0].quote}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonials[0].author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonials[0].author}</div>
                  <div className="text-gray-600">{testimonials[0].role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Grid of Testimonials */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {testimonials.slice(1, 4).map((testimonial, index) => (
          <FadeIn key={index + 1} delay={(index + 1) * 100}>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                  {testimonial.highlight}
                </span>
              </div>
              
              <blockquote className="text-gray-700 leading-relaxed mb-4 flex-grow">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center mt-auto">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.author}</div>
                  <div className="text-gray-500 text-xs">{testimonial.role}</div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Compact Grid for Remaining */}
      <div className="grid md:grid-cols-3 gap-4">
        {testimonials.slice(4).map((testimonial, index) => (
          <FadeIn key={index + 4} delay={(index + 4) * 100}>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="flex text-amber-400 mr-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="bg-white text-gray-600 px-2 py-1 rounded text-xs">
                  {testimonial.highlight}
                </span>
              </div>
              
              <blockquote className="text-gray-700 text-sm leading-relaxed mb-3">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{testimonial.author}</div>
                  <div className="text-gray-500 text-xs">{testimonial.role}</div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      
      {/* Add schema.org markup for reviews */}
      <div className="hidden" itemScope itemType="https://schema.org/Product">
        <meta itemProp="name" content="My Pet ID" />
        {testimonials.map((testimonial, index) => (
          <div key={index} itemProp="review" itemScope itemType="https://schema.org/Review">
            <meta itemProp="author" content={testimonial.author} />
            <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
              <meta itemProp="ratingValue" content={testimonial.rating.toString()} />
              <meta itemProp="bestRating" content="5" />
            </div>
            <meta itemProp="reviewBody" content={testimonial.quote} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;