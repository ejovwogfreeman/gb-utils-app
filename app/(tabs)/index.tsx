import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/styles";

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type Expense = {
  id: string | number;
  title: string;
  amount: number;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [time, setTime] = useState(new Date());

  const loadData = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const storedExpenses = await AsyncStorage.getItem("expenses");

      setTasks(storedTasks ? JSON.parse(storedTasks) : []);
      setExpenses(storedExpenses ? JSON.parse(storedExpenses) : []);
    } catch (e) {
      console.log("Error loading data");
    }
  };

  // ✅ Refresh whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();

      const interval = setInterval(() => {
        setTime(new Date());
      }, 1000);

      return () => clearInterval(interval);
    }, []),
  );

  const totalExpenses = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.greeting}>Hello User👋</Text>
        <Text style={styles.subGreeting}>Welcome back</Text>

        {/* Time Card */}
        <View style={styles.timeCard}>
          <Ionicons name="time" size={22} color="#00b4d8" />
          <Text style={styles.date}>{time.toDateString()}</Text>
          <Text style={styles.clock}>{time.toLocaleTimeString()}</Text>
        </View>

        {/* Tasks Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="checkbox" size={22} color="#00b4d8" />
            <Text style={styles.cardTitle}>Your Tasks</Text>
          </View>

          <Text style={styles.cardValue}>{tasks.length.toLocaleString()}</Text>

          <Text style={styles.cardSub}>Total tasks saved</Text>
        </View>

        {/* Expenses Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="wallet" size={22} color="#00b4d8" />
            <Text style={styles.cardTitle}>Your Balance</Text>
          </View>

          <Text style={styles.cardValue}>
            ₦{totalExpenses.toLocaleString()}
          </Text>

          <Text style={styles.cardSub}>All recorded spending</Text>
        </View>

        {/* Recent Tasks */}
        <View style={styles.previewCard}>
          <View style={[styles.row, { marginBottom: 20 }]}>
            <Ionicons name="list" size={18} color="#00b4d8" />
            <Text style={styles.previewTitle}>Recent Tasks</Text>
          </View>

          {tasks.length === 0 ? (
            <Text style={styles.previewText}>No tasks yet</Text>
          ) : (
            [...tasks].slice(0, 3).map((item) => (
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
              </View>
            ))
          )}
        </View>

        {/* Recent Expenses */}
        <View style={styles.previewCard}>
          <View style={[styles.row, { marginBottom: 20 }]}>
            <Ionicons name="cash" size={18} color="#00b4d8" />
            <Text style={styles.previewTitle}>Recent Transactions</Text>
          </View>

          {expenses.length === 0 ? (
            <Text style={styles.previewText}>No transactions yet</Text>
          ) : (
            [...expenses].slice(0, 3).map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 15,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <View>
                  <Text style={{ color: "#fff" }}>{item.title}</Text>
                  <Text
                    style={{
                      color: item.amount < 0 ? "#ff595e" : "#22c55e",
                    }}
                  >
                    ₦{Math.abs(item.amount).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
