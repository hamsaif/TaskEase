import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TaskService } from "@/services/task.service";
import { Task } from "@/types/task";

export default function TaskDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    TaskService.getById(Number(id))
      .then(res => {
        if (res.success) {
          setTask(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Ganti fungsi toggleComplete dan tambahkan fungsi baru
const handleDelete = async () => {
  if (!task) return;

  Alert.alert(
    "Hapus Task",
    "Apakah kamu yakin ingin menghapus task ini? Tindakan ini tidak dapat dibatalkan.",
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
            const res = await TaskService.delete(task.id);
            if (res.success) {
              Alert.alert("Berhasil", "Task berhasil dihapus", [
                { text: "OK", onPress: () => router.back() }
              ]);
            } else {
              Alert.alert("Error", res.message || "Gagal menghapus task");
            }
          } catch (error) {
            console.error("Error deleting task:", error);
            Alert.alert("Error", "Terjadi kesalahan saat menghapus task");
          }
        }
      }
    ]
  );
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
        <View style={styles.titleRow}>
          <Text style={styles.title}>{task.title}</Text>
          {task.isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Selesai</Text>
            </View>
          )}
        </View>

        {task.description && (
          <Text style={styles.description}>{task.description}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detail</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Prioritas</Text>
          <View style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(task.priority) + '20' }
          ]}>
            <View style={[
              styles.priorityDot,
              { backgroundColor: getPriorityColor(task.priority) }
            ]} />
            <Text style={[
              styles.priorityText,
              { color: getPriorityColor(task.priority) }
            ]}>
              {task.priority.toUpperCase()}
            </Text>
          </View>
        </View>

        {task.category && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kategori</Text>
            <View style={[
              styles.categoryBadge,
              task.category.color && { backgroundColor: task.category.color }
            ]}>
              <Text style={styles.categoryText}>
                {task.category.name}
              </Text>
            </View>
          </View>
        )}

        {task.dueDate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Due Date</Text>
            <Text style={styles.detailValue}>
              📅 {formatDate(task.dueDate)}
            </Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Dibuat</Text>
          <Text style={styles.detailValue}>
            {formatDate(task.createdAt)}
          </Text>
        </View>
      </View>

      {task.subtasks && task.subtasks.length > 0 && (
        <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonEdit]}
          onPress={() => router.push(`/tasks/edit/${task.id}`)}
        >
          <Text style={[styles.actionButtonText, styles.actionButtonTextEdit]}>
            ✏️ Edit Task
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            task.isCompleted ? styles.actionButtonSecondary : styles.actionButtonPrimary
          ]}
          onPress={toggleComplete}
        >
          <Text style={[
            styles.actionButtonText,
            task.isCompleted && styles.actionButtonTextSecondary
          ]}>
            {task.isCompleted ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonDanger]}
          onPress={handleDelete}
        >
          <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>
            🗑️ Hapus Task
          </Text>
        </TouchableOpacity>
      </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            task.isCompleted ? styles.actionButtonSecondary : styles.actionButtonPrimary
          ]}
          onPress={toggleComplete}
        >
          <Text style={[
            styles.actionButtonText,
            task.isCompleted && styles.actionButtonTextSecondary
          ]}>
            {task.isCompleted ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonDanger]}
          onPress={() => {
            // TODO: Implement delete
            console.log("Delete task");
          }}
        >
          <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>
            Hapus Task
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    actionButtonEdit: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  actionButtonTextEdit: {
    color: '#0a7ea4',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  completedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#10b981',
    borderRadius: 6,
  },
  completedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  categoryText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subtaskText: {
    fontSize: 15,
    color: '#111827',
    flex: 1,
  },
  subtaskCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: '#0a7ea4',
  },
  actionButtonSecondary: {
    backgroundColor: '#e5e7eb',
  },
  actionButtonDanger: {
    backgroundColor: '#fee2e2',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  actionButtonTextSecondary: {
    color: '#374151',
  },
  actionButtonTextDanger: {
    color: '#dc2626',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
