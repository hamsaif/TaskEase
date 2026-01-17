// app/index.tsx
import { useEffect } from "react";
import { Text, View } from "react-native";
import { TaskService } from "@/services/task.service";

export default function Home() {
  useEffect(() => {
    TaskService.getAll().then(console.log);
  }, []);

  return (
    <View>
      <Text>Testing API</Text>
    </View>
  );
}
