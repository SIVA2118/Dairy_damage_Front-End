import React, { useEffect, useState } from "react";
import Navbar from './Navbar';
import "./DamageRecordsPage.css";

const DamageRecordsPage = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/image/records")
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div>
      <div><Navbar /></div>
      <h2>📋 Damage Records</h2>
      <div className="records-container">
        {records.map((record, index) => (
          <div className="record-card" key={index}>
            <h3>{record.agency_name}</h3>
            <p><strong>Date:</strong> {new Date(record.submittedAt).toLocaleString()}</p>

            {/* Two-Column Layout for Milk & Curd */}
            <div className="details-grid">
              <div className="milk-section">
                <h4>🥛 Milk Details</h4>
                <p><strong>1 Liter:</strong> {record.milk_1_liter}</p>
                <p><strong>500 ml:</strong> {record.milk_500_ml}</p>
                <p><strong>250 ml:</strong> {record.milk_250_ml}</p>
                <p><strong>120 ml:</strong> {record.milk_120_ml}</p>
              </div>

              <div className="curd-section">
                <h4>🍶 Curd Details</h4>
                <p><strong>1 Liter:</strong> {record.curd_1_liter}</p>
                <p><strong>500 ml:</strong> {record.curd_500_ml}</p>
                <p><strong>400 ml:</strong> {record.curd_400_ml}</p>
                <p><strong>200 ml:</strong> {record.curd_200_ml}</p>
                <p><strong>110 ml:</strong> {record.curd_110_ml}</p>
              </div>
            </div>

            {/* Other Product */}
            <div className="product-section">
              <h4>📦 Other Product</h4>
              <p><strong>Product Name:</strong> {record.other_product}</p>
              <p><strong>Quantity:</strong> {record.other_product_quantity}</p>
            </div>

            {/* Image */}
            {record.image && (
              <img
                src={`data:image/jpeg;base64,${record.image}`}
                alt="Damage"
                className="record-image"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DamageRecordsPage;
