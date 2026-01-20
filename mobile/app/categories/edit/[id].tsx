import { useState, useEffect } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { CategoryService } from "@/services/category.service";
import { Category } from "@/types/category";

const PRESET_COLORS = [
  "#ef4444", "#f59e0b", "#10b981", "#3b82f6",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
];

export default function EditCategory() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCategory();
    }
  }, [id]);

  const loadCategory = async () => {
    try {
      const res = await CategoryService.getById(Number(id));
      if (res.success) {
        const catData = res.data;
        setCategory(catData);
        setName(catData.name || "");
        setSelectedColor(catData.color || null);
      } else {
        Alert.alert("Error", "Kategori tidak ditemukan", [
          { text: "OK", onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error("Error loading category:", error);
      Alert.alert("Error", "Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Nama kategori wajib diisi");
      return;
    }

    if (!category) return;

    setSaving(true);
    try {
      const categoryData: any = {
        name: name.trim(),
      };

      // Note: API mungkin tidak support update color, sesuaikan dengan API
      // Jika API support, uncomment line di bawah:
      // categoryData.color = selectedColor || undefined;

      const res = await CategoryService.update(category.id, categoryData);

      if (res.success) {
        Alert.alert("Berhasil", "Kategori berhasil diupdate", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("Error", res.message || "Gagal mengupdate kategori");
      }
    } catch (error: any) {
      console.error("Error updating category:", error);
      Alert.alert("Error", error.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  if (!category) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Kategori tidak ditemukan</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Kategori</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Nama Kategori *</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama kategori"
            value={name}
            onChangeText={setName}
            editable={!saving}
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
                disabled={saving}
              >
                {selectedColor === color && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.hint}>Pilih warna untuk kategori ini</Text>
        </View>

        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Preview:</Text>
          <View style={[
            styles.previewChip,
            selectedColor && { backgroundColor: selectedColor }
          ]}>
            <Text style={[
              styles.previewText,
              selectedColor && styles.previewTextWhite
            ]}>
              {name || "Nama Kategori"}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Simpan Perubahan</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => router.back()}
            disabled={saving}
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  errorText: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
