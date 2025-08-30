# Library Management System

A React Native mobile application for managing library books, users, and borrowing functionality.

## Features

- 📚 **Book Management**: Browse, search, and view book details
- 👤 **User Profiles**: View user information and manage accounts
- 🔐 **Authentication**: Secure login and logout functionality
- 📖 **Book Borrowing**: Borrow and return books with real-time status updates
- 🎨 **Modern UI**: Clean, responsive design with beautiful animations

## Environment Configuration

This app uses environment variables for easy configuration. Copy the example file and customize it:

```bash
cp env.example .env
```

### Environment Variables

| Variable                          | Description                 | Default                                               |
| --------------------------------- | --------------------------- | ----------------------------------------------------- |
| `EXPO_PUBLIC_API_BASE_URL`        | Backend API base URL        | `https://library-management-system-lxk1.onrender.com` |
| `EXPO_PUBLIC_API_VERSION`         | API version                 | `v1`                                                  |
| `EXPO_PUBLIC_API_AUTH_LOGIN`      | Login endpoint              | `/auth/login`                                         |
| `EXPO_PUBLIC_API_USERS_ME`        | User profile endpoint       | `/users/me`                                           |
| `EXPO_PUBLIC_API_BOOKS_GET_ALL`   | Get all books endpoint      | `/books/getAll`                                       |
| `EXPO_PUBLIC_API_BOOKS_GET_BY_ID` | Get book by ID endpoint     | `/books/getBookById`                                  |
| `EXPO_PUBLIC_API_BOOKS_BORROW`    | Borrow book endpoint        | `/borrow/request`                                     |
| `EXPO_PUBLIC_API_BOOKS_RETURN`    | Return book endpoint        | `/books/return`                                       |
| `EXPO_PUBLIC_API_BOOKS_SEARCH`    | Search books endpoint       | `/books/search`                                       |
| `EXPO_PUBLIC_API_BOOKS_GENRE`     | Get books by genre endpoint | `/books/genre`                                        |
| `EXPO_PUBLIC_APP_NAME`            | Application name            | `Library Management System`                           |
| `EXPO_PUBLIC_APP_VERSION`         | Application version         | `1.0.0`                                               |
| `EXPO_PUBLIC_API_TIMEOUT`         | API request timeout (ms)    | `10000`                                               |

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd libraryManagementSystem
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

## Project Structure

```
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── book/              # Book details screens
├── api/                   # API functions
├── components/            # Reusable components
├── context/              # React Context providers
├── utils/                # Utility functions and constants
└── assets/               # Static assets
```

## API Endpoints

The app communicates with a backend API with the following endpoints:

- **Authentication**: `/api/auth/login`
- **User Profile**: `/api/users/me`
- **Books**: `/api/books/*`
- **Borrowing**: `/api/books/borrow`, `/api/books/return`

## Technologies Used

- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Axios** for API communication
- **AsyncStorage** for local data persistence
- **React Context** for state management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
