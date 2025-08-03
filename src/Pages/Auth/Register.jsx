import "./Auth.css";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import GoogleSignupButton from "../../Components/Google Button/GoogleSignupButton";
import { useState } from "react";
import { signUpWithEmail } from "../../Firebase/firebaseAuthFunctions";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email");
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { user, error } = await signUpWithEmail(email, password, name);
    setLoading(false);

    if (error) {
      if (error === "Firebase: Error (auth/email-already-in-use).") {
        toast.error("Email already exists");
      } else {
        toast.error(error);
      }
      return;
    }

    setVerificationSent(true);
    toast.success("Verification link sent to your email!");
  };

  return (
    <div className="page auth-page">
      <div className="auth-container">
        {!verificationSent ? (
          <>
            <h2 className="auth-header">Welcome To Lazzez</h2>
            <h3 className="auth-sub-header">Create Account</h3>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-input-container">
                <span>
                  <FaUser />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  autoComplete="off"
                  required
                />
              </div>
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
                {loading ? "Creating Account..." : "Create Account"}
              </button>
              <p className="auth-link">
                Already have an account? <Link to="/login">Login</Link>
              </p>
              <div className="divider">
                <hr />
                <span>OR</span>
                <hr />
              </div>
              <GoogleSignupButton />
            </form>
          </>
        ) : (
          <div className="verification-card">
            <svg className="success-icon" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#34D399" strokeWidth="2" />
              <path
                d="M8 12l2.5 2.5L16 9"
                stroke="#34D399"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h4 className="verification-heading">Almost there!</h4>
            <p className="verification-msg">
              A verification link has been sent to <strong>{email}</strong>.
            </p>
            <p className="verification-msg">
              After verifying, you can{" "}
              <Link to="/login" className="login-link">
                Login Here
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
