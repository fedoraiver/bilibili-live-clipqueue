import { Link } from "react-router-dom";
import "./components.css";

function NavBar() {
  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div>
          <ul className="nav nav-underline">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/queue" className="nav-link">
                Queue
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/history" className="nav-link" aria-disabled="true">
                History
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
