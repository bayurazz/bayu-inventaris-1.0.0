import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  // 1. STATE FORM LOGIN
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 2. FUNGSI LOGIN
  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah reload form

    try {
      // Kirim username & password ke backend
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      // Jika password atau username salah dari backend
      if (!res.ok) {
        return alert(data.message || "Login gagal");
      }

      // Jika berhasil, simpan data user ke LocalStorage
      localStorage.setItem("user", JSON.stringify(data));

      // Arahkan ke dashboard sesuai role: jika admin ke /admin, selainnya ke guest /
      navigate(data.role === "admin" ? "/admin" : "/");
    } catch (err) {
      alert("Gagal terhubung ke backend (Pastikan backend sudah running)");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen relative">
      <div className="w-full h-screen absolute z-0 bg-linear-to-br from-blue-400 via-indigo-300 to-blue-500"></div>
      {/* <img
        className="w-full h-screen absolute z-0 object-cover"
        src="/img/mobil.png"
        alt=""
      /> */}
      <div className="w-full h-screen absolute z-0 bg-black/40"></div>

      <form
        className="flex flex-col absolute z-1 justify-center items-center gap-5 w-[25%] min-w-[300px] h-[70%] bg-white rounded-xl shadow-lg p-6"
        onSubmit={handleLogin}
      >
        <h2 className="font-bold text-2xl text-gray-800">Login</h2>

        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Username:
          </label>
          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Masukkan Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Password:
          </label>
          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Masukkan Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="w-full cursor-pointer rounded-lg hover:bg-red-600 py-3 bg-red-500 text-white font-semibold"
          type="submit"
        >
          Log in
        </button>

        <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 mt-2">
          Sign in without account (Tanpa Login)
        </Link>
      </form>
    </div>
  );
}
