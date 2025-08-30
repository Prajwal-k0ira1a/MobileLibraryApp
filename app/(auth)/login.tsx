import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      showToast.error("Email is required", "Validation Error");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      showToast.error("Password is required", "Validation Error");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      showToast.error("Please enter a valid email", "Validation Error");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      showToast.error(
        "Password must be at least 6 characters",
        "Validation Error"
      );
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      showToast.info("Logging in...", "Please wait");

      const res = await loginApi({ email, password });
      await login(res.token);

      showToast.success("Login successful!", "Welcome back");
      router.replace("/(tabs)");
    } catch (e: any) {
      const errorMessage = e?.message || "Login failed. Please try again.";
      setError(errorMessage);
      showToast.error(errorMessage, "Login Failed");
      console.error("Login error:", e);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError} style={styles.errorClose}>
            <Text style={styles.errorCloseText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) clearError();
        }}
        editable={!loading}
      />
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (error) clearError();
        }}
        editable={!loading}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Logging in...</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={onSubmit}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  errorContainer: {
    backgroundColor: "#ff6b6b",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorText: {
    color: "#fff",
    flex: 1,
    fontSize: 14,
  },
  errorClose: {
    padding: 4,
  },
  errorCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
