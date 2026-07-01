// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Loader2 } from "lucide-react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Sesuaikan port 8000 di bawah dengan port Back-End temen lu (misal: 8000, 3000, atau 5000)
      const response = await axios.post("http://localhost:8000/api/v1/login", {
        username: username,
        password: password,
      });

      // Ambil token dari response Back-End
      const token = response.data.token;

      // Simpan token ke localStorage browser agar status login permanen
      localStorage.setItem("authToken", token);

      alert("Login Berhasil!");
      navigate("/"); // Lempar ke halaman Dashboard utama
    } catch (error) {
      if (error.response) {
        // Eror balasan dari server BE (Username/Password salah)
        setErrorMsg(error.response.data.message || "Username atau password salah!");
      } else {
        // Eror koneksi jaringan (Server BE belum dinyalain)
        setErrorMsg("Gagal terhubung ke server Back-End. Pastikan BE menyala!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9fc] min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sistem Inventori</h1>
          <p className="text-gray-500 text-sm mt-1">Silakan masuk untuk mengelola logistik gudang</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1d4ed8] hover:bg-blue-800 text-white py-2.5 rounded-lg font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:bg-blue-400"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" /> Memverifikasi...
              </>
            ) : (
              "Masuk ke Sistem"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}