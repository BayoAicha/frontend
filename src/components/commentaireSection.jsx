import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function CommentaireSection({ livreId, user }) {
  const [commentaires, setCommentaires] = useState([]);
  const [note, setNote] = useState(3);
  const [comment, setComment] = useState("");

  // Correction : useCallback pour la fonction
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
          user_id: decoded.id,
          livre_id: livreId,
          note,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNote(3);
      setComment("");
      fetchCommentaires();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-white font-bold mb-2">Commentaires</h4>
      {commentaires.length === 0 && <p className="text-gray-400">Aucun commentaire.</p>}
      <ul className="text-white mb-2">
        {commentaires.map((c) => (
          <li key={c.id} className="border-b border-gray-700 pb-2 mb-2">
            <p className="font-semibold">{c.utilisateur} ({c.note}/5)</p>
            <p>{c.comment}</p>
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