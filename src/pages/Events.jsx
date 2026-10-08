import React from 'react';
import HeroSection from '../components/HeroSection';
import SectionHeader from '../components/SectionHeader';
import { EventCard } from '../components/Cards';
import { upcomingEvents, pastEvents } from '../data/events';

const Events = () => {
  return (
    <div className="page-transition">
      <HeroSection 
        title="EVENTS & ACTIVITIES"
        subtitle="Learn. Connect. Innovate."
        image="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      />

      <section className="section">
        <div className="container">
          <SectionHeader title="Upcoming Events" subtitle="Join us in our upcoming technical workshops and sessions." />
          <div className="grid grid-3">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} type="upcoming" />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <SectionHeader title="Completed Activities" subtitle="A look back at our past events." />
          <div className="grid grid-4">
            {pastEvents.map(event => (
              <EventCard key={event.id} event={event} type="past" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
