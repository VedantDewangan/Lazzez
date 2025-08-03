import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

export default function HeroSection1() {
  const navigate = useNavigate();
  return (
    <div className="hero-section-1">
      <h1 className="hero-section-1-heading">WELCOME TO LAZZEZ</h1>
      <div>
        <button className="hero-section-1-button">
          <a href="#con">BOOK A TABLE</a>
        </button>
        <button
          className="hero-section-1-button"
          onClick={() => {
            navigate("/menu");
          }}
        >
          MAIN MENU
        </button>
      </div>
      <div className="hero-section-1-text">
        <hr />
        <p>DINE IN AND CARRY OUT NOW AVAILABLE IN RAIPUR</p>
        <hr />
      </div>
    </div>
  );
}
