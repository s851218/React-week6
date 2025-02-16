import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthProvider";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage() {
  const { isAuth, setIsAuth } = useAuth();

  const [cart, setCart] = useState({}); // 購物車產品狀態(產品資訊)

  const [isScreenLoading, setIsScreenLoading] = useState(false);

  // 驗證登入
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.post(`${BASE_URL}/v2/api/user/check`);
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
        console.log("使用者未登入：", error);
      }
    };
    checkAuth();
  }, [setIsAuth]);

  // 取得購物車產品列表
  const getCart = async () => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
      alert("取得購物車產品失敗");
      console.log(`取得購物車產品失敗`, error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) {
      getCart();
    }
  }, [isAuth]);

  // 清空購物車所有產品 API
  const removeAllCart = async () => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      getCart();
    } catch (error) {
      alert("清空購物車產品失敗");
      console.log("清空購物車產品失敗", error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 刪除單一購物車產品 API
  const removeCartItem = async (cartItem_id) => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`);
      getCart();
    } catch (error) {
      alert("刪除購物車產品失敗");
      console.log("刪除購物車產品失敗", error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 調整購物車產品數量 API
  const updateCartItem = async (cartItem_id, product_id, qty) => {
    setIsScreenLoading(true);
    try {
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });
      getCart();
    } catch (error) {
      alert("調整購物車產品數量失敗");
      console.log("調整購物車產品數量失敗", error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 表單部分
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    const { message, ...user } = data;

    const userInfo = {
      data: {
        user,
        message,
      },
    };
    checkout(userInfo);
  };

  // 送出訂單(結帳 API)
  const checkout = async (data) => {
    setIsScreenLoading(true);
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data);
      alert("訂單送出成功！");
      reset(); // 送出訂單後清除表單欄位
      getCart();
    } catch (error) {
      alert("送出訂單失敗");
      console.log("送出訂單失敗", error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  return (
    <>
      {isAuth ? (
        <div className="container">
          <Link className="btn btn-primary mt-3" to="/products">
            回到產品列表
          </Link>
          <div className="mt-3">
            {cart.carts?.length > 0 && (
              <>
                <div className="text-end py-3">
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={removeAllCart}
                  >
                    清空購物車
                  </button>
                </div>
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th></th>
                      <th>品名</th>
                      <th style={{ width: "150px" }}>數量/單位</th>
                      <th className="text-end">單價</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.carts?.map((cartItem) => {
                      return (
                        <tr key={cartItem.id}>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                removeCartItem(cartItem.id);
                              }}
                            >
                              x
                            </button>
                          </td>
                          <td>{cartItem.product.title}</td>
                          <td style={{ width: "150px" }}>
                            <div className="d-flex align-items-center">
                              <div className="btn-group me-2" role="group">
                                <button
                                  type="button"
                                  className="btn btn-outline-dark btn-sm"
                                  onClick={() => {
                                    updateCartItem(
                                      cartItem.id,
                                      cartItem.product_id,
                                      cartItem.qty - 1
                                    );
                                  }}
                                  disabled={cartItem.qty === 1}
                                >
                                  -
                                </button>
                                <span
                                  className="btn border border-dark"
                                  style={{ width: "50px", cursor: "auto" }}
                                >
                                  {cartItem.qty}
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-outline-dark btn-sm"
                                  onClick={() => {
                                    updateCartItem(
                                      cartItem.id,
                                      cartItem.product_id,
                                      cartItem.qty + 1
                                    );
                                  }}
                                >
                                  +
                                </button>
                              </div>
                              <span className="input-group-text bg-transparent border-0">
                                {cartItem.product.unit}
                              </span>
                            </div>
                          </td>
                          <td className="text-end">{cartItem.total} 元</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end">
                        總計：{cart.total} 元
                      </td>
                      <td className="text-end" style={{ width: "130px" }}></td>
                    </tr>
                  </tfoot>
                </table>
              </>
            )}
          </div>

          <div className="my-5 row justify-content-center">
            <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`form-control ${
                    errors?.email?.message && "is-invalid"
                  }`}
                  placeholder="請輸入 Email"
                  {...register("email", {
                    required: "Email 為必填",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Email 格式不正確",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-danger my-2">{errors?.email?.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  收件人姓名
                </label>
                <input
                  id="name"
                  className={`form-control ${
                    errors?.name?.message && "is-invalid"
                  }`}
                  placeholder="請輸入姓名"
                  {...register("name", {
                    required: "姓名為必填",
                  })}
                />
                {errors.name && (
                  <p className="text-danger my-2">{errors?.name?.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                  收件人電話
                </label>
                <input
                  id="tel"
                  type="tel"
                  className={`form-control ${
                    errors?.tel?.message && "is-invalid"
                  }`}
                  placeholder="請輸入電話"
                  {...register("tel", {
                    required: "電話為必填",
                    pattern: {
                      value: /^(0[2-8]\d{7}|09\d{8})$/,
                      message: "電話格式不正確",
                    },
                  })}
                />

                {errors.tel && (
                  <p className="text-danger my-2">{errors?.tel?.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  收件人地址
                </label>
                <input
                  id="address"
                  type="text"
                  className={`form-control ${
                    errors?.address?.message && "is-invalid"
                  }`}
                  placeholder="請輸入地址"
                  {...register("address", {
                    required: "地址為必填",
                  })}
                />

                {errors.address && (
                  <p className="text-danger my-2">{errors?.address?.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  留言
                </label>
                <textarea
                  id="message"
                  className="form-control"
                  {...register("message")}
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={cart.carts?.length === 0}
                >
                  送出訂單
                </button>
              </div>
            </form>
          </div>

          {isScreenLoading && (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(255,255,255,0.3)",
                zIndex: 999,
              }}
            >
              <ReactLoading
                type="spin"
                color="black"
                width="4rem"
                height="4rem"
              />
            </div>
          )}
        </div>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
}
