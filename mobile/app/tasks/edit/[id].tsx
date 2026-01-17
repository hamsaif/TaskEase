// Tambahkan import Alert di bagian atas
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";

// ... existing code ...

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

// Update bagian actions di return statement (ganti bagian yang ada di baris 180-207):
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

// Tambahkan style baru di bagian StyleSheet:
  actionButtonEdit: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  actionButtonTextEdit: {
    color: '#0a7ea4',
  },
