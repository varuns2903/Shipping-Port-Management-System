import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="d-flex flex-column bg-light p-3" style={{ height: '100vh', width: '250px' }}>
            <h3>Admin Panel</h3>
            <ul className="nav nav-pills flex-column mb-auto">
                <li>
                    <Link to="/admin/users" className="nav-link">
                        Manage Users
                    </Link>
                </li>
                <li>
                    <Link to="/admin/ports" className="nav-link">
                        Manage Ports
                    </Link>
                </li>
                <li>
                    <Link to="/admin/bookings" className="nav-link">
                        Manage Bookings
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
