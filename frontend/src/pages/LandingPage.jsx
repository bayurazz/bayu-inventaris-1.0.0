import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [barang, setBarang] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }

    fetch("http://localhost:5000/api/barang")
      .then((res) => res.json())
      .then((data) => setBarang(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <section className="flex flex-row justify-start items-start w-full h-screen ">
      <div className="bg-gray-700 w-1/4 h-full">
        <h2 className="text-white text-2xl font-semibold">Dashboard Guest</h2>
        {user ? (
          <div className="">
            <p>
              Login sebagai: {user.nama} ({user.role})
            </p>
            {user.role === "admin" && (
              <Link to="/admin">Ke Dashboard Admin</Link>
            )}
            {" | "}
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <p className="text-white">Status: Guest (Belum login)</p>
            <Link className="text-white hover:text-blue-500" to="/login">
              Ke Halaman Login Admin
            </Link>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center w-3/4 h-full">
        <table className="bg-gray-200 w-[70%]">
          <thead className="bg-blue-600">
            <tr className="">
              <th>No</th>
              <th>Nama Barang</th>
              <th>Kategori</th>
              <th>Stok</th>
            </tr>
          </thead>
          <tbody>
            {barang.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.nama_barang}</td>
                <td>{item.Kategori?.nama_kategori}</td>
                <td>{item.stok}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
