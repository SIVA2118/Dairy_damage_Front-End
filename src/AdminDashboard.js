import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; // Import the Navbar component
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [data, filterText, filterDate]);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/damage');
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch data from the server.");
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = data;

    if (filterText.trim() !== '') {
      filtered = filtered.filter(item =>
        item.agency_name?.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    if (filterDate !== '') {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt).toISOString().split('T')[0];
        return itemDate === filterDate;
      });
    }

    setFilteredData(filtered);
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData(item);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/damage/${editId}`, formData);
      if (res.status === 200) {
        alert("✅ Record updated successfully");
        setEditId(null);
        fetchData();
      } else {
        alert("❌ Failed to update record.");
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert("❌ Failed to update record.");
    }
  };

  if (loading) return <p>🔄 Loading data...</p>;
  if (error) return <p>❌ {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      {/* Navbar moved inside the padded container */}
      <Navbar />

      {/* 🔍 Filter Section */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search Agency Name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {filteredData.length === 0 ? (
        <p>📭 No matching records found</p>
      ) : (
        <div className="card-container">
          {filteredData.map((item) => (
            <div key={item._id} className="dashboard-card">
              <h1 className="agency-heading">🏢 {item.agency_name}</h1>
              <p><strong>🥛 Milk 1L:</strong> {item.milk_1_liter}</p>
              <p><strong>🥛 Milk 500ml:</strong> {item.milk_500_ml}</p>
              <p><strong>🥛 Milk 250ml:</strong> {item.milk_250_ml}</p>
              <p><strong>🥛 Milk 120ml:</strong> {item.milk_120_ml}</p>
              <p><strong>🍶 Curd 1L:</strong> {item.curd_1_liter}</p>
              <p><strong>🍶 Curd 500ml:</strong> {item.curd_500_ml}</p>
              <p><strong>🍶 Curd 400ml:</strong> {item.curd_400_ml}</p>
              <p><strong>🍶 Curd 200ml:</strong> {item.curd_200_ml}</p>
              <p><strong>🍶 Curd 110ml:</strong> {item.curd_110_ml}</p>
              <p><strong>📦 Other Product:</strong> {item.other_product}</p>
              <p><strong>🔢 Other Qty:</strong> {item.other_product_quantity}</p>
              <p><strong>🕒 Submitted At:</strong> {new Date(item.createdAt).toLocaleString()}</p>
              {isAdmin && (
                <button onClick={() => handleEdit(item)}>✏️ Edit</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ✅ Edit Modal */}
      {editId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Record</h3>
            <input name="agency_name" value={formData.agency_name || ""} onChange={handleChange} placeholder="Agency Name" />
            <input name="milk_1_liter" value={formData.milk_1_liter || ""} onChange={handleChange} placeholder="Milk 1L" />
            <input name="milk_500_ml" value={formData.milk_500_ml || ""} onChange={handleChange} placeholder="Milk 500ml" />
            <input name="milk_250_ml" value={formData.milk_250_ml || ""} onChange={handleChange} placeholder="Milk 250ml" />
            <input name="milk_120_ml" value={formData.milk_120_ml || ""} onChange={handleChange} placeholder="Milk 120ml" />
            <input name="curd_1_liter" value={formData.curd_1_liter || ""} onChange={handleChange} placeholder="Curd 1L" />
            <input name="curd_500_ml" value={formData.curd_500_ml || ""} onChange={handleChange} placeholder="Curd 500ml" />
            <input name="curd_400_ml" value={formData.curd_400_ml || ""} onChange={handleChange} placeholder="Curd 400ml" />
            <input name="curd_200_ml" value={formData.curd_200_ml || ""} onChange={handleChange} placeholder="Curd 200ml" />
            <input name="curd_110_ml" value={formData.curd_110_ml || ""} onChange={handleChange} placeholder="Curd 110ml" />
            <input name="other_product" value={formData.other_product || ""} onChange={handleChange} placeholder="Other Product" />
            <input name="other_product_quantity" value={formData.other_product_quantity || ""} onChange={handleChange} placeholder="Other Product Qty" />
            <div>
              <button className="modal-save" onClick={handleSave}>💾 Save</button>
              <button className="modal-cancel" onClick={() => setEditId(null)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
