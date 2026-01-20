import { Pressable, Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();

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
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <Pressable 
      style={styles.card}
      onPress={() => router.push(`/tasks/${task.id}`)}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {task.title}
          </Text>
          {task.isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓</Text>
            </View>
          )}
        </View>
        {task.description && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.metaRow}>
          {task.category && (
            <View style={[
              styles.categoryBadge,
              task.category.color && { backgroundColor: task.category.color }
            ]}>
              <Text style={styles.categoryText}>
                {task.category.name}
              </Text>
            </View>
          )}
          
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
              {task.priority}
            </Text>
          </View>
        </View>

        {task.dueDate && (
          <Text style={styles.dueDate}>
            📅 {formatDate(task.dueDate)}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  completedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  categoryText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  dueDate: {
    fontSize: 12,
    color: '#6b7280',
  },
});