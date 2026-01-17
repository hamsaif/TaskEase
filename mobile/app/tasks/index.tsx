// Ganti bagian FAB (baris 114-123):
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/tasks/create')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

========================================
5.Create Category Form
File: mobile/app/categories/create.tsx
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { CategoryService } from "@/services/category.service";

const PRESET_COLORS = [
  "#ef4444", "#f59e0b", "#10b981", "#3b82f6",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
];

export default function CreateCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [userId, setUserId] = useState(1); // Hardcode untuk sementara

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Nama kategori wajib diisi");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID tidak valid");
      return;
    }

    setLoading(true);
    try {
      const categoryData = {
        name: name.trim(),
        color: selectedColor || undefined,
        userId,
      };

      const res = await CategoryService.create(categoryData);

      if (res.success) {
        Alert.alert("Berhasil", "Kategori berhasil dibuat", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("Error", res.message || "Gagal membuat kategori");
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
      Alert.alert("Error", error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buat Kategori Baru</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Nama Kategori *</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama kategori"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Warna (opsional)</Text>
          <View style={styles.colorContainer}>
            {PRESET_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  selectedColor === color && styles.colorOptionActive,
                  { backgroundColor: color }
                ]}
                onPress={() => setSelectedColor(selectedColor === color ? null : color)}
                disabled={loading}
              >
                {selectedColor === color && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.hint}>Pilih warna untuk kategori ini</Text>
        </View>

          {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/tasks/create')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Buat Kategori</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  form: {
    padding: 20,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
  colorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  colorOptionActive: {
    borderColor: "#111827",
    transform: [{ scale: 1.1 }],
  },
  checkmark: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  hint: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
  },
  preview: {
    marginTop: 8,
    marginBottom: 24,
  },
  previewLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  previewChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
  },
  previewText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  previewTextWhite: {
    color: "#fff",
  },
  actions: {
    marginTop: 8,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#0a7ea4",
  },
  buttonSecondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttonTextSecondary: {
    color: "#374151",
  },
});
