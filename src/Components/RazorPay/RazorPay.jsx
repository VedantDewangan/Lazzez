import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import "./RazorPay.css";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../Firebase/firebaseClientFunctions";

export default function RazorPay({ grandTotal, cart, cartId }) {
  const { currentUser } = useAuth();
  const [address, setAdress] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const navigate = useNavigate();
  const buyNow = async () => {
    if (!currentUser) return;
    if (address.length <= 5 || pincode.length !== 6) {
      toast.error("Please enter a valid address and pincode");
      return;
    }
    if (pincode !== "492001") {
      toast.error("Sorry, we currently deliver only within Raipur city");
      return;
    }
    const userInfo = {
      userId: currentUser.uid,
      userName: currentUser.displayName,
      userEmail: currentUser.email,
      userAddress: address,
      userPincode: pincode,
      userLandmark: landmark,
    };
    var options = {
      key: "rzp_test_ZIIbSfegRnSEtJ",
      amount: parseInt(grandTotal * 100),
      currency: "INR",
      name: "E-Bharat",
      description: "for testing purpose",
      order_receipt: "order_rcptid_" + currentUser.displayName,
      handler: async function (response) {
        const paymentId = response.razorpay_payment_id;
        const now = new Date();
        const orderInfo = {
          cart,
          userInfo,
          date: now.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          time: now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          status: "Preparing Food",
          paymentId,
        };
        await createOrder({ data: orderInfo, cartId: cartId });
        toast.success("Payment Successful");
        navigate("/orders");
      },
      prefill: {
        name: currentUser.displayName,
        email: currentUser.email,
      },
      theme: {
        color: "#3399cc",
      },
    };
    var pay = new window.Razorpay(options);
    pay.open();
  };

  return (
    <div className="checkout-form">
      <label htmlFor="address">Address</label>
      <input
        type="text"
        id="address"
        placeholder="Enter your address"
        value={address}
        onChange={(e) => setAdress(e.target.value)}
        autoComplete="off"
      />
      <label htmlFor="pincode">Pincode</label>
      <input
        type="text"
        id="pincode"
        placeholder="Enter your pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        autoComplete="off"
      />
      <label htmlFor="landmark">
        Landmark{" "}
        <span style={{ color: "#888", fontSize: "12px" }}>(optional)</span>
      </label>
      <input
        type="text"
        id="landmark"
        placeholder="Nearby landmark"
        value={landmark}
        onChange={(e) => setLandmark(e.target.value)}
        autoComplete="off"
      />
      <button className="checkout-btn" onClick={buyNow}>
        Proceed to Checkout
      </button>
    </div>
  );
}
