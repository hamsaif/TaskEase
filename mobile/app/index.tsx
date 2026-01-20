import { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator 
} from "react-native";
import { useRouter } from "expo-router";
import { TaskService } from "@/services/task.service";
import { Task } from "@/types/task";

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await TaskService.getAll();
      if (res.success) {
        setTasks(res.data || []);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const pendingTasks = tasks.filter(t => !t.isCompleted).length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.isCompleted).length;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Selamat Datang! 👋</Text>
        <Text style={styles.subtitle}>Kelola tugasmu dengan mudah</Text>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.statCardPrimary]}>
          <Text style={styles.statNumber}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>
        
        <View style={[styles.statCard, styles.statCardSuccess]}>
          <Text style={styles.statNumber}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Selesai</Text>
        </View>
        
        <View style={[styles.statCard, styles.statCardWarning]}>
          <Text style={styles.statNumber}>{pendingTasks}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {highPriorityTasks > 0 && (
        <View style={styles.alertCard}>
          <Text style={styles.alertText}>
            ⚠️ Kamu punya {highPriorityTasks} tugas dengan prioritas tinggi!
          </Text>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/tasks')}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Lihat Semua</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/categories')}
          >
            <Text style={styles.actionIcon}>🏷️</Text>
            <Text style={styles.actionText}>Kategori</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Tasks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Tasks</Text>
          <TouchableOpacity onPress={() => router.push('/tasks')}>
            <Text style={styles.seeAllText}>Lihat semua →</Text>
          </TouchableOpacity>
        </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>Belum ada task</Text>
            <Text style={styles.emptySubtext}>
              Buat task pertama kamu sekarang!
            </Text>
          </View>
        ) : (
          tasks.slice(0, 5).map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskItem}
              onPress={() => router.push(`/tasks/${task.id}`)}
            >
              <View style={styles.taskItemContent}>
                <Text style={[
                  styles.taskItemTitle,
                  task.isCompleted && styles.taskItemCompleted
                ]}>
                  {task.isCompleted ? '✓ ' : ''}{task.title}
                </Text>
                {task.category && (
                  <Text style={styles.taskItemCategory}>
                    {task.category.name}
                  </Text>
                )}
              </View>
              <View style={[
                styles.priorityIndicator,
                { backgroundColor: 
                  task.priority === 'high' ? '#ef4444' :
                  task.priority === 'medium' ? '#f59e0b' : '#10b981'
                }
              ]} />
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
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
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statCardPrimary: {
    backgroundColor: '#0a7ea4',
  },
  statCardSuccess: {
    backgroundColor: '#10b981',
  },
  statCardWarning: {
    backgroundColor: '#f59e0b',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  alertCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  alertText: {
    fontSize: 14,
    color: '#92400e',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#0a7ea4',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  taskItemContent: {
    flex: 1,
  },
  taskItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  taskItemCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  taskItemCategory: {
    fontSize: 12,
    color: '#6b7280',
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
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
});