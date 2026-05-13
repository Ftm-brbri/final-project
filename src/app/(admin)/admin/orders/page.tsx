"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://maktab-shop.runflare.run/api";

type Order = {
  _id: string;
  totalPrice: number;

  shippingAddress?: {
    name?: string;
    phone?: string;
    address?: string;
  };
  status: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  
  // GET ORDERS
  
  const getOrders = async () => {
    try {
      setLoading(true);

      // FIXED TOKEN NAME
      const token = localStorage.getItem("admin_token");

      const res = await axios.get(`${API_URL}/orders/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        params: {
          page: 1,
          limit: 50,
        },
      });

      console.log("ORDERS RESPONSE:", res.data);

      // safer response parsing
      const ordersData =
        res.data?.data?.orders ||
        res.data?.data?.items ||
        res.data?.orders ||
        res.data?.data ||
        [];

      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error("Error fetching orders:", error);

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  
  // FETCH ON LOAD
  
  useEffect(() => {
    const fetchOrders = async () => {
      await getOrders();
    };

    fetchOrders();
  }, []);

  
  // LOADING
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800">لیست سفارشات</h1>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-3">ردیف</th>
              <th className="p-3">شماره سفارش</th>
              <th className="p-3">نام مشتری</th>
              <th className="p-3">شهر</th>
              <th className="p-3">مبلغ کل</th>
              <th className="p-3">وضعیت ارسال</th>
              <th className="p-3">تاریخ</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className="border-b transition hover:bg-slate-50"
              >
                {/* INDEX */}
                <td className="p-3 text-center">{index + 1}</td>

                {/* ORDER ID */}
                <td className="p-3 font-mono text-xs">{order._id}</td>

                {/* CUSTOMER */}
                <td className="p-3 font-semibold text-slate-700">
                  {order.shippingAddress?.name || "نامشخص"}
                </td>

                <td className="p-3">{order.shippingAddress?.address || "-"}</td>

                {/* PRICE */}
                <td className="p-3">
                  {order.totalPrice?.toLocaleString()} تومان
                </td>

                {/* STATUS */}
                <td className="p-3">
                  {order.status === "pending"
                    ? "در انتظار"
                    : order.status === "shipped"
                      ? "ارسال شده"
                      : order.status === "delivered"
                        ? "تحویل شده"
                        : order.status}
                </td>

                {/* DATE */}
                <td className="p-3 text-xs text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY */}
        {orders.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            سفارشی یافت نشد
          </div>
        )}
      </div>
    </div>
  );
}
