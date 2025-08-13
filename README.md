# PasswordGuard - Secure Password Manager

A modern, secure password management application built with React, TypeScript, and MongoDB. Store, manage, and access your passwords with enterprise-grade security.

## Features

- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 🗄️ **MongoDB Database**: Persistent storage with encrypted password data
- 🔒 **Password Encryption**: AES-256 encryption for stored passwords
- 👥 **Multi-User Support**: Each user has their own isolated password vault
- 🔍 **Search & Filter**: Find passwords quickly with advanced search
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS and shadcn/ui

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- shadcn/ui components
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- AES-256 encryption for passwords

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v16 or higher)
2. **MongoDB** installed and running locally
3. **npm** or **yarn** package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd password-guard
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm run server:install
```

### 3. MongoDB Setup
Make sure MongoDB is running on your system:

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**macOS/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod
```

**Or use MongoDB Atlas (Cloud):**
Update the `MONGODB_URI` in `server/config.env` with your Atlas connection string.

### 4. Environment Configuration
The backend configuration is already set up in `server/config.env`:
```
MONGODB_URI=mongodb://localhost:27017/password-guard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

**Important:** Change the `JWT_SECRET` in production!

### 5. Start the Application

**Option 1: Run Frontend and Backend Separately**
```bash
# Terminal 1: Start the backend server
npm run server:dev

# Terminal 2: Start the frontend
npm run dev
```

**Option 2: Run Both Together**
```bash
npm run dev:full
```

### 6. Access the Application
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Passwords
- `GET /api/passwords` - Get all passwords (protected)
- `POST /api/passwords` - Create new password (protected)
- `GET /api/passwords/:id` - Get password by ID (protected)
- `PUT /api/passwords/:id` - Update password (protected)
- `DELETE /api/passwords/:id` - Delete password (protected)
- `GET /api/passwords/search/:query` - Search passwords (protected)

## Usage

### 1. Registration
1. Navigate to the registration page
2. Enter your email, username, and password
3. Click "Create Account"
4. You'll be automatically logged in and redirected to the dashboard

### 2. Login
1. Enter your email and password
2. Click "Sign In"
3. Access your password vault

### 3. Managing Passwords
- **Add Password**: Click "Add Password" button
- **View Passwords**: All passwords are displayed in a grid/list view
- **Search**: Use the search bar to find specific passwords
- **Edit**: Click the edit button on any password card
- **Delete**: Click the trash icon to remove a password
- **Copy**: Click the copy icon to copy username or password

## Security Features

- **Password Hashing**: All user passwords are hashed using bcrypt with salt
- **Password Encryption**: Stored passwords are encrypted using AES-256
- **JWT Authentication**: Secure token-based authentication
- **User Isolation**: Each user's data is completely separated
- **Input Validation**: Comprehensive validation on all inputs
- **CORS Protection**: Configured CORS for security

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  username: String (unique),
  password: String (hashed),
  createdAt: Date,
  lastLogin: Date,
  timestamps: true
}
```

### PasswordEntries Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  username: String,
  password: String (encrypted),
  website: String,
  category: String,
  notes: String,
  lastUpdated: Date,
  timestamps: true
}
```

## Development

### Project Structure
```
password-guard/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   └── types/             # TypeScript types
├── server/                # Backend source code
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── server.js          # Main server file
└── package.json           # Frontend dependencies
```

### Available Scripts
- `npm run dev` - Start frontend development server
- `npm run server:dev` - Start backend development server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run server:start` - Start backend in production mode

## Production Deployment

### Frontend
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service

### Backend
1. Set production environment variables
2. Install dependencies: `npm run server:install`
3. Start the server: `npm run server:start`

### Environment Variables for Production
```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-super-secure-jwt-secret
PORT=5000
NODE_ENV=production
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
