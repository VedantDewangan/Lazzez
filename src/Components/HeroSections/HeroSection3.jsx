import "./HeroSection.css";
import image from "../../Assets/icon-map-marker.png";
import image1 from "../../Assets/section-3-dining.jpg";
import image2 from "../../Assets/section-3-kitchen.jpg";
import image3 from "../../Assets/section-3-girl-eating.jpg";
import image4 from "../../Assets/section-3-table.jpg";

export default function HeroSection3() {
  return (
    <div className="hero-section-3">
      <div className="hero-section-3-div-1">
        <img src={image} alt="" />
        <p>Premium Dining</p>
        <p>Exclusive Spaces, Elevated Flavours</p>
        <p>Discover Lazzez's finest dining experiences across Raipur</p>
      </div>
      <div className="hero-section-3-div-2">
        <div className="img-con">
          <img src={image1} alt="" />
          <p>Rooftop Retreat</p>
        </div>
        <div className="img-con">
          <img src={image2} alt="" />
          <p>Chef’s Table</p>
        </div>
        <div className="img-con">
          <img src={image3} alt="" />
          <p>Private Lounge</p>
        </div>
        <div className="img-con">
          <img src={image4} alt="" />
          <p>Sufi & Curry Nights</p>
        </div>
      </div>
      <button className="hero-section-3-but">
        <a href="#con">BOOK A TABLE</a>
      </button>
    </div>
  );
}
