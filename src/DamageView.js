import React, { useEffect, useState } from "react";
import './DamageView.css'; // Importing the CSS file

const DamageView = () => {
  const [items, setItems] = useState([]);  // All fetched data
  const [filteredItems, setFilteredItems] = useState([]); // Filtered results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchAgency, setSearchAgency] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    fetch('http://localhost:5000/api/damage')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setItems(data);
        setFilteredItems(data); // Initially all
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error: ", err);
        setError("Failed to fetch data. Please check the server and URL.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = items;

    if (searchAgency.trim() !== "") {
      filtered = filtered.filter(item =>
        item.agency_name.toLowerCase().includes(searchAgency.toLowerCase())
      );
    }

    if (searchDate !== "") {
      filtered = filtered.filter(item =>
        new Date(item.damage_date).toISOString().split('T')[0] === searchDate
      );
    }

    setFilteredItems(filtered);
  }, [searchAgency, searchDate, items]);

  const formatDateTime = (dateString) => {
    if (!dateString) return { formattedDate: "தேதி இல்லை", time: "நேரம் இல்லை", day: "நாள் இல்லை" };

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { formattedDate: "தவறான தேதி", time: "தவறான நேரம்", day: "தவறான நாள்" };
    }

    const dayNames = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
    const day = dayNames[date.getDay()];
    const time = date.toLocaleTimeString('ta-IN');
    const formattedDate = date.toLocaleDateString('ta-IN');

    return { formattedDate, time, day };
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="card-container">
      <h2>சேதமான பொருட்கள் - பட்டியல்</h2>
      <p>இங்கு சேமிக்கப்பட்ட பால்/தயிர் சேத விவரங்கள் காண்பிக்கப்படும்.</p>

      {/* Filter Section */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="🔍 நிறுவனம் மூலம் தேடவும்"
          value={searchAgency}
          onChange={(e) => setSearchAgency(e.target.value)}
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      <div className="cards">
        {filteredItems.length === 0 ? (
          <p>பொருத்தமான பதிவுகள் இல்லை</p>
        ) : (
          filteredItems.map((item) => {
            const { formattedDate, time, day } = formatDateTime(item.damage_date);
            return (
              <div className="card" key={item._id}>
                <div className="card-header">📅 {formattedDate} - {day}</div>
                <p className="product-name">🏢 நிறுவனம்: {item.agency_name}</p>
                <p>🍼 1 லிட்டர் பால்: {item.milk_1_liter}</p>
                <p>🍼 500 மில்லி பால்: {item.milk_500_ml}</p>
                <p>🍼 250 மில்லி பால்: {item.milk_250_ml}</p>
                <p>🍼 120 மில்லி பால்: {item.milk_120_ml}</p> {/* Added 120ml milk */}
                <p>🍶 1 லிட்டர் தயிர்: {item.curd_1_liter}</p>
                <p>🍶 500 மில்லி தயிர்: {item.curd_500_ml}</p>
                <p>🍶 400 மில்லி தயிர்: {item.curd_400_ml}</p> {/* Added 400ml curd */}
                <p>🍶 200 மில்லி தயிர்: {item.curd_200_ml}</p> {/* Added 200ml curd */}
                <p>🍶 110 மில்லி தயிர்: {item.curd_110_ml}</p> {/* Added 110ml curd */}
                <p>🍶 பிற தயாரிப்பு: {item.other_product} - {item.other_product_quantity}</p>
                <p className="time">🕒 நேரம்: {time}</p>
                <button>View Details</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DamageView;
