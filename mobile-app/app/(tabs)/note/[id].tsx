import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { useNotesStore } from '../../../store/notesStore';

export default function NoteEditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';

  const { currentNote, getNoteById, createNote, updateNote } = useNotesStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      getNoteById(parseInt(id));
    }
  }, [id, isNew]);

  useEffect(() => {
    if (currentNote && !isNew) {
      setTitle(currentNote.title);
      setContent(currentNote.contentMd || '');
      setTags(currentNote.tags?.join(', ') || '');
    }
  }, [currentNote, isNew]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Le titre est requis');
      return;
    }

    setIsSaving(true);
    try {
      const noteData = {
        title: title.trim(),
        contentMd: content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
      };

      if (isNew) {
        await createNote(noteData);
        Alert.alert('Succès', 'Note créée', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        await updateNote(parseInt(id!), noteData);
        Alert.alert('Succès', 'Note mise à jour', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isNew ? 'Nouvelle note' : 'Modifier'}
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          <Text style={[styles.saveText, isSaving && styles.saveTextDisabled]}>
            {isSaving ? '...' : 'Sauvegarder'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Titre */}
        <TextInput
          style={styles.titleInput}
          placeholder="Titre"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
        />

        {/* Tags */}
        <TextInput
          style={styles.tagsInput}
          placeholder="Tags (séparés par virgules)"
          value={tags}
          onChangeText={setTags}
          placeholderTextColor="#999"
        />

        {/* Toggle Preview */}
        <TouchableOpacity
          style={styles.previewToggle}
          onPress={() => setShowPreview(!showPreview)}
        >
          <Text style={styles.previewToggleText}>
            {showPreview ? '✏️ Éditer' : '👁️ Prévisualiser'}
          </Text>
        </TouchableOpacity>

        {/* Contenu */}
        {showPreview ? (
          <View style={styles.preview}>
            <Markdown>{content || '*Aucun contenu*'}</Markdown>
          </View>
        ) : (
          <TextInput
            style={styles.contentInput}
            placeholder="Contenu en Markdown..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        )}

        {/* Informations de partage */}
        {!isNew && currentNote && (
          <View style={styles.shareInfo}>
            <Text style={styles.shareTitle}>Informations de partage</Text>
            
            {currentNote.shares && currentNote.shares.length > 0 && (
              <View style={styles.shareSection}>
                <Text style={styles.shareSectionTitle}>Partagé avec :</Text>
                {currentNote.shares.map((share, index) => (
                  <Text key={index} style={styles.shareEmail}>
                    • {share.sharedWithEmail}
                  </Text>
                ))}
              </View>
            )}

            {currentNote.publicLink && (
              <View style={styles.shareSection}>
                <Text style={styles.shareSectionTitle}>Lien public :</Text>
                <Text style={styles.publicLink} numberOfLines={1}>
                  {currentNote.publicLink.fullUrl}
                </Text>
                <Text style={styles.shareNote}>
                  (Gestion complète du partage disponible sur le web)
                </Text>
              </View>
            )}

            {(!currentNote.shares || currentNote.shares.length === 0) &&
             !currentNote.publicLink && (
              <Text style={styles.noShare}>
                Cette note n'est pas partagée.
                {'\n'}Utilisez l'application web pour partager.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
  },
  saveText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  saveTextDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  tagsInput: {
    fontSize: 14,
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  previewToggle: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  previewToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentInput: {
    fontSize: 16,
    minHeight: 300,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  preview: {
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    minHeight: 300,
  },
  shareInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  shareSection: {
    marginBottom: 15,
  },
  shareSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#666',
  },
  shareEmail: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 2,
  },
  publicLink: {
    fontSize: 12,
    color: '#2563eb',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  shareNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
  noShare: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});
