import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "./Navbar.css";
import { logoutUser } from "../../Firebase/firebaseAuthFunctions";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const obj = [
    {
      name: "HOME",
      link: "/",
    },
    {
      name: "MENU",
      link: "/menu",
    },
    {
      name: "ORDERS",
      link: "/orders",
    },
    {
      name: "CART",
      link: "/cart",
    },
    {
      name: "AI",
      link: "/ai",
    },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <Link to={"/"}>LAZZEZ</Link>
        </div>
        <div className="navbar-right">
          {obj.map((obj, i) => {
            return (
              <Link key={i} to={obj.link}>
                {obj.name}
              </Link>
            );
          })}
          {currentUser ? (
            <button onClick={handleLogout}>LOGOUT</button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
              }}
            >
              LOGIN
            </button>
          )}
        </div>
      </div>
      <div className="hamburger">
        {open ? (
          <div className="hamburger-close">
            <IoClose
              className="close-icon"
              onClick={() => {
                setOpen((prev) => !prev);
              }}
            />
            {obj.map((item, i) => {
              return (
                <Link key={i} to={item.link}>
                  {item.name}
                </Link>
              );
            })}
            {currentUser ? (
              <button className="login-button-hamburger" onClick={handleLogout}>
                LOGOUT
              </button>
            ) : (
              <button
                className="login-button-hamburger"
                onClick={() => {
                  navigate("/login");
                }}
              >
                LOGIN
              </button>
            )}
          </div>
        ) : (
          <div className="hamburger-open">
            <GiHamburgerMenu
              onClick={() => {
                setOpen((prev) => !prev);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
