import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { Pencil } from "lucide-react";
export default function DashboardAdmin() {
  // =========================================================================
  // 1. STATE (Variabel React untuk Menyimpan Data Sementara di Browser)
  // =========================================================================
  const [barang, setBarang] = useState([]); // Menyimpan daftar barang dari database
  const [kategori, setKategori] = useState([]); // Menyimpan daftar kategori untuk pilihan dropdown
  const [user, setUser] = useState(null); // Menyimpan data admin yang sedang login

  // State untuk menampung teks dari Form Input
  const [namaBarang, setNamaBarang] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [stok, setStok] = useState("");

  // Kunci Logika Form:
  // - Jika editId === null -> Form dalam mode TAMBAH BARANG BARU (POST)
  // - Jika editId ada isinya (ID barang) -> Form dalam mode EDIT BARANG (PUT)
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  // =========================================================================
  // 2. USE EFFECT (Dijalankan otomatis 1x saat halaman pertama kali dibuka)
  // =========================================================================
  useEffect(() => {
    // 1. Ambil data login dari LocalStorage
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== "admin") {
      navigate("/");
      return;
    }
    setUser(parsedUser);

    // 2. Ambil data barang & kategori dari backend
    fetchBarang();
    fetchKategori();
  }, [navigate]);

  // =========================================================================
  // 3. FUNGSI READ (Mengambil Data dari Backend / API)
  // =========================================================================
  const fetchBarang = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/barang");
      const data = await res.json();
      setBarang(data);
    } catch (err) {
      console.error("Gagal mengambil data barang:", err);
    }
  };

  const fetchKategori = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/kategori");
      const data = await res.json();
      setKategori(data);
    } catch (err) {
      console.error("Gagal mengambil data kategori:", err);
    }
  };

  // =========================================================================
  // 4. FUNGSI CREATE & UPDATE (Simpan Data Saat Tombol Form Diklik)
  // =========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah browser reload/refresh sendiri

    // Siapkan data objek barang
    const dataBarang = {
      nama_barang: namaBarang,
      kategori_id: kategoriId,
      stok: Number(stok),
    };

    try {
      if (editId === null) {
        // --- PROSES CREATE (Tambah Baru via POST) ---
        await fetch("http://localhost:5000/api/barang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataBarang),
        });
        alert("Barang berhasil ditambahkan!");
      } else {
        // --- PROSES UPDATE (Edit via PUT) ---
        await fetch(`http://localhost:5000/api/barang/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataBarang),
        });
        alert("Barang berhasil diperbarui!");
      }

      // Bersihkan input form & ambil data terbaru dari backend
      resetForm();
      fetchBarang();
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      alert("Terjadi kesalahan saat menyimpan data!");
    }
  };

  // =========================================================================
  // 5. FUNGSI AKSI: EDIT, DELETE, RESET & LOGOUT
  // =========================================================================

  // Saat tombol 'Edit' di baris tabel diklik: isi form dengan data yang dipilih
  const handleEditClick = (item) => {
    setEditId(item.id);
    setNamaBarang(item.nama_barang);
    setKategoriId(item.kategori_id);
    setStok(item.stok);
  };

  // Saat tombol 'Hapus' diklik: kirim request DELETE ke backend
  const handleDelete = async (id) => {
    const yakin = window.confirm(
      "Apakah Anda yakin ingin menghapus barang ini?"
    );
    if (!yakin) return;

    try {
      await fetch(`http://localhost:5000/api/barang/${id}`, {
        method: "DELETE",
      });
      alert("Barang berhasil dihapus!");
      fetchBarang(); // Refresh tabel setelah dihapus
    } catch (err) {
      console.error("Gagal menghapus barang:", err);
      alert("Gagal menghapus barang!");
    }
  };

  // Mengembalikan form ke keadaan kosong semula
  const resetForm = () => {
    setEditId(null);
    setNamaBarang("");
    setKategoriId("");
    setStok("");
  };

  // Logout akun admin
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <section className="flex flex-row justify-center items-center  w-full h-400 bg-gray-300">
      <div className="flex flex-col w-1/4 h-full p-6 bg-gray-700 shadow-2xl/50">
        <h2 className="text-2xl font-bold text-white">Welcome Admin !</h2>
        <p className="text-white">
          Halo, {user?.nama} ({user?.role})
        </p>
        <h3 className="text-xl font-bold text-white">
          {editId ? "Form Edit Barang" : "Form Tambah Barang"}
        </h3>
        <div className="flex flex-col justify-center gap-5 w-[90%] h-[10%]">
          <Link
            className="flex items-center px-4 py-2 cursor-pointer rounded font-semibold bg-blue-500 hover:bg-blue-600 text-white"
            to="/"
          >
            Back to guest form
          </Link>
          <button
            className="px-4 py-2 rounded cursor-pointer font-semibold bg-red-500 hover:bg-red-600 text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-5 w-full h-full">
        {/* FORM INPUT CRUD */}
        <form
          className="flex flex-row items-center justify-center gap-5 w-4/5 h-30 rounded-lg shadow-2xl/90 bg-white"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label>Nama Barang: </label>
            <input
              className="w-fit h-fit p-4 border rounded-xl"
              type="text"
              value={namaBarang}
              onChange={(e) => setNamaBarang(e.target.value)}
              placeholder="Contoh: Mouse Logitech"
              required
            />
          </div>

          <div className="flex flex-col">
            <label>Kategori: </label>
            <select
              className="w-fit h-fit p-4 border rounded-xl"
              value={kategoriId}
              onChange={(e) => setKategoriId(e.target.value)}
              required
            >
              <option value="">pilih kategori</option>
              {kategori.map((kat) => (
                <option key={kat.id} value={kat.id}>
                  {kat.nama_kategori}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label>Stok: </label>
            <input
              className="w-fit h-fit p-4 border rounded-xl"
              type="number"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
              placeholder="Jumlah stok"
              required
            />
          </div>

          <button
            className="w-fit h-fit p-4 cursor-pointer rounded-xl text-white bg-red-500 hover:bg-red-600"
            type="submit"
          >
            {editId ? "Simpan Perubahan" : "Tambah Barang"}
          </button>

          {/* Tombol Batal hanya muncul saat sedang mengedit */}
          {editId && (
            <button
              type="button"
              className="w-fit h-fit p-4 cursor-pointer rounded-xl text-white bg-gray-500 hover:bg-gray-600"
              onClick={resetForm}
            >
              Batal Edit
            </button>
          )}
        </form>
        {/* TABEL DATA BARANG DENGAN AKSI EDIT & HAPUS */}
        <div className="flex flex-col justify-center items-center w-4/5 rounded-lg bg-white shadow-2xl/90">
          <Link to="/kategori">edit kategori</Link>
          <table className="w-4/5 text-black">
            <thead className="bg-blue-600">
              <tr>
                <th className="text-white">No</th>
                <th className="text-white">Nama Barang</th>
                <th className="text-white">Kategori</th>
                <th className="text-white">Stok</th>
                <th className="text-white">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {barang.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.nama_barang}</td>
                  <td>{item.Kategori?.nama_kategori || "-"}</td>
                  <td>{item.stok}</td>
                  <td>
                    <div className="flex gap-5">
                      <button
                        className="w-fit h-fit p-4 text-white bg-green-500 hover:bg-green-800 rounded-lg cursor-pointer"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-fit h-fit p-4 text-white hover:bg-red-800 bg-red-500 rounded-lg cursor-pointer"
                        onClick={() => handleDelete(item.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
