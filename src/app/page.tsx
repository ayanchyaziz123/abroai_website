import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LiveSection from "@/components/LiveSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-ground">
      <Nav />
      <LiveSection />
      <Footer />
    </div>
  );
}
