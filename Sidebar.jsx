// Sidebar.jsx
import React from "react";
import { Home, Box, ArrowLeftRight, BarChart3 } from "lucide-react";

// Daftar menu navigasi.
// "href" memakai "#" sementara — tinggal diganti memakai <Link to="..."> dari
// react-router-dom kalau routing sudah disiapkan. Properti "to" sudah
// disediakan agar transisinya tinggal tukar tag <a> jadi <Link>.
const menuItems = [
  { label: "Dashboard", to: "/dashboard", icon: Home, active: true },
  { label: "Inventori Barang", to: "/daftar-barang", icon: Box, active: false },
  { label: "Transaksi", to: "/transaksi", icon: ArrowLeftRight, active: false },
  { label: "Laporan", to: "/laporan", icon: BarChart3, active: false },
];

export default function Sidebar() {
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
          {menuItems.map(({ label, to, icon: Icon, active }) => (
            <li key={label}>
              {/* Ganti href="#" dengan <Link to={to}> dari react-router-dom saat routing siap */}
              <a
                href="#"
                className={
                  active
                    ? "flex items-center gap-3 bg-[#f0f5ff] text-[#1d4ed8] p-3 rounded-lg font-semibold text-[15px]"
                    : "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px] transition"
                }
              >
                <Icon
                  className={`w-5 text-center ${
                    active ? "text-[#1d4ed8]" : "text-gray-400"
                  }`}
                  size={18}
                />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100 flex items-center gap-3">
        <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
          A
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">Admin User</p>
          <p className="text-gray-500 text-xs">Supervisor</p>
        </div>
      </div>
    </div>
  );
}
