import { useEffect, useState } from "react";
import axios from "axios";

export default function EmpruntsListe() {
  const [emprunts, setEmprunts] = useState([]);

  useEffect(() => {
    const fetchEmprunts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/emprunts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmprunts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmprunts();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-6 text-white"> Mes Emprunts</h2>
      {emprunts.length === 0 ? (
        <p className="text-white">Aucun emprunt trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emprunts.map((emprunt) => (
            <div
              key={emprunt.id}
              className="bg-gray-900 p-4 rounded shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-green-500 mb-2">
                {emprunt.titre}
              </h3>
              <p className="text-white">Auteur : {emprunt.auteur}</p>
              <p className="text-white">Date d’emprunt : {emprunt.date_emprunt}</p>
              <p className="text-white">
                Retour : {emprunt.retour ? "Oui" : "Non"}
              </p>
              <p className="text-white">
                Date retour prévue : {emprunt.date_retour}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
