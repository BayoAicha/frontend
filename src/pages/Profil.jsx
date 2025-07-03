import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

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
    </div>
  );
}