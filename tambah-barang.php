<?php 
include 'koneksi.php'; 

// Logika PHP untuk menyimpan data ke database saat tombol submit ditekan
if(isset($_POST['submit'])) {
    $nama_barang = $_POST['nama_barang'];
    $kode_barang = $_POST['kode_barang'];
    $kategori = $_POST['kategori'];
    $supplier = $_POST['supplier'];
    $lokasi = $_POST['lokasi'];
    $harga_satuan = $_POST['harga_satuan'];
    $stok_awal = $_POST['stok_awal'];
    $stok_min = $_POST['stok_min'];

    $query = "INSERT INTO barang (kode_barang, nama_barang, supplier, kategori, lokasi, stok_saat_ini, stok_min, harga_satuan) 
              VALUES ('$kode_barang', '$nama_barang', '$supplier', '$kategori', '$lokasi', '$stok_awal', '$stok_min', '$harga_satuan')";

    if(mysqli_query($koneksi, $query)) {
        echo "<script>alert('Data barang berhasil ditambahkan!'); window.location.href='daftar-barang.php';</script>";
    } else {
        echo "<script>alert('Gagal menambahkan data!');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tambah Barang - Sistem Inventori</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-[#f8f9fc] flex h-screen overflow-hidden">

    <div class="w-[260px] bg-white p-6 flex flex-col h-full border-r border-gray-200 flex-shrink-0">
        <div class="mb-10"><h1 class="text-xl font-bold text-gray-900 tracking-tight">Sistem Inventori</h1><p class="text-gray-500 text-[13px] mt-0.5">Gudang Logistik</p></div>
        <nav class="flex-grow">
            <ul class="space-y-1.5">
                <li><a href="dashboard.php" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px]"><i class="w-5 text-center text-gray-400 fas fa-home"></i> Dashboard</a></li>
                <li><a href="daftar-barang.php" class="flex items-center gap-3 bg-[#f0f5ff] text-[#1d4ed8] p-3 rounded-lg font-semibold text-[15px]"><i class="w-5 text-center text-[#1d4ed8] fas fa-cube"></i> Inventori Barang</a></li>
                <li><a href="transaksi.php" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px]"><i class="w-5 text-center text-gray-400 fas fa-exchange-alt"></i> Transaksi</a></li>
                <li><a href="laporan.php" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px]"><i class="w-5 text-center text-gray-400 fas fa-chart-bar"></i> Laporan</a></li>
            </ul>
        </nav>
        <div class="mt-auto pt-6 border-t border-gray-100 flex items-center gap-3">
            <div class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">A</div>
            <div><p class="font-bold text-gray-900 text-sm">Admin User</p><p class="text-gray-500 text-xs">Supervisor</p></div>
        </div>
    </div>

    <div class="flex-grow p-10 overflow-y-auto">
        <div class="mb-8">
            <a href="daftar-barang.php" class="text-[#1d4ed8] text-sm font-semibold hover:underline mb-2 inline-block"><i class="fas fa-arrow-left mr-1"></i> Kembali ke Inventori</a>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Tambah Barang Baru</h1>
            <p class="text-gray-500 mt-1.5 text-[15px]">Masukkan detail informasi produk ke dalam database gudang.</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm max-w-4xl">
            <div class="p-6 border-b border-gray-100">
                <h2 class="text-lg font-bold text-gray-900">Informasi Dasar Produk</h2>
            </div>
            
            <form action="" method="POST" class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Nama Barang <span class="text-red-500">*</span></label>
                        <input type="text" name="nama_barang" required placeholder="Contoh: Helm Proyek Safety" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition">
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Kode Barang (SKU) <span class="text-red-500">*</span></label>
                        <input type="text" name="kode_barang" required placeholder="Contoh: HLM-001" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition">
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Kategori <span class="text-red-500">*</span></label>
                        <select name="kategori" required class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition cursor-pointer">
                            <option value="">Pilih Kategori...</option>
                            <option value="Safety">Safety</option>
                            <option value="Packaging">Packaging</option>
                            <option value="Office Supplies">Office Supplies</option>
                            <option value="Equipment">Equipment</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Nama Supplier</label>
                        <input type="text" name="supplier" placeholder="Contoh: PT Safety Makmur" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition">
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Lokasi Penyimpanan</label>
                        <input type="text" name="lokasi" placeholder="Contoh: Gudang A - Rak 2" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition">
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Harga Satuan (Rp) <span class="text-red-500">*</span></label>
                        <input type="number" name="harga_satuan" required min="0" placeholder="Contoh: 150000" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition">
                    </div>
                </div>

                <div class="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
                    <h3 class="text-sm font-bold text-blue-800 mb-4">Pengaturan Stok</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-[13px] font-semibold text-gray-700 mb-2">Stok Awal <span class="text-red-500">*</span></label>
                            <input type="number" name="stok_awal" required min="0" value="0" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition">
                        </div>
                        <div>
                            <label class="block text-[13px] font-semibold text-gray-700 mb-2">Batas Stok Minimum <span class="text-red-500">*</span></label>
                            <input type="number" name="stok_min" required min="0" value="5" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition">
                            <p class="text-[11px] text-gray-500 mt-1.5">Sistem akan memberi peringatan jika stok di bawah angka ini.</p>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <a href="daftar-barang.php" class="px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Batal</a>
                    <button type="submit" name="submit" class="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-[#1d4ed8] hover:bg-blue-800 transition shadow-sm flex items-center gap-2">
                        <i class="fas fa-save"></i> Simpan Barang
                    </button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>