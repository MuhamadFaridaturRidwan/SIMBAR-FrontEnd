<?php 
include 'koneksi.php'; 
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Peringatan Stok Rendah - Sistem Inventori</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans leading-normal tracking-normal">

    <nav class="bg-white p-4 shadow-lg text-gray-800">
        <div class="container mx-auto flex justify-between items-center">
            <span class="font-bold text-xl text-gray-800">📦 Panel Inventori</span>
            <ul class="flex space-x-6 text-sm">
                <li><a href="dashboard.php" class="hover:text-blue-600 font-semibold text-blue-600 border-b-2 border-blue-600 pb-1">Dashboard</a></li>
                <li><a href="daftar-barang.php" class="hover:text-blue-600 font-semibold text-gray-600">Inventori Barang</a></li>
                <li><a href="transaksi.php" class="hover:text-blue-600 font-semibold text-gray-600">Transaksi</a></li>
                <li><a href="laporan.php" class="hover:text-blue-600 font-semibold text-gray-600">Laporan</a></li>
            </ul>
        </div>
    </nav>

    <div class="container mx-auto mt-10 p-4">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Peringatan Stok Rendah</h1>
            <a href="dashboard.php" class="text-blue-600 hover:underline">← Kembali ke Dashboard</a>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <table class="min-w-full">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Kode SKU</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nama Barang</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Stok Saat Ini</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <?php
                    // Query untuk mengambil barang dengan stok rendah (1-10 unit)
                    $query = mysqli_query($koneksi, "SELECT * FROM barang WHERE stok_saat_ini <= 10 AND stok_saat_ini > 0 ORDER BY stok_saat_ini ASC");
                    while($row = mysqli_fetch_assoc($query)) {
                    ?>
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm font-mono text-blue-600"><?php echo $row['kode_barang']; ?></td>
                        <td class="px-6 py-4 text-sm font-semibold text-gray-800"><?php echo $row['nama_barang']; ?></td>
                        <td class="px-6 py-4 text-sm font-bold text-red-600"><?php echo $row['stok_saat_ini']; ?> Unit</td>
                        <td class="px-6 py-4 text-sm">
                            <a href="form-masuk.php?id=<?php echo $row['id_barang']; ?>" class="bg-green-100 hover:bg-green-200 text-green-700 font-bold py-1 px-3 rounded text-xs">Tambah Stok</a>
                        </td>
                    </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>