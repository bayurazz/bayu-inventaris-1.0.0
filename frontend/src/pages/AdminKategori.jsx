import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminKategori() {
  //kategori
  const [namaKategori, setNamaKategori] = useState("");
  const [editKategoriId, setEditKategoriId] = useState(null);
  const [kategori, setKategori] = useState([]);

  const fetchKategori = () => {
    fetch("http://localhost:5000/api/kategori")
      .then((res) => res.json())
      .then((data) => setKategori(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const handleSubmitKategori = async (e) => {
    e.preventDefault();

    const dataKategori = { nama_kategori: namaKategori };

    if (editKategoriId === null) {
      await fetch("http://localhost:5000/api/kategori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataKategori),
      });
      alert("Kategori berhasil ditambahkan!");
    } else {
      await fetch(`http://localhost:5000/api/kategori/${editKategoriId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataKategori),
      });
      alert("Kategori berhasil diperbarui!");
    }

    resetFormKategori();
    fetchKategori(); // refresh tabel kategori + dropdown di form barang
  };

  // Isi form saat tombol Edit di tabel kategori diklik
  const handleEditKategori = (item) => {
    setEditKategoriId(item.id);
    setNamaKategori(item.nama_kategori);
  };

  // DELETE kategori
  const handleDeleteKategori = async (id) => {
    const yakin = window.confirm("Yakin ingin menghapus kategori ini?");
    if (!yakin) return;

    await fetch(`http://localhost:5000/api/kategori/${id}`, {
      method: "DELETE",
    });

    alert("Kategori berhasil dihapus!");
    fetchKategori();
    fetchBarang(); // opsional: barang yang memakai kategori ini bisa ikut berubah
  };

  const resetFormKategori = () => {
    setEditKategoriId(null);
    setNamaKategori("");
  };
  return (
    <>
      <div className="">
        {/* kategori */}
        <form onSubmit={handleSubmitKategori}>
          <Link to="/admin">kembali</Link>
          <input
            value={namaKategori}
            onChange={(e) => setNamaKategori(e.target.value)}
            placeholder="Nama kategori"
            required
          />
          <button type="submit">
            {editKategoriId === null ? "Tambah" : "Simpan"}
          </button>
          {editKategoriId !== null && (
            <button type="button" onClick={resetFormKategori}>
              Batal
            </button>
          )}
        </form>

        <table>
          <tbody>
            {kategori.map((k) => (
              <tr key={k.id}>
                <td>{k.nama_kategori}</td>
                <td>
                  <button onClick={() => handleEditKategori(k)}>Edit</button>
                  <button onClick={() => handleDeleteKategori(k.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
