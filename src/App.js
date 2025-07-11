import React from "react";
import { Routes, Route } from "react-router-dom";
import DamageForm from "./DamageForm";
import DamageView from "./DamageView";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import ExtraDamagePage from "./ExtraDamagePage";
import DamageRecordsPage from "./DamageRecordsPage"; // ✅ Correct import

function App() {
  return (
    <Routes>
      <Route path="/" element={<DamageForm />} />
      <Route path="/view" element={<DamageView />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/ExtraDamagePage" element={<ExtraDamagePage />} />
      <Route path="/records" element={<DamageRecordsPage />} />
    </Routes>
  );
}

export default App; // ✅ only one default export
