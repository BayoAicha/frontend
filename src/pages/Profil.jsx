import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; //  Syntaxe correcte

export default function Profil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); //   jwtDecode, 
        setUser(decoded);
      } catch (err) {
        console.error("Token invalide", err);
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-white">Aucun utilisateur connecté.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <h1 className="text-3xl text-green-500 font-bold mb-4">
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
