import { useState, useEffect, useCallback } from "react";
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
import { TaskService } from "@/services/task.service";
import { CategoryService } from "@/services/category.service";
import { Task } from "@/types/task";
import { Category } from "@/types/category";

export default function EditTask() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const res = await CategoryService.getAll();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

  const loadTask = useCallback(async () => {
    try {
      const res = await TaskService.getById(Number(id));
      if (res.success) {
        const taskData = res.data;
        setTask(taskData);
        setTitle(taskData.title || "");
        setDescription(taskData.description || "");
        setPriority(taskData.priority || "medium");
        setDueDate(
          taskData.dueDate
            ? new Date(taskData.dueDate).toISOString().split("T")[0]
            : ""
        );
        setCategoryId(taskData.categoryId || null);
      } else {
        Alert.alert("Error", "Task tidak ditemukan", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error("Error loading task:", error);
      Alert.alert("Error", "Gagal memuat task");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      loadTask();
      loadCategories();
    }
  }, [id, loadTask, loadCategories]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title wajib diisi");
      return;
    }

    if (!task) return;

    setSaving(true);
    try {
      const taskData: any = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        categoryId: categoryId || undefined,
      };

      // Include dueDate only if it's provided
      if (dueDate) {
        taskData.dueDate = dueDate;
      }

      const res = await TaskService.update(task.id, taskData);

      if (res.success) {
        Alert.alert("Berhasil", "Task berhasil diupdate", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", res.message || "Gagal mengupdate task");
      }
    } catch (error: any) {
      console.error("Error updating task:", error);
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

  if (!task) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Task tidak ditemukan</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Task</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan title task"
            value={title}
            onChangeText={setTitle}
            editable={!saving}
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
            editable={!saving}
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
                disabled={saving}
              >
                <View
                  style={[
                    styles.radioCircle,
                    priority === p && styles.radioCircleActive,
                    priority === p && {
                      backgroundColor:
                        p === "high"
                          ? "#ef4444"
                          : p === "medium"
                          ? "#f59e0b"
                          : "#10b981",
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.radioText,
                    priority === p && styles.radioTextActive,
                  ]}
                >
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
            editable={!saving}
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
                  onPress={() =>
                    setCategoryId(categoryId === cat.id ? null : cat.id)
                  }
                  disabled={saving}
                >
                  {cat.color && (
                    <View
                      style={[styles.colorDot, { backgroundColor: cat.color }]}
                    />
                  )}
                  <Text
                    style={[
                      styles.categoryText,
                      categoryId === cat.id && styles.categoryTextActive,
                    ]}
                  >
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
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              Batal
            </Text>
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
