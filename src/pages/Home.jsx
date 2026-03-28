import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSlider from '../components/home/HeroSlider';
import StatsSection from '../components/home/StatsSection';
import MissionSection from '../components/home/MissionSection';
import EventsSection from '../components/home/EventsSection';
import NewsSection from '../components/home/NewsSection';
import PageTransition from '../components/layout/PageTransition';

import SEO from '../components/ui/SEO';

/**
 * Page d'accueil principale
 * Centralise les sections de la landing page
 */
const Home = () => {
  return (
    <div className="layout-root">
      <SEO 
        title="Accueil" 
        description="Bienvenue à la Chorale Sainte Marie Auxiliatrice de Lyon. Explorez notre répertoire sacré, écoutez nos chants et rejoignez notre aventure vocale." 
      />
      <Header />
      
      <main>
        <HeroSlider />
        <StatsSection />
        <EventsSection />
        <MissionSection />
        <NewsSection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
