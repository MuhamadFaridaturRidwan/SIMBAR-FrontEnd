// DaftarBarang.jsx
import React, { useState, useMemo } from "react";
import { Package, Search, MapPin, Plus, Trash2, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

// ----------------------------------------------------------------------
// MOCK DATA
// Nama field dipertahankan mirip kolom tabel `barang` (id_barang,
// nama_barang, dst) supaya mapping ke response API nanti mudah — tinggal
// ganti sumber data dari array statis ini ke hasil fetch/axios.
// Variasi stok sengaja dibuat mencakup ketiga status: Tersedia, Rendah, Habis.
// ----------------------------------------------------------------------
const initialBarangData = [
  {
    id_barang: 1,
    nama_barang: "Helm Safety SNI Kuning",
    kode_barang: "BRG-0021",
    supplier: "PT Sumber Aman",
    kategori: "Safety",
    lokasi: "Rak A1-02",
    stok_saat_ini: 45,
    stok_min: 20,
  },
  {
    id_barang: 2,
    nama_barang: "Kardus Box Double Wall 40x40",
    kode_barang: "BRG-0034",
    supplier: "CV Karton Jaya",
    kategori: "Packaging",
    lokasi: "Rak B2-05",
    stok_saat_ini: 8,
    stok_min: 15,
  },
  {
    id_barang: 3,
    nama_barang: "Kertas A4 80gsm",
    kode_barang: "BRG-0102",
    supplier: "Toko ATK Sejahtera",
    kategori: "Office Supplies",
    lokasi: "Rak C1-01",
    stok_saat_ini: 0,
    stok_min: 10,
  },
  {
    id_barang: 4,
    nama_barang: "Sarung Tangan Safety Anti Panas",
    kode_barang: "BRG-0177",
    supplier: "PT Sumber Aman",
    kategori: "Safety",
    lokasi: "Rak A1-04",
    stok_saat_ini: 4,
    stok_min: 12,
  },
  {
    id_barang: 5,
    nama_barang: "Lakban Bening 2 inch",
    kode_barang: "BRG-0099",
    supplier: "CV Karton Jaya",
    kategori: "Packaging",
    lokasi: "Rak B2-01",
    stok_saat_ini: 3,
    stok_min: 8,
  },
  {
    id_barang: 6,
    nama_barang: "Gunting Listrik Crimping",
    kode_barang: "BRG-0210",
    supplier: "Toko Alat Teknik",
    kategori: "Equipment",
    lokasi: "Rak D3-02",
    stok_saat_ini: 17,
    stok_min: 5,
  },
  {
    id_barang: 7,
    nama_barang: "Spidol Whiteboard Hitam",
    kode_barang: "BRG-0145",
    supplier: "Toko ATK Sejahtera",
    kategori: "Office Supplies",
    lokasi: "Rak C1-03",
    stok_saat_ini: 60,
    stok_min: 20,
  },
  {
    id_barang: 8,
    nama_barang: "Obeng Set Multifungsi",
    kode_barang: "BRG-0256",
    supplier: "Toko Alat Teknik",
    kategori: "Equipment",
    lokasi: "Rak D3-05",
    stok_saat_ini: 0,
    stok_min: 6,
  },
];

// Helper status, mengikuti logika PHP asal:
// stok 0 -> Habis, stok <= stok_min -> Rendah, selain itu -> Tersedia
function getStatusInfo(item) {
  if (item.stok_saat_ini === 0) {
    return { label: "Habis", className: "bg-red-100 text-red-700" };
  }
  if (item.stok_saat_ini <= item.stok_min) {
    return { label: "Rendah", className: "bg-yellow-100 text-yellow-700" };
  }
  return { label: "Tersedia", className: "bg-[#dcfce3] text-[#166534]" };
}

export default function DaftarBarang() {
  // Data barang disimpan sebagai state supaya tombol Hapus bisa
  // benar-benar menghilangkan baris dari tampilan (hapus lokal dulu;
  // nanti diganti panggilan axios.delete(`/api/barang/${id}`) ke backend).
  const [barangList, setBarangList] = useState(initialBarangData);

  // State filter — menggantikan $_GET['search'], $_GET['kategori'], $_GET['status']
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [status, setStatus] = useState("");

  // ----------------------------------------------------------------------
  // TODO (integrasi API): kalau datanya besar, pindahkan filter ini ke
  // server — kirim search/kategori/status sebagai query param ke
  // axios.get("/api/barang", { params: { search, kategori, status } }).
  // Untuk sekarang masih disaring di client dari barangList.
  // ----------------------------------------------------------------------
  const filteredBarang = useMemo(() => {
    return barangList.filter((item) => {
      const keyword = search.trim().toLowerCase();
      const matchSearch =
        keyword === "" ||
        item.nama_barang.toLowerCase().includes(keyword) ||
        item.kode_barang.toLowerCase().includes(keyword);

      const matchKategori = kategori === "" || item.kategori === kategori;

      let matchStatus = true;
      if (status === "Stok Tersedia") {
        matchStatus = item.stok_saat_ini > item.stok_min;
      } else if (status === "Stok Rendah") {
        matchStatus = item.stok_saat_ini <= item.stok_min && item.stok_saat_ini > 0;
      } else if (status === "Stok Habis") {
        matchStatus = item.stok_saat_ini === 0;
      }

      return matchSearch && matchKategori && matchStatus;
    });
  }, [barangList, search, kategori, status]);

  // Hapus barang — sementara hanya hapus dari state lokal.
  // TODO (integrasi API): panggil axios.delete(`/api/barang/${id}`) lalu
  // baru update state setelah responsenya sukses.
  function handleHapus(item) {
    const konfirmasi = window.confirm(
      `Yakin ingin menghapus ${item.nama_barang}?`
    );
    if (konfirmasi) {
      setBarangList((prev) =>
        prev.filter((b) => b.id_barang !== item.id_barang)
      );
    }
  }

  // Placeholder untuk aksi Edit — tinggal diarahkan ke route edit
  // (misal navigate(`/daftar-barang/${item.id_barang}/edit`)) saat
  // react-router-dom sudah dipasang.
  function handleEdit(item) {
    console.log("Edit barang:", item);
  }

  return (
    <div className="bg-[#f8f9fc] flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-grow p-10 overflow-y-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Inventori Barang
            </h1>
            <p className="text-gray-500 mt-1.5 text-[15px]">
              Kelola semua barang di gudang
            </p>
          </div>
          {/* Ganti href="#" dengan <Link to="/tambah-barang"> dari react-router-dom saat routing siap */}
          <Link
            to="/tambah-barang"
            className="bg-[#1d4ed8] hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm transition shadow-sm w-fit"
          >
            <Plus size={16} /> Tambah Barang
          </Link>
        </div>

        {/* === Filter & Pencarian (real-time, tanpa reload) === */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            <div className="col-span-6">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Cari Produk
              </label>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ketik nama atau SKU..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
            </div>

            <div className="col-span-3">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Kategori
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none cursor-pointer"
              >
                <option value="">Semua Kategori</option>
                <option value="Safety">Safety</option>
                <option value="Packaging">Packaging</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Equipment">Equipment</option>
              </select>
            </div>

            <div className="col-span-3">
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none cursor-pointer"
              >
                <option value="">Semua Status</option>
                <option value="Stok Tersedia">Stok Tersedia</option>
                <option value="Stok Rendah">Stok Rendah</option>
                <option value="Stok Habis">Stok Habis</option>
              </select>
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          Menampilkan {filteredBarang.length} produk
        </p>

        {/* === Tabel Barang === */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Produk
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  SKU
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Kategori
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Lokasi
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Jumlah
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBarang.length > 0 ? (
                filteredBarang.map((item) => {
                  const { label, className } = getStatusInfo(item);
                  return (
                    <tr key={item.id_barang} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#eff6ff] text-[#3b82f6] rounded border border-[#bfdbfe] flex items-center justify-center flex-shrink-0">
                          <Package size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {item.nama_barang}
                          </p>
                          <p className="text-[13px] text-gray-500 mt-0.5">
                            {item.supplier}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-mono font-semibold text-gray-700">
                        {item.kode_barang}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-[12px] font-semibold border border-gray-200">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-gray-600 flex items-center">
                        <MapPin size={13} className="text-gray-400 mr-1.5" />
                        {item.lokasi}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 text-sm">
                          {item.stok_saat_ini} unit
                        </p>
                        <p className="text-[12px] text-gray-500 mt-0.5">
                          Min: {item.stok_min}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`${className} px-2.5 py-1 rounded-full text-[12px] font-semibold`}
                        >
                          {label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            title="Edit barang"
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-[#1d4ed8] hover:border-blue-200 transition"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHapus(item)}
                            title="Hapus barang"
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    Tidak ada produk yang cocok dengan filter.
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
