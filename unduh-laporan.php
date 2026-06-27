<?php
include 'koneksi.php';

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="Laporan_Lengkap_' . date('m-d-y') . '.csv"');

$output = fopen('php://output', 'w');

// Bagian Inventori
fputcsv($output, array('=== LAPORAN INVENTORI ==='));
fputcsv($output, array('Kode', 'Nama Produk', 'Stok', 'Harga Satuan', 'Total Nilai'));
$q1 = mysqli_query($koneksi, "SELECT * FROM barang");
while($r = mysqli_fetch_assoc($q1)) {
    fputcsv($output, array($r['kode_barang'], $r['nama_barang'], $r['stok_saat_ini'], $r['harga_satuan'], ($r['stok_saat_ini'] * $r['harga_satuan'])));
}

fputcsv($output, array('')); // Baris kosong

// Bagian Transaksi
fputcsv($output, array('=== RIWAYAT TRANSAKSI ==='));
fputcsv($output, array('Tanggal', 'Tipe', 'Produk', 'Jumlah', 'Referensi'));
$q2 = mysqli_query($koneksi, "SELECT * FROM (SELECT m.tanggal_masuk as tgl, 'MASUK' as tipe, b.nama_barang, m.jumlah, m.referensi FROM barang_masuk m JOIN barang b ON m.id_barang = b.id_barang UNION ALL SELECT k.tanggal_keluar as tgl, 'KELUAR' as tipe, b.nama_barang, k.jumlah, k.referensi FROM barang_keluar k JOIN barang b ON k.id_barang = b.id_barang) as gabungan ORDER BY tgl DESC");
while($r = mysqli_fetch_assoc($q2)) {
    fputcsv($output, array($r['tgl'], $r['tipe'], $r['nama_barang'], $r['jumlah'], $r['referensi']));
}

fclose($output);
exit();