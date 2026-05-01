import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";

type IconName = ComponentProps<typeof Ionicons>["name"];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        // 👇 ONLY hide header for Home (index)
        headerShown: route.name !== "index",

        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "#00b4d8",
        tabBarInactiveTintColor: "#888",

        tabBarIcon: ({ color, size }) => {
          let icon: IconName = "ellipse";

          if (route.name === "index") icon = "home";
          else if (route.name === "tasks") icon = "checkbox";
          else if (route.name === "expenses") icon = "wallet";
          else if (route.name === "calculator") icon = "calculator";
          else if (route.name === "privacy") icon = "shield-checkmark";

          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
      <Tabs.Screen name="expenses" options={{ title: "Expenses" }} />
      <Tabs.Screen name="calculator" options={{ title: "Calculator" }} />
      <Tabs.Screen name="privacy" options={{ title: "Privacy" }} />
    </Tabs>
  );
}
