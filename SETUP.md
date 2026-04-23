# Personal Finance Tracker - Setup Guide

This guide will help you set up and run both the frontend and backend of your Personal Finance Tracker application.

## 📁 Project Structure

```
Personal Finance Tracker + Insights/
├── backend/           # Express + MongoDB API
└── finance-tracker/   # React + TypeScript Frontend
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas cloud database)

### Step 1: Set up MongoDB

**Option A: MongoDB Atlas (Recommended - Cloud Database)**
1. Go to https://www.mongodb.com/atlas and create a free account
2. Create a new cluster (M0 Sandbox - Free Tier)
3. In Database Access, create a database user with password
4. In Network Access, add your IP address or allow access from anywhere (0.0.0.0/0)
5. Click "Connect" → "Connect your application"
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority`)
7. Save it for the next step

**Option B: Local MongoDB**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Default connection: `mongodb://localhost:27017/finance-tracker`

### Step 2: Configure Backend Environment

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. The `.env` file should already exist (copied from `.env.example`). Update it with your MongoDB connection string:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRE=7d
   ```

### Step 3: Start the Backend Server

```bash
cd backend
npm run dev
```

You should see: `Finance Tracker API server running on port 5000`

### Step 4: Configure Frontend Environment

1. Navigate to the frontend folder:
   ```bash
   cd finance-tracker
   ```

2. Copy the environment file:
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

3. The `.env` file should contain:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Step 5: Start the Frontend

```bash
cd finance-tracker
npm run dev
```

The frontend will start at `http://localhost:3000`

## ✅ Verify Everything Works

1. **Backend Health Check**: Visit `http://localhost:5000/api/health`
   - You should see: `{"success": true, "message": "Finance Tracker API is running"}`

2. **Frontend**: Visit `http://localhost:3000`
   - Your React app should load

3. **API Integration**: The frontend proxy is configured to forward `/api` requests to the backend automatically

## 📡 API Endpoints Available

Once both servers are running:

- `GET http://localhost:5000/api/health` - Health check
- `GET http://localhost:5000/api/transactions` - List all transactions
- `POST http://localhost:5000/api/transactions` - Create transaction
- `GET http://localhost:5000/api/categories` - List categories
- `POST http://localhost:5000/api/categories` - Create category
- `GET http://localhost:5000/api/accounts` - List accounts
- `POST http://localhost:5000/api/accounts` - Create account
- `GET http://localhost:5000/api/budgets` - List budgets
- `POST http://localhost:5000/api/budgets` - Create budget

## 🛠️ Using the API in Your Frontend

### Example: Using the API Service

```tsx
import { api } from './services/api';
import { useTransactions } from './hooks/useApi';

// Method 1: Direct API calls
const fetchData = async () => {
  const response = await api.getTransactions();
  if (response.success) {
    console.log(response.data);
  }
};

// Method 2: Using the custom hook (recommended)
function MyComponent() {
  const { data, loading, error, execute } = useTransactions().getTransactions;
  
  useEffect(() => {
    execute(); // Fetch transactions
  }, [execute]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {data?.data?.map(transaction => (
        <div key={transaction._id}>
          {transaction.description} - ${transaction.amount}
        </div>
      ))}
    </div>
  );
}
```

### Example: Creating Data

```tsx
import { useTransactions } from './hooks/useApi';

function CreateTransaction() {
  const { execute: createTransaction, loading } = useTransactions().createTransaction;
  
  const handleSubmit = async (formData) => {
    const success = await createTransaction({
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.categoryId,
      account: formData.accountId,
      date: new Date().toISOString(),
    });
    
    if (success) {
      alert('Transaction created!');
    } else {
      alert('Failed to create transaction');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Transaction'}
      </button>
    </form>
  );
}
```

## 🐛 Troubleshooting

### Backend Issues

**"MongoDB connection error"**
- Check your MongoDB connection string in `.env`
- If using Atlas: Verify your IP is whitelisted in Network Access
- If local: Ensure MongoDB service is running

**"Port 5000 already in use"**
- Kill existing Node processes: `taskkill /F /IM node.exe` (Windows) or `killall node` (Mac/Linux)
- Or change the PORT in `.env` to something else (e.g., 5001)

### Frontend Issues

**"Cannot connect to API"**
- Ensure backend is running on port 5000
- Check that `VITE_API_URL` in `.env` is correct
- Verify Vite proxy config in `vite.config.ts`

**"Module not found" errors**
- Delete `node_modules` folder and run `npm install` again
- Ensure all imports use correct paths

## 📦 Build for Production

### Build Backend
```bash
cd backend
npm run build
npm start  # Runs compiled JavaScript from dist/
```

### Build Frontend
```bash
cd finance-tracker
npm run build
# Deploy the 'dist' folder to your hosting service
```

## 🔐 Security Notes

- Never commit `.env` files with real credentials to git
- Use strong JWT secrets in production
- Enable CORS only for trusted domains in production
- Use MongoDB Atlas with proper IP whitelisting
- Consider adding rate limiting for production APIs

## 📚 Next Steps

1. **Create initial data**: Use the API to create some categories and accounts first
2. **Add authentication**: Implement user login/signup with JWT
3. **Build features**: Create forms for adding transactions, viewing reports, etc.
4. **Style the UI**: Use Tailwind CSS and shadcn/ui components
5. **Add charts**: Use Recharts to visualize spending data

## 🆘 Need Help?

- Check the README files in both `backend/` and `finance-tracker/` folders
- Review the API example component at `finance-tracker/src/components/examples/ApiExample.tsx`
- Check the API service at `finance-tracker/src/services/api.ts`
- Review the custom hooks at `finance-tracker/src/hooks/useApi.ts`

Happy coding! 🎉
