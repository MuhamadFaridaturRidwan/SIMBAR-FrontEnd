// TambahBarang.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react"; // Tambah icon Loader2
import axios from "axios"; // 1. Import axios
import Sidebar from "./Sidebar";

function TambahBarang() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_barang: "",
    kode_barang: "",
    kategori: "",
    supplier: "",
    lokasi: "",
    harga_satuan: "",
    stok_awal: "0",
    stok_min: "5",
  });

  // 2. State untuk mencegah user klik tombol berkali-kali saat loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Ubah jadi Async/Await untuk nembak API Laravel
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Nyalakan efek loading
    
    try {
      /* * CATATAN: Pastikan nama field di sini sesuai dengan yang diminta 
       * oleh kodingan API Laravel temen lu. Jika Laravel meminta 'stok_saat_ini', 
       * lu bisa ubah format datanya di sini sebelum dikirim:
       */
      const payload = {
        nama_barang: formData.nama_barang,
        kode_barang: formData.kode_barang,
        kategori: formData.kategori,
        supplier: formData.supplier,
        lokasi: formData.lokasi,
        harga_satuan: formData.harga_satuan,
        stok_saat_ini: formData.stok_awal, // Mapping agar sesuai dengan DB
        stok_min: formData.stok_min,
      };

      // Tembak endpoint POST ke backend
      await axios.post("http://localhost:8000/api/v1/barang", payload);
      
      alert("Data barang berhasil ditambahkan ke database!");
      navigate("/daftar-barang");
      
    } catch (error) {
      console.error("Gagal menyimpan barang:", error);
      alert("Gagal menyimpan data barang. Silakan cek koneksi atau kodingan API!");
    } finally {
      setIsSubmitting(false); // Matikan efek loading
    }
  };

  return (
    <div className="bg-[#f8f9fc] flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-grow p-10 overflow-y-auto">
        <div className="mb-8">
          <Link
            to="/daftar-barang"
            className="text-[#1d4ed8] text-sm font-semibold hover:underline mb-2 inline-flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Kembali ke Inventori
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Tambah Barang Baru
          </h1>
          <p className="text-gray-500 mt-1.5 text-[15px]">
            Masukkan detail informasi produk ke dalam database gudang (Real-time DB).
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-4xl">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              Informasi Dasar Produk
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                  Nama Barang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama_barang"
                  required
                  value={formData.nama_barang}
                  onChange={handleChange}
                  placeholder="Contoh: Helm Proyek Safety"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                  Kode Barang (SKU) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="kode_barang"
                  required
                  value={formData.kode_barang}
                  onChange={handleChange}
                  placeholder="Contoh: HLM-001"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="kategori"
                  required
                  value={formData.kategori}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition cursor-pointer"
                >
                  <option value="">Pilih Kategori...</option>
                  <option value="Safety">Safety</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Equipment">Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                  Nama Supplier
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Contoh: PT Safety Makmur"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                  Lokasi Penyimpanan
                </label>
                <input
                  type="text"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  placeholder="Contoh: Gudang A - Rak 2"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                  Harga Satuan (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="harga_satuan"
                  required
                  min="0"
                  value={formData.harga_satuan}
                  onChange={handleChange}
                  placeholder="Contoh: 150000"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
              <h3 className="text-sm font-bold text-blue-800 mb-4">
                Pengaturan Stok
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                    Stok Awal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stok_awal"
                    required
                    min="0"
                    value={formData.stok_awal}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                    Batas Stok Minimum <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stok_min"
                    required
                    min="0"
                    value={formData.stok_min}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  />
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    Sistem akan memberi peringatan jika stok di bawah angka ini.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Link
                to="/daftar-barang"
                className="px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Batal
              </Link>
              
              {/* 4. Update Button dengan efek Loading */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition shadow-sm flex items-center gap-2 ${
                  isSubmitting 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-[#1d4ed8] hover:bg-blue-800 cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Simpan Barang
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

export default TambahBarang;