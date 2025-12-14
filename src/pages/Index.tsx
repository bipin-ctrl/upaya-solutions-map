import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MapSection from '@/components/MapSection';
import ReportSection from '@/components/ReportSection';
import StatsSection from '@/components/StatsSection';
import IssuesFeed from '@/components/IssuesFeed';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <MapSection />
      <StatsSection />
      <ReportSection />
      <IssuesFeed />
      <Footer />
    </main>
  );
};

export default Index;
