import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { TaskService } from "@/../../services/task.service";

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<any>(null);
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

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  if (!task) {
    return <Text>Task tidak ditemukan</Text>;
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {task.title}
      </Text>

      <Text style={{ marginTop: 8 }}>
        {task.description || "-"}
      </Text>

      <Text style={{ marginTop: 8 }}>
        Priority: {task.priority || "-"}
      </Text>
    </View>
  );
}
