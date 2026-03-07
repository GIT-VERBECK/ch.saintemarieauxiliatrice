import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSlider from '../components/home/HeroSlider';
import EventsSection from '../components/home/EventsSection';
import NewsSection from '../components/home/NewsSection';

/**
 * Page d'accueil principale
 * Centralise les sections de la landing page
 */
const Home = () => {
  return (
    <div className="layout-root">
      <Header />
      
      <main>
        <HeroSlider />
        <EventsSection />
        <NewsSection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
