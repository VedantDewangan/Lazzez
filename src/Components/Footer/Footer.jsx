import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2 className="footer-title">Lazzez</h2>
        <p className="footer-tagline">
          From masalas to memories—every dish tells a tale
        </p>
        <p className="footer-location">
          Authentic Indian Cuisine · Raipur, Chhattisgarh
        </p>
        <p className="footer-note">
          © {new Date().getFullYear()} Lazzez. All rights reserved.
        </p>
        <Link to={"/admin"} className="admin-link">
          GO TO ADMIN PANNEL
        </Link>
      </div>
    </footer>
  );
}
