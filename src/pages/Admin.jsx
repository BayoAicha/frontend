import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [emprunts, setEmprunts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirige si pas connecté
      return;
    }

    const decoded = jwtDecode(token);
    setUser(decoded);

    if (decoded.role !== "admin") {
      navigate("/"); // Redirige si pas admin
      return;
    }

    const fetchData = async () => {
      try {
        //  Récupère tous les utilisateurs
        const usersRes = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        //  Récupère tous les emprunts
        const empruntsRes = await axios.get("http://localhost:5000/api/admin/emprunts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(usersRes.data);
        setEmprunts(empruntsRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [navigate]);

  if (!user) {
    return <p className="text-white p-8">Chargement...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl text-green-500 font-bold mb-6">Espace Administrateur</h1>
      <p className="text-white mb-8">
        Bienvenue, {user.nom}. Vous êtes connecté(e) en tant qu’administrateur.
      </p>

      {/*  Liste des utilisateurs */}
      <h2 className="text-2xl text-blue-400 mb-4">👥 Utilisateurs</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left text-white border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2">ID</th>
              <th className="p-2">Nom</th>
              <th className="p-2">Email</th>
              <th className="p-2">Rôle</th>
              <th className="p-2">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-700">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.nom}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  {new Date(u.crée_le).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Liste des emprunts */}
      <h2 className="text-2xl text-blue-400 mb-4">📚 Emprunts</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-white border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2">ID</th>
              <th className="p-2">Utilisateur</th>
              <th className="p-2">Email</th>
              <th className="p-2">Livre</th>
              <th className="p-2">Auteur</th>
              <th className="p-2">Date Emprunt</th>
              <th className="p-2">Date Retour</th>
              <th className="p-2">Retourné</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.map((e) => (
              <tr key={e.id} className="border-b border-gray-700">
                <td className="p-2">{e.id}</td>
                <td className="p-2">{e.utilisateur}</td>
                <td className="p-2">{e.email}</td>
                <td className="p-2">{e.titre}</td>
                <td className="p-2">{e.auteur}</td>
                <td className="p-2">
                  {new Date(e.date_emprunt).toLocaleDateString()}
                </td>
                <td className="p-2">
                  {e.date_retour ? new Date(e.date_retour).toLocaleDateString() : "N/A"}
                </td>
                <td className="p-2">{e.retour ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
