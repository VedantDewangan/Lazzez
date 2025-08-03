import AbooutUs from "../../Components/AbooutUs/AbooutUs";
import ContactUs from "../../Components/ContactUs/ContactUs";
import Footer from "../../Components/Footer/Footer";
import HeroMenu from "../../Components/HeroMenu/HeroMenu";
import HeroSection1 from "../../Components/HeroSections/HeroSection1";
import HeroSection2 from "../../Components/HeroSections/HeroSection2";
import HeroSection3 from "../../Components/HeroSections/HeroSection3";
import Navbar from "../../Components/Navbar/Navbar";
import "./Home.css";
import { FaAngleUp } from "react-icons/fa";

export default function Home() {
  return (
    <div className="page">
      <Navbar />
      <HeroSection1 />
      <HeroSection2 />
      <HeroSection3 />
      <HeroMenu />
      <AbooutUs />
      <ContactUs />
      <Footer />
      <a href="#" className="up-button">
        <FaAngleUp />
      </a>
    </div>
  );
}
