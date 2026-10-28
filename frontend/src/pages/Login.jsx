import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Login gagal");
      }

      localStorage.setItem("user", JSON.stringify(data));
      navigate(data.role === "admin" ? "/admin" : "/");
    } catch (err) {
      alert("Gagal terhubung ke backend");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen relative">
      <img
        className="w-full h-screen absolute z-0"
        src="/img/mobil.png"
        alt=""
      />
      <div className="w-full h-screen absolute z-0 bg-black/40"></div>
      <form
        className="flex flex-col absolute z-1 justify-center items-center gap-5 w-[25%] h-[70%] bg-white rounded-xl"
        onSubmit={handleLogin}
      >
        <h2 className="-translate-y-5 font-bold text-2xl">Login</h2>
        <div className="flex flex-col">
          <label>Username: </label>
          <input
            className="border w-fit h-fit p-4 rounded-lg shadow-xl/20"
            placeholder="Masukan Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col ">
          <label>Password: </label>
          <input
            className="border w-fit h-fit p-4 rounded-lg shadow-xl/20"
            placeholder="Masukan Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="w-fit h-fit pl-20 pr-20 cursor-pointer rounded-lg hover:bg-red-600 py-5 bg-red-500 text-white"
          type="submit"
        >
          Log in
        </button>
      </form>
      <br />
      <Link to="/">Masuk sebagai Guest (Tanpa Login)</Link>
    </div>
  );
}
