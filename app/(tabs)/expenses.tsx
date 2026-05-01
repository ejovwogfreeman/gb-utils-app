import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
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

type Expense = {
  id: string;
  title: string;
  amount: number;
};

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");

  // ✅ ADD THIS (you were using it but didn't define it)
  const [type, setType] = useState<"income" | "expense">("income");

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const data = await AsyncStorage.getItem("expenses");
    if (data) setExpenses(JSON.parse(data));
  };

  const saveExpenses = async (items: Expense[]) => {
    setExpenses(items);
    await AsyncStorage.setItem("expenses", JSON.stringify(items));
  };

  // ✅ FIXED: now respects income/expense type
  const addExpense = () => {
    if (!title.trim() || !amount.trim()) return;

    const value = Math.abs(Number(amount));

    const newExpense: Expense = {
      id: Date.now().toString(),
      title,
      amount: type === "income" ? value : -value, // income positive, expense negative
    };

    saveExpenses([newExpense, ...expenses]);

    setTitle("");
    setAmount("");
    setType("income");
    setModalVisible(false);
  };

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter((e) => e.id !== id));
  };

  const filtered = useMemo(() => {
    return expenses.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, expenses]);

  // ✅ FIX: income should be calculated, not hardcoded
  const income = filtered
    .filter((e) => e.amount > 0)
    .reduce((a, b) => a + b.amount, 0);

  const expenseTotal = filtered
    .filter((e) => e.amount < 0)
    .reduce((a, b) => a + Math.abs(b.amount), 0);

  const balance = income - expenseTotal;

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>
          Expense Tracker <Ionicons name="wallet" size={28} color="#00b4d8" />
        </Text>
        <Text style={styles.subGreeting}>Track your money flow</Text>

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
            placeholder="Search transactions..."
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, color: "#fff", padding: 10 }}
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color="#00b4d8" />
            </TouchableOpacity>
          )}
        </View>

        {/* BALANCE */}
        <View style={[styles.cardStyle, { marginBottom: 10 }]}>
          <Ionicons name="wallet" size={18} color="#00b4d8" />
          <Text style={{ color: "#00b4d8" }}>Balance</Text>
          <Text style={{ color: "#00b4d8", fontWeight: "bold" }}>
            ₦{balance.toLocaleString()}
          </Text>
        </View>

        {/* INCOME + EXPENSE */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={styles.cardStyle}>
            <Ionicons name="arrow-down" size={18} color="#22c55e" />
            <Text style={{ color: "#22c55e" }}>Income</Text>
            <Text style={{ color: "#22c55e", fontWeight: "bold" }}>
              ₦{income.toLocaleString()}
            </Text>
          </View>

          <View style={styles.cardStyle}>
            <Ionicons name="arrow-up" size={18} color="#ff595e" />
            <Text style={{ color: "#ff595e" }}>Expense</Text>
            <Text style={{ color: "#ff595e", fontWeight: "bold" }}>
              ₦{expenseTotal.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* ADD BUTTON */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            backgroundColor: "#00b4d8",
            padding: 12,
            borderRadius: 10,
            marginVertical: 15,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            + Add Transaction
          </Text>
        </TouchableOpacity>

        {/* LIST */}
        {filtered.length === 0 ? (
          <Text style={{ color: "#aaa", textAlign: "center", marginTop: 30 }}>
            No transactions found
          </Text>
        ) : (
          filtered.map((item) => (
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

              <TouchableOpacity onPress={() => deleteExpense(item.id)}>
                <Ionicons name="trash" size={20} color="#ff595e" />
              </TouchableOpacity>
            </View>
          ))
        )}

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
              <Text style={{ color: "#fff", fontSize: 18 }}>
                Add Transaction
              </Text>

              <TextInput
                placeholder="Title"
                placeholderTextColor="#aaa"
                value={title}
                onChangeText={setTitle}
                style={styles.inputStyle}
              />

              <TextInput
                placeholder="Amount"
                placeholderTextColor="#aaa"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.inputStyle}
              />

              {/* TYPE SELECT */}
              <View style={{ flexDirection: "row", marginVertical: 10 }}>
                <TouchableOpacity
                  onPress={() => setType("income")}
                  style={[
                    styles.btn,
                    { backgroundColor: type === "income" ? "#22c55e" : "#333" },
                  ]}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Income
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setType("expense")}
                  style={[
                    styles.btn,
                    {
                      backgroundColor: type === "expense" ? "#ff595e" : "#333",
                    },
                  ]}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Expense
                  </Text>
                </TouchableOpacity>
              </View>

              {/* BUTTONS */}
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
                  onPress={addExpense} // ✅ FIXED (was addTask)
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
