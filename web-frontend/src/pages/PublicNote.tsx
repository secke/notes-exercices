import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { publicApi } from '../lib/api';
import ReactMarkdown from 'react-markdown';
import type { Note } from '../types';
import { FileText } from 'lucide-react';

export default function PublicNote() {
  const { token } = useParams<{ token: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      if (!token) return;

      try {
        const data = await publicApi.getNoteByToken(token);
        setNote(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Note introuvable');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
            {/* Header skeleton */}
            <div className="bg-blue-600 px-6 py-8">
              <div className="h-8 bg-blue-500 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-blue-500 rounded w-1/2"></div>
            </div>

            {/* Tags skeleton */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                <div className="h-8 bg-gray-200 rounded-full w-24"></div>
              </div>
            </div>

            {/* Contenu skeleton */}
            <div className="px-6 py-8 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Footer skeleton */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {error || 'Note introuvable'}
          </h1>
          <p className="mt-2 text-gray-600">
            Ce lien est peut-être expiré ou invalide
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-8">
            <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
            <p className="text-blue-100">
              Par {note.ownerEmail} • {new Date(note.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>

          {/* Tags */}
          {note.tags.length > 0 && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contenu */}
          <div className="px-6 py-8 prose max-w-none">
            <ReactMarkdown>{note.contentMd || '*Aucun contenu*'}</ReactMarkdown>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Cette note est partagée publiquement via Notes Collaboratives
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}