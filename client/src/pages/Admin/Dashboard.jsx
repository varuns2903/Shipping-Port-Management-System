import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";

function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [portCount, setPortCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const users = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: token,
          },
        });
        const ports = await axios.get("http://localhost:5000/api/ports", {
          headers: {
            Authorization: token,
          },
        });
        const bookings = await axios.get("http://localhost:5000/api/bookings", {
          headers: {
            Authorization: token,
          },
        });

        setUserCount(users.data.length);
        setPortCount(ports.data.length);
        setBookingCount(bookings.data.length);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <div className="container mt-4">
          <h2>Admin Dashboard</h2>
          <div className="d-flex">
            <DashboardCard title="Total Users" value={userCount} />
            <DashboardCard title="Total Ports" value={portCount} />
            <DashboardCard title="Total Bookings" value={bookingCount} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
