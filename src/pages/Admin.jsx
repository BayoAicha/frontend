import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Composant pour l'espace d'administration
// Permettre la gestion des utilisateurs et des emprunts
// Utilise useState pour gérer l'état local
// Utilise useEffect pour les effets de bord (récupération des données)

export default function Admin() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [emprunts, setEmprunts] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchLivre, setSearchLivre] = useState("");
  const navigate = useNavigate();
  // Vérification du token à chaque chargement de la page
  // Redirection si pas connecté ou pas admin

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirection quand c'est pas connecté
      return;
    }

    const decoded = jwtDecode(token);
    setUser(decoded);

    if (decoded.role !== "admin") {
      navigate("/"); // Redirection quand c'est pas admin
      return;
    }

    const fetchData = async () => {
      try {
        //  Récupèration de tous les utilisateurs
        const usersRes = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        //  Récupèration de tous les emprunts
        const empruntsRes = await axios.get("http://localhost:5000/api/admin/emprunts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(usersRes.data);
        setEmprunts(empruntsRes.data);
      } catch (err) {
        if (
          err.response &&
          err.response.status === 403 &&
          err.response.data &&
          (err.response.data.message?.toLowerCase().includes("token") ||
            err.response.data.error?.toLowerCase().includes("token"))
        ) {
          alert("Votre session a expiré. Veuillez vous reconnecter.");
          navigate("/login");
        } else {
          console.error(err);
        }
      }
    };

    fetchData();
  }, [navigate]);

  if (!user) {
    return <p className="text-white p-8">Chargement...</p>;
  }

  return (
    <div className="p-8 bg-white">
      <h1 className="text-3xl text-green-500 font-bold mb-6">Espace de gestion des utilisateurs et des emprunts</h1>
      <p className="text-black bold mb-8">
        Bienvenue, {user.nom}. Vous êtes connecté(e) en tant qu’administrateur.
      </p>

      {/* Filtres de recherche globaux */}
      <div className="flex flex-col md:flex-row md:items-end md:space-x-4 mb-8">
        <div className="flex flex-col mb-2 md:mb-0">
          <label className="text-black font-bold mb-1">Utilisateur (nom ou email)</label>
          <input
            type="text"
            value={searchUser}
            onChange={e => setSearchUser(e.target.value)}
            placeholder="Rechercher utilisateur..."
            className="px-3 py-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-black font-bold mb-1">Livre (titre)</label>
          <input
            type="text"
            value={searchLivre}
            onChange={e => setSearchLivre(e.target.value)}
            placeholder="Rechercher livre..."
            className="px-3 py-2 rounded bg-gray-200 text-black"
          />
        </div>
      </div>

      {/*  Liste des utilisateurs */}
      <h2 className="text-2xl text-blue-400  mb-4">👥 Utilisateurs</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
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
                <td className="p-2 font-bold text-black">{u.id}</td>
                <td className="p-2 font-bold text-black">{u.nom}</td>
                <td className="p-2 font-bold text-black">{u.email}</td>
                <td className="p-2 font-bold text-black">{u.role}</td>
                <td className="p-2 font-bold text-black">{new Date(u.cree_le).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Liste des emprunts */}
      <h2 className="text-2xl text-blue-400 mb-4"> Emprunts</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
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
            {emprunts
              .filter(e =>
                (searchUser === "" || (e.utilisateur && e.utilisateur.toLowerCase().includes(searchUser.toLowerCase())) || (e.email && e.email.toLowerCase().includes(searchUser.toLowerCase()))) &&
                (searchLivre === "" || (e.titre && e.titre.toLowerCase().includes(searchLivre.toLowerCase())))
              )
              .map((e) => (
                <tr key={e.id} className="border-b border-gray-700">
                  <td className="p-2 font-bold text-black">{e.id}</td>
                  <td className="p-2 font-bold text-black">{e.utilisateur || ""}</td>
                  <td className="p-2 font-bold text-black">{e.email || ""}</td>
                  <td className="p-2 font-bold text-black">{e.titre || ""}</td>
                  <td className="p-2 font-bold text-black">{e.auteur || ""}</td>
                  <td className="p-2 font-bold text-black">{e.date_emprunt ? new Date(e.date_emprunt).toLocaleDateString() : ""}</td>
                  <td className="p-2 font-bold text-black">{e.date_retour ? new Date(e.date_retour).toLocaleDateString() : "N/A"}</td>
                  <td className="p-2 font-bold text-black">{e.retour ? "✅" : "❌"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
