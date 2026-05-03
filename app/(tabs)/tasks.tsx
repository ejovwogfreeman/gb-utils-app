import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/styles";

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem("tasks");
    if (data) setTasks(JSON.parse(data));
  };

  const saveTasks = async (items: Task[]) => {
    setTasks(items);
    await AsyncStorage.setItem("tasks", JSON.stringify(items));
  };

  const addTask = () => {
    if (!taskText.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
    };

    saveTasks([newTask, ...tasks]);
    setTaskText("");
    setModalVisible(false);
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    saveTasks(updated);
  };

  const filteredTasks = tasks.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <Text style={styles.greeting}>
          Task Tracker <Ionicons name="checkbox" size={28} color="#00b4d8" />
        </Text>
        <Text style={styles.subGreeting}>Manage your daily goals</Text>

        {/* SEARCH */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: 10,
            paddingHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <Ionicons name="search" size={18} color="#00b4d8" />

          <TextInput
            placeholder="Search tasks..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, color: "#fff", padding: 10 }}
          />

          {/* CLEAR ICON */}
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color="#00b4d8" />
            </TouchableOpacity>
          )}
        </View>

        {/* ADD BUTTON */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            backgroundColor: "#00b4d8",
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "#000", fontWeight: "bold" }}>+ Add Task</Text>
        </TouchableOpacity>

        {/* TASK LIST (SCROLLVIEW) */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredTasks.length === 0 ? (
            <Text style={{ color: "#aaa", textAlign: "center", marginTop: 20 }}>
              No tasks found
            </Text>
          ) : (
            filteredTasks.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  padding: 15,
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              >
                {/* TEXT */}
                <TouchableOpacity
                  onPress={() => toggleComplete(item.id)}
                  style={{ flex: 1 }}
                >
                  <Text
                    style={{
                      color: item.completed ? "#00b4d8" : "#fff",
                      textDecorationLine: item.completed
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>

                {/* DELETE */}
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                  <Ionicons name="trash" size={20} color="#ff595e" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>

        {/* MODAL */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#0d1b2a",
                padding: 20,
                borderRadius: 15,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, marginBottom: 10 }}>
                Add New Task
              </Text>

              <TextInput
                placeholder="Enter task..."
                placeholderTextColor="#aaa"
                value={taskText}
                onChangeText={setTaskText}
                style={styles.inputStyle}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 15,
                }}
              >
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={[styles.btn, { backgroundColor: "#ff595e" }]}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={addTask}
                  style={[styles.btn, { backgroundColor: "#00b4d8" }]}
                >
                  <Text style={{ textAlign: "center", color: "#000" }}>
                    Add
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
