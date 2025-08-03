import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("Admin-Lazzez")) {
      navigate("/admin");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email !== "admin@lazzez.com" || password !== "Lazzez@123") {
      toast.error("Please Enter valid credentials");
      return;
    }
    localStorage.setItem("Admin-Lazzez", "Admin logged In");
    navigate("/admin");
    toast.success("Welcome ADMIN");
  };

  return (
    <div className="page admin-login-page">
      <h2
        style={{
          color: "whitesmoke",
          fontWeight: "500",
          textAlign: "center",
          margin: 0,
        }}
      >
        Admin Login
      </h2>
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
        />
        <button type="submit">LOGIN AS ADMIN</button>
      </form>
    </div>
  );
}
