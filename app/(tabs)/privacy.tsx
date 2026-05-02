import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/styles";

export default function Privacy() {
  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>
          Privacy Policy{" "}
          <Ionicons name="shield-checkmark" size={28} color="#00b4d8" />
        </Text>
        <Text style={styles.subGreeting2}>
          Your privacy matters. Here’s how this app handles your data.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. No Data Collection</Text>
          <Text style={styles.previewText}>
            This app does not collect, store, or share any personal information.
            We do not track users or gather analytics.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Local Storage Only</Text>
          <Text style={styles.previewText}>
            All your data (tasks and expenses) are stored locally on your device
            using secure storage methods like AsyncStorage.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>3. No Internet Usage</Text>
          <Text style={styles.previewText}>
            This app does not require an internet connection and does not send
            any data to external servers.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>4. Data Control</Text>
          <Text style={styles.previewText}>
            You have full control over your data. Deleting the app will remove
            all stored data permanently.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>5. Security</Text>
          <Text style={styles.previewText}>
            Since your data never leaves your device, it remains private and
            inaccessible to third parties.
          </Text>
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Summary</Text>
          <Text style={styles.previewText}>
            This is a fully offline app. Your information stays on your device
            and is never shared, collected, or transmitted.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
