import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthProvider";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function LoginPage() {
  const [account, setAccount] = useState({
    "username": "",
    "password": "",
  });

  const { setIsAuth } = useAuth();

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { value, name } = e.target;

    setAccount({
      ...account,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const login = async () => {
      try {
        const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);

        const { token, expired } = res.data;

        document.cookie = `hexToken=${token}; hexExpired=${new Date(expired)}`;

        axios.defaults.headers.common["Authorization"] = token;

        setIsAuth(true);
        navigate("/");
        alert("登入成功！");
      } catch (error) {
        alert("登入失敗！");
        console.log("登入失敗：", error);
      }
    };
    login();
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <div className="form-floating mb-3">
            <input
              name="username"
              value={account.username}
              onChange={handleInputChange}
              type="email"
              className="form-control"
              id="username"
              placeholder="name@example.com"
              required
            />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input
              name="password"
              value={account.password}
              onChange={handleInputChange}
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn btn-dark">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    </>
  );
}
