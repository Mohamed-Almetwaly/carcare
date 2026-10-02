import React from 'react';
import { Hero } from '../home/Hero';
import { PopularServices } from '../home/PopularServices';
import { HowItWorks } from '../home/HowItWorks';
import { WhyChooseUs } from '../home/WhyChooseUs';
import { Testimonials } from '../home/Testimonials';

export const HomePage: React.FC = () => {
  return (
    <div id="home-page" className="animate-in fade-in duration-200">
      <Hero />
      <PopularServices />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
};
