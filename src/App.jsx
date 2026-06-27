import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./components/Dashboard";
import DaftarBarang from "./components/DaftarBarang";
import Transaksi from "./components/Transaksi";
import Laporan from "./components/Laporan";

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman utama/default langsung nampilin Dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Jalur navigasi untuk halaman lainnya */}
        <Route path="/daftar-barang" element={<DaftarBarang />} />
        <Route path="/transaksi" element={<Transaksi />} />
        <Route path="/laporan" element={<Laporan />} />
      </Routes>
    </Router>
  );
}

export default App;