import { Link } from "react-router-dom";
// Importation de React et composants nécessaires


export default function Maison() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 bg-white">
      <h1 className="text-4xl font-bold text-green-500 mb-4">
        Bienvenue dans la Bibliothèque 
      </h1>
      <p className="text-black text-lg max-w-2xl text-center mb-20 bold">
        Consultez les livres / Gérez vos emprunts / Laissez des commentaires
        <br />
        Connectez-vous ou inscrivez-vous pour commencer !
      </p>
      {/* Cadre avec deux images horizontales */}
      <div className="flex flex-row gap-12 mb-16">
        {/* Image 1 : lumière.jpeg */}
        <div className="relative w-72 h-44 rounded-xl overflow-hidden shadow-lg border-2 border-green-400 bg-gray-100 flex items-center justify-center">
          <img
            src="/lumière.jpeg"
            alt="Découvrir"
            className="w-full h-full object-cover"
          />
          <Link to="/books">
            <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white bg-black bg-opacity-40 hover:bg-opacity-60 transition cursor-pointer tracking-widest">
              DECOUVRIR
            </span>
          </Link>
        </div>
        {/* Image 2 : personnel.png */}
        <div className="relative w-72 h-44 rounded-xl overflow-hidden shadow-lg border-2 border-green-400 bg-gray-100 flex items-center justify-center">
          <img
            src="/personnel.png"
            alt="Connaître"
            className="w-full h-full object-cover"
          />
          <Link to="/profil">
            <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white bg-black bg-opacity-40 hover:bg-opacity-60 transition cursor-pointer tracking-widest">
              CONNAITRE
            </span>
          </Link>
        </div>
      </div>
      <div className="flex flex-row gap-20">
        {/* Image 1 */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-white rounded-lg flex items-center border-yellow-400 justify-center shadow-lg overflow-hidden">
            <img
              src="/Livres.jpeg"
              alt="Lire"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-green-500 font-semibold mt-3 text-xl">Lire</span>
        </div>
        {/* Image 2 */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-white rounded-lg  flex items-center justify-center shadow-lg overflow-hidden">
            <img
              src="/Etudiant.jpeg"
              alt="Apprendre"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-green-500 font-semibold mt-3 text-xl">Apprendre</span>
        </div>
        {/* Image 3 */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
            <img
              src="/Diplomation.jpeg"
              alt="Evoluer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-green-500 font-semibold mt-3 text-xl">Evoluer</span>
        </div>
      </div>
      {/* Footer amélioré */}
      <footer className="w-full mt-16 py-6 bg-gray-900 text-white text-center border-t border-gray-700">
        <div className="mb-2 font-bold text-lg">Nous contacter</div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-base">
          <a href="https://instagram.com/maBibli" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-400 transition">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="inline-block"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.771.13 4.659.402 3.678 1.383 2.697 2.364 2.425 3.476 2.367 4.757.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.058 1.281.33 2.393 1.311 3.374.981.981 2.093 1.253 3.374 1.311C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.281-.058 2.393-.33 3.374-1.311.981-.981 1.253-2.093 1.311-3.374.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.058-1.281-.33-2.393-1.311-3.374-.981-.981-2.093-1.253-3.374-1.311C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            <span className="text-green-400">maBiblio</span>
          </a>
          <a href="https://facebook.com/maBiblio" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-400 transition">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="inline-block"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            <span className="text-green-400">maBiblio</span>
          </a>
        </div>
      </footer>
    </div>
  );
}