<?php include 'koneksi.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventori Barang - Sistem Inventori</title>
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
                <li><a href="dashboard.php" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium text-[15px] transition"><i class="w-5 text-center text-gray-400 fas fa-home"></i> Dashboard</a></li>
                <li><a href="daftar-barang.php" class="flex items-center gap-3 bg-[#f0f5ff] text-[#1d4ed8] p-3 rounded-lg font-semibold text-[15px]"><i class="w-5 text-center text-[#1d4ed8] fas fa-cube"></i> Inventori Barang</a></li>
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
        <div class="flex justify-between items-start mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Inventori Barang</h1>
                <p class="text-gray-500 mt-1.5 text-[15px]">Kelola semua barang di gudang</p>
            </div>
            <a href="tambah-barang.php" class="bg-[#1d4ed8] hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 text-sm transition shadow-sm w-fit"><i class="fas fa-plus"></i> Tambah Barang</a>
        </div>

        <div class="bg-white p-6 rounded-xl border border-gray-200 mb-6 shadow-sm">
            <form method="GET" action="">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                    <div class="col-span-6">
                        <label class="block text-[13px] font-semibold text-gray-700 mb-1.5">Cari Produk</label>
                        <div class="relative">
                            <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                            <input type="text" name="search" value="<?= $_GET['search'] ?? '' ?>" placeholder="Ketik nama atau SKU, lalu tekan Enter..." class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none">
                        </div>
                    </div>
                    <div class="col-span-3">
                        <label class="block text-[13px] font-semibold text-gray-700 mb-1.5">Kategori</label>
                        <select name="kategori" onchange="this.form.submit()" class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none cursor-pointer">
                            <option value="">Semua Kategori</option>
                            <option value="Safety" <?= (isset($_GET['kategori']) && $_GET['kategori'] == 'Safety') ? 'selected' : '' ?>>Safety</option>
                            <option value="Packaging" <?= (isset($_GET['kategori']) && $_GET['kategori'] == 'Packaging') ? 'selected' : '' ?>>Packaging</option>
                            <option value="Office Supplies" <?= (isset($_GET['kategori']) && $_GET['kategori'] == 'Office Supplies') ? 'selected' : '' ?>>Office Supplies</option>
                            <option value="Equipment" <?= (isset($_GET['kategori']) && $_GET['kategori'] == 'Equipment') ? 'selected' : '' ?>>Equipment</option>
                        </select>
                    </div>
                    <div class="col-span-3">
                        <label class="block text-[13px] font-semibold text-gray-700 mb-1.5">Status</label>
                        <select name="status" onchange="this.form.submit()" class="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 outline-none cursor-pointer">
                            <option value="">Semua Status</option>
                            <option value="Stok Tersedia" <?= (isset($_GET['status']) && $_GET['status'] == 'Stok Tersedia') ? 'selected' : '' ?>>Stok Tersedia</option>
                            <option value="Stok Rendah" <?= (isset($_GET['status']) && $_GET['status'] == 'Stok Rendah') ? 'selected' : '' ?>>Stok Rendah</option>
                            <option value="Stok Habis" <?= (isset($_GET['status']) && $_GET['status'] == 'Stok Habis') ? 'selected' : '' ?>>Stok Habis</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>

        <?php
        $search = $_GET['search'] ?? '';
        $kategori = $_GET['kategori'] ?? '';
        $status = $_GET['status'] ?? '';
        
        $sql_query = "SELECT * FROM barang WHERE (nama_barang LIKE '%$search%' OR kode_barang LIKE '%$search%')";
        if ($kategori != '') $sql_query .= " AND kategori = '$kategori'";
        
        if ($status == 'Stok Tersedia') $sql_query .= " AND stok_saat_ini > stok_min";
        elseif ($status == 'Stok Rendah') $sql_query .= " AND stok_saat_ini <= stok_min AND stok_saat_ini > 0";
        elseif ($status == 'Stok Habis') $sql_query .= " AND stok_saat_ini = 0";
        
        $sql_query .= " ORDER BY id_barang DESC";
        $query = mysqli_query($koneksi, $sql_query);
        $total_filter = mysqli_num_rows($query);
        ?>

        <p class="text-gray-500 text-sm mb-4">Menampilkan <?= $total_filter ?> produk</p>

        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Produk</th>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">SKU</th>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Kategori</th>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Lokasi</th>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Jumlah</th>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                        <th class="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <?php
                    if($total_filter > 0) {
                        while($row = mysqli_fetch_assoc($query)) {
                            $s_lbl = "Tersedia"; $s_cls = "bg-[#dcfce3] text-[#166534]"; 
                            if($row['stok_saat_ini'] == 0) { $s_lbl = "Habis"; $s_cls = "bg-red-100 text-red-700"; } 
                            elseif($row['stok_saat_ini'] <= $row['stok_min']) { $s_lbl = "Rendah"; $s_cls = "bg-yellow-100 text-yellow-700"; }
                    ?>
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4 flex items-center gap-4">
                            <div class="w-10 h-10 bg-[#eff6ff] text-[#3b82f6] rounded border border-[#bfdbfe] flex items-center justify-center flex-shrink-0"><i class="fas fa-cube"></i></div>
                            <div><p class="font-bold text-gray-900 text-sm"><?= $row['nama_barang'] ?></p><p class="text-[13px] text-gray-500 mt-0.5"><?= $row['supplier'] ?></p></div>
                        </td>
                        <td class="px-6 py-4 text-[13px] font-mono font-semibold text-gray-700"><?= $row['kode_barang'] ?></td>
                        <td class="px-6 py-4"><span class="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-[12px] font-semibold border border-gray-200"><?= $row['kategori'] ?></span></td>
                        <td class="px-6 py-4 text-[13px] text-gray-600"><i class="fas fa-map-marker-alt text-gray-400 mr-1.5"></i><?= $row['lokasi'] ?></td>
                        <td class="px-6 py-4"><p class="font-bold text-gray-900 text-sm"><?= $row['stok_saat_ini'] ?> unit</p><p class="text-[12px] text-gray-500 mt-0.5">Min: <?= $row['stok_min'] ?></p></td>
                        <td class="px-6 py-4"><span class="<?= $s_cls ?> px-2.5 py-1 rounded-full text-[12px] font-semibold"><?= $s_lbl ?></span></td>
                    </tr>
                    <?php 
                        } 
                    } else {
                        echo '<tr><td colspan="6" class="px-6 py-10 text-center text-gray-500">Tidak ada produk yang cocok dengan filter.</td></tr>';
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>