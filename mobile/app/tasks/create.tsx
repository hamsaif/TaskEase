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
import { useRouter } from "expo-router";
import { TaskService } from "@/services/task.service";
import { CategoryService } from "@/services/category.service";
import { Category } from "@/types/category";

export default function CreateTask() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [userId, setUserId] = useState(1); // Hardcode untuk sementara, bisa dari context/state nanti

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
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title wajib diisi");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID tidak valid");
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
        userId,
        categoryId: categoryId || undefined,
      };

      const res = await TaskService.create(taskData);

      if (res.success) {
        Alert.alert("Berhasil", "Task berhasil dibuat", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("Error", res.message || "Gagal membuat task");
      }
    } catch (error: any) {
      console.error("Error creating task:", error);
      Alert.alert("Error", error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buat Task Baru</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan title task"
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Masukkan deskripsi task (opsional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.radioGroup}>
            {(["low", "medium", "high"] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.radioButton,
                  priority === p && styles.radioButtonActive,
                ]}
                onPress={() => setPriority(p)}
                disabled={loading}
              >
                <View style={[
                  styles.radioCircle,
                  priority === p && styles.radioCircleActive,
                  priority === p && { backgroundColor:
                    p === 'high' ? '#ef4444' :
                    p === 'medium' ? '#f59e0b' : '#10b981'
                  }
                ]} />
                <Text style={[
                  styles.radioText,
                  priority === p && styles.radioTextActive,
                ]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Due Date (opsional)</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD (contoh: 2024-12-31)"
            value={dueDate}
            onChangeText={setDueDate}
            editable={!loading}
          />
          <Text style={styles.hint}>Format: YYYY-MM-DD</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category (opsional)</Text>
          <View style={styles.categoryContainer}>
            {categories.length === 0 ? (
              <Text style={styles.emptyText}>Tidak ada kategori</Text>
            ) : (
              categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    categoryId === cat.id && styles.categoryChipActive,
                    cat.color && { borderColor: cat.color },
                  ]}
                  onPress={() => setCategoryId(categoryId === cat.id ? null : cat.id)}
                  disabled={loading}
                >
                  {cat.color && (
                    <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
                  )}
                  <Text style={[
                    styles.categoryText,
                    categoryId === cat.id && styles.categoryTextActive,
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Buat Task</Text>
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
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  hint: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 12,
  },
  radioButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  radioButtonActive: {
    borderColor: "#0a7ea4",
    backgroundColor: "#eff6ff",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    marginRight: 8,
  },
  radioCircleActive: {
    borderColor: "transparent",
  },
  radioText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  radioTextActive: {
    color: "#111827",
    fontWeight: "600",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  categoryChipActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#0a7ea4",
    borderWidth: 2,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: "#374151",
  },
  categoryTextActive: {
    color: "#0a7ea4",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
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
