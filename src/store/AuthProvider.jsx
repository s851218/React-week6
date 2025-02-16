import { useContext, useState } from "react";
import AuthContext from "./auth-context";

// AuthProvider 元件
export default function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定義 hook
export function useAuth() {
  return useContext(AuthContext);
}
