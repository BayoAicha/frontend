import { useEffect, useState } from "react";
import axios from "axios";
//Systèm de notification pour les utilisateurs etudiants
// Affiche les notifications reçues par l'utilisateur
// Utilise useState pour gérer l'état des notifications
export default function NotificationsBloc() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchNotif = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        setNotifications([]);
      }
    };
    fetchNotif();
  }, []);
  // Si pas de notifications, on ne rend rien
  // Si pas de token, on ne fait rien
  // Si erreur lors de la récupération, on vide les notifications

  if (!notifications.length) return null;

  return (
    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-900 p-4 mt-6 w-full max-w-md rounded shadow">
      <h3 className="font-bold mb-2">Notifications reçues</h3>
      <ul className="space-y-2">
        {notifications.map((n) => (
          <li key={n.id} className="text-sm">
            <span className="font-semibold">{new Date(n.date_envoi).toLocaleDateString()} :</span> {n.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
