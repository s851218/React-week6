import axios from "axios";
import { useAuth } from "../store/AuthProvider";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Logout() {
  const { setIsAuth } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();

    const logout = async () => {
      try {
        await axios.post(`${BASE_URL}/v2/logout`);
        alert("登出成功！");
        setIsAuth(false);
      } catch (error) {
        alert("登出失敗！");
        console.log("登出失敗：", error);
      }
    };
    logout();
  };

  return (
    <>
      <button type="button" className="btn btn-light" onClick={handleLogout}>
        登出
      </button>
    </>
  );
}
