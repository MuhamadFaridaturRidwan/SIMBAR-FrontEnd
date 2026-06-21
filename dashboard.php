<?php include 'koneksi.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Sistem Inventori</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-[#f8f9fc] flex h-screen overflow-hidden">

    <div class="w-[260px] bg-white p-6 flex flex-col h-full border-r border-gray-200 flex-shrink-0">
        <div class="mb-10">
            <h1 class="text-xl font-bold text-gray-900 tracking-tight">Sistem Inventori</h1>
            <p class="text-gray-500 text-[13px] mt-0.5">Gudang Logistik</p>
        </div>
        <nav class="flex-grow">
            <ul class="space-y-1.5">
                <li><a href="dashboard.php" class="flex items-center gap-3 bg-[#f0f5ff] text-[#1d4ed8] p-3 rounded-lg font-semibold text-[15px]"><i class="w-5 text-center text-[#1d4ed8] fas fa-home"></i> Dashboard</a></li>
                <li><a href="daftar-barang.php" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px] transition"><i class="w-5 text-center text-gray-400 fas fa-cube"></i> Inventori Barang</a></li>
                <li><a href="transaksi.php" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px] transition"><i class="w-5 text-center text-gray-400 fas fa-exchange-alt"></i> Transaksi</a></li>
                <li><a href="laporan.php" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px] transition"><i class="w-5 text-center text-gray-400 fas fa-chart-bar"></i> Laporan</a></li>
            </ul>
        </nav>
        <div class="mt-auto pt-6 border-t border-gray-100 flex items-center gap-3">
            <div class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">A</div>
            <div><p class="font-bold text-gray-900 text-sm">Admin User</p><p class="text-gray-500 text-xs">Supervisor</p></div>
        </div>
    </div>

    <div class="flex-grow p-10 overflow-y-auto">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p class="text-gray-500 mt-1.5 text-[15px]">Ringkasan operasional inventori gudang hari ini.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <?php 
            $tot_prod = mysqli_fetch_assoc(mysqli_query($koneksi, "SELECT COUNT(*) as t FROM barang"))['t'];
            $tot_stok = mysqli_fetch_assoc(mysqli_query($koneksi, "SELECT SUM(stok_saat_ini) as t FROM barang"))['t'];
            $tot_low = mysqli_fetch_assoc(mysqli_query($koneksi, "SELECT COUNT(*) as t FROM barang WHERE stok_saat_ini <= stok_min AND stok_saat_ini > 0"))['t'];
            $tot_out = mysqli_fetch_assoc(mysqli_query($koneksi, "SELECT COUNT(*) as t FROM barang WHERE stok_saat_ini = 0"))['t'];
            ?>
            <div class="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                <div class="bg-[#eff6ff] text-[#3b82f6] rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0"><i class="fas fa-box"></i></div>
                <div><h3 class="text-gray-500 text-[12px] font-bold tracking-widest uppercase">Total Produk</h3><p class="text-3xl font-bold text-gray-900 mt-1"><?= $tot_prod ?></p></div>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                <div class="bg-[#dcfce3] text-[#16a34a] rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0"><i class="fas fa-check-circle"></i></div>
                <div><h3 class="text-gray-500 text-[12px] font-bold tracking-widest uppercase">Stok Tersedia</h3><p class="text-3xl font-bold text-[#16a34a] mt-1"><?= number_format($tot_stok, 0, '', '.') ?></p></div>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                <div class="bg-yellow-100 text-yellow-600 rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0"><i class="fas fa-exclamation-triangle"></i></div>
                <div><h3 class="text-gray-500 text-[12px] font-bold tracking-widest uppercase">Stok Rendah</h3><p class="text-3xl font-bold text-yellow-600 mt-1"><?= $tot_low ?></p></div>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
                <div class="bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0"><i class="fas fa-times-circle"></i></div>
                <div><h3 class="text-gray-500 text-[12px] font-bold tracking-widest uppercase">Stok Habis</h3><p class="text-3xl font-bold text-red-600 mt-1"><?= $tot_out ?></p></div>
            </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 p-8 mb-10 shadow-sm">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Statistik Stok per Kategori</h2>
            <div class="space-y-6">
                <?php
                $q_kat = mysqli_query($koneksi, "SELECT kategori, SUM(stok_saat_ini) as total FROM barang GROUP BY kategori ORDER BY total DESC");
                while($rk = mysqli_fetch_assoc($q_kat)) {
                    $percent = min(($rk['total'] / 500) * 100, 100);
                ?>
                <div>
                    <div class="flex justify-between text-sm font-semibold mb-2">
                        <span class="text-gray-700"><?= $rk['kategori'] ?></span>
                        <span class="text-gray-900"><?= $rk['total'] ?> unit</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2.5">
                        <div class="bg-[#3b82f6] h-2.5 rounded-full transition-all duration-500" style="width: <?= $percent ?>%"></div>
                    </div>
                </div>
                <?php } ?>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 class="text-lg font-bold text-gray-900">Aktivitas Terakhir</h2>
                    <a href="transaksi.php" class="text-[#1d4ed8] text-xs font-bold hover:underline">Lihat Semua</a>
                </div>
                <div class="p-6 space-y-6">
                    <?php
                    $q_act = mysqli_query($koneksi, "
                        (SELECT 'masuk' as tipe, m.tanggal_masuk as tgl, b.nama_barang, m.jumlah FROM barang_masuk m JOIN barang b ON m.id_barang = b.id_barang)
                        UNION ALL
                        (SELECT 'keluar' as tipe, k.tanggal_keluar as tgl, b.nama_barang, k.jumlah FROM barang_keluar k JOIN barang b ON k.id_barang = b.id_barang)
                        ORDER BY tgl DESC LIMIT 5
                    ");
                    while($ra = mysqli_fetch_assoc($q_act)) {
                        $is_in = ($ra['tipe'] == 'masuk');
                    ?>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="<?= $is_in ? 'bg-[#dcfce3] text-[#166534]' : 'bg-[#ffedd5] text-[#c2410c]' ?> w-10 h-10 rounded-lg flex items-center justify-center">
                                <i class="fas <?= $is_in ? 'fa-arrow-up' : 'fa-arrow-down' ?>"></i>
                            </div>
                            <div>
                                <p class="text-sm font-bold text-gray-900"><?= $ra['nama_barang'] ?></p>
                                <p class="text-[11px] text-gray-400"><?= date('d M Y, H:i', strtotime($ra['tgl'])) ?></p>
                            </div>
                        </div>
                        <p class="text-sm font-bold <?= $is_in ? 'text-[#16a34a]' : 'text-[#ea580c]' ?>">
                            <?= $is_in ? '+' : '-' ?><?= $ra['jumlah'] ?>
                        </p>
                    </div>
                    <?php } ?>
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
                <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 class="text-lg font-bold text-gray-900">Ringkasan Stok Rendah</h2>
                    <span class="bg-red-100 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-bold">Perlu Atensi</span>
                </div>
                <table class="w-full text-left">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU</th>
                            <th class="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Produk</th>
                            <th class="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Stok</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <?php
                        $q_low_list = mysqli_query($koneksi, "SELECT kode_barang, nama_barang, stok_saat_ini FROM barang WHERE stok_saat_ini <= stok_min AND stok_saat_ini > 0 LIMIT 5");
                        while($rl = mysqli_fetch_assoc($q_low_list)) {
                        ?>
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-6 py-4 text-[12px] font-mono font-semibold text-gray-600"><?= $rl['kode_barang'] ?></td>
                            <td class="px-6 py-4 text-[12px] font-bold text-gray-900"><?= $rl['nama_barang'] ?></td>
                            <td class="px-6 py-4 text-center font-bold text-red-600 text-[12px]"><?= $rl['stok_saat_ini'] ?></td>
                        </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>