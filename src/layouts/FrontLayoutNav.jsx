import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../store/AuthProvider";
import Logout from "../components/Logout";

export default function FrontLayoutNav() {
  // 是否登入狀態
  const { isAuth } = useAuth();

  return (
    <>
      <nav
        className="navbar bg-dark border-bottom border-body"
        data-bs-theme="dark"
      >
        <div className="container">
          <div className="d-flex justify-content-between align-items-center w-100">
            <ul className="navbar-nav flex-row gap-5 fs-5">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  首頁
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">
                  產品列表
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/cart">
                  購物車
                </NavLink>
              </li>
            </ul>
            {isAuth ? (
              <Logout />
            ) : (
              <NavLink type="button" className="btn btn-light" to="/login">
                登入
              </NavLink>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
