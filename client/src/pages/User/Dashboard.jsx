import React from 'react'

const UserDashboard = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 font-weight-bold">User Dashboard</h1>
      <p className="text-center mb-4 text-muted">
        Welcome! Here’s an overview of your recent bookings, upcoming shipments,
        and container statuses.
      </p>

      {/* Overview Cards Section */}
      <div className="row mb-4">
        {/* Recent Bookings */}
        <div className="col-md-4">
          <div className="card border-primary mb-3">
            <div className="card-header bg-primary text-white">
              Recent Bookings
            </div>
            <div
              className="card-body"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {recentBookings.length > 0 ? (
                <ul className="list-group">
                  {recentBookings.slice(0, 5).map((booking) => (
                    <li key={booking.booking_id} className="list-group-item">
                      <strong>Booking ID:</strong> {booking.booking_id},{" "}
                      <strong>Status:</strong> {booking.booking_status}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent bookings.</p>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Shipments */}
        <div className="col-md-4">
          <div className="card border-success mb-3">
            <div className="card-header bg-success text-white">
              Upcoming Shipments
            </div>
            <div
              className="card-body"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {upcomingShipments.length > 0 ? (
                <ul className="list-group">
                  {upcomingShipments.slice(0, 5).map((shipment) => (
                    <li key={shipment.ship_id} className="list-group-item">
                      <strong>Ship ID:</strong> {shipment.ship_id},{" "}
                      <strong>Name:</strong> {shipment.ship_name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming shipments.</p>
              )}
            </div>
          </div>
        </div>

        {/* Container Statuses */}
        <div className="col-md-4">
          <div className="card border-info mb-3">
            <div className="card-header bg-info text-white">
              Container Statuses
            </div>
            <div
              className="card-body"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {containerStatuses.length > 0 ? (
                <ul className="list-group">
                  {containerStatuses.slice(0, 5).map((container) => (
                    <li
                      key={container.container_id}
                      className="list-group-item"
                    >
                      <strong>Container ID:</strong> {container.container_id},{" "}
                      <strong>Type:</strong> {container.container_type}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No container statuses.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Cards for Buttons */}
      <div className="row mb-4">
        {/* Browse Ports Button */}
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title font-weight-bold text-primary">
                View details about available ports
              </h5>
              <p className="card-text text-muted mb-3">
                Explore different ports to get more information about their
                availability and facilities.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/user/browse-ports")}
              >
                Browse Ports
              </button>
            </div>
          </div>
        </div>

        {/* Book Port Button */}
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title font-weight-bold text-success">
                Click here to book a port
              </h5>
              <p className="card-text text-muted mb-3">
                Book your preferred port for upcoming shipments in a few simple
                steps.
              </p>
              <button
                className="btn btn-success"
                onClick={() => navigate("/user/book-port")}
              >
                Book a Port
              </button>
            </div>
          </div>
        </div>

        {/* Track Shipments Button */}
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title font-weight-bold text-info">
                Track the status and location of shipments
              </h5>
              <p className="card-text text-muted mb-3">
                Stay updated with the latest status and real-time location of
                your shipments.
              </p>
              <button
                className="btn btn-info"
                onClick={() => navigate("/user/track-shipments")}
              >
                Track Shipments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
