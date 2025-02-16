import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, []);

  return (
    <>
      <div className="container d-flex justify-content-center">
        <div className="mt-5">
          <h1>404 NotFound</h1>
          <p>3 秒後跳轉至首頁...</p>
        </div>
      </div>
    </>
  );
}
