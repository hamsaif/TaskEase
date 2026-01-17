
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

export function TaskCard({ task }: any) {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(`/tasks/${task.id}`)}>
      <Text>{task.title}</Text>
    </Pressable>
  );
}
