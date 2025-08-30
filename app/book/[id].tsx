import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { borrowBook, fetchBookById } from "../../api/bookApi";
import { showToast } from "../../utils/toast";
import { Book } from "../../utils/types";

export default function BookDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadBookDetails = async () => {
    if (!id) {
      setError("No book ID provided");
      showToast.error("No book ID provided", "Error");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Fetching book details for ID:", id);
      showToast.info("Loading book details...", "Please wait");

      const bookData = await fetchBookById(id);
      console.log("Book details received:", bookData);
      setBook(bookData);
      showToast.success("Book details loaded successfully");
    } catch (e: any) {
      const errorMessage = e?.message || "Failed to load book details";
      setError(errorMessage);
      showToast.error(errorMessage, "Book Details Error");
      console.error("Book details loading error:", e);
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

  const handleBorrow = async () => {
    if (!book || book.available === 0) return;

    try {
      setBorrowing(true);
      console.log("Borrowing book:", book._id);
      showToast.info("Processing your request...", "Please wait");

      const updatedBook = await borrowBook(book._id);
      console.log("Book borrowed successfully:", updatedBook);
      setBook(updatedBook);
      showToast.success("Book borrowed successfully!", "Enjoy reading!");
    } catch (e: any) {
      const errorMessage = e?.message || "Failed to borrow book";
      setError(errorMessage);
      showToast.error(errorMessage, "Borrow Failed");
      console.error("Borrow error:", e);
    } finally {
      setBorrowing(false);
    }
  };

  useEffect(() => {
    loadBookDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading book details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadBookDetails}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Book not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Book Image */}
        {book.bookImages && book.bookImages.length > 0 && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: book.bookImages[0] }}
              style={styles.bookImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Book Title */}
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>

        {/* Book Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>ISBN:</Text>
            <Text style={styles.value}>{book.isbn}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Genre:</Text>
            <Text style={styles.value}>{book.genre}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Status:</Text>
            <Text
              style={[
                styles.status,
                { color: book.status === "Available" ? "green" : "red" },
              ]}
            >
              {book.status}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Available:</Text>
            <Text style={styles.value}>
              {book.available} of {book.quantity} copies
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{book.description}</Text>
        </View>

        {/* Borrow Button */}
        <TouchableOpacity
          style={[
            styles.borrowButton,
            {
              backgroundColor:
                book.available > 0 && book.status === "Available"
                  ? "#007AFF"
                  : "#ccc",
            },
          ]}
          onPress={handleBorrow}
          disabled={
            book.available === 0 || book.status !== "Available" || borrowing
          }
        >
          {borrowing ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.borrowButtonText}>
              {book.available > 0 && book.status === "Available"
                ? "Borrow Book"
                : "Not Available"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  bookImage: {
    width: 200,
    height: 280,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  author: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  detailsContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
  },
  descriptionContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  borrowButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  borrowButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
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
    marginBottom: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#666",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
