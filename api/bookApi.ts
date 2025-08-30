import { API_ENDPOINTS } from "../utils/constants";
import { Book, CreateBookRequest, UpdateBookRequest } from "../utils/types";
import axiosInstance from "./axiosInstance";

// Fetch all books
export const fetchBooks = async (): Promise<Book[]> => {
  const response = await axiosInstance.get(API_ENDPOINTS.BOOKS.GET_ALL);
  // Handle the wrapped response structure: { status: true, data: Book[] }
  return response.data.data || response.data;
};

// Fetch a single book by ID
export const fetchBookById = async (bookId: string): Promise<Book> => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.BOOKS.GET_BY_ID}/${bookId}`
  );
  // Handle the wrapped response structure: { status: true, data: Book }
  return response.data.data || response.data;
};

// Create a new book
export const createBook = async (
  bookData: CreateBookRequest
): Promise<Book> => {
  const response = await axiosInstance.post("/books", bookData);
  return response.data;
};

// Update a book
export const updateBook = async (
  bookId: string,
  bookData: UpdateBookRequest
): Promise<Book> => {
  const response = await axiosInstance.put(`/books/${bookId}`, bookData);
  return response.data;
};

// Delete a book
export const deleteBook = async (bookId: string): Promise<void> => {
  await axiosInstance.delete(`/books/${bookId}`);
};

// Borrow a book
export const borrowBook = async (bookId: string): Promise<Book> => {
  const response = await axiosInstance.post(API_ENDPOINTS.BOOKS.BORROW, {
    bookId,
  });
  return response.data;
};

// Return a book
export const returnBook = async (bookId: string): Promise<Book> => {
  const response = await axiosInstance.post(API_ENDPOINTS.BOOKS.RETURN, {
    bookId,
  });
  return response.data;
};

// Search books by title, author, or genre
export const searchBooks = async (query: string): Promise<Book[]> => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.BOOKS.SEARCH}?q=${encodeURIComponent(query)}`
  );
  return response.data;
};

// Get books by genre
export const getBooksByGenre = async (genre: string): Promise<Book[]> => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.BOOKS.GENRE}/${encodeURIComponent(genre)}`
  );
  return response.data;
};
