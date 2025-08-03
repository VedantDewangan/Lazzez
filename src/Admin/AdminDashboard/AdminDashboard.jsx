import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addToBestSeller,
  deleteTheFood,
  getAllFood,
  getAllOrders,
  removeFromBestSeller,
} from "../../Firebase/firebaseAdminFunction";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [food, setFood] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [getLoading, setGetLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("Admin-Lazzez")) {
      navigate("/admin/login");
    }
    const getAllFoodItem = async () => {
      if (getLoading) return;
      setGetLoading(true);
      try {
        const data = await getAllFood();
        setFood(data);
        setFoodItem(data);
      } catch (error) {
        console.log(error);
      }
      setGetLoading(false);
    };
    const getAllOrder = async () => {
      const data = await getAllOrders();
      setOrder(data);
    };
    getAllFoodItem();
    getAllOrder();
  }, []);

  useEffect(() => {
    if (search === "") {
      setFoodItem(food);
    } else {
      setFoodItem(
        food.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, food]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const orderStats = {
    todayOrders: 12,
    pendingOrders: 5,
    totalOrders: 238,
  };

  const deleteFood = async (id) => {
    try {
      await deleteTheFood({ id });
      setFood((prev) => prev.filter((item) => item.id !== id));
      toast.success("Food item deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error in deleting the food item");
    }
  };

  const addBestSeller = async (id) => {
    try {
      await addToBestSeller({ id });
      const arr = food.map((obj) =>
        obj.id === id ? { ...obj, bestseller: true } : obj
      );
      setFood(arr);
      toast.success("Added to bestseller");
    } catch (error) {
      console.log(error);
      toast.error("Error in adding to bestseller");
    }
  };

  const removeBestSeller = async (id) => {
    try {
      await removeFromBestSeller({ id });
      const arr = food.map((obj) =>
        obj.id === id ? { ...obj, bestseller: false } : obj
      );
      setFood(arr);
      toast.success("Removed from bestseller");
    } catch (error) {
      console.log(error);
      toast.error("Error in removing from bestseller");
    }
  };

  const today = new Date().toDateString();

  const todayOrders = order.filter(
    (item) => new Date(item.date).toDateString() === today
  );
  const pendingOrders = order.filter((item) => item.status !== "Delivered");

  return (
    <div>
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>{todayOrders.length}</h3>
          <p>Today's Orders</p>
        </div>
        <div className="summary-card">
          <h3>{pendingOrders.length}</h3>
          <p>Pending Orders</p>
        </div>
        <div className="summary-card">
          <h3>{food.length}</h3>
          <p>Total Food Items</p>
        </div>
      </div>
      <div className="admin-buttons">
        <button onClick={() => navigate("/admin/manage-order")}>
          Manage Orders
        </button>
        <button onClick={() => navigate("/admin/add-food")}>
          Add New Food
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="admin-search-con">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button>SEARCH</button>
      </div>
      <div className="food-container">
        {getLoading ? (
          <p>Loading...</p>
        ) : (
          foodItem.map((obj, i) => (
            <div className="food-card" key={i}>
              <img
                className="food-image"
                src={obj.imageUrl ? obj.imageUrl : null}
                alt={obj.name}
              />
              <div className="food-details">
                <h3>{obj.name}</h3>
                <p>{obj.description}</p>
                <p>
                  <strong>Price:</strong> ₹{obj.price}
                </p>
                <p>
                  <strong>Category:</strong> {obj.category}
                </p>
                <div className="food-actions">
                  <button
                    className="delete-btn"
                    onClick={() => deleteFood(obj.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bestseller-btn"
                    onClick={() => {
                      if (obj.bestseller) {
                        removeBestSeller(obj.id);
                      } else {
                        addBestSeller(obj.id);
                      }
                    }}
                  >
                    {obj.bestseller
                      ? "Remove from Bestseller"
                      : "Add to Bestseller"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
