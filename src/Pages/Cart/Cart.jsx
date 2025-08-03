import Navbar from "../../Components/Navbar/Navbar";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { useEffect, useState } from "react";
import {
  addToCart,
  getCartItem,
  removeFromCart,
  updateCartItemQuantity,
} from "../../Firebase/firebaseClientFunctions";
import RazorPay from "../../Components/RazorPay/RazorPay";

export default function Cart() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingReduce, setLoadingReduce] = useState(null);
  const [loadingIncrease, setLoadingIncrease] = useState(null);
  const [cartId, setCartId] = useState("");

  useEffect(() => {
    const getCartItems = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const data = await getCartItem(currentUser.uid);
        setCart(data[0].cartItems);
        setCartId(data[0].id);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    getCartItems();
  }, [currentUser]);

  const getPriceBreakdown = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.FoodPrice * item.quantity,
      0
    );
    const gst = subtotal * 0.05;
    const total = subtotal + gst;
    return {
      subtotal,
      gst,
      delivery: 100,
      grandTotal: total,
    };
  };

  const { subtotal, gst, delivery, grandTotal } = getPriceBreakdown();

  const reduceQuantity = async ({ id, quantity }) => {
    if (!currentUser || loadingReduce) return;
    setLoadingReduce(id);

    try {
      if (quantity === 1) {
        await removeFromCart({ userId: currentUser.uid, foodId: id });
        setCart((prev) => prev.filter((item) => item.foodId !== id));
      } else {
        const newQuantity = quantity - 1;
        await updateCartItemQuantity({
          userId: currentUser.uid,
          foodId: id,
          newQuantity,
        });
        setCart((prev) =>
          prev.map((item) =>
            item.foodId === id ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error reducing quantity:", error);
    }

    setLoadingReduce(null);
  };

  const increaseQuantity = async ({ obj }) => {
    if (!currentUser || loadingIncrease) return;
    setLoadingIncrease(obj.foodId);
    await addToCart({
      userEmail: currentUser.email,
      userName: currentUser.displayName,
      usserId: currentUser.uid,
      FoodDescription: obj.description,
      foodId: obj.foodId,
      FoodImageUrl: obj.imageUrl,
      FoodName: obj.name,
      FoodPrice: obj.name,
    });
    setCart((prev) =>
      prev.map((item) =>
        item.foodId === obj.foodId
          ? { ...item, quantity: item.quantity + 1 }
          : { ...item }
      )
    );
    setLoadingIncrease(null);
  };

  return (
    <div className="page">
      <Navbar />
      <div style={{ height: "50px", width: "100vw" }}></div>

      {currentUser ? (
        loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
        ) : cart.length === 0 ? (
          <div className="cart-content" style={{ paddingTop: "40px" }}>
            <h2 className="cart-heading">Your Cart</h2>
            <p className="cart-subtext">You haven't added anything yet.</p>
          </div>
        ) : (
          <div className="cart-container">
            <h2 className="cart-heading">Your Cart</h2>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.foodId} className="cart-item">
                  <img
                    src={item.FoodImageUrl}
                    alt={item.FoodName}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <h3>{item.FoodName}</h3>
                    <p>Price: ₹{item.FoodPrice}</p>
                    <div className="cart-quantity-but">
                      <button
                        style={{
                          opacity: loadingIncrease
                            ? loadingIncrease === item.foodId
                              ? 0.4
                              : 1
                            : 1,
                        }}
                        onClick={() => {
                          increaseQuantity({ obj: item });
                        }}
                      >
                        +
                      </button>
                      <p>{item.quantity}</p>
                      <button
                        style={{
                          opacity: loadingReduce
                            ? loadingReduce === item.foodId
                              ? 0.4
                              : 1
                            : 1,
                        }}
                        onClick={() => {
                          reduceQuantity({
                            id: item.foodId,
                            quantity: item.quantity,
                          });
                        }}
                      >
                        -
                      </button>
                    </div>
                    <p>Total: ₹{item.FoodPrice * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <h3>Checkout Summary</h3>
              <div className="checkout-line">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout-line">
                <span>GST (5%):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="checkout-line">
                <span>Delivery:</span>
                <span>
                  <span className="cut-price">₹{delivery}</span>{" "}
                  <span className="free-text">Free</span>
                </span>
              </div>
              <hr />
              <div className="checkout-line total">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              <RazorPay
                cart={cart}
                grandTotal={grandTotal.toFixed(2)}
                cartId={cartId}
              />
              <p className="test-purpose">For Test Purpose use these cards</p>
              <p className="test-purpose">5267 3181 8797 5449</p>
              <p className="test-purpose">4386 2894 0766 0153</p>
            </div>
          </div>
        )
      ) : (
        <div className="not-logged-in">
          <p className="login-warning">Please login to view your cart.</p>
          <button onClick={() => navigate("/login")} className="login-btn">
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}
