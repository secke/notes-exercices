import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useNotesStore } from '../store/notesStore';
import { PlusCircle, Search, LogOut, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const {
    notes,
    fetchNotes,
    deleteNote,
    isLoading,
    searchQuery,
    selectedVisibility,
    selectedTag,
    setSearchQuery,
    setSelectedVisibility,
    setSelectedTag,
    clearFilters,
    currentPage,
    totalPages,
  } = useNotesStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await deleteNote(id);
        toast.success('Note supprimée');
        fetchNotes(currentPage);
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Extraire tous les tags uniques des notes
  const availableTags = Array.from(
    new Set(notes.flatMap(note => note.tags))
  ).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mes Notes</h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/notes/new')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <PlusCircle size={20} />
                Nouvelle note
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                <LogOut size={20} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher une note..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={selectedVisibility}
              onChange={(e) => setSelectedVisibility(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les visibilités</option>
              <option value="PRIVATE">Privées</option>
              <option value="SHARED">Partagées</option>
              <option value="PUBLIC">Publiques</option>
            </select>

            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Rechercher
            </button>
            
            <button
              type="button"
              onClick={clearFilters}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Réinitialiser
            </button>
          </form>
        </div>

        {/* Liste des notes */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="flex gap-2 mb-3">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="flex gap-2">
                  <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                  <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune note</h3>
            <p className="mt-2 text-gray-600">
              Commencez par créer votre première note
            </p>
            <button
              onClick={() => navigate('/notes/new')}
              className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <PlusCircle size={20} />
              Créer une note
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/notes/${note.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                    {note.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      note.visibility === 'PRIVATE'
                        ? 'bg-gray-200 text-gray-700'
                        : note.visibility === 'SHARED'
                        ? 'bg-blue-200 text-blue-700'
                        : 'bg-green-200 text-green-700'
                    }`}
                  >
                    {note.visibility === 'PRIVATE'
                      ? 'Privé'
                      : note.visibility === 'SHARED'
                      ? 'Partagé'
                      : 'Public'}
                  </span>
                </div>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-sm text-gray-500 mb-3">
                  Modifié le {new Date(note.updatedAt).toLocaleDateString('fr-FR')}
                </p>

                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => navigate(`/notes/${note.id}/edit`)}
                    className="flex-1 px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="flex-1 px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => fetchNotes(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="px-4 py-2 bg-white border border-gray-300 rounded-md">
              Page {currentPage + 1} sur {totalPages}
            </span>
            <button
              onClick={() => fetchNotes(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
