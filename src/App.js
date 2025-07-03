import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Emprunts from "./pages/Emprunts";
import Livres from "./pages/Livres";
import Maison from "./pages/Maison";
import Profil from "./pages/Profil";
import Admin from "./pages/Admin"; 
//  importation des composants de pages

function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <main className="min-h-[calc(100vh-4rem)]">
        <Routes>
          <Route path="/" element={<Maison />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/books" element={<Livres />} />
          <Route path="/emprunts" element={<Emprunts />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/admin" element={<Admin />} /> {/*  ajouté */}
        </Routes>
      </main>
    </div>
  );
}
//  Composant principal de l'application
//   barre de navigation et les routes de l'application

export default App;
