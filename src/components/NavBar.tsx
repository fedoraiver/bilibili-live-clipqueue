import { Link } from "react-router-dom";
import "./components.css";

interface NavBarProps {
  isConnected: boolean;
}

function NavBar({ isConnected }: NavBarProps) {
  return (
    <nav className="navbar bg-body-tertiary">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <ul
          className="nav nav-underline"
          style={{ display: "flex", gap: "16px", alignItems: "center" }}
        >
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
            <Link to="/history" className="nav-link">
              History
            </Link>
          </li>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: isConnected ? "limegreen" : "red",
              marginLeft: "12px",
            }}
            title={isConnected ? "连接正常" : "未连接"}
          ></div>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
