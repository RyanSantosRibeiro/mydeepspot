import Header from "./components/Header";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="flex items-center justify-items-center min-h-screen">
      <Header transparent={true} />
      <Hero />
    </div>
  );
}
