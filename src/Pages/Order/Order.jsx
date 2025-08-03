import Navbar from "../../Components/Navbar/Navbar";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Order.css";
import { useEffect, useState } from "react";
import { getMyOrder } from "../../Firebase/firebaseClientFunctions";

export default function Order() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getOrder = async () => {
      if (!currentUser) return;
      setLoading(true);
      const data = await getMyOrder(currentUser.uid);

      // Sort latest orders first (assuming date + time are strings)
      const sorted = data.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB - dateA;
      });

      setOrder(sorted);
      setLoading(false);
    };
    getOrder();
  }, [currentUser]);

  return (
    <div className="page">
      <Navbar />
      <div style={{ height: "100px", width: "100vw" }}></div>
      {currentUser ? (
        <div className="order-content">
          <h2 className="order-heading">Your Orders</h2>
          {loading ? (
            <p className="order-subtext">Loading...</p>
          ) : order.length === 0 ? (
            <p className="order-subtext">
              No orders yet. When you place one, it will show up here!
            </p>
          ) : (
            <div className="order-list">
              {order.map((orderItem) => (
                <div className="order-card" key={orderItem.id}>
                  <div className="order-header">
                    <span>
                      <strong>Order ID:</strong> {orderItem.id}
                    </span>
                    <span>
                      <strong>Status:</strong> {orderItem.status}
                    </span>
                  </div>
                  <div className="order-details">
                    <span>
                      <strong>Date:</strong> {orderItem.date}
                    </span>
                    <span>
                      <strong>Time:</strong> {orderItem.time}
                    </span>
                    <span>
                      <strong>Address:</strong> {orderItem.userInfo.userAddress}
                      , {orderItem.userInfo.userPincode}
                    </span>
                  </div>

                  <div className="order-cart-slider">
                    {orderItem.cart.map((item, idx) => (
                      <div className="order-food-item" key={idx}>
                        <img src={item.FoodImageUrl} alt={item.FoodName} />
                        <div className="item-info">
                          <h4>{item.FoodName}</h4>
                          <p>
                            ₹{item.FoodPrice} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="not-logged-in">
          <p className="login-warning">Please login to view your orders.</p>
          <button onClick={() => navigate("/login")} className="login-btn">
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}
