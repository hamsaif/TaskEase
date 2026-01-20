import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl
} from "react-native";
import { useRouter } from "expo-router";
import { CategoryService } from "@/services/category.service";
import { Category } from "@/types/category";

export default function CategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await CategoryService.getAll();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCategories();
  };

  const handleDelete = async (category: Category) => {
    Alert.alert(
      "Hapus Kategori",
      `Apakah kamu yakin ingin menghapus kategori "${category.name}"? Tindakan ini tidak dapat dibatalkan.`,
      [
        {
          text: "Batal",
          style: "cancel"
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await CategoryService.delete(category.id);
              if (res.success) {
                Alert.alert("Berhasil", "Kategori berhasil dihapus");
                loadCategories(); // Refresh list
              } else {
                Alert.alert("Error", res.message || "Gagal menghapus kategori");
              }
            } catch (error) {
              console.error("Error deleting category:", error);
              Alert.alert("Error", "Terjadi kesalahan saat menghapus kategori");
            }
          }
        }
      ]
    );
  };

  const handleEdit = (category: Category) => {
    router.push(`/categories/edit/${category.id}`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {categories.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏷️</Text>
          <Text style={styles.emptyText}>Belum ada kategori</Text>
          <Text style={styles.emptySubtext}>
            Buat kategori pertama kamu sekarang!
          </Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.categoryCard}>
              <View style={[
                styles.colorIndicator,
                item.color && { backgroundColor: item.color }
              ]} />
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categoryDate}>
                  Dibuat {new Date(item.createdAt).toLocaleDateString('id-ID')}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDelete(item)}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/categories/create')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  categoryDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  editIcon: {
    fontSize: 20,
  },
  deleteIcon: {
    fontSize: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});
