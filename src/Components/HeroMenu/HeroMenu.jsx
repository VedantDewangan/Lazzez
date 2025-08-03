import { useEffect, useState } from "react";
import Card from "../Card/Card";
import "./HeroMenu.css";
import {
  getBestSellerMenu,
  getCartItem,
} from "../../Firebase/firebaseClientFunctions";
import { useAuth } from "../../Context/AuthContext";

export default function HeroMenu() {
  const [bestseller, setBestSeller] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const getBestSeller = async () => {
      setLoading(true);
      try {
        const data = await getBestSellerMenu();
        setBestSeller(data);
        if (currentUser) {
          const response = await getCartItem(currentUser.uid);
          4;
          setCart(response[0].cartItems);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getBestSeller();
  }, []);

  return (
    <div className="bestseller-section">
      <h2 className="bestseller-section-heading">OUR BESTSELLER</h2>
      <div className="line"></div>
      <div className="all-card-con">
        {loading ? (
          <p>Loading...</p>
        ) : (
          bestseller.map((obj, i) => {
            return (
              <Card
                key={i}
                foodId={obj.id}
                name={obj.name}
                image_link={obj.imageUrl}
                des={obj.description}
                price={obj.price}
                quantity={
                  cart.find((item) => item.foodId === obj.id)?.quantity || 0
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}
