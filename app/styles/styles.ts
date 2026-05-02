import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0d1b2a",
  },

  container: {
    flex: 1,
    backgroundColor: "#0d1b2a",
    padding: 20,
  },

  greeting: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },

  subGreeting1: {
    fontSize: 20,
    color: "#ccc",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },

  subGreeting2: {
    color: "#ccc",
    marginBottom: 20,
  },

  timeCard: {
    backgroundColor: "rgba(0,180,216,0.15)",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },

  date: {
    color: "#fff",
    fontSize: 16,
    marginTop: 5,
  },

  clock: {
    color: "#00b4d8",
    fontSize: 24,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5,
  },

  cardTitle: {
    color: "#00b4d8",
    fontSize: 14,
  },

  cardValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 5,
  },

  cardSub: {
    color: "#888",
    fontSize: 12,
  },

  previewCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  previewTitle: {
    color: "#00b4d8",
    fontWeight: "bold",
  },

  previewText: {
    color: "#ddd",
    fontSize: 13,
    marginBottom: 4,
  },

  /* STYLES */
  cardStyle: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  inputStyle: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 10,
    borderRadius: 10,
    color: "#fff",
    marginTop: 10,
  },

  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
});

export default styles;
