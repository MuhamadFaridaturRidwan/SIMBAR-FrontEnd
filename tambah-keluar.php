tambah-keluar
<?php 
include 'koneksi.php'; 

if(isset($_POST['submit'])) {
    $id_barang = $_POST['id_barang'];
    $tanggal_keluar = $_POST['tanggal_keluar'];
    $jumlah = $_POST['jumlah'];
    $referensi = $_POST['referensi'];
    $catatan = $_POST['catatan'];
    $oleh = $_POST['oleh'];

    // CEK STOK DULU! Jangan sampai minus.
    $cek_stok = mysqli_fetch_assoc(mysqli_query($koneksi, "SELECT stok_saat_ini, nama_barang FROM barang WHERE id_barang = '$id_barang'"));
    
    if($cek_stok['stok_saat_ini'] < $jumlah) {
        // Jika jumlah keluar > stok tersedia, batalkan!
        echo "<script>alert('GAGAL! Stok {$cek_stok['nama_barang']} tidak mencukupi. Sisa stok hanya: {$cek_stok['stok_saat_ini']}');</script>";
    } else {
        // Jika aman, lakukan pencatatan dan pengurangan stok
        $query_keluar = "INSERT INTO barang_keluar (id_barang, tanggal_keluar, jumlah, referensi, catatan, oleh) 
                        VALUES ('$id_barang', '$tanggal_keluar', '$jumlah', '$referensi', '$catatan', '$oleh')";
        $query_update = "UPDATE barang SET stok_saat_ini = stok_saat_ini - $jumlah WHERE id_barang = '$id_barang'";

        if(mysqli_query($koneksi, $query_keluar) && mysqli_query($koneksi, $query_update)) {
            echo "<script>alert('Transaksi Barang Keluar Berhasil dicatat!'); window.location.href='transaksi.php';</script>";
        } else {
            echo "<script>alert('Gagal mencatat transaksi!');</script>";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Barang Keluar - Sistem Inventori</title>
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
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Form Barang Keluar <span class="text-[#ea580c] text-xl ml-2"><i class="fas fa-arrow-down"></i></span></h1>
            <p class="text-gray-500 mt-1.5 text-[15px]">Catat pengeluaran/pengiriman stok dari gudang.</p>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm max-w-4xl">
            <div class="p-6 border-b border-gray-100 bg-[#fff7ed] rounded-t-xl"><h2 class="text-lg font-bold text-[#c2410c]">Detail Pengeluaran Barang</h2></div>
            <form action="" method="POST" class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="md:col-span-2">
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Pilih Produk <span class="text-red-500">*</span></label>
                        <select name="id_barang" required class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 cursor-pointer">
                            <option value="">-- Pilih Barang dari Gudang --</option>
                            <?php
                            // Hanya tampilkan barang yang stoknya lebih dari 0
                            $q_brg = mysqli_query($koneksi, "SELECT id_barang, kode_barang, nama_barang, stok_saat_ini FROM barang WHERE stok_saat_ini > 0 ORDER BY nama_barang ASC");
                            while($b = mysqli_fetch_assoc($q_brg)){
                                echo "<option value='{$b['id_barang']}'>{$b['kode_barang']} - {$b['nama_barang']} (Sisa Stok: {$b['stok_saat_ini']})</option>";
                            }
                            ?>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Tanggal & Waktu Keluar <span class="text-red-500">*</span></label>
                        <input type="datetime-local" name="tanggal_keluar" required value="<?= date('Y-m-d\TH:i') ?>" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-100">
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Jumlah Barang Keluar <span class="text-red-500">*</span></label>
                        <input type="number" name="jumlah" required min="1" placeholder="Masukkan jumlah unit..." class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-100">
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Referensi (No. Surat Jalan / Invoice)</label>
                        <input type="text" name="referensi" placeholder="Contoh: INV-2026-001" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-100">
                    </div>
                    <div>
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Petugas / Oleh</label>
                        <input type="text" name="oleh" value="Admin User" required class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-100">
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-[13px] font-semibold text-gray-700 mb-2">Tujuan / Catatan Keluar</label>
                        <textarea name="catatan" rows="3" placeholder="Dikirim ke cabang mana atau untuk proyek apa..." class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-100"></textarea>
                    </div>
                </div>
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <a href="transaksi.php" class="px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200">Batal</a>
                    <button type="submit" name="submit" class="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-[#ea580c] hover:bg-orange-700 shadow-sm flex items-center gap-2"><i class="fas fa-save"></i> Simpan Transaksi Keluar</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>