import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Composant pour afficher la liste des emprunts
//  filtrage par auteur et genre
// Utilisation useState pour gérer l'état local
// Utilisation useEffect pour les effets de bord (récupération des données)
export default function EmpruntsListe() {
  const [emprunts, setEmprunts] = useState([]);
  const [auteur, setAuteur] = useState("");
  const [genre, setGenre] = useState("");
  const [auteursOptions, setAuteursOptions] = useState([]);
  const [genresOptions, setGenresOptions] = useState([]);
  const navigate = useNavigate();

  // Images de fond pour les livres 
  const imagesBackground = [
    "/petit%20prince.jpeg",
    "/enfant%20noir.jpeg",
    "/bird.jpeg",
    "/soleil.jpeg",
  ];

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
        // Extraire auteurs et genres uniques
        setAuteursOptions([
          ...new Set(res.data.map((e) => e.auteur).filter(Boolean)),
        ]);
        setGenresOptions([
          ...new Set(res.data.map((e) => e.genre).filter(Boolean)),
        ]);
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
    fetchEmprunts();
  }, [navigate]);

  // Filtrage local côté client
  const empruntsFiltres = emprunts.filter(
    (e) =>
      (auteur ? e.auteur === auteur : true) &&
      (genre ? e.genre === genre : true)
  );
  //
  return (
    <div className="p-8 bg-black-100 min-h-screen">
      <h2 className="text-3xl mb-6 text-black bold"> Mes Emprunts</h2>
      {/* Filtres */}
      <div className="flex flex-row gap-6 mb-8">
        <div className="flex flex-col">
          <label className="text-black mb-1">Auteur</label>
          <select
            value={auteur}
            onChange={(e) => setAuteur(e.target.value)}
            className="px-3 py-2 rounded bg-gray-200 text-black"
          >
            <option value="">Tous les auteurs</option>
            {auteursOptions.map((a, idx) => (
              <option key={idx} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-black mb-1">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-3 py-2 rounded bg-gray-200 text-black"
          >
            <option value="">Tous les genres</option>
            {genresOptions.map((g, idx) => (
              <option key={idx} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>
      {empruntsFiltres.length === 0 ? (
        // Si aucun emprunt ne correspond aux filtres
        <p className="text-black"> Aucun emprunt ne correspond à vos filtres.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empruntsFiltres.map((emprunt, idx) => {
            // Attribution des images pour tous les emprunts (même logique que LivresListe)
            const bgImage = imagesBackground[idx % imagesBackground.length];
            return (
              <div
                key={emprunt.id}
                className="bg-gray-900 p-4 rounded shadow hover:shadow-lg transition relative overflow-hidden"
                style={{
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  minHeight: "220px",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-green-500 mb-2">
                    {emprunt.titre}
                  </h3>
                  <p className="text-white">Auteur : {emprunt.auteur}</p>
                  <p className="text-white">Genre : {emprunt.genre}</p>
                  <p className="text-white">
                    Date d’emprunt : {emprunt.date_emprunt}
                  </p>
                  <p className="text-white">
                    Retour : {emprunt.retour ? "Oui" : "Non"}
                  </p>
                  <p className="text-white">
                    Date retour prévue : {emprunt.date_retour}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
