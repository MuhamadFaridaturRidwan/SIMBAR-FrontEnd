// StokRendah.jsx
import React, { useState, useMemo } from "react";
import { AlertTriangle, PlusCircle } from "lucide-react";
import Sidebar from "./Sidebar";

// ----------------------------------------------------------------------
// MOCK DATA
// Sengaja dicampur: ada barang dengan stok aman (di atas 10 unit) dan ada
// yang stoknya rendah/kritis (1-10 unit), supaya proses filter di bawah
// benar-benar terlihat menyaring data, bukan menampilkan semuanya.
// Nama field dipertahankan mirip kolom tabel `barang` (id_barang,
// nama_barang, dst) agar mapping ke response API nanti mudah.
// ----------------------------------------------------------------------
const initialBarang = [
  { id_barang: 1, kode_barang: "BRG-0021", nama_barang: "Helm Safety SNI Kuning", stok_saat_ini: 45 },
  { id_barang: 2, kode_barang: "BRG-0231", nama_barang: "Toner Printer HP 12A", stok_saat_ini: 2 },
  { id_barang: 3, kode_barang: "BRG-0114", nama_barang: "Baterai AA Alkaline", stok_saat_ini: 5 },
  { id_barang: 4, kode_barang: "BRG-0099", nama_barang: "Lakban Bening 2 inch", stok_saat_ini: 3 },
  { id_barang: 5, kode_barang: "BRG-0145", nama_barang: "Spidol Whiteboard Hitam", stok_saat_ini: 60 },
  { id_barang: 6, kode_barang: "BRG-0177", nama_barang: "Sarung Tangan Safety Anti Panas", stok_saat_ini: 4 },
  { id_barang: 7, kode_barang: "BRG-0210", nama_barang: "Gunting Listrik Crimping", stok_saat_ini: 17 },
  { id_barang: 8, kode_barang: "BRG-0042", nama_barang: "Kabel Tie 20cm (pak)", stok_saat_ini: 1 },
  { id_barang: 9, kode_barang: "BRG-0034", nama_barang: "Kardus Box Double Wall 40x40", stok_saat_ini: 8 },
  { id_barang: 10, kode_barang: "BRG-0102", nama_barang: "Kertas A4 80gsm", stok_saat_ini: 0 },
];

export default function StokRendah() {
  const [barangList] = useState(initialBarang);

  // ----------------------------------------------------------------------
  // Filter otomatis, mengikuti query SQL asal:
  // WHERE stok_saat_ini <= 10 AND stok_saat_ini > 0 ORDER BY stok_saat_ini ASC
  // Catatan: barang yang stoknya benar-benar 0 (habis total) TIDAK dianggap
  // "stok rendah" di sini — itu kategori terpisah ("Stok Habis"), sama
  // seperti behavior PHP asal yang punya kondisi stok_saat_ini > 0.
  // ----------------------------------------------------------------------
  const barangStokRendah = useMemo(() => {
    return barangList
      .filter((item) => item.stok_saat_ini <= 10 && item.stok_saat_ini > 0)
      .sort((a, b) => a.stok_saat_ini - b.stok_saat_ini);
  }, [barangList]);

  // Placeholder aksi restock — tinggal diarahkan ke route/form
  // tambah-stok sungguhan (misal navigate(`/form-masuk?id=${id}`)) saat
  // react-router-dom sudah dipasang.
  function handleTambahStok(item) {
    console.log("Tambah stok untuk:", item);
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
                Menampilkan {barangStokRendah.length} produk dengan stok 10
                unit ke bawah
              </p>
            </div>
          </div>
          {/* Ganti href="#" dengan <Link to="/dashboard"> dari react-router-dom saat routing siap */}
          <a
            href="#"
            className="text-[#1d4ed8] text-sm font-semibold hover:underline flex-shrink-0"
          >
            ← Kembali ke Dashboard
          </a>
        </div>

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
              {barangStokRendah.length > 0 ? (
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
                        className="bg-green-100 hover:bg-green-200 text-green-700 font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 w-fit transition"
                      >
                        <PlusCircle size={14} /> Tambah Stok
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    Tidak ada produk dengan stok rendah saat ini.
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
