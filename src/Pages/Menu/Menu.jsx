import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./Menu.css";
import { getCartItem, getMenu } from "../../Firebase/firebaseClientFunctions";
import Card from "../../Components/Card/Card";
import Footer from "../../Components/Footer/Footer";
import { useAuth } from "../../Context/AuthContext";

export default function Menu() {
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState([]);
  const { currentUser } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(function () {
    async function getFullMenu() {
      setLoading(true);
      try {
        const data = await getMenu();
        setMenu(data);
        if (currentUser) {
          const response = await getCartItem(currentUser.uid);
          setCart(response[0].cartItems);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }

    getFullMenu();
  }, []);

  const arr = [
    "Starter",
    "Indian Breads",
    "Rice & Biryani",
    "Main Courses",
    "Sweet",
    "Beverage",
  ];

  return (
    <div className="page">
      <Navbar />
      <div style={{ minHeight: "100px", width: "100vw" }}></div>
      <h2 className="bestseller-section-heading">OUR MENU</h2>
      <div className="line"></div>

      <div className="all-menu-con">
        {loading ? (
          <p style={{ textAlign: "center", padding: "50px" }}>Loading...</p>
        ) : (
          arr.map((category, i) => {
            return (
              <div key={i}>
                <h2
                  style={{
                    padding: "30px 0px 20px 0px",
                    textAlign: "center",
                    fontFamily: "Cormorant",
                    fontStyle: "italic",
                    fontSize: "2.4em",
                    opacity: 0.9,
                  }}
                >
                  {category}
                </h2>
                <div className="all-card-con">
                  {menu.map((obj) => {
                    if (obj.category === category) {
                      return (
                        <Card
                          key={obj.id}
                          foodId={obj.id}
                          name={obj.name}
                          price={obj.price}
                          image_link={obj.imageUrl}
                          des={obj.description}
                          quantity={
                            cart.find((item) => item.foodId === obj.id)
                              ?.quantity || 0
                          }
                        />
                      );
                    }
                  })}
                  <div style={{ height: "10px", width: "100vw" }}></div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <Footer />
    </div>
  );
}
