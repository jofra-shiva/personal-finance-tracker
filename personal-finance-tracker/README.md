# Personal Finance Tracker (MERN Stack)

A complete, production-ready personal finance management application with authentication, transaction tracking, and interactive analytics.

## Features

- **Authentication**: JWT-based login & signup with bcrypt password hashing.
- **Transactions**: Add, edit, and delete income/expense transactions.
- **Categories**: Dynamic category management with custom colors.
- **Dashboard**: High-level overview of total income, expenses, and balance.
- **Analytics**: 
  - Pie chart for expense distribution by category.
  - Bar chart for monthly income vs expense comparison.
  - Line chart for spending trends over time.
- **Responsive Design**: Built with Tailwind CSS, fully mobile-friendly.
- **Pagination & Filtering**: Efficient data handling for large transaction histories.

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide React, Recharts, Axios, React Hot Toast.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed locally or a MongoDB Atlas URI

### Installation

1. **Clone the repository** (or unzip the files)
2. **Setup Backend**:
   - Navigate to `server/`
   - Run `npm install`
   - Create a `.env` file based on `.env.example`
   - Set your `MONGO_URI` and `JWT_SECRET`
3. **Setup Frontend**:
   - Navigate to `client/`
   - Run `npm install`

### Running the Application

1. **Start Backend**:
   ```bash
   cd server
   npm run dev
   ```
2. **Start Frontend**:
   ```bash
   cd client
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```text
personal-finance-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth state management
│   │   ├── pages/          # Application views
│   │   └── api/            # API integration
├── server/                 # Express backend
│   ├── config/             # DB configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth & Error handling
│   ├── models/             # Mongoose schemas
│   └── routes/             # API endpoints
```
