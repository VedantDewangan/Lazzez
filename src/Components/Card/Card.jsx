import "./Card.css";
import image from "../../Assets/Biryani.jpg";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../../Firebase/firebaseClientFunctions";
import { useState } from "react";

export default function Card({
  image_link,
  name,
  price,
  des,
  foodId,
  quantity,
}) {
  const { currentUser } = useAuth();
  const [quan, setQuan] = useState(quantity);

  const handleClick = async () => {
    if (!currentUser) {
      toast.error("Please Login To Add To Cart");
      return;
    }
    await addToCart({
      usserId: currentUser.uid,
      userName: currentUser.displayName,
      userEmail: currentUser.email,
      foodId,
      FoodName: name,
      FoodPrice: price,
      FoodImageUrl: image_link,
      FoodDescription: des,
    });
    toast.success("Item added in cart");
    setQuan(1);
  };

  const increaseQuantity = async () => {
    if (!currentUser) return;
    await addToCart({
      usserId: currentUser.uid,
      userName: currentUser.displayName,
      userEmail: currentUser.email,
      foodId,
      FoodName: name,
      FoodPrice: price,
      FoodImageUrl: image_link,
      FoodDescription: des,
    });
    setQuan((prev) => prev + 1);
  };

  const decreaseQuantity = async () => {
    if (!currentUser) return;
    if (quan === 1) {
      await removeFromCart({
        userId: currentUser.uid,
        foodId: foodId,
      });
      setQuan(0);
    } else if (quan > 1) {
      await updateCartItemQuantity({
        userId: currentUser.uid,
        foodId: foodId,
        newQuantity: quan - 1,
      });
      setQuan((prev) => prev - 1);
    }
  };

  return (
    <div className="card-container">
      <div className="card-img-con">
        <img src={image_link || image} alt={name} />
      </div>

      <div className="card-content">
        <p className="card-name">{name}</p>
        {des && <p className="card-description">{des}</p>}
      </div>

      <div className="card-price-con">
        <p>₹{price}</p>
        {quan === 0 || !currentUser ? (
          <button
            onClick={handleClick}
            style={{ backgroundColor: "rgb(26, 214, 26)" }}
          >
            Add
          </button>
        ) : (
          <div className="card-inc-dec-but">
            <button
              onClick={() => {
                increaseQuantity();
              }}
            >
              +
            </button>
            <p>{quan}</p>
            <button
              onClick={() => {
                decreaseQuantity();
              }}
            >
              -
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
