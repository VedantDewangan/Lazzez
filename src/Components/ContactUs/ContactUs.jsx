import "./ContactUs.css";
import image from "../../Assets/icon-dining.png";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ContactUs() {
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const min = today.toISOString().split("T")[0];

    const max = new Date();
    max.setMonth(max.getMonth() + 3);

    if (max.getDate() !== today.getDate()) {
      max.setDate(0);
    }

    const maxStr = max.toISOString().split("T")[0];

    setMinDate(min);
    setMaxDate(maxStr);
  }, []);

  return (
    <div className="contact-page" id="con">
      <img className="contact-logo" src={image} alt="" />
      <h2 className="contact-page-heading">
        Host Your Private Events and Parties with Us
      </h2>
      <p className="contact-page-subheading">
        Whether it’s a party, birthday celebration, private function or awards
        ceremony, we can accommodate your upcoming event.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.warning("Sorry we are not booking tables now!!");
        }}
      >
        <div>
          <select>
            <option value="1">1 Person</option>
            <option value="2">2 Person</option>
            <option value="3">3 Person</option>
            <option value="4">4 Person</option>
            <option value="5">5 Person</option>
            <option value="6">6 Person</option>
            <option value="7">7 Person</option>
            <option value="8">8 Person</option>
            <option value="9">9 Person</option>
            <option value="10">10 Person</option>
          </select>
          <input type="date" min={minDate} max={maxDate} />
          <select>
            <option value="10:00">10:00</option>
            <option value="10:30">10:30</option>
            <option value="11:00">11:00</option>
            <option value="11:30">11:30</option>
            <option value="12:00">12:00</option>
            <option value="12:30">12:30</option>
            <option value="13:00">13:00</option>
            <option value="13:30">13:30</option>
            <option value="14:00">14:00</option>
            <option value="14:30">14:30</option>
            <option value="15:00">15:00</option>
            <option value="15:30">15:30</option>
            <option value="16:00">16:00</option>
            <option value="16:30">16:30</option>
            <option value="17:00">17:00</option>
            <option value="17:30">17:30</option>
            <option value="18:00">18:00</option>
            <option value="18:30">18:30</option>
            <option value="19:00">19:00</option>
            <option value="19:30">19:30</option>
            <option value="20:00">20:00</option>
            <option value="20:30">20:30</option>
            <option value="21:00">21:00</option>
            <option value="21:30">21:30</option>
            <option value="22:00">22:00</option>
            <option value="22:30">22:30</option>
            <option value="23:00">23:00</option>
            <option value="23:30">23:30</option>
            <option value="00:00">00:00</option>
          </select>
        </div>
        <input type="text" placeholder="Your Name" />
        <button>MAKE A RESERVATION</button>
      </form>
    </div>
  );
}
