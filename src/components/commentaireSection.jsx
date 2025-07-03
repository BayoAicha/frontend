import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function CommentaireSection({ livreId, user }) {
  const [commentaires, setCommentaires] = useState([]);
  const [note, setNote] = useState(3);
  const [comment, setComment] = useState("");

  // Utilisation de useCallback pour la fonction
  // fetchCommentaires afin de ne pas la recréer à chaque rendu
  // Utilisation de useCallback pour la fonction
  // fetchCommentaires afin de ne pas la recréer à chaque rendu
  const fetchCommentaires = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/commentaires/${livreId}`);
      setCommentaires(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [livreId]);

  useEffect(() => {
    fetchCommentaires();
  }, [fetchCommentaires]);

  const handleAjouterCommentaire = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      await axios.post(
        `http://localhost:5000/api/commentaires`,
        {
          livre_id: livreId,
          note,
          commentaire: comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNote(3);
      setComment("");
      fetchCommentaires();
    } catch (err) {
      console.error("Erreur Axios:", err);
      if (err.response) {
        console.error("Réponse backend:", err.response.data);
        alert(JSON.stringify(err.response.data));
      }
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-white font-bold mb-2">Commentaires</h4>
      {commentaires.length === 0 && <p className="text-gray-400">Aucun commentaire.</p>}
      <ul className="text-white mb-2">
        {commentaires.map((c) => (
          <li key={c.id} className="flex items-start space-x-3 border-b border-gray-700 pb-3 mb-3">
            {/* Avatar cercle avec initiale */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-xl font-bold text-white">
              {c.utilisateur ? c.utilisateur[0].toUpperCase() : '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-green-400">{c.utilisateur}</span>
                {/* Note en étoiles */}
                <span className="text-yellow-400">
                  {c.note ? '★'.repeat(c.note) + '☆'.repeat(5 - c.note) : ''}
                </span>
                {/* Date si disponible */}
                {c.crée_le && (
                  <span className="text-xs text-gray-400 ml-2">{new Date(c.crée_le).toLocaleDateString()}</span>
                )}
              </div>
              <p className="mt-1 text-gray-200">{c.commentaire || c.comment}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Formulaire */}
      {user && user.role !== "admin" && (
        <div className="mt-2">
          <label className="block text-white mb-1">Note (1 à 5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={note}
            onChange={(e) => setNote(Number(e.target.value))}
            className="px-2 py-1 rounded bg-gray-800 text-white w-full mb-2"
          />
          <textarea
            rows="2"
            placeholder="Votre commentaire..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-2 py-1 rounded bg-gray-800 text-white mb-2"
          />
          <button
            onClick={handleAjouterCommentaire}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
          >
            Envoyer
          </button>
        </div>
      )}
    </div>
  );
}
