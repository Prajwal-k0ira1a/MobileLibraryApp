export interface Book {
  _id: string;
  bookImages: string[];
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  available: number;
  description: string;
  genre: string;
  status: "Available" | "Borrowed";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBookRequest {
  bookImages: string[];
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  available: number;
  description: string;
  genre: string;
  status?: "Available" | "Borrowed";
}

export interface UpdateBookRequest {
  bookImages?: string[];
  title?: string;
  author?: string;
  isbn?: string;
  quantity?: number;
  available?: number;
  description?: string;
  genre?: string;
  status?: "Available" | "Borrowed";
}
