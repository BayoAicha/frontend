import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import CommentaireSection from "./commentaireSection";

export default function LivresListe() {
  const [livres, setLivres] = useState([]);
  // Gestion des messages avec type (succès/erreur)
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(null); // 'success' | 'error' | null
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [genre, setGenre] = useState("");
  const [genresOptions, setGenresOptions] = useState([]);
  const [auteursOptions, setAuteursOptions] = useState([]);
  const [user, setUser] = useState(null);
  const [newTitre, setNewTitre] = useState("");
  const [newAuteur, setNewAuteur] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitre, setEditTitre] = useState("");
  const [editAuteur, setEditAuteur] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editDisponible, setEditDisponible] = useState(true);
  const [selectedLivre, setSelectedLivre] = useState(null);
  const [livreCommentaires, setLivreCommentaires] = useState([]);
  const [moyenneEtoiles, setMoyenneEtoiles] = useState(null);
  const messageRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Erreur token :", err);
      }
    }
  }, []);

  const fetchFiltres = useCallback(async () => {
    try {
      const params = {};
      if (titre) params.titre = titre;
      if (auteur) params.auteur = auteur;
      if (genre) params.genre = genre;
      const res = await axios.get("http://localhost:5000/api/livres/filtres", { params });
      setGenresOptions(res.data.genres);
      setAuteursOptions(res.data.auteurs);
    } catch (err) {
      console.error(err);
    }
  }, [titre, auteur, genre]);

  const fetchLivres = useCallback(async () => {
    try {
      const params = {};
      if (titre) params.titre = titre;
      if (auteur) params.auteur = auteur;
      if (genre) params.genre = genre;
      const res = await axios.get("http://localhost:5000/api/livres", { params });
      setLivres(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [titre, auteur, genre]);

  useEffect(() => {
    fetchLivres();
    fetchFiltres();
    // Rafraîchissement auto toutes les 20 secondes
    const interval = setInterval(() => {
      fetchLivres();
      fetchFiltres();
    }, 20000);
    return () => clearInterval(interval);
  }, [fetchLivres, fetchFiltres]);

  const resetFiltres = () => {
    setTitre("");
    setAuteur("");
    setGenre("");
    setMessage("");
    setMessageType(null);
  };

  // Affichage et disparition automatique du message
  const showMessage = (msg, type = null) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType(null);
    }, 3000);
    // Scroll vers le message si possible
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleEmprunter = async (livreId) => {
    if (user?.role === "admin") return;
    const token = localStorage.getItem("token");
    if (!token) {
      showMessage("Veuillez vous connecter.", "error");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/emprunts",
        {
          livre_id: livreId,
          date_retour: "2025-07-30",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("Livre emprunté avec succès !", "success");
      fetchLivres();
      fetchFiltres();
    } catch (err) {
      if (err.response) {
        showMessage(err.response.data.message || "Erreur lors de l'emprunt.", "error");
      } else {
        showMessage("Erreur lors de l'emprunt.", "error");
      }
    }
  };

  const handleAjouterLivre = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:5000/api/livres",
        { titre: newTitre, auteur: newAuteur, genre: newGenre },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("Livre ajouté avec succès !", "success");
      setNewTitre("");
      setNewAuteur("");
      setNewGenre("");
      fetchLivres();
      fetchFiltres();
    } catch (err) {
      showMessage("Erreur lors de l'ajout du livre.", "error");
    }
  };

  const handleSupprimerLivre = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(`http://localhost:5000/api/livres/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("Livre supprimé avec succès !", "success");
      fetchLivres();
      fetchFiltres();
    } catch (err) {
      showMessage("Erreur lors de la suppression du livre.", "error");
    }
  };

  const handleModifierLivre = (livre) => {
    setEditingId(livre.id);
    setEditTitre(livre.titre);
    setEditAuteur(livre.auteur);
    setEditGenre(livre.genre);
    setEditDisponible(!!livre.disponible);
  };

  const handleEnregistrerModif = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(
        `http://localhost:5000/api/livres/${editingId}`,
        {
          titre: editTitre,
          auteur: editAuteur,
          genre: editGenre,
          disponible: editDisponible,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("Livre modifié avec succès !", "success");
      setEditingId(null);
      fetchLivres();
      fetchFiltres();
    } catch (err) {
      showMessage("Erreur lors de la modification du livre.", "error");
    }
  };

  // Fonction pour charger les commentaires et calculer la moyenne d'étoiles d'un livre
  const fetchCommentairesEtMoyenne = async (livreId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/commentaires/${livreId}`);
      setLivreCommentaires(res.data);
      if (res.data.length > 0) {
        const notes = res.data.filter(c => c.note).map(c => c.note);
        const moyenne = notes.length > 0 ? (notes.reduce((a, b) => a + b, 0) / notes.length) : null;
        setMoyenneEtoiles(moyenne);
      } else {
        setMoyenneEtoiles(null);
      }
    } catch (err) {
      setLivreCommentaires([]);
      setMoyenneEtoiles(null);
    }
  };

  // Images de fond disponibles (chemins encodés pour les espaces)
  const imagesBackground = [
    "/petit%20prince.jpeg",
    "/enfant%20noir.jpeg",
    "/bird.jpeg",
    "/soleil.jpeg"
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-6 text-black bold"> Liste des Livres</h2>

      {/* Affichage des messages */}
      {message && (
        <div
          ref={messageRef}
          className={`fixed left-1/2 top-8 z-50 -translate-x-1/2 mb-4 px-4 py-3 rounded font-bold text-center shadow-lg transition-all duration-300 pointer-events-none select-none
            ${messageType === "success"
              ? "bg-green-100 text-green-800 border border-green-400"
              : messageType === "error"
              ? "bg-red-100 text-red-800 border border-red-400"
              : "bg-gray-100 text-gray-800 border"}
          `}
          style={{ minWidth: 300, maxWidth: 500 }}
        >
          {message}
        </div>
      )}

      {/* Filtres */}
      <div className="bg-gray-800 p-4 rounded mb-8 flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
        <div className="flex flex-col">
          <label className="text-white mb-1">Titre</label>
          <input
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Titre..."
            className="px-3 py-2 rounded bg-gray-900 text-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white mb-1">Auteur</label>
          <select
            value={auteur}
            onChange={(e) => setAuteur(e.target.value)}
            className="px-3 py-2 rounded bg-gray-900 text-white"
          >
            <option value="">Tous les auteurs</option>
            {auteursOptions.map((a, idx) => (
              <option key={idx} value={a}>{a}</option>
            ))}
          </select>
          {auteur && <span className="text-xs text-green-400 mt-1">Filtre actif</span>}
        </div>
        <div className="flex flex-col">
          <label className="text-white mb-1">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-3 py-2 rounded bg-gray-900 text-white"
          >
            <option value="">Tous les genres</option>
            {genresOptions.map((g, idx) => (
              <option key={idx} value={g}>{g}</option>
            ))}
          </select>
          {genre && <span className="text-xs text-green-400 mt-1">Filtre actif</span>}
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => { fetchLivres(); fetchFiltres(); }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold shadow"
          >
            Filtrer
          </button>
          <button
            onClick={resetFiltres}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded font-bold shadow"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Résultats filtrés */}
      <div className="mb-4">
        {livres.length > 0 ? (
          <span className="text-sm text-black font-bold">{livres.length} livre{livres.length > 1 ? 's' : ''} trouvé{livres.length > 1 ? 's' : ''}</span>
        ) : (
          <span className="text-red-400 font-bold">Aucun livre ne correspond à vos filtres.</span>
        )}
      </div>

      {/* Ajout Livre */}
      {user?.role === "admin" && (
        <div className="bg-gray-800 p-4 rounded mb-8">
          <h3 className="text-xl text-white mb-4">➕ Ajouter un livre</h3>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <input placeholder="Titre" value={newTitre} onChange={(e) => setNewTitre(e.target.value)} className="px-3 py-2 rounded bg-gray-900 text-white" />
            <input placeholder="Auteur" value={newAuteur} onChange={(e) => setNewAuteur(e.target.value)} className="px-3 py-2 rounded bg-gray-900 text-white" />
            <input placeholder="Genre" value={newGenre} onChange={(e) => setNewGenre(e.target.value)} className="px-3 py-2 rounded bg-gray-900 text-white" />
            <button onClick={handleAjouterLivre} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">Ajouter</button>
          </div>
        </div>
      )}

      {/* Liste livres */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {livres.map((livre, idx) => {
          // Attribution cyclique des images pour tous les livres
          const bgImage = imagesBackground[idx % imagesBackground.length];
          return (
            <div
              key={livre.id}
              className="bg-gray-900 p-4 rounded shadow hover:shadow-lg transition cursor-pointer relative overflow-hidden"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '220px',
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />
              <div className="relative z-10">
                {editingId === livre.id ? (
                  <div className="space-y-2">
                    <input value={editTitre} onChange={(e) => setEditTitre(e.target.value)} className="w-full px-2 py-1 rounded bg-gray-800 text-white" />
                    <input value={editAuteur} onChange={(e) => setEditAuteur(e.target.value)} className="w-full px-2 py-1 rounded bg-gray-800 text-white" />
                    <input value={editGenre} onChange={(e) => setEditGenre(e.target.value)} className="w-full px-2 py-1 rounded bg-gray-800 text-white" />
                    <label className="text-white">
                      Disponible:
                      <input type="checkbox" checked={editDisponible} onChange={(e) => setEditDisponible(e.target.checked)} className="ml-2" />
                    </label>
                    <button onClick={handleEnregistrerModif} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded w-full">Enregistrer</button>
                  </div>
                ) : (
                  <>
                    <h3
                      className="text-xl font-bold text-green-500 mb-2 cursor-pointer underline hover:text-green-300"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedLivre(livre);
                        fetchCommentairesEtMoyenne(livre.id);
                      }}
                    >
                      {livre.titre}
                    </h3>
                    <p className="text-white">Auteur : {livre.auteur}</p>
                    <p className="text-white">Genre : {livre.genre}</p>
                    <p className="text-white">Disponible : {livre.disponible ? "Oui" : "Non"}</p>
                    {user?.role === "admin" ? (
                      <>
                        <button onClick={() => handleModifierLivre(livre)} className="mt-4 bg-amber-200 hover:bg-amber-300 text-black px-4 py-2 rounded w-full">Modifier</button>
                        <button onClick={() => handleSupprimerLivre(livre.id)} className="mt-2 bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded w-full">Supprimer</button>
                      </>
                    ) : livre.disponible && (
                      <button onClick={e => { e.stopPropagation(); handleEmprunter(livre.id); }} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">Emprunter</button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Panneau de détails du livre sélectionné */}
      {selectedLivre && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 w-full max-w-lg relative">
            <button onClick={() => setSelectedLivre(null)} className="absolute top-2 right-2 text-white text-2xl">&times;</button>
            <h3 className="text-2xl font-bold text-green-400 mb-2">{selectedLivre.titre}</h3>
            <p className="text-white mb-1">Auteur : <span className="font-semibold">{selectedLivre.auteur}</span></p>
            <p className="text-white mb-1">Genre : <span className="font-semibold">{selectedLivre.genre}</span></p>
            <p className="text-white mb-3">Disponible : {selectedLivre.disponible ? "Oui" : "Non"}</p>
            {/* Affichage moyenne étoiles */}
            <div className="mb-3">
              <span className="text-yellow-400 text-lg">
                {moyenneEtoiles ? '★'.repeat(Math.round(moyenneEtoiles)) + '☆'.repeat(5 - Math.round(moyenneEtoiles)) : 'Pas encore de note'}
              </span>
              {moyenneEtoiles && (
                <span className="ml-2 text-gray-300">({moyenneEtoiles.toFixed(1)}/5)</span>
              )}
            </div>
            {/* Section commentaires et ajout */}
            <div className="max-h-64 overflow-y-auto">
              <CommentaireSection livreId={selectedLivre.id} user={user} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}