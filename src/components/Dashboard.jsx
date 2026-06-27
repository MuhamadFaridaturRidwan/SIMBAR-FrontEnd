// Dashboard.jsx
import React, { useState } from "react";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Sidebar from "./Sidebar";
import {
  mockSummary,
  mockKategoriStok,
  mockAktivitas,
  mockStokRendah,
} from "./mockData";

// Util format angka ribuan ala number_format($x, 0, '', '.')
function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}

// Util format tanggal ala date('d M Y, H:i', strtotime(...))
function formatDate(dateString) {
  const d = new Date(dateString.replace(" ", "T"));
  const bulan = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  const tgl = String(d.getDate()).padStart(2, "0");
  const jam = String(d.getHours()).padStart(2, "0");
  const menit = String(d.getMinutes()).padStart(2, "0");
  return `${tgl} ${bulan[d.getMonth()]} ${d.getFullYear()}, ${jam}:${menit}`;
}

export default function Dashboard() {
  // ----------------------------------------------------------------------
  // STATE
  // Karena ini murni front-end (belum ada API), state langsung diisi dari
  // mockData.js memakai initializer function pada useState. Kalau nanti
  // sudah terhubung ke backend, tinggal mulai dari array/objek kosong lalu
  // isi via useEffect + axios/fetch (lihat komentar TODO di bawah).
  // ----------------------------------------------------------------------
  const [summary] = useState(mockSummary);
  const [kategoriStok] = useState(mockKategoriStok);
  const [aktivitas] = useState(mockAktivitas);
  const [stokRendahList] = useState(mockStokRendah);

  // --------------------------------------------------------------------
  // TODO (integrasi API): saat backend sudah siap, ganti pola di atas
  // menjadi seperti ini:
  //
  //   const [summary, setSummary] = useState(null);
  //   useEffect(() => {
  //     axios.get("/api/dashboard/summary").then((res) => setSummary(res.data));
  //   }, []);
  //
  // Lakukan hal yang sama untuk kategoriStok, aktivitas, dan stokRendahList,
  // masing-masing dari endpoint-nya sendiri.
  // --------------------------------------------------------------------

  return (
    <div className="bg-[#f8f9fc] flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-grow p-10 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1.5 text-[15px]">
            Ringkasan operasional inventori gudang hari ini.
          </p>
        </div>

        {/* === Kartu Ringkasan === */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
            <div className="bg-[#eff6ff] text-[#3b82f6] rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
              <Package size={20} />
            </div>
            <div>
              <h3 className="text-gray-500 text-[12px] font-bold tracking-widest uppercase">
                Total Produk
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {summary.totalProduk}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
            <div className="bg-[#dcfce3] text-[#16a34a] rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="text-gray-500 text-[12px] font-bold tracking-widest uppercase">
                Stok Tersedia
              </h3>
              <p className="text-3xl font-bold text-[#16a34a] mt-1">
                {formatNumber(summary.stokTersedia)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
            <div className="bg-yellow-100 text-yellow-600 rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-gray-500 text-[12px] font-bold tracking-widest uppercase">
                Stok Rendah
              </h3>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {summary.stokRendah}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
            <div className="bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
              <XCircle size={20} />
            </div>
            <div>
              <h3 className="text-gray-500 text-[12px] font-bold tracking-widest uppercase">
                Stok Habis
              </h3>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {summary.stokHabis}
              </p>
            </div>
          </div>
        </div>

        {/* === Statistik Stok per Kategori === */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-10 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Statistik Stok per Kategori
          </h2>
          <div className="space-y-6">
            {kategoriStok.map((rk) => {
              const percent = Math.min((rk.total / 500) * 100, 100);
              return (
                <div key={rk.kategori}>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-700">{rk.kategori}</span>
                    <span className="text-gray-900">{rk.total} unit</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-[#3b82f6] h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* === Aktivitas Terakhir === */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                Aktivitas Terakhir
              </h2>
              {/* Ganti href="#" dengan <Link to="/transaksi"> saat routing siap */}
              <a
                href="/transaksi"
                className="text-[#1d4ed8] text-xs font-bold hover:underline"
              >
                Lihat Semua
              </a>
            </div>
            <div className="p-6 space-y-6">
              {aktivitas.map((ra) => {
                const isIn = ra.tipe === "masuk";
                return (
                  <div key={ra.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`${
                          isIn
                            ? "bg-[#dcfce3] text-[#166534]"
                            : "bg-[#ffedd5] text-[#c2410c]"
                        } w-10 h-10 rounded-lg flex items-center justify-center`}
                      >
                        {isIn ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {ra.namaBarang}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {formatDate(ra.tanggal)}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`text-sm font-bold ${
                        isIn ? "text-[#16a34a]" : "text-[#ea580c]"
                      }`}
                    >
                      {isIn ? "+" : "-"}
                      {ra.jumlah}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* === Ringkasan Stok Rendah === */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                Ringkasan Stok Rendah
              </h2>
              <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
                Perlu Atensi
              </span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Produk
                  </th>
                  <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                    Stok
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stokRendahList.map((rl) => (
                  <tr key={rl.kodeBarang} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-[12px] font-mono font-semibold text-gray-600">
                      {rl.kodeBarang}
                    </td>
                    <td className="px-6 py-4 text-[12px] font-bold text-gray-900">
                      {rl.namaBarang}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-red-600 text-[12px]">
                      {rl.stokSaatIni}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
