import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-dark text-light text-center">
      <h1 className="display-1 text-danger">404</h1>
      <p className="lead">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" className="btn btn-outline-primary mt-3">
        Return to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
