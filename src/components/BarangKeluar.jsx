// BarangKeluar.jsx
import { useState, useEffect } from "react"; // 1. Tambah useEffect
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, ArrowDown, Loader2 } from "lucide-react"; // Tambah Loader2
import axios from "axios"; // 2. Import axios
import Sidebar from "./Sidebar";

function BarangKeluar() {
  const navigate = useNavigate();

  // 3. STATE BARU (Penampung opsi produk dari database)
  const [barangOptions, setBarangOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id_barang: "",
    tanggal_keluar: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
    jumlah: "",
    referensi: "",
    oleh: "Admin User",
    catatan: "",
  });

  // 4. RITUAL FETCH DATA BARANG (Untuk Dropdown & Validasi Stok)
  useEffect(() => {
    const fetchBarangOptions = async () => {
      try {
        setLoadingOptions(true);
        const response = await axios.get("http://localhost:8000/api/v1/barang");
        setBarangOptions(response.data.data || response.data);
      } catch (error) {
        console.error("Gagal memuat opsi produk:", error);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchBarangOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 5. EKSEKUSI API & VALIDASI STOK
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cari produk yang dipilih dari array state yang ditarik dari DB
    const produkTerpilih = barangOptions.find(
      (b) => String(b.id_barang) === String(formData.id_barang)
    );

    if (produkTerpilih) {
      const jumlahKeluar = parseInt(formData.jumlah);
      
      // Validasi Pintar: Jangan sampai pengeluaran melebihi stok di DB
      if (produkTerpilih.stok_saat_ini < jumlahKeluar) {
        alert(`GAGAL! Stok ${produkTerpilih.nama_barang} tidak mencukupi.\nSisa stok di gudang hanya: ${produkTerpilih.stok_saat_ini} unit.`);
        return; // Hentikan proses, jangan tembak ke API
      }
    }

    setIsSubmitting(true);

    try {
      // Sesuaikan rute endpoint ini dengan milik temen lu (misal: /api/v1/barang-keluar)
      await axios.post("http://localhost:8000/api/v1/barang-keluar", formData);

      alert("Transaksi Barang Keluar Berhasil dicatat ke database!");
      navigate("/transaksi");
    } catch (error) {
      console.error("Gagal mencatat barang keluar:", error);
      alert("Gagal menyimpan transaksi keluar. Cek kembali isian atau koneksi API Anda!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f9fc] flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-grow p-10 overflow-y-auto">
        <div className="mb-8">
          <Link to="/transaksi" className="text-[#1d4ed8] text-sm font-semibold hover:underline mb-2 inline-flex items-center gap-1">
            <ArrowLeft size={16} /> Kembali ke Transaksi
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Form Barang Keluar <span className="text-[#ea580c]"><ArrowDown size={28} /></span>
          </h1>
          <p className="text-gray-500 mt-1.5 text-[15px]">Catat pengeluaran/pengiriman stok dari gudang (Real-time DB).</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-4xl">
          <div className="p-6 border-b border-gray-100 bg-[#fff7ed] rounded-t-xl">
            <h2 className="text-lg font-bold text-[#c2410c]">Detail Pengeluaran Barang</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Pilih Produk <span className="text-red-500">*</span></label>
                <select 
                  name="id_barang" 
                  required 
                  disabled={loadingOptions}
                  value={formData.id_barang} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 cursor-pointer"
                >
                  <option value="">
                    {loadingOptions ? "-- Sedang memuat produk dari database... --" : "-- Pilih Barang dari Gudang --"}
                  </option>
                  {barangOptions.map((b) => (
                    <option key={b.id_barang} value={b.id_barang}>
                      {b.kode_barang} - {b.nama_barang} (Sisa Stok: {b.stok_saat_ini ?? 0})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Tanggal & Waktu Keluar <span className="text-red-500">*</span></label>
                <input type="datetime-local" name="tanggal_keluar" required value={formData.tanggal_keluar} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-100" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Jumlah Barang Keluar <span className="text-red-500">*</span></label>
                <input type="number" name="jumlah" required min="1" value={formData.jumlah} onChange={handleChange} placeholder="Masukkan jumlah unit..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-100" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Referensi (No. Surat Jalan / Invoice)</label>
                <input type="text" name="referensi" value={formData.referensi} onChange={handleChange} placeholder="Contoh: INV-2026-001" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-100" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Petugas / Oleh</label>
                <input type="text" name="oleh" required value={formData.oleh} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-100" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Tujuan / Catatan Keluar</label>
                <textarea name="catatan" rows="3" value={formData.catatan} onChange={handleChange} placeholder="Dikirim ke cabang mana atau untuk proyek apa..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-100"></textarea>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Link to="/transaksi" className="px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200">Batal</Link>
              
              <button 
                type="submit" 
                disabled={isSubmitting || loadingOptions}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition shadow-sm flex items-center gap-2 ${
                  isSubmitting || loadingOptions
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-[#ea580c] hover:bg-orange-700 cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Simpan Transaksi Keluar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BarangKeluar;