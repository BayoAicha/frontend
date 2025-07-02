export default function Maison() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <h1 className="text-4xl font-bold text-green-500 mb-4">
        Bienvenue dans la Bibliothèque 📚
      </h1>
      <p className="text-white text-lg max-w-2xl text-center">
        Cette plateforme vous permet de consulter la liste des livres disponibles,
        de gérer vos emprunts, de laisser des commentaires et plus encore.
        Connectez-vous ou inscrivez-vous pour commencer !
      </p>
    </div>
  );
}
