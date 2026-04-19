# 🚀 LogSight | Enterprise-Grade Log Monitoring & Analytics

LogSight is a sophisticated full-stack monitoring application designed to provide real-time visibility into system logs, performance metrics, and security anomalies. Built with a focus on high-fidelity data visualization and real-time ingestion, it transforms raw log data into actionable insights through an interactive, modern dashboard.

## 🌟 Key Features

- **⚡ Real-time Log Streaming**: Leveraging Socket.io for instantaneous log ingestion and display without page refreshes.
- **📊 Advanced Data Visualization**: Interactive time-series charts, distribution graphs, and anomaly heatmaps built with Recharts.
- **🔍 Full-Text Search & Filtering**: Deep inspection of logs with multi-parameter filtering (date range, severity level, source).
- **🛡️ Secure Authentication**: Dual-layer authentication system featuring traditional JWT-based credentials and GitHub OAuth integration.
- **📈 Traffic Simulation**: Built-in engine to simulate high-velocity traffic for stress testing and feature demonstration.
- **📥 Data Portability**: One-click log export to CSV format for external auditing and reporting.
- **📱 Responsive Glassmorphism UI**: A premium, state-of-the-art interface built with Tailwind CSS and Framer Motion for smooth micro-animations.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Real-time**: Socket.io-client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching/Pub-Sub**: Redis
- **Real-time**: Socket.io
- **Authentication**: JWT & GitHub OAuth
- **Security**: Express-rate-limit & Joi validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- GitHub OAuth credentials

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aman-28-tech/logsight-app.git
   cd logsight-app

Setup Backend:
cd logsight-backend
npm install
# Create a .env file based on environment requirements
npm run dev

Setup Frontend:
cd ../logsight-frontend
npm install
# Create a .env file based on environment requirements
npm run dev


📂 Project Structure

logsight-app/
├── logsight-backend/      # Express API, MongoDB models, Socket logic
│   ├── src/
│   │   ├── config/        # Database & OAuth configs
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API endpoints
│   │   └── server.js      # Entry point
├── logsight-frontend/     # React Application (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI elements
│   │   ├── hooks/         # Custom React hooks (Data fetching)
│   │   ├── utils/         # Helper functions
│   │   └── App.jsx        # Main application logic
└── .gitignore             # Root gitignore

Developed with ❤️ by Amandeep
