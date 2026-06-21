laporan
<?php include 'koneksi.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan - Sistem Inventori</title>
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
                <li><a href="daftar-barang.php" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px]"><i class="w-5 text-center text-gray-400 fas fa-cube"></i> Inventori Barang</a></li>
                <li><a href="transaksi.php" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px]"><i class="w-5 text-center text-gray-400 fas fa-exchange-alt"></i> Transaksi</a></li>
                <li><a href="laporan.php" class="flex items-center gap-3 bg-[#f0f5ff] text-[#1d4ed8] p-3 rounded-lg font-semibold text-[15px]"><i class="w-5 text-center text-[#1d4ed8] fas fa-chart-bar"></i> Laporan</a></li>
            </ul>
        </nav>
        <div class="mt-auto pt-6 border-t border-gray-100 flex items-center gap-3">
            <div class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">A</div>
            <div><p class="font-bold text-gray-900 text-sm">Admin User</p><p class="text-gray-500 text-xs">Supervisor</p></div>
        </div>
    </div>

    <div class="flex-grow p-10 overflow-y-auto">
        <div class="flex justify-between items-start mb-8">
            <div><h1 class="text-3xl font-bold text-gray-900 tracking-tight">Laporan</h1><p class="text-gray-500 mt-1.5 text-[15px]">Laporan inventori dan analisis stok gudang</p></div>
            <div class="flex gap-3">
                <button onclick="window.print()" class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm shadow-sm transition"><i class="fas fa-print"></i> Print</button>
                <a href="unduh-laporan.php" target="_blank" class="bg-[#1d4ed8] hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm transition shadow-sm">
                    <i class="fas fa-file-download"></i> Download Laporan Lengkap
                </a>
            </div>
        </div>

        <?php
        $tab = $_GET['tab'] ?? 'inventori'; 
        $active_cls = "bg-[#1d4ed8] text-white shadow-sm";
        $inactive_cls = "bg-gray-100 text-gray-600 hover:bg-gray-200";
        ?>

        <div class="bg-white p-6 rounded-xl border border-gray-200 mb-6 shadow-sm">
            <label class="block text-[13px] font-semibold text-gray-700 mb-3">Pilih Jenis Laporan</label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="?tab=inventori" class="<?= ($tab == 'inventori') ? $active_cls : $inactive_cls ?> text-center py-3 rounded-lg font-semibold text-sm transition">Laporan Inventori</a>
                <a href="?tab=transaksi" class="<?= ($tab == 'transaksi') ? $active_cls : $inactive_cls ?> text-center py-3 rounded-lg font-semibold text-sm transition">Laporan Transaksi</a>
                <a href="?tab=stok" class="<?= ($tab == 'stok') ? $active_cls : $inactive_cls ?> text-center py-3 rounded-lg font-semibold text-sm transition">Stok Rendah</a>
            </div>
            
            <?php if($tab == 'transaksi'): ?>
            <form action="" method="GET" class="mt-6 border-t border-gray-100 pt-5">
                <input type="hidden" name="tab" value="transaksi">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label class="block text-[13px] font-semibold text-gray-700 mb-2">Dari Tanggal</label><input type="date" name="dari" value="<?= $_GET['dari'] ?? '' ?>" class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm" onchange="this.form.submit()"></div>
                    <div><label class="block text-[13px] font-semibold text-gray-700 mb-2">Sampai Tanggal</label><input type="date" name="sampai" value="<?= $_GET['sampai'] ?? '' ?>" class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm" onchange="this.form.submit()"></div>
                </div>
            </form>
            <?php endif; ?>
        </div>

        <?php if($tab == 'inventori'): ?>
            <?php $sum = mysqli_fetch_assoc(mysqli_query($koneksi, "SELECT COUNT(*) as prod, SUM(stok_saat_ini) as unit, SUM(stok_saat_ini * harga_satuan) as val, SUM(CASE WHEN stok_saat_ini <= stok_min THEN 1 ELSE 0 END) as res FROM barang")); ?>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><h3 class="text-gray-500 text-[13px] font-medium mb-2">Total Produk</h3><p class="text-4xl font-bold text-gray-900"><?= number_format($sum['prod'], 0, '', '.') ?></p></div>
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><h3 class="text-gray-500 text-[13px] font-medium mb-2">Total Unit</h3><p class="text-4xl font-bold text-[#1d4ed8]"><?= number_format($sum['unit'], 0, '', '.') ?></p></div>
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><h3 class="text-gray-500 text-[13px] font-medium mb-2">Total Nilai</h3><p class="text-3xl font-bold text-[#16a34a] mt-1">Rp <?= number_format($sum['val'], 0, '', '.') ?></p></div>
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><h3 class="text-gray-500 text-[13px] font-medium mb-2">Perlu Restock</h3><p class="text-4xl font-bold text-[#d97706]"><?= number_format($sum['res'], 0, '', '.') ?></p></div>
            </div>
            
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-10">
                <div class="p-6 border-b border-gray-100"><h2 class="text-xl font-bold text-gray-900">Detail Inventori</h2></div>
                <table class="w-full text-left border-collapse">
                    <thead class="bg-white border-b border-gray-200">
                        <tr><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">SKU</th><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Produk</th><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Jumlah</th><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Nilai</th></tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <?php
                        $q = mysqli_query($koneksi, "SELECT * FROM barang");
                        while($r = mysqli_fetch_assoc($q)) {
                        ?>
                        <tr class="hover:bg-gray-50"><td class="px-6 py-4 text-[13px] font-mono text-gray-600"><?= $r['kode_barang'] ?></td><td class="px-6 py-4 font-bold text-[13px]"><?= $r['nama_barang'] ?></td><td class="px-6 py-4 text-center text-[13px]"><?= $r['stok_saat_ini'] ?></td><td class="px-6 py-4 text-right text-[13px] font-bold">Rp <?= number_format($r['stok_saat_ini'] * $r['harga_satuan'], 0, '', '.') ?></td></tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>

        <?php elseif($tab == 'transaksi'): ?>
            <?php
            $w_m = "1=1"; $w_k = "1=1";
            if(!empty($_GET['dari']) && !empty($_GET['sampai'])) {
                $w_m .= " AND DATE(tanggal_masuk) BETWEEN '{$_GET['dari']}' AND '{$_GET['sampai']}'";
                $w_k .= " AND DATE(tanggal_keluar) BETWEEN '{$_GET['dari']}' AND '{$_GET['sampai']}'";
            }
            $st_m = mysqli_fetch_assoc(mysqli_query($koneksi, "SELECT COUNT(*) as jml, SUM(jumlah) as total FROM barang_masuk WHERE $w_m"));
            $st_k = mysqli_fetch_assoc(mysqli_query($koneksi, "SELECT COUNT(*) as jml, SUM(jumlah) as total FROM barang_keluar WHERE $w_k"));
            $selisih = ($st_m['total'] ?? 0) - ($st_k['total'] ?? 0);
            ?>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><h3 class="text-gray-500 text-[13px] font-medium mb-2">Total Transaksi</h3><p class="text-3xl font-bold text-gray-900"><?= ($st_m['jml'] + $st_k['jml']) ?></p></div>
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><h3 class="text-gray-500 text-[13px] font-medium mb-2">Barang Masuk</h3><p class="text-3xl font-bold text-[#16a34a]"><?= $st_m['total'] ?? 0 ?></p></div>
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><h3 class="text-gray-500 text-[13px] font-medium mb-2">Barang Keluar</h3><p class="text-3xl font-bold text-[#ea580c]"><?= $st_k['total'] ?? 0 ?></p></div>
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><h3 class="text-gray-500 text-[13px] font-medium mb-2">Selisih</h3><p class="text-3xl font-bold <?= $selisih > 0 ? 'text-[#16a34a]' : 'text-[#ea580c]' ?>"><?= $selisih > 0 ? '+'.$selisih : $selisih ?></p></div>
            </div>

        <?php elseif($tab == 'stok'): ?>
            <?php $res = mysqli_fetch_assoc(mysqli_query($koneksi, "SELECT COUNT(*) as jml, SUM(stok_min - stok_saat_ini) as kurang, SUM((stok_min - stok_saat_ini) * harga_satuan) as biaya FROM barang WHERE stok_saat_ini <= stok_min AND stok_saat_ini > 0")); ?>
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8 flex items-center gap-5">
                <i class="fas fa-exclamation-circle text-yellow-600 text-3xl"></i>
                <div><h3 class="font-bold text-yellow-800 text-lg">Peringatan Stok Rendah</h3><p class="text-yellow-700 text-sm mt-1">Ada <?= $res['jml'] ?> produk di bawah batas minimum.</p></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><h3 class="text-gray-500 text-[13px] font-medium mb-2">Produk Rendah</h3><p class="text-4xl font-bold text-gray-900"><?= $res['jml'] ?></p></div>
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><h3 class="text-gray-500 text-[13px] font-medium mb-2">Total Kekurangan</h3><p class="text-4xl font-bold text-[#ea580c]"><?= $res['kurang'] ?> unit</p></div>
                <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"><h3 class="text-gray-500 text-[13px] font-medium mb-2">Estimasi Biaya</h3><p class="text-3xl font-bold text-[#16a34a] mt-1">Rp <?= number_format($res['biaya'], 0, '', '.') ?></p></div>
            </div>
            
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div class="p-6 border-b border-gray-100"><h2 class="text-xl font-bold text-gray-900">Produk Perlu Restock</h2></div>
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Produk</th><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Kurang</th><th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Estimasi Biaya</th></tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <?php
                        $q = mysqli_query($koneksi, "SELECT * FROM barang WHERE stok_saat_ini <= stok_min AND stok_saat_ini > 0");
                        while($i = mysqli_fetch_assoc($q)) {
                            $krg = $i['stok_min'] - $i['stok_saat_ini'];
                        ?>
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-5"><p class="font-bold text-[14px]"><?= $i['nama_barang'] ?></p></td>
                            <td class="px-6 py-5 text-center font-bold text-orange-600"><?= $krg ?></td>
                            <td class="px-6 py-5 text-right font-bold">Rp <?= number_format($krg * $i['harga_satuan'], 0, '', '.') ?></td>
                        </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>