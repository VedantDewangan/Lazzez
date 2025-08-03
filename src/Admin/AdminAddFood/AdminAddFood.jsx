import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminAddFood.css";
import { addFood } from "../../Firebase/firebaseAdminFunction";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminAddFood() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("Admin-Lazzez")) {
      navigate("/");
    }
  }, [navigate]);

  const [foodData, setFoodData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFoodData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (
      !foodData.name ||
      !foodData.price ||
      !foodData.category ||
      !foodData.image
    ) {
      alert("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const apiKey = "0af3cfa29c3d69f05c167ad66b693281";
      const formData = new FormData();
      formData.append("image", foodData.image);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await addFood(
        foodData.name,
        foodData.description,
        response.data.data.display_url,
        foodData.price,
        foodData.category
      );
      toast.success("Food Added");
      setFoodData({
        name: "",
        price: "",
        image: "",
        description: "",
        category: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong !!");
    }
    setLoading(false);
  };

  return (
    <div className="admin-page">
      <h2>Add New Food Item</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          className="admin-input"
          type="text"
          name="name"
          placeholder="Food Name"
          value={foodData.name}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <input
          className="admin-input"
          type="text"
          name="description"
          placeholder="Description"
          value={foodData.description}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <input
          className="admin-input"
          type="number"
          name="price"
          placeholder="Price"
          value={foodData.price}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <select
          className="admin-input"
          name="category"
          value={foodData.category}
          onChange={handleChange}
          required
          autoComplete="off"
        >
          <option value="">Select Category</option>
          <option value="Starter">Starter</option>
          <option value="Indian Breads">Indian Breads</option>
          <option value="Main Courses">Main Courses</option>
          <option value="Rice & Biryani">Rice & Biryani</option>
          <option value="Sweet">Sweet</option>
          <option value="Beverage">Beverage</option>
        </select>
        <input
          className="admin-input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <button className="admin-button" type="submit">
          {loading ? "Loading..." : "Add"}
        </button>
      </form>
      <Link to={"/admin"}>GO BACK</Link>
    </div>
  );
}
