import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  // 1. STATE
  const [barang, setBarang] = useState([]); // Menyimpan daftar barang untuk dilihat guest
  const [user, setUser] = useState(null); // Mengecek apakah ada user yang sedang login
  const navigate = useNavigate();

  // 2. USE EFFECT (Ambil data otomatis saat halaman dimuat)
  useEffect(() => {
    // Cek apakah ada session user di browser
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }

    // Ambil daftar barang dari backend (hanya READ)
    ambilDataBarang();
  }, []);

  const ambilDataBarang = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/barang");
      const data = await res.json();
      setBarang(data);
    } catch (err) {
      console.error("Gagal mengambil data barang:", err);
    }
  };

  // Logout akun
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <section className="flex flex-row justify-start items-start w-full h-200">
      {/* SIDEBAR KIRI: Info Status Login */}
      <div className="bg-gray-700 w-1/4 h-full p-6 text-white flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Dashboard Guest</h2>

        {user ? (
          <div className="flex flex-col gap-5">
            <p className="mb-2 ">
              Login sebagai: <span className="font-semibold">{user.nama}</span>{" "}
              ({user.role})
            </p>
            {user.role === "admin" && (
              <div className="mb-2">
                <Link
                  to="/admin"
                  className="px-5 py-3 font-semibold bg-blue-500 hover:bg-blue-600 cursor-pointer rounded"
                >
                  &rarr; Ke Dashboard Admin
                </Link>
              </div>
            )}
            <button
              onClick={handleLogout}
              className=" px-4 py-2 rounded cursor-pointer font-semibold text-white bg-red-500 hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-4">Status: Guest (Belum login)</p>
            <Link
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block"
              to="/login"
            >
              Ke Halaman Login Admin
            </Link>
          </div>
        )}
      </div>

      {/* KONTEN KANAN: Tabel Barang (Read Only) */}
      <div className="flex flex-col justify-center items-center p-8 w-full">
        <table className="bg-white w-3/4 h-screen shadow-2xl/90 rounded-lg  border">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">No</th>
              <th className="p-3 text-left">Nama Barang</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-left">Stok</th>
            </tr>
          </thead>
          <tbody>
            {barang.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  Belum ada data barang.
                </td>
              </tr>
            ) : (
              barang.map((item, i) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-medium">{item.nama_barang}</td>
                  <td className="p-3">{item.Kategori?.nama_kategori || "-"}</td>
                  <td className="p-3">{item.stok}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
