import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import DashboardCard from "../../components/DashboardCard";

function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [portCount, setPortCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [countryCount, setCountryCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [shipCount, setShipCount] = useState(0);
  const [containerCount, setContainerCount] = useState(0);
  const [stats, setStats] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: token };

      try {
        const users = await axios.get("http://localhost:5000/api/users", {
          headers,
        });
        setUserCount(users.data.data.length);

        const ports = await axios.get("http://localhost:5000/api/ports", {
          headers,
        });
        setPortCount(ports.data.data.length);

        const bookings = await axios.get("http://localhost:5000/api/bookings", {
          headers,
        });
        setBookingCount(bookings.data.data.length);

        const countries = await axios.get(
          "http://localhost:5000/api/countries",
          { headers }
        );
        setCountryCount(countries.data.data.length);

        const employees = await axios.get(
          "http://localhost:5000/api/employees",
          { headers }
        );
        setEmployeeCount(employees.data.data.length);

        const ships = await axios.get("http://localhost:5000/api/ships", {
          headers,
        });
        setShipCount(ships.data.data.length);

        const containers = await axios.get(
          "http://localhost:5000/api/containers",
          { headers }
        );
        setContainerCount(containers.data.data.length);

        const statsResponse = await axios.get(
          "http://localhost:5000/api/stats",
          { headers }
        );
        setStats(statsResponse.data.data);

        const logs = await axios.get("http://localhost:5000/api/activityLogs", {
          headers,
        });
        setActivityLogs(logs.data.data);
      } catch (error) {
        toast.error(error.response.data.msg);
        console.error("Error fetching data", error.response || error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <Navbar />
        <div className="container mt-4">
          <h2>Admin Dashboard</h2>

          {/* Overview Section */}
          <div className="d-flex flex-wrap">
            <DashboardCard
              title="Total Users"
              value={userCount}
              path="/admin/manage-users"
            />
            <DashboardCard
              title="Total Ports"
              value={portCount}
              path="/admin/manage-ports"
            />
            <DashboardCard
              title="Total Bookings"
              value={bookingCount}
              path="/admin/manage-bookings"
            />
            <DashboardCard
              title="Total Countries"
              value={countryCount}
              path="/admin/manage-countries"
            />
            <DashboardCard
              title="Total Employees"
              value={employeeCount}
              path="/admin/manage-employees"
            />
            <DashboardCard
              title="Total Ships"
              value={shipCount}
              path="/admin/manage-ships"
            />
            <DashboardCard
              title="Total Containers"
              value={containerCount}
              path="/admin/manage-containers"
            />
          </div>

          {/* Quick Stats Section */}
          <div className="mt-4">
            <h3>Port Stats</h3>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Port Name</th>
                  <th>Capacity (TEU)</th>
                  <th>Available Space (TEU)</th>
                  <th>Utilization (%)</th>
                  <th>Active Bookings</th>
                  <th>Total Cargo Load (Tons)</th>
                </tr>
              </thead>
              <tbody>
                {stats.length > 0 ? (
                  stats.map((stat) => (
                    <tr key={stat.port_id}>
                      <td>{stat.port_name}</td>
                      <td>{stat.capacity}</td>
                      <td>{stat.available_space}</td>
                      <td>{parseFloat(stat.capacityUtilization).toFixed(2)}</td>
                      <td>{stat.activeBookings}</td>
                      <td>{stat.totalCargoLoad || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Activity Logs Section */}
          <div className="mt-4">
            <h3>Activity Logs</h3>
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table
                className="table table-striped"
                style={{ position: "relative" }}
              >
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f8f9fa",
                    zIndex: 1,
                  }}
                >
                  <tr>
                    <th>Activity</th>
                    <th>Port Name</th>
                    <th>Reference ID</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.length > 0 ? (
                    activityLogs.map((log, index) => (
                      <tr key={index}>
                        <td>{log.activity}</td>
                        <td>{log.port_name}</td>
                        <td>{log.reference_id}</td>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No recent activities</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
