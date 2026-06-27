import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, ArrowUp } from "lucide-react";
import Sidebar from "./Sidebar";

function BarangMasuk() {
  const navigate = useNavigate();

  // Mock data produk
  const [mockBarang] = useState([
    { id_barang: "1", kode_barang: "SF-001", nama_barang: "Helm Safety Krisbow", stok_saat_ini: 25 },
    { id_barang: "2", kode_barang: "PK-002", nama_barang: "Kardus Packing A4", stok_saat_ini: 150 },
    { id_barang: "3", kode_barang: "OS-003", nama_barang: "Spidol Snowman Hitam", stok_saat_ini: 4 },
  ]);

  const [formData, setFormData] = useState({
    id_barang: "",
    tanggal_masuk: new Date().toISOString().slice(0, 16),
    jumlah: "",
    referensi: "",
    oleh: "Admin User",
    catatan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Transaksi Barang Masuk Berhasil dicatat!");
    navigate("/transaksi");
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
            Form Barang Masuk <span className="text-[#16a34a]"><ArrowUp size={28} /></span>
          </h1>
          <p className="text-gray-500 mt-1.5 text-[15px]">Catat penambahan stok ke dalam gudang.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-4xl">
          <div className="p-6 border-b border-gray-100 bg-[#f0fdf4] rounded-t-xl">
            <h2 class="text-lg font-bold text-[#166534]">Detail Penerimaan Barang</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Pilih Produk <span className="text-red-500">*</span></label>
                <select name="id_barang" required value={formData.id_barang} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 cursor-pointer">
                  <option value="">-- Pilih Barang dari Gudang --</option>
                  {mockBarang.map((b) => (
                    <option key={b.id_barang} value={b.id_barang}>
                      {b.kode_barang} - {b.nama_barang} (Stok saat ini: {b.stok_saat_ini})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Tanggal & Waktu Masuk <span class="text-red-500">*</span></label>
                <input type="datetime-local" name="tanggal_masuk" required value={formData.tanggal_masuk} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-100" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Jumlah Barang Masuk <span class="text-red-500">*</span></label>
                <input type="number" name="jumlah" required min="1" value={formData.jumlah} onChange={handleChange} placeholder="Masukkan jumlah unit..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-100" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Referensi (No. PO/DO)</label>
                <input type="text" name="referensi" value={formData.referensi} onChange={handleChange} placeholder="Contoh: PO-2026-099" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-100" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Petugas / Oleh</label>
                <input type="text" name="oleh" required value={formData.oleh} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-100" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Catatan Penerimaan</label>
                <textarea name="catatan" rows="3" value={formData.catatan} onChange={handleChange} placeholder="Tambahkan catatan jika ada (opsional)..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-100"></textarea>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Link to="/transaksi" className="px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200">Batal</Link>
              <button type="submit" className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-[#16a34a] hover:bg-green-700 shadow-sm flex items-center gap-2 cursor-pointer">
                <Save size={16} /> Simpan Transaksi Masuk
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BarangMasuk;