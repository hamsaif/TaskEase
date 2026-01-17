
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { TaskService } from "@/services/task.service";
import { Task } from "@/types/task";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    TaskService.getAll().then(res => {
      if (res.success) setTasks(res.data);
    });
  }, []);

  return (
    <FlatList
      data={tasks}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>{item.title}</Text>
        </View>
      )}
    />
  );
}
