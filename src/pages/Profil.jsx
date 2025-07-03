import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NotificationsBloc from "../components/NotificationsBloc";
// Composant pour afficher le profil utilisateur
// Affiche les informations de l'utilisateur connecté

export default function Profil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Token invalide", err);
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center bg-white justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-black">Aucun utilisateur connecté.</p>
      </div>
    );
  }
  // Si l'utilisateur n'est pas connecté, affichage d' un message
  

  return (
    <div className="flex flex-col bg-white items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      {/* Image de profil dans un cadre carré à bordure jaune */}
      <div className="w-32 h-32 border-4 border-yellow-400 rounded-lg overflow-hidden mb-4 shadow">
        <img
          src="/profil.png"
          alt="Profil utilisateur"
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-3xl text-black font-bold mb-4">
        Mon Profil
      </h1>
      <div className="bg-gray-900 p-6 rounded shadow-md w-full max-w-md text-white">
        <p><span className="font-bold">Nom :</span> {user.nom}</p>
        <p><span className="font-bold">Email :</span> {user.email}</p>
        <p><span className="font-bold">Connecté(e) en tant que :</span> {user.role}</p>
      </div>
      {/* Bloc d'information pour les étudiants */}
      {user.role !== "admin" && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 mt-6 w-full max-w-md rounded shadow">
          <span>
            Connectez-vous comme administrateur pour pouvoir
            <span className="font-bold"> Ajouter</span>,
            <span className="font-bold"> Modifier</span>,
            <span className="font-bold"> Supprimer</span> et
            <span className="font-bold"> Gérer</span> des livres, gérer les utilisateurs et les emprunts.<br/> Adresse mail d'un administrateur : admin@mail.com <br/> mot de passe de l'administrateur : motdepasseadmin
          </span>
        </div>
      )}
      {/* Bloc notifications */}
      <NotificationsBloc />
    </div>
  );
}