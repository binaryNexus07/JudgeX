# JudgeX Frontend

JudgeX is a premium, modern, and highly responsive online judge and competitive programming platform. This repository contains the standalone React frontend, designed with a stunning "Glassmorphism" UI, dynamic micro-animations, and real-time execution capabilities.

## ✨ Features

- **Modern Glassmorphism UI**: Beautifully crafted dark-mode interface with translucent glass panels, floating gradients, and seamless micro-animations.
- **Real-Time Code Execution Console**: Integrated with `socket.io-client` to listen for asynchronous execution verdicts from the Judge Worker in real-time (Pending ➔ Compiling ➔ Running ➔ Accepted).
- **Advanced Code Workspace**: Features side-by-side problem descriptions and a code editor with self-rectifying boilerplate generation based on the selected language.
- **Admin & Sudo Dashboard**: A secure, restricted `/sudo` area for administrators to monitor live traffic, view CSS-based analytical charts, and seamlessly add new programming challenges.
- **Fully Responsive**: Flawlessly adapts to any screen size, whether on an ultra-wide monitor, a split-screen view, or a mobile device.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: React Router DOM (v7)
- **Styling**: Vanilla CSS (Global Tokens, Flexbox/Grid, Glassmorphism, CSS Variables)
- **Real-Time**: Socket.io Client (WebSocket)
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/YourUsername/JudgeX-Frontend.git
   cd JudgeX-Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (if connecting to a local backend):
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📁 Project Structure

```text
src/
├── api/             # Axios client and API route definitions
├── assets/          # Static assets like cinematic background videos and logos
├── components/      # Reusable UI components (Navbar, ProtectedRoutes, etc.)
├── context/         # React Contexts (AuthContext, SocketContext, ThemeContext)
├── pages/           # Main application views (Home, Workspace, Admin, Contests, etc.)
├── App.jsx          # Root component and Routing configuration
├── index.css        # Global CSS variables, design tokens, and utility classes
└── main.jsx         # Application entry point & Context Providers
```

## 🔌 Backend Integration

This frontend is designed to strictly couple with the JudgeX Node.js/Express API Gateway. 
- Standard requests (Authentication, Problem Fetching) are handled via **HTTPS/Axios**.
- Code submissions are asynchronous; the frontend subscribes to **Socket.io events** emitted by the API Gateway to render live execution verdicts without polling.

---
*Built with precision for algorithmic excellence.*
