# ReWear - Community Clothing Exchange Backend

A comprehensive backend API for a community-driven clothing exchange platform built with Node.js, Express, Sequelize ORM, and MySQL.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role management (user/admin)
- **Item Management**: Full CRUD operations for clothing items with approval workflow
- **Swap System**: Users can request swaps or redeem items using points
- **Admin Panel**: Moderation tools for approving/rejecting items and managing users
- **Points System**: Reward users for uploading items and successful swaps
- **Search & Filtering**: Advanced filtering by category, size, condition, etc.
- **Security**: Rate limiting, CORS, helmet, and input validation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## 📁 Project Structure

```
backend/
├── controllers/         # Route controllers
│   ├── authController.js
│   ├── itemController.js
│   ├── swapController.js
│   └── adminController.js
├── routes/             # API routes
│   ├── auth.js
│   ├── items.js
│   ├── swaps.js
│   └── admin.js
├── models/             # Sequelize models
│   ├── User.js
│   ├── Item.js
│   ├── Swap.js
│   └── index.js
├── middleware/         # Custom middleware
│   ├── auth.js
│   └── validation.js
├── config/            # Configuration files
│   └── database.js
├── app.js            # Express app configuration
├── server.js         # Server entry point
├── .env              # Environment variables
└── package.json      # Project dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Copy the `.env` file and update the database credentials:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=rewear_db
   DB_USER=your_username
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

3. **Create MySQL database:**
   ```sql
   CREATE DATABASE rewear_db;
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000`

5. **Verify installation:**
   
   Visit `http://localhost:3000/api/health` - you should see a success message.

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |

### Item Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/items` | Get all approved items | No |
| GET | `/api/items/:id` | Get item by ID | No |
| POST | `/api/items` | Create new item | Yes |
| PUT | `/api/items/:id` | Update item | Yes (Owner) |
| DELETE | `/api/items/:id` | Delete item | Yes (Owner/Admin) |
| GET | `/api/items/user/my-items` | Get user's items | Yes |

### Swap Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/swaps` | Create swap request | Yes |
| PUT | `/api/swaps/:id/respond` | Accept/reject swap | Yes (Owner) |
| GET | `/api/swaps/my-swaps` | Get user's swaps | Yes |
| PUT | `/api/swaps/:id/complete` | Mark swap as completed | Yes |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/items/pending` | Get pending items | Admin |
| PUT | `/api/admin/items/:id/moderate` | Approve/reject item | Admin |
| DELETE | `/api/admin/items/:id` | Delete item | Admin |
| PUT | `/api/admin/items/:id/featured` | Toggle featured status | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/:id/toggle-status` | Activate/deactivate user | Admin |
| GET | `/api/admin/stats` | Get platform statistics | Admin |

## 🔐 Authentication

Include the JWT token in the Authorization header:

```javascript
headers: {
  'Authorization': 'Bearer your_jwt_token_here'
}
```

## 🎯 Points System

- **Initial Points**: 100 points for new users
- **Item Upload**: +10 points
- **Successful Swap**: +20 points for both parties
- **Redemption Cost**: 50 points per item

## 📝 Database Models

### User Model
- `id`, `name`, `email`, `password`, `role`, `points`, `isActive`, `timestamps`

### Item Model
- `id`, `title`, `description`, `category`, `type`, `size`, `condition`, `tags`, `images`, `status`, `featured`, `userId`, `timestamps`

### Swap Model
- `id`, `itemId`, `requesterId`, `ownerId`, `type`, `status`, `message`, `pointsUsed`, `timestamps`

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers middleware

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a production MySQL database
3. Set up proper CORS origins
4. Configure SSL/TLS
5. Use a process manager like PM2

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.