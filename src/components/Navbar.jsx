import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const linkBase = "text-white hover:text-green-400 transition px-2 py-1";
  const activeStyle = "border-b-2 border-green-500 text-green-400";

  return (
    <nav className="bg-black px-6 py-4 flex items-center justify-between shadow-md">
      <div className="text-white text-2xl font-bold">
        Ma Bibliothèque
      </div>
      <div className="space-x-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${linkBase} ${activeStyle}` : linkBase
          }
        >
          Accueil
        </NavLink>

        <NavLink
          to="/books"
          className={({ isActive }) =>
            isActive ? `${linkBase} ${activeStyle}` : linkBase
          }
        >
          Livres
        </NavLink>

        <NavLink
          to="/emprunts"
          className={({ isActive }) =>
            isActive ? `${linkBase} ${activeStyle}` : linkBase
          }
        >
          Mes emprunts
        </NavLink>

        {/* les boutons Connexion & Inscription en style boutons */}
        <Link
          to="/login"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Connexion
        </Link>

        <Link
          to="/register"
          className="border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-600 hover:text-white transition"
        >
          Inscription
        </Link>
      </div>
    </nav>
  );
}
