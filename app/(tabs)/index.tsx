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

type Transactions = {
  id: string | number;
  title: string;
  amount: number;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [time, setTime] = useState(new Date());

  const loadData = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const storedTransactions = await AsyncStorage.getItem("transactions");

      setTasks(storedTasks ? JSON.parse(storedTasks) : []);
      setTransactions(storedTransactions ? JSON.parse(storedTransactions) : []);
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

  const balance = transactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return {
        greeting: "Good Morning ☀️",
        quote: "Start your day with focus and intention.",
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: "Good Afternoon 🌤️",
        quote: "Keep pushing, you're doing great.",
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        greeting: "Good Evening 🌆",
        quote: "Reflect on your wins today, no matter how small.",
      };
    } else {
      return {
        greeting: "Good Night 🌙",
        quote: "Rest well and recharge for tomorrow.",
      };
    }
  };

  const { greeting, quote } = getGreeting();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.greeting}>Hello Champ👋!</Text>
        <Text style={styles.timeGreeting}>{greeting}</Text>
        <Text style={styles.subGreeting}>{quote}</Text>

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

          <Text style={styles.cardValue}>₦{balance.toLocaleString()}</Text>

          <Text style={styles.cardSub}>Your current balance</Text>
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

          {transactions.length === 0 ? (
            <Text style={styles.previewText}>No transactions yet</Text>
          ) : (
            [...transactions].slice(0, 3).map((item) => (
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
