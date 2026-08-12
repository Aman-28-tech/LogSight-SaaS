# LogSight | Enterprise-Grade Log Monitoring & Analytics

LogSight is a sophisticated full-stack monitoring application designed to provide real-time visibility into system logs, performance metrics, and security anomalies. Built with a focus on high-fidelity data visualization and real-time ingestion, it transforms raw log data into actionable insights through an interactive, modern dashboard.

## Key Capabilities

- **Real-time Log Streaming**: Leverages Socket.io for instantaneous log ingestion and display without page refreshes or polling overhead.
- **Advanced Data Visualization**: Features interactive time-series charts, distribution graphs, and anomaly heatmaps engineered with Recharts.
- **Full-Text Search & Filtering**: Enables deep inspection of logs with multi-parameter filtering (date range, severity level, source application).
- **Secure Authentication**: Implements a dual-layer authentication system featuring traditional JWT-based credentials and OAuth integration, backed by robust verification flows.
- **Traffic Simulation**: Includes a built-in engine to simulate high-velocity traffic for stress testing and feature demonstration.
- **Data Portability**: Supports one-click log export to CSV format for external auditing, reporting, and compliance.
- **Responsive Architecture**: Delivers a premium, state-of-the-art interface utilizing modern CSS paradigms for a cohesive user experience across all devices.

## Technology Stack

### Frontend Architecture
- **Framework**: React 19
- **Build System**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Real-time Client**: Socket.io-client

### Backend Infrastructure
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching & Message Broker**: Redis
- **Real-time Engine**: Socket.io
- **Authentication**: JWT & OAuth integrations
- **Security**: Express-rate-limit, Joi validation schemas

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or Atlas)
- Redis instance (optional, for scalable real-time pub/sub)
- External API keys for email/OAuth providers

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aman-28-tech/LogSight-SaaS.git
   cd LogSight-SaaS
   ```

2. **Configure Backend Environment**:
   ```bash
   cd logsight-backend
   npm install
   ```
   Create a `.env` file in the `logsight-backend` directory and configure the required variables (e.g., `MONGO_URI`, `JWT_SECRET`, `RESEND_API_KEY`).

3. **Start the Backend Server**:
   ```bash
   npm run dev
   ```

4. **Configure Frontend Environment**:
   Open a new terminal session.
   ```bash
   cd logsight-frontend
   npm install
   ```
   Create a `.env` file in the `logsight-frontend` directory with your required variables (e.g., `VITE_API_URL`).

5. **Start the Frontend Application**:
   ```bash
   npm run dev
   ```

## Project Structure

```text
LogSight-SaaS/
├── logsight-backend/       # Express API, MongoDB models, Socket logic
│   ├── src/
│   │   ├── config/         # Database and infrastructure configurations
│   │   ├── controllers/    # Request handlers and business logic
│   │   ├── middleware/     # Security, rate-limiting, and validation
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoint definitions
│   │   ├── services/       # Core service integrations (Real-time, AI, Email)
│   │   ├── utils/          # Helper utilities
│   │   └── server.js       # Application entry point
├── logsight-frontend/      # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks for state management
│   │   ├── pages/          # Top-level route components
│   │   ├── utils/          # Frontend utility functions
│   │   └── App.jsx         # Main application routing and logic
└── .gitignore              # Root gitignore
```

## Maintainers

Maintained by Amandeep.
