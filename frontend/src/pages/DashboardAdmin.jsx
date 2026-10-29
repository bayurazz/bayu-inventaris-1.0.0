import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
  // =========================================================================
  // 1. STATE (Variabel React untuk Menyimpan Data Sementara di Browser)
  // =========================================================================
  const [barang, setBarang] = useState([]);       // Menyimpan daftar barang dari database
  const [kategori, setKategori] = useState([]);   // Menyimpan daftar kategori untuk pilihan dropdown
  const [user, setUser] = useState(null);         // Menyimpan data admin yang sedang login

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
    const yakin = window.confirm("Apakah Anda yakin ingin menghapus barang ini?");
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

  // =========================================================================
  // 6. TAMPILAN HALAMAN (JSX / HTML)
  // =========================================================================
  return (
    <section className="flex flex-col justify-center items-center gap-5 w-full h-450 bg-gray-300">
      <div className="flex flex-col justify-center items-center w-4/5 h-80 bg-white rounded-xl relative">
        <h2 className="text-2xl font-bold text-white">
          Selamat Datang Admin !
        </h2>
        <p className="text-white">
          Halo, {user?.nama} ({user?.role})
        </p>

        <div className="w-fit h-fit absolute flex gap-2 top-5 left-5">
          <button
            className="w-fit h-fit px-2 py-1 cursor-pointer rounded-xl text-white bg-linear-to-br bg-[#16A34A] hover:bg-[#3760469d] text-2xl font-semibold"
            onClick={handleLogout}
          >
            Logout
          </button>
          <Link
            className="w-fit h-fit px-2 py-1 cursor-pointer rounded-xl text-white bg-linear-to-br bg-[#2563EB] hover:bg-[#1D4ED8] text-2xl font-semibold"
            to="/"
          >
            Back to guest form
          </Link>
          <h3 className="text-xl font-bold self-center">
            {editId ? "Form Edit Barang" : "Form Tambah Barang"}
          </h3>
        </div>

        {/* FORM INPUT CRUD */}
        <form
          className="flex justify-center items-center absolute bottom-5 left-0 gap-20 w-full h-30"
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
      </div>

      {/* TABEL DATA BARANG DENGAN AKSI EDIT & HAPUS */}
      <div className="flex flex-col justify-center items-center w-4/5 h-fit rounded-lg bg-white shadow-2xl/90">
        <Link to="/kategori">edit kategori</Link>
        <table className="w-4/5 text-black">
          <thead className="bg-gray-400">
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
    </section>
  );
}