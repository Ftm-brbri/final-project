"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "@/src/shared/components/pagination";

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
  const [loading, setLoading] = useState(true);

  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [confirmedOrders, setConfirmedOrders] = useState<Order[]>([]);

  const [pendingPage, setPendingPage] = useState(1);
  const [confirmedPage, setConfirmedPage] = useState(1);

  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [confirmedTotalPages, setConfirmedTotalPages] = useState(1);

  const fetchOrders = async (status: "pending" | "confirmed", page: number) => {
    const token = localStorage.getItem("admin_token");

    const res = await axios.get(`${API_URL}/orders/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        limit: 6,
        status,
      },
    });

    const data =
      res.data?.data?.orders ||
      res.data?.data?.items ||
      res.data?.orders ||
      res.data?.data ||
      [];

    const totalPages = res.data?.data?.totalPages || 1;

    return {
      data: Array.isArray(data) ? data : [],
      totalPages,
    };
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);

        const [pending, confirmed] = await Promise.all([
          fetchOrders("pending", pendingPage),
          fetchOrders("confirmed", confirmedPage),
        ]);

        if (!mounted) return;

        setPendingOrders(pending.data);
        setConfirmedOrders(confirmed.data);

        setPendingTotalPages(pending.totalPages);
        setConfirmedTotalPages(confirmed.totalPages);
      } catch (error) {
        console.error("Orders fetch error:", error);

        setPendingOrders([]);
        setConfirmedOrders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [pendingPage, confirmedPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        در حال بارگذاری...
      </div>
    );
  }

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow transition">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-slate-500">{order._id}</p>

        <span
          className={`px-3 py-1 text-xs font-bold rounded-full ${
            order.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {order.status === "pending" ? "در انتظار" : "تأیید شده"}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        <p className="font-semibold text-slate-800">
          {order.shippingAddress?.name || "نامشخص"}
        </p>

        <p className="text-sm text-slate-500">
          {order.shippingAddress?.address || "-"}
        </p>

        <p className="text-sm font-bold text-slate-900">
          {order.totalPrice?.toLocaleString()} تومان
        </p>

        <p className="text-xs text-slate-400">
          {new Date(order.createdAt).toLocaleDateString("fa-IR")}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10" dir="rtl">
      <h1 className="text-2xl font-black text-slate-800">لیست سفارشات</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-yellow-600">
          🟡 سفارشات در انتظار
        </h2>

        {pendingOrders.length === 0 ? (
          <p className="text-sm text-slate-400">سفارشی در انتظار وجود ندارد</p>
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              {pendingOrders.map((order) => (
                <div key={order._id} className="border-l-4 border-yellow-400">
                  <OrderCard order={order} />
                </div>
              ))}
            </div>

            <Pagination
              currentPage={pendingPage}
              totalPages={pendingTotalPages}
              onPageChange={setPendingPage}
            />
          </>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-green-600">
          🟢 سفارشات تأیید شده
        </h2>

        {confirmedOrders.length === 0 ? (
          <p className="text-sm text-slate-400">سفارشی تأیید شده وجود ندارد</p>
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              {confirmedOrders.map((order) => (
                <div key={order._id} className="border-l-4 border-green-400">
                  <OrderCard order={order} />
                </div>
              ))}
            </div>

            <Pagination
              currentPage={confirmedPage}
              totalPages={confirmedTotalPages}
              onPageChange={setConfirmedPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
