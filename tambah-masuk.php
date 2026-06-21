tambah-masuk
<?php 
include 'koneksi.php'; 

if(isset($_POST['submit'])) {
    $id_barang = $_POST['id_barang'];
    $tanggal_masuk = $_POST['tanggal_masuk'];
    $jumlah = $_POST['jumlah'];
    $referensi = $_POST['referensi'];
    $catatan = $_POST['catatan'];
    $oleh = $_POST['oleh'];

    // 1. Catat ke tabel riwayat barang_masuk
    $query_masuk = "INSERT INTO barang_masuk (id_barang, tanggal_masuk, jumlah, referensi, catatan, oleh) 
                    VALUES ('$id_barang', '$tanggal_masuk', '$jumlah', '$referensi', '$catatan', '$oleh')";
    
    // 2. Tambah stok di master barang
    $query_update = "UPDATE barang SET stok_saat_ini = stok_saat_ini + $jumlah WHERE id_barang = '$id_barang'";

    if(mysqli_query($koneksi, $query_masuk) && mysqli_query($koneksi, $query_update)) {
        echo "<script>alert('Transaksi Barang Masuk Berhasil dicatat!'); window.location.href='transaksi.php';</script>";
    } else {
        echo "<script>alert('Gagal mencatat transaksi!');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Barang Masuk - Sistem Inventori</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'); body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-[#f8f9fc] flex h-screen overflow-hidden">
    <div class="w-[260px] bg-white p-6 flex flex-col h-full border-r border-gray-200 flex-shrink-0">
        <div class="mb-10"><h1 class="text-xl font-bold text-gray-900 tracking-tight">Sistem Inventori</h1><p class="text-gray-500 text-[13px] mt-0.5">Gudang Logistik</p></div>
        <nav class="flex-grow">
            <ul class="space-y-1.5">
                <li><a href="dashboard.php" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px]"><i class="w-5 text-center text-gray-400 fas fa-home"></i> Dashboard</a></li>
                <li><a href="daftar-barang.php" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px]"><i class="w-5 text-center text-gray-400 fas fa-cube"></i> Inventori Barang</a></li>
                <li><a href="transaksi.php" class="flex items-center gap-3 bg-[#f0f5ff] text-[#1d4ed8] p-3 rounded-lg font-semibold text-[15px]"><i class="w-5 text-center text-[#1d4ed8] fas fa-exchange-alt"></i> Transaksi</a></li>
            </ul>
        </nav>
    </div>

    <div class="flex-grow p-10 overflow-y-auto">
        <div class="mb-8">
            <a href="transaksi.php" class="text-[#1d4ed8] text-sm font-semibold hover:underline mb-2 inline-block"><i class="fas fa-arrow-left mr-1"></i> Kembali ke Transaksi</a>
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Form Barang Masuk <span class="text-[#16a34a] text-xl ml-2"><i class="fas fa-arrow-up"></i></span></h1>
            <p class="text-gray-500 mt-1.5 text-[15px]">Catat penambahan stok ke dalam gudang.</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm max-w-4xl">
            <div class="p-6 border-b border-gray-100 bg-[#f0fdf4] rounded-t-xl"><h2 class="text-lg font-bold text-[#166534]">Detail Penerimaan Barang</h2></div>
            <form action="" method="POST" class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="md:col-span-2">
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Pilih Produk <span class="text-red-500">*</span></label>
                        <select name="id_barang" required class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 cursor-pointer">
                            <option value="">-- Pilih Barang dari Gudang --</option>
                            <?php
                            $q_brg = mysqli_query($koneksi, "SELECT id_barang, kode_barang, nama_barang, stok_saat_ini FROM barang ORDER BY nama_barang ASC");
                            while($b = mysqli_fetch_assoc($q_brg)){
                                echo "<option value='{$b['id_barang']}'>{$b['kode_barang']} - {$b['nama_barang']} (Stok saat ini: {$b['stok_saat_ini']})</option>";
                            }
                            ?>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Tanggal & Waktu Masuk <span class="text-red-500">*</span></label>
                        <input type="datetime-local" name="tanggal_masuk" required value="<?= date('Y-m-d\TH:i') ?>" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-100">
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Jumlah Barang Masuk <span class="text-red-500">*</span></label>
                        <input type="number" name="jumlah" required min="1" placeholder="Masukkan jumlah unit..." class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-100">
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Referensi (No. PO/DO)</label>
                        <input type="text" name="referensi" placeholder="Contoh: PO-2026-099" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-100">
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Petugas / Oleh</label>
                        <input type="text" name="oleh" value="Admin User" required class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-100">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Catatan Penerimaan</label>
                        <textarea name="catatan" rows="3" placeholder="Tambahkan catatan jika ada (opsional)..." class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-100"></textarea>
                    </div>
                </div>
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <a href="transaksi.php" class="px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200">Batal</a>
                    <button type="submit" name="submit" class="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-[#16a34a] hover:bg-green-700 shadow-sm flex items-center gap-2"><i class="fas fa-save"></i> Simpan Transaksi Masuk</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>