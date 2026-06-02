import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Expired from "./pages/Expired";
import PublicStats from "./pages/PublicStats";
import ResetPassword from "./pages/ResetPassword";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analytics/:id" element={<Analytics />} />
      <Route path="/expired" element={<Expired />} />
      <Route path="/stats/:shortCode" element={<PublicStats />} />
      <Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>
    </Routes>
  );
}

export default App;