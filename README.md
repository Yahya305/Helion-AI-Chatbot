<div align="center">

# 🤖 Helion AI Agent

### _An Intelligent Conversational AI with Memory & Tool Integration_

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Powered-FF6B6B?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Screenshots](#-screenshots) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 Overview

**Helion** is a sophisticated AI agent platform that combines the power of Large Language Models with persistent memory and dynamic tool integration. Built with a modern tech stack, Helion provides an intelligent conversational experience that remembers context, executes tools, and delivers streaming responses in real-time.

### ✨ Key Highlights

-   🧠 **Persistent Memory System** - Remembers conversations and user preferences across sessions
-   🔧 **Dynamic Tool Integration** - Extensible tool registry for web search, weather, datetime, and custom tools
-   🌊 **Real-time Streaming** - Server-Sent Events (SSE) for smooth, token-by-token responses
-   🔄 **LangGraph Workflow** - Sophisticated agent orchestration with state management
-   🎨 **Modern UI** - Beautiful, responsive interface built with React and TailwindCSS
-   🔐 **Secure Authentication** - JWT-based auth with HTTP-only cookies
-   💾 **PostgreSQL Checkpointing** - Reliable state persistence and conversation history

---

## 🎯 Features

### Agent Capabilities

-   **Intelligent Reasoning** - Powered by Google's Gemini 2.0 Flash model
-   **Tool Execution** - Seamlessly calls external tools when needed
-   **Memory Management** - Stores and retrieves contextual memories
-   **Streaming Responses** - Real-time token streaming for better UX
-   **Multi-turn Conversations** - Maintains context across conversation threads

### Built-in Tools

| Tool               | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| 🌐 **Web Search**  | Search the web using Tavily API for real-time information    |
| 🌤️ **Weather**     | Get current weather information for any city                 |
| 🕐 **Date & Time** | Retrieve current date and time information                   |
| 💭 **Memory**      | Store and retrieve user preferences and conversation context |

### Frontend Features

-   📱 Responsive design that works on all devices
-   🎨 Clean, modern UI with smooth animations
-   💬 Real-time message streaming
-   🔄 Conversation history management
-   🎭 Tool execution visualization
-   🌙 Professional dark theme

---

## 🏗️ Architecture

Helion follows a modern **client-server architecture** with clear separation of concerns:

```mermaid
graph TB
    subgraph "Frontend - React + Vite"
        UI[React UI Components]
        Router[TanStack Router]
        Query[TanStack Query]
        API[Axios API Client]
    end

    subgraph "Backend - FastAPI"
        FastAPI[FastAPI Server]
        Auth[JWT Authentication]
        ChatAPI[Chat API]
        MemAPI[Memory API]
    end

    subgraph "Agent Layer - LangGraph"
        Agent[Agent Node]
        Tools[Tool Node]
        State[State Management]
        Checkpointer[PostgreSQL Checkpointer]
    end

    subgraph "External Services"
        Gemini[Google Gemini 2.0]
        Tavily[Tavily Search API]
        Weather[Weather API]
    end

    subgraph "Database"
        PostgreSQL[(PostgreSQL)]
    end

    UI --> Router
    Router --> Query
    Query --> API
    API --> FastAPI

    FastAPI --> Auth
    FastAPI --> ChatAPI
    FastAPI --> MemAPI

    ChatAPI --> Agent
    MemAPI --> PostgreSQL

    Agent --> Tools
    Tools --> Agent
    Agent --> State
    State --> Checkpointer
    Checkpointer --> PostgreSQL

    Agent --> Gemini
    Tools --> Tavily
    Tools --> Weather
    Tools --> PostgreSQL
```

### Backend Architecture

The backend is built with **FastAPI** and follows a modular structure:

```
server/
├── agent/              # LangGraph agent implementation
│   ├── workflow.py     # Graph construction and compilation
│   ├── nodes.py        # Agent and tool nodes
│   ├── state.py        # State management
│   └── prompts.py      # System prompts
├── api/                # API routes
│   ├── auth/           # Authentication endpoints
│   ├── chat/           # Chat endpoints (SSE streaming)
│   └── memories/       # Memory management endpoints
├── tools/              # Tool implementations
│   ├── tool_registry.py    # Dynamic tool registration
│   ├── web_search.py       # Web search tool
│   ├── city_weather.py     # Weather tool
│   ├── date_time.py        # DateTime tool
│   └── memory.py           # Memory tool
├── core/               # Core utilities
│   ├── database.py     # Database connection
│   ├── constants.py    # Configuration
│   └── exceptions.py   # Custom exceptions
└── models/             # SQLAlchemy models
    ├── user.py
    ├── conversation.py
    └── memory.py
```

### Frontend Architecture

The frontend is built with **React 19** and **Vite**:

```
client/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── Chat/       # Chat interface components
│   │   ├── Auth/       # Authentication components
│   │   └── ui/         # shadcn/ui components
│   ├── routes/         # TanStack Router pages
│   │   ├── __root.tsx
│   │   ├── index.tsx   # Home page
│   │   └── chat.tsx    # Chat page
│   ├── lib/            # Utilities and API client
│   │   └── api.ts      # Axios instance
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript type definitions
└── public/             # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

-   **Python 3.11+**
-   **Node.js 18+**
-   **PostgreSQL 16+**
-   **API Keys:**
    -   Google Gemini API Key
    -   Tavily API Key (for web search)

### Backend Setup

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd Agent2.0/server
    ```

2. **Create a virtual environment**

    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    ```

3. **Install dependencies**

    ```bash
    pip install -r requirements.txt
    ```

4. **Configure environment variables**

    Create a `.env` file in the `server` directory:

    ```env
    # Database
    POSTGRES_CONNECTION_URI=postgresql://user:password@localhost:5432/helion_db

    # API Keys
    GOOGLE_API_KEY=your_gemini_api_key
    TAVILY_API_KEY=your_tavily_api_key

    # JWT
    JWT_SECRET_KEY=your_secret_key_here
    JWT_ALGORITHM=HS256

    # Environment
    ENV=development
    FRONTEND_URL=http://localhost:5173
    ```

5. **Initialize the database**

    ```bash
    alembic upgrade head
    ```

6. **Run the server**

    ```bash
    fastapi dev main.py
    ```

    The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to client directory**

    ```bash
    cd ../client
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    Create a `.env` file in the `client` directory:

    ```env
    VITE_API_URL=http://localhost:8000
    ```

4. **Run the development server**

    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:5173`

### Docker Setup (Optional)

Run the entire stack with Docker Compose:

```bash
docker-compose up -d
```

---

## 📸 Screenshots

### Chat Interface

![Chat Interface](./client/public/ChatSS.png)
_Helion's clean and intuitive chat interface with real-time streaming responses_

### Tool Integration

![Tool Integration](./client/public/ToolsIntegration.png)
_Seamless integration with external tools for enhanced capabilities_

---

## 🛠️ Tech Stack

### Backend

| Technology            | Purpose                              |
| --------------------- | ------------------------------------ |
| **FastAPI**           | High-performance async web framework |
| **LangGraph**         | Agent workflow orchestration         |
| **LangChain**         | LLM integration and tooling          |
| **Google Gemini 2.0** | Large Language Model                 |
| **PostgreSQL**        | Database and checkpointing           |
| **SQLAlchemy**        | ORM for database operations          |
| **Alembic**           | Database migrations                  |
| **Pydantic**          | Data validation                      |
| **python-jose**       | JWT token handling                   |
| **Tavily**            | Web search API                       |

### Frontend

| Technology          | Purpose                     |
| ------------------- | --------------------------- |
| **React 19**        | UI library                  |
| **TypeScript**      | Type-safe JavaScript        |
| **Vite**            | Build tool and dev server   |
| **TanStack Router** | Type-safe routing           |
| **TanStack Query**  | Server state management     |
| **TailwindCSS**     | Utility-first CSS framework |
| **shadcn/ui**       | Beautiful UI components     |
| **Axios**           | HTTP client                 |
| **Lucide React**    | Icon library                |

---

## 🔧 API Endpoints

### Authentication

-   `POST /api/auth/register` - Register a new user
-   `POST /api/auth/login` - Login and receive JWT token
-   `POST /api/auth/logout` - Logout and clear session
-   `GET /api/auth/me` - Get current user info

### Chat

-   `POST /api/chat` - Send a message (SSE streaming)
-   `GET /api/chat/conversations` - Get all conversations
-   `GET /api/chat/conversations/{id}` - Get conversation by ID
-   `DELETE /api/chat/conversations/{id}` - Delete a conversation

### Memories

-   `GET /api/memories` - Get all memories for current user
-   `POST /api/memories` - Create a new memory
-   `DELETE /api/memories/{id}` - Delete a memory

---

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd server
pytest

# Frontend tests
cd client
npm test
```

### Code Quality

```bash
# Backend linting
cd server
ruff check .

# Frontend linting
cd client
npm run lint
```

---

## 📝 Environment Variables

### Backend (.env)

```env
# Database
POSTGRES_CONNECTION_URI=postgresql://user:password@localhost:5432/helion_db

# API Keys
GOOGLE_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key

# JWT Configuration
JWT_SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment
ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

-   [LangChain](https://langchain.com/) for the amazing LLM framework
-   [Google](https://ai.google.dev/) for the Gemini API
-   [Tavily](https://tavily.com/) for the search API
-   [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components

---

<div align="center">

**Built with ❤️ using FastAPI, React, and LangGraph**

⭐ Star this repo if you find it helpful!

</div>
