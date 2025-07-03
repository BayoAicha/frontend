import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Envoie une requête POST à l'API pour se connecter
    // Si la connexion réussit, stocke le token dans le localStorage
    // Si la connexion échoue, affiche un message d'erreur
    // Redirige l'utilisateur vers la page d'accueil après 0.8s

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        mot_de_passe, // se Connecter
      });

      console.log(res.data);
      setMessage(" Connexion réussie !!!");
      localStorage.setItem("token", res.data.token);

      setEmail("");
      setMotDePasse("");
      setTimeout(() => {
        navigate("/");
      }, 800); // Redirection après 0.8s
    } catch (err) {
      console.error(err);
      setMessage(" Échec de la connexion");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black p-8 rounded shadow-md w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl text-white mb-4">Connexion</h2>

      <div className="mb-4">
        <label className="block text-white mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="block text-white mb-1">Mot de passe</label>
        <input
          type="password"
          value={mot_de_passe}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
          className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
      >
        Se connecter
      </button>

      {message && (
        <p className="mt-4 text-white text-center">{message}</p>
      )}
    </form>
  );
}