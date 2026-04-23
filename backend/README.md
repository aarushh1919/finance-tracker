# Finance Tracker Backend API

A RESTful API for personal finance tracking built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Transaction Management**: Create, read, update, and delete financial transactions
- **Category Management**: Organize transactions with custom income/expense categories
- **Account Management**: Manage multiple financial accounts (checking, savings, credit, etc.)
- **Budget Tracking**: Set and monitor budgets for expense categories
- **Statistics**: Get insights into spending patterns and financial trends
- **Data Validation**: Comprehensive input validation and error handling
- **TypeScript**: Full type safety and better development experience

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions with filtering and pagination
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `GET /api/transactions/stats` - Get transaction statistics

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create a new account
- `PUT /api/accounts/:id` - Update an account
- `DELETE /api/accounts/:id` - Delete an account

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create a new budget
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget
- `PATCH /api/budgets/:id/spending` - Update budget spending calculations

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
- `MONGODB_URI`: Your MongoDB connection string
- `PORT`: Server port (default: 5000)
- `FRONTEND_URL`: Your frontend URL for CORS

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Database Schema

### Transaction
```typescript
{
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: ObjectId;
  account: ObjectId;
  date: Date;
  notes?: string;
  tags?: string[];
}
```

### Category
```typescript
{
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  budgetLimit?: number;
  isActive: boolean;
}
```

### Account
```typescript
{
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash' | 'other';
  balance: number;
  currency: string;
  bankName?: string;
  accountNumber?: string;
  isActive: boolean;
}
```

### Budget
```typescript
{
  name: string;
  category: ObjectId;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  spent: number;
  isActive: boolean;
}
```

## API Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // For validation errors
}
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript project
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests (when implemented)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/finance-tracker |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `JWT_SECRET` | JWT secret key | (required for auth) |
| `JWT_EXPIRE` | JWT expiration time | 7d |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
