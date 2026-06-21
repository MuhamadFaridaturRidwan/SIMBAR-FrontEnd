<?php include 'koneksi.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaksi - Sistem Inventori</title>
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
                <li><a href="transaksi.php" class="flex items-center gap-3 bg-[#f0f5ff] text-[#1d4ed8] p-3 rounded-lg font-semibold text-[15px]"><i class="w-5 text-center text-[#1d4ed8] fas fa-exchange-alt"></i> Transaksi</a></li>
                <li><a href="laporan.php" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px]"><i class="w-5 text-center text-gray-400 fas fa-chart-bar"></i> Laporan</a></li>
            </ul>
        </nav>
        <div class="mt-auto pt-6 border-t border-gray-100 flex items-center gap-3">
            <div class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">A</div>
            <div><p class="font-bold text-gray-900 text-sm">Admin User</p><p class="text-gray-500 text-xs">Supervisor</p></div>
        </div>
    </div>

    <div class="flex-grow p-10 overflow-y-auto">
        <div class="flex justify-between items-start mb-8">
            <div><h1 class="text-3xl font-bold text-gray-900 tracking-tight">Transaksi Barang</h1><p class="text-gray-500 mt-1.5 text-[15px]">Kelola barang masuk dan keluar gudang</p></div>
            <div class="flex gap-3">
                <a href="tambah-masuk.php" class="bg-[#16a34a] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm shadow-sm hover:bg-green-700 transition w-fit"><i class="fas fa-arrow-up"></i> Barang Masuk</a>
                <a href="tambah-keluar.php" class="bg-[#ea580c] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm shadow-sm hover:bg-orange-700 transition w-fit"><i class="fas fa-arrow-down"></i> Barang Keluar</a>
            </div>
        </div>

        <div class="bg-white p-6 rounded-t-xl border border-gray-200 border-b-0 shadow-sm">
            <form method="GET" action="">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                    <div class="col-span-6">
                        <label class="block text-[13px] font-semibold text-gray-700 mb-1.5">Cari Transaksi</label>
                        <div class="relative">
                            <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                            <input type="text" name="search" value="<?= $_GET['search'] ?? '' ?>" placeholder="Ketik produk atau referensi, lalu tekan Enter..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100">
                        </div>
                    </div>
                    <div class="col-span-3">
                        <label class="block text-[13px] font-semibold text-gray-700 mb-1.5">Tipe Transaksi</label>
                        <select name="tipe" onchange="this.form.submit()" class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none cursor-pointer">
                            <option value="">Semua Transaksi</option>
                            <option value="Barang Masuk" <?= (isset($_GET['tipe']) && $_GET['tipe'] == 'Barang Masuk') ? 'selected' : '' ?>>Barang Masuk</option>
                            <option value="Barang Keluar" <?= (isset($_GET['tipe']) && $_GET['tipe'] == 'Barang Keluar') ? 'selected' : '' ?>>Barang Keluar</option>
                        </select>
                    </div>
                    <div class="col-span-3">
                        <label class="block text-[13px] font-semibold text-gray-700 mb-1.5">Tanggal</label>
                        <input type="date" name="tanggal" onchange="this.form.submit()" value="<?= $_GET['tanggal'] ?? '' ?>" class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none cursor-pointer">
                    </div>
                </div>
            </form>
        </div>

        <div class="bg-white rounded-b-xl border border-gray-200 overflow-hidden shadow-sm">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 border-y border-gray-200">
                    <tr>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Tanggal</th>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Tipe</th>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Produk</th>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Jumlah</th>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Referensi</th>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Catatan</th>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase">Oleh</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <?php
                    $search = $_GET['search'] ?? ''; 
                    $tipe = $_GET['tipe'] ?? ''; 
                    $tanggal = $_GET['tanggal'] ?? '';

                    $sql_query = "SELECT * FROM (
                        SELECT 'Barang Masuk' as tipe_trx, m.tanggal_masuk as tanggal, b.nama_barang, b.kode_barang, m.jumlah, m.referensi, m.catatan, m.oleh 
                        FROM barang_masuk m JOIN barang b ON m.id_barang = b.id_barang 
                        UNION ALL 
                        SELECT 'Barang Keluar' as tipe_trx, k.tanggal_keluar as tanggal, b.nama_barang, b.kode_barang, k.jumlah, k.referensi, k.catatan, k.oleh 
                        FROM barang_keluar k JOIN barang b ON k.id_barang = b.id_barang
                    ) AS gabungan WHERE 1=1 ";

                    if ($search != '') $sql_query .= " AND (nama_barang LIKE '%$search%' OR referensi LIKE '%$search%' OR kode_barang LIKE '%$search%')";
                    if ($tipe != '') $sql_query .= " AND tipe_trx = '$tipe'";
                    if ($tanggal != '') $sql_query .= " AND DATE(tanggal) = '$tanggal'";
                    
                    $sql_query .= " ORDER BY tanggal DESC";
                    $q = mysqli_query($koneksi, $sql_query);
                    $total_data = mysqli_num_rows($q);

                    if($total_data > 0) {
                        while($row = mysqli_fetch_assoc($q)) {
                            $is_masuk = ($row['tipe_trx'] == 'Barang Masuk');
                    ?>
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4 text-[13px] text-gray-600 font-medium"><?= date('Y-m-d', strtotime($row['tanggal'])) ?></td>
                        <td class="px-6 py-4">
                            <span class="<?= $is_masuk ? 'bg-[#dcfce3] text-[#166534]' : 'bg-[#ffedd5] text-[#c2410c]' ?> px-2.5 py-1 rounded-full text-[11px] font-bold flex w-max items-center gap-1">
                                <i class="fas <?= $is_masuk ? 'fa-arrow-up' : 'fa-arrow-down' ?> text-[10px]"></i> <?= $is_masuk ? 'Masuk' : 'Keluar' ?>
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <p class="font-bold text-gray-900 text-[13px]"><?= $row['nama_barang'] ?></p>
                            <p class="text-[11px] text-gray-400 font-mono mt-0.5"><?= $row['kode_barang'] ?></p>
                        </td>
                        <td class="px-6 py-4">
                            <span class="font-bold text-[13px] <?= $is_masuk ? 'text-[#16a34a]' : 'text-[#ea580c]' ?>">
                                <?= $is_masuk ? '+' : '-' ?><?= $row['jumlah'] ?> unit
                            </span>
                        </td>
                        <td class="px-6 py-4 text-[13px] font-semibold text-gray-700"><?= $row['referensi'] ?></td>
                        <td class="px-6 py-4 text-[12px] text-gray-500 w-48"><?= $row['catatan'] ?></td>
                        <td class="px-6 py-4 text-[12px] text-gray-600"><?= $row['oleh'] ?></td>
                    </tr>
                    <?php 
                        } 
                    } else {
                        echo '<tr><td colspan="7" class="px-6 py-10 text-center text-gray-500">Tidak ada riwayat transaksi yang cocok dengan filter.</td></tr>';
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>