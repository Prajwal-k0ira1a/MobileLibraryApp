import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getProfile, User } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const router = useRouter();

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching user profile...");
      const profileData = await getProfile();
      console.log("Profile data received:", profileData);
      setUser(profileData);
      showToast.success("Profile loaded successfully");
    } catch (e: any) {
      const errorMessage = e?.message || "Failed to load profile";
      setError(errorMessage);
      showToast.error(errorMessage, "Profile Error");
      console.error("Profile loading error:", e);
      console.error("Error details:", {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data,
        url: e?.config?.url,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("Logging out user...");
            console.log("Current auth state before logout:", {
              isAuthenticated: true,
              hasToken: !!true,
            });

            showToast.info("Logging out...", "Please wait");
            await logout();

            console.log("User logged out successfully");
            console.log("Auth state after logout:", {
              isAuthenticated: false,
              hasToken: false,
            });

            showToast.success("Logged out successfully", "Goodbye!");
            router.replace("/(auth)/login");
          } catch (error: any) {
            console.error("Logout error:", error);
            console.error("Error details:", {
              message: error?.message,
              stack: error?.stack,
            });
            showToast.error(
              "Failed to logout. Please try again.",
              "Logout Error"
            );
          }
        },
      },
    ]);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>
      {user ? (
        <View style={styles.profileInfo}>
          {/* Profile Image */}
          <View style={styles.imageContainer}>
            {user.profileImage && user.profileImage.trim() !== "" ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.defaultImage}>
                <Text style={styles.defaultImageText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user.name}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>

          <Text style={styles.label}>Role:</Text>
          <Text style={[styles.value, styles.roleText]}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Text>

          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.value,
              { color: user.isActive ? "#34C759" : "#FF3B30" },
            ]}
          >
            {user.isActive ? "Active" : "Inactive"}
          </Text>

          {user.createdAt && (
            <>
              <Text style={styles.label}>Member Since:</Text>
              <Text style={styles.value}>
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </>
          )}
        </View>
      ) : (
        <Text style={styles.errorText}>No profile data available</Text>
      )}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  profileInfo: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 15,
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  defaultImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  defaultImageText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  roleText: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});
