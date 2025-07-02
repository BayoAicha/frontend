import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import CommentaireSection from "./commentaireSection";

export default function LivresListe() {
  const [livres, setLivres] = useState([]);
  const [message, setMessage] = useState("");
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

  // Récupère dynamiquement les genres/auteurs selon les filtres
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

  // Récupère les livres selon filtres
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
  }, [fetchLivres, fetchFiltres]);

  const resetFiltres = () => {
    setTitre("");
    setAuteur("");
    setGenre("");
    setMessage("");
  };

  const handleEmprunter = async (livreId) => {
    if (user?.role === "admin") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ Veuillez vous connecter.");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      await axios.post(
        "http://localhost:5000/api/emprunts",
        {
          utilisateur_id: decoded.id,
          livre_id: livreId,
          date_retour: "2025-07-30",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(" Livre emprunté !");
      fetchLivres();
      fetchFiltres();
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur emprunt.");
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
      setMessage("✅ Livre ajouté !");
      setNewTitre("");
      setNewAuteur("");
      setNewGenre("");
      fetchLivres();
      fetchFiltres();
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur ajout.");
    }
  };

  const handleSupprimerLivre = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(`http://localhost:5000/api/livres/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Livre supprimé !");
      fetchLivres();
      fetchFiltres();
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur suppression.");
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
      setMessage("✅ Livre modifié !");
      setEditingId(null);
      fetchLivres();
      fetchFiltres();
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur modif.");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-6 text-white">📚 Liste des Livres</h2>
      {message && <div className="mb-4 text-green-500 font-bold">{message}</div>}

      {/* Filtres */}
      <div className="bg-gray-800 p-4 rounded mb-8 flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
        <div className="flex flex-col">
          <label className="text-white mb-1">Titre</label>
          <input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Titre..." className="px-3 py-2 rounded bg-gray-900 text-white" />
        </div>
        <div className="flex flex-col">
          <label className="text-white mb-1">Auteur</label>
          <select value={auteur} onChange={(e) => setAuteur(e.target.value)} className="px-3 py-2 rounded bg-gray-900 text-white">
            <option value="">Tous les auteurs</option>
            {auteursOptions.map((a, idx) => (
              <option key={idx} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-white mb-1">Genre</label>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="px-3 py-2 rounded bg-gray-900 text-white">
            <option value="">Tous les genres</option>
            {genresOptions.map((g, idx) => (
              <option key={idx} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => { fetchLivres(); fetchFiltres(); }} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">Filtrer</button>
          <button onClick={resetFiltres} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">Réinitialiser</button>
        </div>
      </div>

      {/* Ajouter livre admin */}
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
        {livres.map((livre) => (
          <div key={livre.id} className="bg-gray-900 p-4 rounded shadow hover:shadow-lg transition">
            {editingId === livre.id ? (
              <div className="space-y-2">
                <input value={editTitre} onChange={(e) => setEditTitre(e.target.value)} className="w-full px-2 py-1 rounded bg-gray-800 text-white" />
                <input value={editAuteur} onChange={(e) => setEditAuteur(e.target.value)} className="w-full px-2 py-1 rounded bg-gray-800 text-white" />
                <input value={editGenre} onChange={(e) => setEditGenre(e.target.value)} className="w-full px-2 py-1 rounded bg-gray-800 text-white" />
                <label className="text-white">Disponible: <input type="checkbox" checked={editDisponible} onChange={(e) => setEditDisponible(e.target.checked)} className="ml-2" /></label>
                <button onClick={handleEnregistrerModif} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded w-full">Enregistrer</button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-green-500 mb-2">{livre.titre}</h3>
                <p className="text-white">Auteur : {livre.auteur}</p>
                <p className="text-white">Genre : {livre.genre}</p>
                <p className="text-white">Disponible : {livre.disponible ? "Oui" : "Non"}</p>
                {user?.role === "admin" ? (
                  <>
                    <button onClick={() => handleModifierLivre(livre)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">Modifier</button>
                    <button onClick={() => handleSupprimerLivre(livre.id)} className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full">Supprimer</button>
                  </>
                ) : livre.disponible && (
                  <button onClick={() => handleEmprunter(livre.id)} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">Emprunter</button>
                )}
                {/* 🔑 Section Commentaires */}
                <CommentaireSection livreId={livre.id} user={user} />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}