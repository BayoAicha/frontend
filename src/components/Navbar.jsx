import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Vérification du token à chaque changement de page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  // Lien actif → souligné + fond jaune
  const linkClass = (path) =>
    `px-3 py-1 rounded ${
      location.pathname === path
        ? "bg-yellow-700 text-white underline"
        : "text-white hover:text-yellow-400"
    } transition`;
    // Classe pour les liens de navigation
    // Utilisation de Tailwind CSS pour le style
    // Utilisation de la classe `transition` pour les effets de survol

  return (
    <nav className="bg-green-600 px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <img
          src="/Mabiblio.png"
          alt="Logo Ma Bibliothèque"
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
        />
        <span className="text-white text-2xl font-bold">MaBibliothèque</span>
      </div>

      <div className="space-x-4 flex items-center">
        <Link to="/" className={linkClass("/")}>
          Accueil
        </Link>
        <Link to="/books" className={linkClass("/books")}>
          Livres
        </Link>

        {/*  Mes emprunts pour étudiants uniquement */}
        {user?.role !== "admin" && user && (
          <Link to="/emprunts" className={linkClass("/emprunts")}>
            Mes emprunts
          </Link>
        )}

        {/*  Espace Admin pour admin uniquement */}
        {user?.role === "admin" && (
          <Link to="/admin" className={linkClass("/admin")}>
            Gestion utilisateurs
            et emprunts
          </Link>
        )}

        {/*  Profil + Déconnexion si connecté */}
        {user ? (
          <>
            <Link to="/profil" className={linkClass("/profil")}>
              Profil
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white text-black px-4 py-2 rounded hover:bg-yellow-700 transition"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="bg-white border border-yellow-600 text-black px-4 py-2 rounded hover:bg-yellow-600 hover:text-white transition"
            >
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
