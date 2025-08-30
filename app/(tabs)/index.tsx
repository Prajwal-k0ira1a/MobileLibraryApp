import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchBooks } from "../../api/bookApi";
import BookCard from "../../components/BookCard";
import { showToast } from "../../utils/toast";
import { Book } from "../../utils/types";

export default function BooksScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadBooks = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        showToast.info("Refreshing books...", "Please wait");
      } else {
        setLoading(true);
        showToast.info("Loading books...", "Please wait");
      }
      setError(null);
      console.log("Fetching books from API...");
      const data = await fetchBooks();
      console.log("Books data received:", data);
      console.log("Number of books:", data?.length || 0);
      setBooks(data || []);

      if (isRefresh) {
        showToast.success(`Refreshed! Found ${data?.length || 0} books`);
      } else {
        showToast.success(`Loaded ${data?.length || 0} books successfully`);
      }
    } catch (e: any) {
      const errorMessage = e?.message || "Failed to load books";
      setError(errorMessage);
      showToast.error(errorMessage, "Books Loading Error");
      console.error("Books loading error:", e);
      console.error("Error details:", {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data,
        url: e?.config?.url,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const onRefresh = useCallback(() => {
    loadBooks(true);
  }, [loadBooks]);

  const retryLoad = useCallback(() => {
    setError(null);
    showToast.info("Retrying to load books...", "Please wait");
    loadBooks();
  }, [loadBooks]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading books...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryLoad}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() => router.push(`/book/${item._id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No books found</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new books
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
  listContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
