"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Pagination from "@/src/shared/components/pagination";

const API_URL = "https://maktab-shop.runflare.run/api";

type OrderStatus = "pending" | "confirmed" | "cancelled";

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

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "در انتظار",
  confirmed: "تأیید شده",
  cancelled: "رد شده",
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const TABS: {
  id: OrderStatus;
  label: string;
  border: string;
  activeTab: string;
}[] = [
  {
    id: "pending",
    label: "در انتظار",
    border: "border-yellow-400",
    activeTab: "border-yellow-500 text-yellow-700",
  },
  {
    id: "confirmed",
    label: "تأیید شده",
    border: "border-green-400",
    activeTab: "border-green-500 text-green-700",
  },
  {
    id: "cancelled",
    label: "رد شده",
    border: "border-red-400",
    activeTab: "border-red-500 text-red-700",
  },
];

const EMPTY_MESSAGES: Record<OrderStatus, string> = {
  pending: "سفارشی در انتظار وجود ندارد",
  confirmed: "سفارشی تأیید شده وجود ندارد",
  cancelled: "سفارش رد شده‌ای وجود ندارد",
};

function OrderCard({
  order,
  updating,
  onStatusChange,
}: {
  order: Order;
  updating: boolean;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}) {
  const currentStatus = order.status as OrderStatus;
  const statusLabel = STATUS_LABELS[currentStatus] ?? order.status;

  const allActions = [
    {
      status: "pending" as const,
      label: "در انتظار",
      className: "border-yellow-300 text-yellow-700 hover:bg-yellow-50",
    },
    {
      status: "confirmed" as const,
      label: "تأیید",
      className: "border-green-300 text-green-700 hover:bg-green-50",
    },
    {
      status: "cancelled" as const,
      label: "رد",
      className: "border-red-300 text-red-700 hover:bg-red-50",
    },
  ];

  const actions = allActions.filter(
    (action) => action.status !== currentStatus,
  );

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-slate-500">{order._id}</p>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            STATUS_BADGE[currentStatus] ?? "bg-slate-100 text-slate-600"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        <p className="font-semibold text-slate-800">
          {order.shippingAddress?.name || "نامشخص"}
        </p>

        <p className="text-sm text-slate-500">
          {order.shippingAddress?.phone || "-"}
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

      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.status}
            type="button"
            disabled={updating}
            onClick={() => onStatusChange(order._id, action.status)}
            className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${action.className}`}
          >
            {updating ? "..." : action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [pages, setPages] = useState<Record<OrderStatus, number>>({
    pending: 1,
    confirmed: 1,
    cancelled: 1,
  });
  const [totalPages, setTotalPages] = useState(1);

  const currentPage = pages[activeTab];
  const activeTabConfig = TABS.find((tab) => tab.id === activeTab)!;

  const fetchOrders = async (status: OrderStatus, page: number) => {
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

    const total =
      res.data?.total ??
      res.data?.data?.total ??
      res.data?.data?.pagination?.total ??
      0;

    return {
      data: Array.isArray(data) ? data : [],
      totalPages: Math.ceil(total / 6) || 1,
    };
  };

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);

      const result = await fetchOrders(activeTab, currentPage);

      setOrders(result.data);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Orders fetch error:", error);
      setOrders([]);
      toast.error("خطا در دریافت سفارشات");
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    setTimeout(() => {
      loadOrders();
    }, 0);
  }, [loadOrders]);

  const handleTabChange = (tab: OrderStatus) => {
    setActiveTab(tab);
  };

  const handlePageChange = (page: number) => {
    setPages((prev) => ({ ...prev, [activeTab]: page }));
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const token = localStorage.getItem("admin_token");

    try {
      setUpdatingId(orderId);

      await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(`وضعیت سفارش به «${STATUS_LABELS[status]}» تغییر کرد`);

      if (status !== activeTab) {
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
      } else {
        await loadOrders();
      }
    } catch (error) {
      console.error("Order status update error:", error);
      toast.error("خطا در تغییر وضعیت سفارش");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-black text-slate-800">لیست سفارشات</h1>

      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
              activeTab === tab.id
                ? `bg-slate-50 ${tab.activeTab}`
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500">
          در حال بارگذاری...
        </div>
      ) : orders.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-400">
          {EMPTY_MESSAGES[activeTab]}
        </p>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`border-l-4 ${activeTabConfig.border}`}
              >
                <OrderCard
                  order={order}
                  updating={updatingId === order._id}
                  onStatusChange={updateOrderStatus}
                />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
