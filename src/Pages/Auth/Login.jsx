import GoogleSigninButton from "../../Components/Google Button/GoogleSigninButton";
import "./Auth.css";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { signInWithEmail } from "../../Firebase/firebaseAuthFunctions";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    const { user, error } = await signInWithEmail(email, password);
    setLoading(false);

    if (error) {
      if (error === "Firebase: Error (auth/invalid-credential).") {
        toast.error("Please Enter valid email or password");
        return;
      }
      toast.error(error);
      return;
    } else {
      toast.success("Login successfully!");
      navigate("/");
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-container">
        <h2 className="auth-header">Welcome Back</h2>
        <h3 className="auth-sub-header">Login to Lazzez</h3>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-container">
            <span>
              <FaEnvelope />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              autoComplete="off"
              required
            />
          </div>
          <div className="auth-input-container">
            <span>
              <FaLock />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              autoComplete="off"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="auth-link">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>

          <div className="divider">
            <hr />
            <span>OR</span>
            <hr />
          </div>

          <GoogleSigninButton />
        </form>
      </div>
    </div>
  );
}
