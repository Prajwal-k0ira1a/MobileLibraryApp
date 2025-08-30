import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Book } from "../utils/types";

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

export default function BookCard({ book, onPress }: BookCardProps) {
  const { title, author, quantity, available, genre, status, bookImages } =
    book;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        {bookImages && bookImages.length > 0 && (
          <Image
            source={{ uri: bookImages[0] }}
            style={styles.bookImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.textContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>by {author}</Text>
          <Text style={styles.genre}>{genre}</Text>
          <Text style={styles.available}>
            Available: {available}/{quantity}
          </Text>
          <Text
            style={[
              styles.status,
              { color: status === "Available" ? "green" : "red" },
            ]}
          >
            Status: {status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: "#f8f8f8",
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookImage: {
    width: 60,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: "gray",
    marginBottom: 2,
  },
  genre: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  available: {
    fontSize: 12,
    color: "green",
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: "500",
  },
});
