import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
  const [barang, setBarang] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // State untuk Form Input
  const [namaBarang, setNamaBarang] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [stok, setStok] = useState("");

  // State penentu: apakah sedang Tambah Baru (null) atau Edit (berisi ID barang)
  const [editId, setEditId] = useState(null);

  // 1. Cek Login & Ambil Data Awal saat halaman dibuka
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(savedUser);
    if (parsed.role !== "admin") {
      navigate("/");
      return;
    }
    setUser(parsed);

    fetchBarang();
    fetchKategori();
  }, [navigate]);

  // Fungsi Ambil Data Barang (READ)
  const fetchBarang = () => {
    fetch("http://localhost:5000/api/barang")
      .then((res) => res.json())
      .then((data) => setBarang(data))
      .catch((err) => console.error(err));
  };

  // Fungsi Ambil Data Kategori untuk Dropdown Select
  const fetchKategori = () => {
    fetch("http://localhost:5000/api/kategori")
      .then((res) => res.json())
      .then((data) => setKategori(data))
      .catch((err) => console.error(err));
  };

  // 2. Fungsi Submit (Bisa CREATE atau UPDATE tergantung editId)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataBarang = {
      nama_barang: namaBarang,
      kategori_id: kategoriId,
      stok: Number(stok),
    };

    if (editId === null) {
      // PROSES TAMBAH (CREATE)
      await fetch("http://localhost:5000/api/barang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBarang),
      });
      alert("Barang berhasil ditambahkan!");
    } else {
      // PROSES EDIT (UPDATE)
      await fetch(`http://localhost:5000/api/barang/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBarang),
      });
      alert("Barang berhasil diperbarui!");
      setEditId(null);
    }

    // Reset Form & Refresh Data Tabel
    resetForm();
    fetchBarang();
  };

  // CREATE atau UPDATE kategori

  // 3. Masukkan Data ke Form saat tombol 'Edit' diklik
  const handleEditClick = (item) => {
    setEditId(item.id);
    setNamaBarang(item.nama_barang);
    setKategoriId(item.kategori_id);
    setStok(item.stok);
  };

  // 4. Fungsi Hapus (DELETE)
  const handleDelete = async (id) => {
    const yakin = window.confirm(
      "Apakah Anda yakin ingin menghapus barang ini?"
    );
    if (!yakin) return;

    await fetch(`http://localhost:5000/api/barang/${id}`, {
      method: "DELETE",
    });

    alert("Barang berhasil dihapus!");
    fetchBarang(); // Refresh tabel
  };

  // Fungsi Reset Form
  const resetForm = () => {
    setEditId(null);
    setNamaBarang("");
    setKategoriId("");
    setStok("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <section className="flex flex-col justify-center items-center gap-5 w-full h-full ">
      <div className="flex flex-col items-center w-4/5 2/5 bg-blue-300 rounded-xl relative">
        <h2 className="text-2xl font-bold text-white">
          Selamat Datang Admin !
        </h2>
        <p className="text-white">
          Halo, {user?.nama} ({user?.role})
        </p>
        <div className=" w-1/2 bg-yellow-100">
          <button onClick={handleLogout}>Logout</button>
          {" | "}
          <Link to="/">Tampilan Guest</Link>
          <h3>{editId ? "Form Edit Barang" : "Form Tambah Barang"}</h3>
        </div>

        {/* FORM INPUT CRUD */}

        <form
          className="flex justify-center gap-20 w-full h-20"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label>Nama Barang: </label>
            <input
              className="w-fit h-fit p-4 bg-blue-200 rounded-xl"
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
              className="w-fit h-fit p-4 bg-blue-200 rounded-xl"
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

          <div className="flex flex-col ">
            <label>Stok: </label>
            <input
              className="w-fit h-fit p-4 bg-blue-200 rounded-xl"
              type="number"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
              placeholder="Jumlah stok"
              required
            />
          </div>

          <button type="submit">
            {editId ? "Simpan Perubahan" : "Tambah Barang"}
          </button>

          {/* Tombol Batal hanya muncul saat sedang mengedit */}
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: "8px" }}
            >
              Batal Edit
            </button>
          )}
        </form>
      </div>

      {/* TABEL DATA BARANG DENGAN AKSI EDIT & HAPUS */}
      <div className="flex flex-col justify-center items-center w-4/5 h-fit bg-gray-300 shadow-2xl/90">
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
                  <button onClick={() => handleEditClick(item)}>Edit</button>{" "}
                  <button onClick={() => handleDelete(item.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
