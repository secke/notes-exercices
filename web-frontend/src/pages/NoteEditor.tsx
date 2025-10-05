import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotesStore } from '../store/notesStore';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Save, Eye, EyeOff, Share2, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { shareApi } from '../lib/api';

export default function NoteEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { currentNote, fetchNoteById, createNote, updateNote } = useNotesStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'PRIVATE' | 'SHARED' | 'PUBLIC'>('PRIVATE');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Share modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [publicLink, setPublicLink] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      fetchNoteById(parseInt(id));
    }
  }, [id, isEditing]);

  useEffect(() => {
    if (currentNote && isEditing) {
      setTitle(currentNote.title);
      setContent(currentNote.contentMd || '');
      setTags(currentNote.tags.join(', '));
      setVisibility(currentNote.visibility);
      
      if (currentNote.publicLink) {
        setPublicLink(`${window.location.origin}/p/${currentNote.publicLink.urlToken}`);
      }
    }
  }, [currentNote, isEditing]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    setIsSaving(true);
    try {
      const noteData = {
        title: title.trim(),
        contentMd: content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        ...(isEditing && { visibility }),
      };

      if (isEditing && id) {
        await updateNote(parseInt(id), noteData);
        toast.success('Note mise à jour');
      } else {
        const newNote = await createNote(noteData);
        toast.success('Note créée');
        navigate(`/notes/${newNote.id}`);
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareWithUser = async () => {
    if (!shareEmail.trim() || !id) return;

    try {
      await shareApi.shareWithUser(parseInt(id), shareEmail.trim());
      toast.success(`Note partagée avec ${shareEmail}`);
      setShareEmail('');
      fetchNoteById(parseInt(id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur de partage');
    }
  };

  const handleGeneratePublicLink = async () => {
    if (!id) return;

    try {
      const link = await shareApi.createPublicLink(parseInt(id));
      const fullUrl = `${window.location.origin}/p/${link.urlToken}`;
      setPublicLink(fullUrl);
      toast.success('Lien public généré');
      fetchNoteById(parseInt(id));
    } catch (error) {
      toast.error('Erreur lors de la génération du lien');
    }
  };

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicLink);
    toast.success('Lien copié dans le presse-papiers');
  };

  const handleRevokePublicLink = async () => {
    if (!currentNote?.publicLink?.id || !id) return;

    if (!window.confirm('Voulez-vous vraiment révoquer ce lien public ?')) return;

    try {
      await shareApi.deletePublicLink(currentNote.publicLink.id);
      setPublicLink('');
      toast.success('Lien public révoqué');
      fetchNoteById(parseInt(id));
    } catch (error) {
      toast.error('Erreur lors de la révocation du lien');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                Retour
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Modifier la note' : 'Nouvelle note'}
              </h1>
            </div>

            <div className="flex gap-3">
              {isEditing && (
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  <Share2 size={20} />
                  Partager
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={20} />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métadonnées */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de la note"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="travail, important, projet"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibilité
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PRIVATE">Privée</option>
                  <option value="SHARED">Partagée</option>
                  <option value="PUBLIC">Publique</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Éditeur Markdown */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Contenu (Markdown)</h2>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
              {showPreview ? 'Éditer' : 'Prévisualiser'}
            </button>
          </div>

          {showPreview ? (
            <div className="p-6 prose max-w-none">
              <ReactMarkdown>{content || '*Aucun contenu*'}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écrivez votre note en Markdown..."
              className="w-full p-6 border-0 focus:ring-0 resize-none font-mono"
              rows={20}
            />
          )}
        </div>
      </main>

      {/* Modal de partage */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Partager la note</h2>

            {/* Partage avec utilisateur */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Partager avec un utilisateur</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleShareWithUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Partager
                </button>
              </div>
            </div>

            {/* Lien public */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Lien public</h3>
              {publicLink ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={publicLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                    <button
                      onClick={copyPublicLink}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Copier
                    </button>
                  </div>
                  <button
                    onClick={handleRevokePublicLink}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Révoquer le lien public
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGeneratePublicLink}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <LinkIcon size={20} />
                  Générer un lien
                </button>
              )}
            </div>

            {/* Partages existants */}
            {currentNote?.shares && currentNote.shares.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Partagé avec :</h3>
                <ul className="space-y-1">
                  {currentNote.shares.map((share) => (
                    <li key={share.id} className="text-sm text-gray-600">
                      • {share.sharedWithEmail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
