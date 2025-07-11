import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaUserShield } from "react-icons/fa";
import "./DamageForm.css";
import "leaflet/dist/leaflet.css";

const DamageForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    agency_name: "",
    milk_1_liter: "",
    milk_500_ml: "",
    milk_250_ml: "",
    milk_120_ml: "",
    curd_1_liter: "",
    curd_500_ml: "",
    curd_400_ml: "",
    curd_200_ml: "",
    curd_110_ml: "",
    other_product: "",
    other_product_quantity: "",
    submittedAt: ""
  });

  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error(error);
          alert("❌ Could not fetch location.");
        }
      );
    } else {
      alert("❌ Geolocation not supported.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const formattedDateTime = now.toLocaleString("ta-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const dataToSend = {
      ...formData,
      submittedAt: formattedDateTime
    };

    try {
      const res = await fetch("http://localhost:5000/api/damage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      });

      const result = await res.json();
      if (res.ok) {
        alert("✅ சேதம் பதிவு செய்யப்பட்டது!");
        setFormData({
          agency_name: "",
          milk_1_liter: "",
          milk_500_ml: "",
          milk_250_ml: "",
          milk_120_ml: "",
          curd_1_liter: "",
          curd_500_ml: "",
          curd_400_ml: "",
          curd_200_ml: "",
          curd_110_ml: "",
          other_product: "",
          other_product_quantity: "",
          submittedAt: ""
        });
      } else {
        alert("❌ பிழை: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ சேமிக்கும் போது பிழை ஏற்பட்டது.");
    }
  };

  return (
    <div className="container">
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-title">பால் / தயிர் சேதம் பதிவு</div>
          <button className="navbar-button" onClick={() => navigate("/ExtraDamagePage")}>
            Extra Damage
          </button>
          <button className="navbar-button" onClick={() => navigate("/view")}>
            View
          </button>
          <div className="navbar-buttons">
          <FaUserShield
            className="navbar-button"
            size={15} 
            onClick={() => navigate("/admin")}
            title="Admin Login"
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group full-width">
          <label>நிறுவனத்தின் பெயர்:</label>
          <input type="text" name="agency_name" value={formData.agency_name} onChange={handleChange} required />
        </div>

        <div className="form-columns">
          <div className="column">
            <h3>பால்</h3>
            {["milk_1_liter", "milk_500_ml", "milk_250_ml", "milk_120_ml"].map((name, i) => (
              <div className="form-group" key={i}>
                <label>{name.replace(/_/g, " ").replace(/ml|liter/, m => m === "ml" ? "மில்லி" : "லிட்டர்")}:</label>
                <input type="number" name={name} value={formData[name]} onChange={handleChange} min="0" />
              </div>
            ))}
          </div>

          <div className="column">
            <h3>தயிர்</h3>
            {["curd_1_liter", "curd_500_ml", "curd_400_ml", "curd_200_ml", "curd_110_ml"].map((name, i) => (
              <div className="form-group" key={i}>
                <label>{name.replace(/_/g, " ").replace(/ml|liter/, m => m === "ml" ? "மில்லி" : "லிட்டர்")}:</label>
                <input type="number" name={name} value={formData[name]} onChange={handleChange} min="0" />
              </div>
            ))}
          </div>
        </div>

        <h3>பிற தயாரிப்பு</h3>
        <div className="form-group full-width">
          <label>தயாரிப்பின் பெயர்:</label>
          <input type="text" name="other_product" value={formData.other_product} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>அளவு:</label>
          <input type="number" name="other_product_quantity" value={formData.other_product_quantity} onChange={handleChange} min="0" />
        </div>

        {formData.submittedAt && (
          <p className="info">📅 பதிவு நேரம்: {formData.submittedAt}</p>
        )}

        <button type="submit" className="submit-button">சேமிக்க</button>
      </form>

      {/* Map */}
      {location && (
        <div style={{ height: "400px", marginTop: "20px" }}>
          <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ width: "100%", height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[location.lat, location.lng]}>
              <Popup>தற்போதைய இடம்</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default DamageForm;
