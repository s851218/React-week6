import { createHashRouter } from "react-router-dom";
import FrontLayoutNav from "../layouts/FrontLayoutNav";
import HomePage from "../pages/HomePage";
import ProductListPage from "../pages/ProductListPage";
import CartPage from "../pages/CartPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";

const routes = [
  {
    path: "/",
    element: <FrontLayoutNav />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductListPage />,
      },
      {
        path: `/products/:id`,
        element: <ProductDetailPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

const router = createHashRouter(routes);

export default router;
