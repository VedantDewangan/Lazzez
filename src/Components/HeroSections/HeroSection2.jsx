import "./HeroSection.css";
import image from "../../Assets/icon-folk-n-knife.png";
import biryani from "../../Assets/biryani.jpg";
import dhokala from "../../Assets/Dhokala.jpg";
import dosa from "../../Assets/masala-dosa.jpg";
import rasmalai from "../../Assets/rasmalai.jpg";

export default function HeroSection2() {
  return (
    <div className="hero-section-2">
      <img src={image} alt="" />
      <p className="hero-section-2-p-1">
        Raipur’s Favourite Spot for Authentic Indian Flavours
      </p>
      <p className="hero-section-2-p-2">
        Gather your loved ones for a truly unforgettable Indian feast! At
        LAZZEZ, we serve the bold, vibrant flavours of India—rich curries, fresh
        ingredients, and heartwarming classics. From casual lunches to special
        celebrations, our warm ambiance and flavour-packed menu make every visit
        memorable.
      </p>
      <p className="hero-section-2-p-3">
        Come hungry. Leave happy. Experience India’s best—right here in Raipur.
      </p>
      <div className="hero-section-2-images">
        <img src={biryani} alt="" />
        <img src={rasmalai} alt="" />
        <img src={dosa} alt="" />
        <img src={dhokala} alt="" />
      </div>
    </div>
  );
}
