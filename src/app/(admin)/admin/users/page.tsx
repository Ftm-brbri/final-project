"use client";

import { useState } from "react";
import { Pencil, Trash2, X, Shield, User as UserIcon } from "lucide-react";
import Pagination from "@/src/shared/components/pagination";
import toast from "react-hot-toast";

//mock
type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "BANNED";
  createdAt: string;
};

const MOCK_USERS: User[] = [
  {
    _id: "1",
    firstName: "علی",
    lastName: "رضایی",
    email: "ali@example.com",
    phone: "09123456789",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "1402/10/12",
  },
  {
    _id: "2",
    firstName: "سارا",
    lastName: "احمدی",
    email: "sara@example.com",
    phone: "09351234567",
    role: "USER",
    status: "ACTIVE",
    createdAt: "1402/11/05",
  },
  {
    _id: "3",
    firstName: "محمد",
    lastName: "کریمی",
    email: "m.karimi@example.com",
    phone: "09197654321",
    role: "USER",
    status: "BANNED",
    createdAt: "1403/01/20",
  },
  {
    _id: "4",
    firstName: "زهرا",
    lastName: "موسوی",
    email: "zahra.m@example.com",
    phone: "09021112233",
    role: "USER",
    status: "ACTIVE",
    createdAt: "1403/02/15",
  },
];

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "USER",
    status: "ACTIVE",
  });

  // OPEN EDIT MODAL
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setShowEditModal(true);
  };

  // CLOSE MODAL
  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  // UPDATE USER (Mock)
  const updateUser = () => {
    if (!selectedUser) return;

    setUsers((prev) =>
      prev.map((u) =>
        u._id === selectedUser._id ? ({ ...u, ...editForm } as User) : u,
      ),
    );
    closeEditModal();
    toast.success("اطلاعات کاربر با موفقیت به‌روزرسانی شد");
  };

  // DELETE USER (Mock)
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const deleteUser = () => {
    if (!selectedUser) return;

    setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
    setShowDeleteModal(false);
    setSelectedUser(null);
    toast.success("کاربر با موفقیت حذف شد");

    if (paginatedUsers.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // PAGINATION
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6" dir="rtl">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800">لیست کاربران</h1>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4 font-semibold">ردیف</th>
              <th className="p-4 font-semibold">کاربر</th>
              <th className="p-4 font-semibold">اطلاعات تماس</th>
              <th className="p-4 font-semibold">نقش</th>
              <th className="p-4 font-semibold">وضعیت</th>
              <th className="p-4 font-semibold">تاریخ عضویت</th>
              <th className="p-4 font-semibold">عملیات</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map((u, index) => (
              <tr
                key={u._id}
                className="border-b transition-colors hover:bg-slate-50 text-center"
              >
                <td className="p-4 text-slate-500">{startIndex + index + 1}</td>

                <td className="p-4">
                  <div className="flex items-center justify-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${u.role === "ADMIN" ? "bg-orange-500" : "bg-slate-300"}`}
                    >
                      {u.role === "ADMIN" ? (
                        <Shield size={20} />
                      ) : (
                        <UserIcon size={20} />
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-700">
                        {u.firstName} {u.lastName}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <div className="text-right inline-block">
                    <p className="text-slate-600">{u.email}</p>
                    <p className="text-slate-500 text-xs mt-1" dir="ltr">
                      {u.phone}
                    </p>
                  </div>
                </td>

                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${
                      u.role === "ADMIN"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {u.role === "ADMIN" ? "مدیر" : "کاربر عادی"}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${
                      u.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status === "ACTIVE" ? "فعال" : "مسدود"}
                  </span>
                </td>

                <td className="p-4 text-slate-500">{u.createdAt}</td>

                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditModal(u)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                      title="ویرایش"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => openDeleteModal(u)}
                      className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                      title="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  هیچ کاربری یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            {/* HEADER */}
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-800">
                ویرایش اطلاعات کاربر
              </h2>
              <button
                onClick={closeEditModal}
                className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    نام
                  </label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, firstName: e.target.value })
                    }
                    className="w-full rounded-2xl border p-4 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    نام خانوادگی
                  </label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lastName: e.target.value })
                    }
                    className="w-full rounded-2xl border p-4 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full rounded-2xl border p-4 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    شماره تماس
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full rounded-2xl border p-4 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    نقش کاربر
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        role: e.target.value as "ADMIN" | "USER",
                      })
                    }
                    className="w-full rounded-2xl border p-4 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
                  >
                    <option value="USER">کاربر عادی</option>
                    <option value="ADMIN">مدیر (Admin)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    وضعیت حساب
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as "ACTIVE" | "BANNED",
                      })
                    }
                    className="w-full rounded-2xl border p-4 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
                  >
                    <option value="ACTIVE">فعال</option>
                    <option value="BANNED">مسدود (Banned)</option>
                  </select>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={closeEditModal}
                  className="flex-1 rounded-2xl border border-slate-200 py-4 font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  انصراف
                </button>
                <button
                  onClick={updateUser}
                  className="flex-1 rounded-2xl bg-linear-to-r from-orange-500 to-amber-400 py-4 font-bold text-white shadow-lg shadow-orange-500/30 transition hover:scale-[1.02]"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-black text-slate-800">حذف کاربر</h2>
            <p className="mt-4 text-slate-500">
              آیا از حذف این کاربر مطمئن هستید؟ این عملیات غیرقابل بازگشت است.
            </p>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 font-semibold text-slate-700">
              {selectedUser.firstName} {selectedUser.lastName} (
              {selectedUser.phone})
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 rounded-2xl border border-slate-200 py-3.5 font-bold text-slate-600 transition hover:bg-slate-50"
              >
                انصراف
              </button>

              <button
                onClick={deleteUser}
                className="flex-1 rounded-2xl bg-red-500 py-3.5 font-bold text-white shadow-lg shadow-red-500/30 transition hover:bg-red-600"
              >
                بله، حذف کن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
