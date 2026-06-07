import About from "@/components/about";
import Contact from "@/components/contact";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Services from "@/components/services";
import WhyUs from "@/components/Whyus";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero/>
            <About/>
            <WhyUs/>
            {/* <Services/> */}
            <Contact/>

    </>
  );
}