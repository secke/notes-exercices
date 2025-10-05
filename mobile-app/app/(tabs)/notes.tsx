import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNotesStore } from '../../store/notesStore';
import { useAuthStore } from '../../store/authStore';

export default function NotesListScreen() {
  const router = useRouter();
  const { notes, isLoading, isRefreshing, syncStatus, fetchNotes, refreshNotes, deleteNote } =
    useNotesStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert('Confirmer', 'Supprimer cette note ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(id);
          await fetchNotes();
        },
      },
    ]);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const renderNote = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => router.push(`/(tabs)/note/${item.id}`)}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <View style={[
          styles.badge,
          item.visibility === 'PRIVATE' && styles.badgePrivate,
          item.visibility === 'SHARED' && styles.badgeShared,
          item.visibility === 'PUBLIC' && styles.badgePublic,
        ]}>
          <Text style={styles.badgeText}>
            {item.visibility === 'PRIVATE' ? 'Privé' :
             item.visibility === 'SHARED' ? 'Partagé' : 'Public'}
          </Text>
        </View>
      </View>

      {item.tags?.length > 0 && (
        <View style={styles.tags}>
          {item.tags.map((tag: string, index: number) => (
            <Text key={index} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.noteDate}>
        {!item.synced && '⏳ '} 
        {new Date(item.updatedAt).toLocaleDateString('fr-FR')}
      </Text>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>Supprimer</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Notes</Text>
        <View style={styles.headerRight}>
          {!syncStatus.isOnline && (
            <Text style={styles.offlineIndicator}>📵 Hors ligne</Text>
          )}
          {syncStatus.pendingOperations > 0 && (
            <Text style={styles.pendingText}>
              {syncStatus.pendingOperations} en attente
            </Text>
          )}
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Liste */}
      <FlatList
        data={notes.filter(n => !n.pendingDelete)}
        renderItem={renderNote}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshNotes} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune note</Text>
            <Text style={styles.emptySubtext}>
              {isLoading ? 'Chargement...' : 'Créez votre première note'}
            </Text>
          </View>
        }
      />

      {/* Bouton Créer */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/note/new')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  offlineIndicator: {
    fontSize: 12,
    color: '#f59e0b',
  },
  pendingText: {
    fontSize: 12,
    color: '#666',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
  },
  list: {
    padding: 15,
  },
  noteCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgePrivate: {
    backgroundColor: '#e5e7eb',
  },
  badgeShared: {
    backgroundColor: '#dbeafe',
  },
  badgePublic: {
    backgroundColor: '#d1fae5',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: '#666',
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontSize: 14,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});