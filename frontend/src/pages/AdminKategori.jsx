import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminKategori() {
  // =========================================================================
  // 1. STATE (Variabel Penyimpan Data Kategori)
  // =========================================================================
  const [kategori, setKategori] = useState([]);       // Menyimpan daftar kategori dari database
  const [namaKategori, setNamaKategori] = useState(""); // Menyimpan teks input nama kategori
  const [editKategoriId, setEditKategoriId] = useState(null); // null = Tambah, ada ID = Edit

  // =========================================================================
  // 2. USE EFFECT (Dijalankan 1x saat halaman dibuka)
  // =========================================================================
  useEffect(() => {
    fetchKategori();
  }, []);

  // =========================================================================
  // 3. FUNGSI READ (Mengambil Data Kategori dari Backend)
  // =========================================================================
  const fetchKategori = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/kategori");
      const data = await res.json();
      setKategori(data);
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
    }
  };

  // =========================================================================
  // 4. FUNGSI CREATE & UPDATE (Simpan Data Kategori)
  // =========================================================================
  const handleSubmitKategori = async (e) => {
    e.preventDefault(); // Mencegah reload halaman

    const dataKategori = { nama_kategori: namaKategori };

    try {
      if (editKategoriId === null) {
        // Mode Tambah (POST)
        await fetch("http://localhost:5000/api/kategori", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataKategori),
        });
        alert("Kategori berhasil ditambahkan!");
      } else {
        // Mode Edit (PUT)
        await fetch(`http://localhost:5000/api/kategori/${editKategoriId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataKategori),
        });
        alert("Kategori berhasil diperbarui!");
      }

      resetFormKategori();
      fetchKategori(); // Refresh daftar kategori
    } catch (err) {
      console.error("Gagal menyimpan kategori:", err);
      alert("Terjadi kesalahan saat menyimpan kategori!");
    }
  };

  // =========================================================================
  // 5. FUNGSI EDIT, DELETE & RESET
  // =========================================================================
  // Isi form dengan kategori yang mau diedit
  const handleEditKategori = (item) => {
    setEditKategoriId(item.id);
    setNamaKategori(item.nama_kategori);
  };

  // Hapus kategori (DELETE)
  const handleDeleteKategori = async (id) => {
    const yakin = window.confirm("Yakin ingin menghapus kategori ini?");
    if (!yakin) return;

    try {
      await fetch(`http://localhost:5000/api/kategori/${id}`, {
        method: "DELETE",
      });
      alert("Kategori berhasil dihapus!");
      fetchKategori(); // Refresh tabel
    } catch (err) {
      console.error("Gagal menghapus kategori:", err);
      alert("Gagal menghapus kategori!");
    }
  };

  // Bersihkan form
  const resetFormKategori = () => {
    setEditKategoriId(null);
    setNamaKategori("");
  };

  // =========================================================================
  // 6. TAMPILAN HALAMAN (JSX / HTML)
  // =========================================================================
  return (
    <div className="p-6">
      {/* Form Input Kategori */}
      <form onSubmit={handleSubmitKategori} className="flex gap-3 mb-6 items-center">
        <Link to="/admin" className="text-blue-600 underline">
          &larr; Kembali ke Dashboard
        </Link>
        <input
          className="border p-2 rounded"
          value={namaKategori}
          onChange={(e) => setNamaKategori(e.target.value)}
          placeholder="Nama kategori"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
        >
          {editKategoriId === null ? "Tambah" : "Simpan"}
        </button>
        {editKategoriId !== null && (
          <button
            type="button"
            onClick={resetFormKategori}
            className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-500"
          >
            Batal
          </button>
        )}
      </form>

      {/* Tabel Kategori */}
      <table className="border-collapse border border-gray-300 w-full max-w-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2 text-left">Nama Kategori</th>
            <th className="border border-gray-300 p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kategori.map((k) => (
            <tr key={k.id}>
              <td className="border border-gray-300 p-2">{k.nama_kategori}</td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  onClick={() => handleEditKategori(k)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDeleteKategori(k.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}