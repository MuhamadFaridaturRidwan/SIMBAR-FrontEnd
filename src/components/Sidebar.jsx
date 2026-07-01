// Sidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // 1. Tambah useNavigate
import { Home, Package, RefreshCw, BarChart3, LogOut } from "lucide-react"; // 2. Tambah ikon LogOut
import axios from "axios"; // 3. Tambah impor axios

// Daftar menu navigasi sesuai dengan path di App.jsx
const menuItems = [
  { label: "Dashboard", to: "/", icon: Home },
  { label: "Inventori Barang", to: "/daftar-barang", icon: Package },
  { label: "Transaksi", to: "/transaksi", icon: RefreshCw },
  { label: "Laporan", to: "/laporan", icon: BarChart3 },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate(); // 4. Inisialisasi hook navigate

  // 5. Fungsi LogOut terintegrasi API Back-End
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      // Tembak API logout BE (Sesuaikan port 8000 dengan port server temen lu)
      await axios.post("http://localhost:8000/api/v1/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Gagal koneksi ke server BE, tapi session lokal tetap dibersihkan:", error);
    } finally {
      // Apapun hasil dari BE (sukses/gagal/server mati), bersihkan token lokal & tendang ke login
      localStorage.removeItem("authToken");
      alert("Anda telah keluar dari sistem.");
      navigate("/login");
    }
  };

  return (
    <div className="w-[260px] bg-white p-6 flex flex-col h-full border-r border-gray-200 flex-shrink-0">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Sistem Inventori
        </h1>
        <p className="text-gray-500 text-[13px] mt-0.5">Gudang Logistik</p>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-1.5">
          {menuItems.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to;

            return (
              <li key={label}>
                <Link
                  to={to}
                  className={
                    isActive
                      ? "flex items-center gap-3 bg-[#f0f5ff] text-[#1d4ed8] p-3 rounded-lg font-semibold text-[15px] transition"
                      : "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px] transition"
                  }
                >
                  <Icon
                    className={`w-5 text-center ${
                      isActive ? "text-[#1d4ed8]" : "text-gray-400"
                    }`}
                    size={18}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 6. AREA BAWAH: Profil Admin & Tombol Keluar Sistem */}
      <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-4">
        {/* Info Profil */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm flex-shrink-0">
            A
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Admin User</p>
            <p className="text-gray-500 text-xs">Supervisor</p>
          </div>
        </div>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-semibold text-[14px] transition cursor-pointer"
        >
          <LogOut size={16} className="text-red-500" />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </div>
  );
}