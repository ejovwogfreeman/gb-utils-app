import { Parser } from "expr-eval";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/styles";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [isDeg, setIsDeg] = useState(true);

  const parser = useMemo(() => {
    const p = new Parser();

    const toRad = (x: number) => (x * Math.PI) / 180;

    p.functions.sin = (x: number) => Math.sin(isDeg ? toRad(x) : x);

    p.functions.cos = (x: number) => Math.cos(isDeg ? toRad(x) : x);

    p.functions.tan = (x: number) => Math.tan(isDeg ? toRad(x) : x);

    p.functions.sqrt = Math.sqrt;
    p.functions.log = Math.log10;

    return p;
  }, [isDeg]);

  const handlePress = (val: string) => {
    setInput((prev) => prev + val);
  };

  const handleDelete = () => setInput((prev) => prev.slice(0, -1));
  const handleClear = () => setInput("");

  const toRad = (x: string | number) => (Number(x) * Math.PI) / 180;

  const formatResult = (value: number) => {
    const rounded = Number(value.toFixed(12));
    return rounded.toString().replace(/\.?0+$/, "");
  };

  const handleCalculate = () => {
    try {
      let expr = input;

      if (isDeg) {
        expr = expr.replace(/sin\(([^)]+)\)/g, (_, val) => {
          return `sin(${toRad(val)})`;
        });

        expr = expr.replace(/cos\(([^)]+)\)/g, (_, val) => {
          return `cos(${toRad(val)})`;
        });

        expr = expr.replace(/tan\(([^)]+)\)/g, (_, val) => {
          return `tan(${toRad(val)})`;
        });
      }

      const result = parser.evaluate(expr);
      setInput(formatResult(result));
    } catch {
      setInput("Error");
    }
  };

  const buttons = [
    ["sin(", "cos(", "tan(", "sqrt("],
    ["log(", "pi", "e", "^"],
    ["(", ")", "/", "*"],
    ["7", "8", "9", "-"],
    ["4", "5", "6", "+"],
    ["1", "2", "3", "="],
    ["0", ".", "DEL", "C"],
  ];

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            width: "100%",
          }}
        >
          {/* Header */}
          <View
            style={{
              padding: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>Mode: {isDeg ? "DEG" : "RAD"}</Text>

            <TouchableOpacity
              onPress={() => setIsDeg((prev) => !prev)}
              style={{
                backgroundColor: "#00b4d8",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#000", fontWeight: "bold" }}>
                {isDeg ? "RAD" : "DEG"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Display */}
          <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 32,
                textAlign: "right",
              }}
            >
              {input || "0"}
            </Text>
          </View>

          {/* Buttons */}
          <View style={{ padding: 10 }}>
            {buttons.map((row, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: 10 }}>
                {row.map((btn, j) => (
                  <TouchableOpacity
                    key={j}
                    style={{
                      flex: 1,
                      margin: 5,
                      backgroundColor:
                        btn === "="
                          ? "#00b4d8"
                          : btn === "C"
                            ? "#ff595e"
                            : "rgba(255,255,255,0.08)",
                      padding: 16,
                      borderRadius: 12,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      if (btn === "=") handleCalculate();
                      else if (btn === "DEL") handleDelete();
                      else if (btn === "C") handleClear();
                      else handlePress(btn);
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      {btn}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
