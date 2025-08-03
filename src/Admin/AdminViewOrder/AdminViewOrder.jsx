import { useEffect, useState } from "react";
import "./AdminViewOrder.css";
import { useNavigate } from "react-router-dom";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../Firebase/firebaseAdminFunction";
import { toast } from "react-toastify";

export default function AdminViewOrder() {
  const navigate = useNavigate();
  const [currTab, setCurrTab] = useState("pending");
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("Admin-Lazzez")) {
      navigate("/");
    }

    const getAllOrder = async () => {
      setLoading(true);
      try {
        const data = await getAllOrders();
        setOrder(data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    getAllOrder();
  }, []);

  const updateOrder = async (obj) => {
    try {
      const newStatus =
        obj.status === "Preparing Food" ? "Out For Delivery" : "Delivered";
      await updateOrderStatus({ id: obj.id, text: newStatus });

      setOrder((prev) =>
        prev.map((order) =>
          order.id === obj.id ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order Updated");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const filteredOrders =
    currTab === "pending"
      ? order.filter((order) => order.status !== "Delivered")
      : order.filter((order) => order.status === "Delivered");

  return (
    <div className="admin-orders-page">
      <div className="admin-order-tabs">
        <button
          className={currTab === "pending" ? "active-tab" : ""}
          onClick={() => setCurrTab("pending")}
        >
          VIEW PENDING ORDERS
        </button>
        <button
          className={currTab === "all" ? "active-tab" : ""}
          onClick={() => setCurrTab("all")}
        >
          VIEW ALL ORDERS
        </button>
      </div>

      <div className="order-list">
        {filteredOrders.map((orderItem) => {
          return (
            <div className="order-card" key={orderItem.id}>
              <div className="order-header">
                <span>
                  <strong>Order ID:</strong> {orderItem.id}
                </span>
                <span>
                  <div>
                    <strong>Status:</strong> {orderItem.status}
                  </div>
                  <button
                    className="update-but"
                    style={{
                      display:
                        orderItem.status === "Delivered" ? "none" : "block",
                    }}
                    onClick={() => {
                      updateOrder(orderItem);
                    }}
                  >
                    Update Order
                  </button>
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
                  <strong>Address:</strong> {orderItem?.userInfo?.userAddress},{" "}
                  {orderItem?.userInfo?.userPincode}
                </span>
              </div>
              <div className="order-cart-slider">
                {orderItem?.cart?.map((item, idx) => (
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
          );
        })}
      </div>
    </div>
  );
}
