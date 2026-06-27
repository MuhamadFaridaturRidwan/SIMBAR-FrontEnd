import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./components/Dashboard";
import DaftarBarang from "./components/DaftarBarang";
import Transaksi from "./components/Transaksi";
import Laporan from "./components/Laporan";
import StokRendah from "./components/StokRendah";
import TambahBarang from "./components/TambahBarang";
import BarangMasuk from "./components/BarangMasuk";   // <-- Import baru
import BarangKeluar from "./components/BarangKeluar"; // <-- Import baru

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/daftar-barang" element={<DaftarBarang />} />
        <Route path="/tambah-barang" element={<TambahBarang />} />
        <Route path="/transaksi" element={<Transaksi />} />
        <Route path="/tambah-masuk" element={<BarangMasuk />} />   {/* <-- Jalur Form Masuk */}
        <Route path="/tambah-keluar" element={<BarangKeluar />} /> {/* <-- Jalur Form Keluar */}
        <Route path="/laporan" element={<Laporan />} />
        <Route path="/stok-rendah" element={<StokRendah />} />
      </Routes>
    </Router>
  );
}

export default App;