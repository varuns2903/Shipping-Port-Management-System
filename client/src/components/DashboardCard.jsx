import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function DashboardCard({ title, value, path }) {
  const navigate = useNavigate();

  return (
    <div className="card m-2" style={{ width: "18rem" }}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="card-text mb-0">{value}</h5>
          <button
            className="btn btn-dark btn-sm ms-2"
            onClick={() => navigate(path)}
          >
            Details →
          </button>
        </div>
      </div>
    </div>
  );
}

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  path: PropTypes.string.isRequired,
};

export default DashboardCard;
