// StokRendah.jsx
import React, { useState, useEffect, useMemo } from "react";
import { AlertTriangle, PlusCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // 1. Menggunakan konfigurasi API terpusat (Auto-token)
import Sidebar from "./Sidebar";

export default function StokRendah() {
  const navigate = useNavigate();
  
  // 2. STATE REAL DATABASE (Mulai dari array kosong)
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. RITUAL PENGAMBILAN DATA REAL-TIME DARI DB LARAVEL
  useEffect(() => {
    const fetchBarangSistem = async () => {
      try {
        setLoading(true);
        // Memanggil rute relatif /barang yang aman dengan token JWT otomatis
        const response = await api.get("/barang");
        setBarangList(response.data.data || response.data || []);
      } catch (error) {
        console.error("Gagal mengambil data dari database:", error);
        if (error.response?.status === 401) {
          alert("Sesi masuk habis, silakan login ulang!");
        } else {
          alert("Gagal memuat data peringatan stok dari server!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBarangSistem();
  }, []);

  // 4. FILTERING PINTAR CLIENT-SIDE (Memilah barang kritis dari DB)
  const barangStokRendah = useMemo(() => {
    return barangList
      .filter((item) => {
        const stok = parseInt(item.stok_saat_ini ?? 0);
        // Mempertahankan kondisi asal: Stok 1-10 unit masuk radar peringatan
        return stok <= 10 && stok > 0;
      })
      // Urutkan dari stok yang paling kritis / paling sedikit (ASC)
      .sort((a, b) => parseInt(a.stok_saat_ini ?? 0) - parseInt(b.stok_saat_ini ?? 0));
  }, [barangList]);

  // 5. AKSI RESTOCK - Otomatis mengarahkan ke form penerimaan dengan membawa data item
  function handleTambahStok(item) {
    navigate("/tambah-masuk", { state: { id_barang: item.id_barang } });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fc]">
      <Sidebar />

      <div className="flex-grow p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <AlertTriangle size={28} className="text-yellow-500 flex-shrink-0" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Peringatan Stok Rendah
              </h1>
              <p className="text-gray-500 mt-1 text-[15px]">
                {loading ? "Menghitung data..." : `Menampilkan ${barangStokRendah.length} produk dengan stok 10 unit ke bawah`}
              </p>
            </div>
          </div>
          
          {/* Menggunakan komponen Link bawaan react-router-dom agar navigasi instant tanpa reload */}
          <Link
            to="/"
            className="text-[#1d4ed8] text-sm font-semibold hover:underline flex-shrink-0"
          >
            &larr; Kembali ke Dashboard
          </Link>
        </div>

        {/* === Tabel Tampilan Monitoring Peringatan Stok === */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Kode SKU
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Nama Barang
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Stok Saat Ini
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500 font-semibold text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-gray-400" />
                      Memindai volume stok barang di database...
                    </div>
                  </td>
                </tr>
              ) : barangStokRendah.length > 0 ? (
                barangStokRendah.map((item) => (
                  <tr key={item.id_barang} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-mono text-[#1d4ed8]">
                      {item.kode_barang}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      {item.nama_barang}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-red-600">
                      {item.stok_saat_ini} Unit
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => handleTambahStok(item)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 w-fit transition cursor-pointer"
                      >
                        <PlusCircle size={14} /> Tambah Stok
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    Aman, tidak ada produk dengan kondisi stok rendah saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}