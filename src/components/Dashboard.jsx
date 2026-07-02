// Dashboard.jsx
import React, { useState, useEffect } from "react"; 
import api from "../api"; // Menggunakan konfigurasi API terpusat (Auto-token)
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

// Util format angka ribuan ala number_format
function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value || 0);
}

// Util format tanggal operasional gudang
function formatDate(dateString) {
  if (!dateString) return "-";
  const cleanDate = dateString.replace(" ", "T");
  const d = new Date(cleanDate);
  if (isNaN(d.getTime())) return dateString; 
  
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const tgl = String(d.getDate()).padStart(2, "0");
  const jam = String(d.getHours()).padStart(2, "0");
  const menit = String(d.getMinutes()).padStart(2, "0");
  return `${tgl} ${bulan[d.getMonth()]} ${d.getFullYear()}, ${jam}:${menit}`;
}

export default function Dashboard() {
  const [summary, setSummary] = useState({ 
    totalProduk: 0, 
    stokTersedia: 0, 
    stokRendah: 0, 
    stokHabis: 0 
  });
  const [kategoriStok, setKategoriStok] = useState([]);
  const [aktivitas, setAktivitas] = useState([]);
  const [stokRendahList, setStokRendahList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardCalculatedData = async () => {
      try {
        setLoading(true);
        
        // JURUS PENYELAMAT: Mengambil data dari 3 pintu utama Laravel yang sudah pasti aktif
        const [resBarang, resMasuk, resKeluar] = await Promise.all([
          api.get("/barang"),
          api.get("/barang-masuk"),
          api.get("/barang-keluar")
        ]);

        const barangList = resBarang.data.data || resBarang.data || [];
        const masukList = resMasuk.data.data || resMasuk.data || [];
        const keluarList = resKeluar.data.data || resKeluar.data || [];

        // 1. PROSES HITUNG SUMMARY KARTU ATAS
        let totalUnitStok = 0;
        let totalRendah = 0;
        let totalHabis = 0;
        const listRendahRaw = [];

        barangList.forEach((item) => {
          const stok = parseInt(item.stok_saat_ini ?? 0);
          totalUnitStok += stok;

          if (stok <= 0) {
            totalHabis++;
          } else if (stok <= 10) {
            totalRendah++;
            listRendahRaw.push(item);
          }
        });

        setSummary({
          totalProduk: barangList.length,
          stokTersedia: totalUnitStok,
          stokRendah: totalRendah,
          stokHabis: totalHabis,
        });

        // 2. PROSES HITUNG STATISTIK PER KATEGORI
        const kategoriMap = {};
        barangList.forEach((item) => {
          const kat = item.kategori || "Umum";
          const stok = parseInt(item.stok_saat_ini ?? 0);
          kategoriMap[kat] = (kategoriMap[kat] || 0) + stok;
        });

        const formattedKategori = Object.keys(kategoriMap).map((key) => ({
          kategori: key,
          total: kategoriMap[key]
        }));
        setKategoriStok(formattedKategori);

        // 3. AMBIL DATA PRODUK STOK RENDAH TERATAS (Maksimal 5 item)
        const sortedRendah = listRendahRaw
          .sort((a, b) => parseInt(a.stok_saat_ini ?? 0) - parseInt(b.stok_saat_ini ?? 0))
          .slice(0, 5);
        setStokRendahList(sortedRendah);

        // 4. GABUNGKAN DATA RIWAYAT AKTIVITAS TERAKHIR (Maksimal 5 item)
        const aktivitasMasuk = masukList.map((item) => ({
          id: `in-${item.id_barang_masuk || item.id}`,
          tipe_trx: "masuk",
          nama_barang: item.barang?.nama_barang || item.nama_barang || "Produk",
          tanggal: item.tanggal_masuk || item.created_at,
          jumlah: item.jumlah || item.qty || 0,
        }));

        const aktivitasKeluar = keluarList.map((item) => ({
          id: `out-${item.id_barang_keluar || item.id}`,
          tipe_trx: "keluar",
          nama_barang: item.barang?.nama_barang || item.nama_barang || "Produk",
          tanggal: item.tanggal_keluar || item.created_at,
          jumlah: item.jumlah || item.qty || 0,
        }));

        const gabunganAktivitas = [...aktivitasMasuk, ...aktivitasKeluar]
          .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
          .slice(0, 5);

        setAktivitas(gabunganAktivitas);

      } catch (error) {
        console.error("Gagal memuat kalkulasi data dashboard:", error);
        if (error.response?.status === 401) {
          alert("Sesi akses habis atau tidak valid, silakan login kembali.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardCalculatedData();
  }, []);

  return (
    <div className="bg-[#f8f9fc] flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-grow p-10 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1.5 text-[15px]">Ringkasan operasional inventori gudang hari ini.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-semibold text-sm tracking-wide flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin text-blue-500" />
            Sedang menghitung akumulasi volume database gudang...
          </div>
        ) : (
          <>
            {/* === KARTU SUMMARY === */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                <div className="bg-[#eff6ff] text-[#3b82f6] rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 text-[12px] font-bold tracking-widest uppercase">Total Produk</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{summary.totalProduk}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                <div className="bg-[#dcfce3] text-[#16a34a] rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 text-[12px] font-bold tracking-widest uppercase">Stok Tersedia</h3>
                  <p className="text-3xl font-bold text-[#16a34a] mt-1">{formatNumber(summary.stokTersedia)}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                <div className="bg-yellow-100 text-yellow-600 rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 text-[12px] font-bold tracking-widest uppercase">Stok Rendah</h3>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{summary.stokRendah}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                <div className="bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
                  <XCircle size={20} />
                </div>
                <div>
                  <h3 className="text-gray-500 text-[12px] font-bold tracking-widest uppercase">Stok Habis</h3>
                  <p className="text-3xl font-bold text-red-600 mt-1">{summary.stokHabis}</p>
                </div>
              </div>
            </div>

            {/* === VOLUME KATEGORI === */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-10 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Statistik Stok per Kategori</h2>
              <div className="space-y-6">
                {kategoriStok.length > 0 ? (
                  kategoriStok.map((rk, index) => {
                    const namaKategori = rk.kategori || "Umum";
                    const totalUnit = rk.total || 0;
                    const percent = Math.min((totalUnit / 500) * 100, 100); 
                    return (
                      <div key={index}>
                        <div className="flex justify-between text-sm font-semibold mb-2">
                          <span className="text-gray-700">{namaKategori}</span>
                          <span className="text-gray-900">{totalUnit} unit</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-[#3b82f6] h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">Belum ada rincian data kategori produk.</p>
                )}
              </div>
            </div>

            {/* === BOTTOM GRID === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">Aktivitas Terakhir</h2>
                  <Link to="/transaksi" className="text-[#1d4ed8] text-xs font-bold hover:underline">
                    Lihat Semua
                  </Link>
                </div>
                <div className="p-6 space-y-6">
                  {aktivitas.length > 0 ? (
                    aktivitas.map((ra, index) => {
                      const isIn = ra.tipe_trx === "masuk";
                      return (
                        <div key={ra.id || index} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`${
                              isIn ? "bg-[#dcfce3] text-[#166534]" : "bg-[#ffedd5] text-[#c2410c]"
                            } w-10 h-10 rounded-lg flex items-center justify-center`}>
                              {isIn ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{ra.nama_barang}</p>
                              <p className="text-[11px] text-gray-400">{formatDate(ra.tanggal)}</p>
                            </div>
                          </div>
                          <p className={`text-sm font-bold ${isIn ? "text-[#16a34a]" : "text-[#ea580c]"}`}>
                            {isIn ? "+" : "-"}
                            {ra.jumlah}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">Belum ada pergerakan barang masuk/keluar.</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">Ringkasan Stok Rendah</h2>
                  <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
                    Perlu Atensi
                  </span>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Produk</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Stok</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stokRendahList.length > 0 ? (
                      stokRendahList.map((rl, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-[12px] font-mono font-semibold text-gray-600">
                            {rl.kode_barang}
                          </td>
                          <td className="px-6 py-4 text-[12px] font-bold text-gray-900">
                            {rl.nama_barang}
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-red-600 text-[12px]">
                            {rl.stok_saat_ini}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                          Aman, seluruh stok barang di gudang melimpah.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}