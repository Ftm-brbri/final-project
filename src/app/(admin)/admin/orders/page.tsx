"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://maktab-shop.runflare.run/api";

type Order = {
  _id: string;
  totalPrice: number;
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    city: string;
  };
  deliveryStatus: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("admin-token");

      const res = await axios.get(`${API_URL}/orders/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data?.data?.orders || res.data?.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      await getOrders();
    };

    fetchProducts();
  }, []);

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
              <th className="p-3">مبلغ کل</th>
              <th className="p-3">وضعیت ارسال</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className="border-b hover:bg-slate-50 transition"
              >
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3 font-mono text-xs">{order._id}</td>
                <td className="p-3 font-semibold text-slate-700">
                  {order.shippingAddress?.fullName || "نامشخص"}
                </td>
                <td className="p-3">
                  {order.totalPrice?.toLocaleString()} تومان
                </td>
                <td className="p-3">
                  {order.deliveryStatus === "pending"
                    ? "در انتظار"
                    : order.deliveryStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            سفارشی یافت نشد
          </div>
        )}
      </div>
    </div>
  );
}
