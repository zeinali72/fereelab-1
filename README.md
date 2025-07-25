# AI Chatbot with OpenRouter Integration

<p align="center">
  <img alt="Advanced AI Chatbot with Model Marketplace" src="app/(chat)/opengraph-image.png" width="600">
</p>

<p align="center">
    A comprehensive AI chatbot application built with Next.js, featuring OpenRouter integration, model marketplace, and advanced UI/UX.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-marketplace"><strong>Model Marketplace</strong></a> ·
  <a href="#setup"><strong>Setup</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a> ·
  <a href="#usage"><strong>Usage</strong></a>
</p>

---

## ✨ Features

### 🤖 **Advanced AI Integration**
- **OpenRouter API**: Access to 50+ language models from various providers
- **Dynamic Model Selection**: Switch between models on-the-fly
- **Streaming Responses**: Real-time message streaming
- **Model Marketplace**: Browse and select models with pricing information

### 🎨 **Enhanced User Experience**
- **Reply System**: Click reply on any bot message to continue conversations
- **Enhanced Chat Input**: Larger input area with animations and blur effects
- **Settings Panel**: Manage API keys and view usage statistics
- **Modern UI**: Clean design with smooth animations and transitions

### 🔐 **Authentication & Security**
- **NextAuth.js Integration**: Secure user authentication
- **API Key Management**: Secure storage and management of OpenRouter API keys
- **User Profiles**: Personal chat history and preferences

### 💾 **Data Persistence**
- **PostgreSQL**: Reliable chat history storage
- **Redis Caching**: Fast session management and data caching
- **Real-time Updates**: Live chat synchronization

### 🛠 **Developer Experience**
- **Next.js App Router**: Modern React framework with server components
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **Docker Support**: Containerized deployment ready

## 🏪 Model Marketplace

The integrated model marketplace provides:

- **Browse Models**: Explore 50+ AI models from providers like OpenAI, Anthropic, Google, Meta, and more
- **Price Comparison**: View real-time pricing for prompt and completion tokens
- **Model Filtering**: Filter by price (free/paid), search by name, and sort by various criteria
- **Context Information**: See context length and capabilities for each model
- **One-Click Selection**: Instantly switch to any model for your conversations

### Supported Model Providers
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude models)
- Google (Gemini, PaLM)
- Meta (Llama models)
- Microsoft (Azure OpenAI)
- Mistral AI
- Cohere
- And many more through OpenRouter

## 🚀 Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Redis instance
- OpenRouter API key

### Environment Variables

Create a `.env.local` file:

```bash
# Disable Next.js telemetry
NEXT_TELEMETRY_DISABLED=1

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ai_chatbot"
POSTGRES_URL="postgresql://username:password@localhost:5432/ai_chatbot"

# Redis Configuration  
REDIS_URL="redis://localhost:6379"

# Authentication
AUTH_SECRET="your-auth-secret-key-here"
AUTH_URL="http://localhost:3000"

# OpenRouter API (get from https://openrouter.ai/keys)
OPENROUTER_API_KEY="your-openrouter-api-key-here"

# Optional: Google Gemini API (backup)
GOOGLE_GENERATIVE_AI_API_KEY="your-google-api-key-here"
```

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd fereelab-1
npm install --legacy-peer-deps
```

2. **Set up the database:**
```bash
npm run db:migrate
```

3. **Start the development server:**
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🌐 Deployment

### Docker Deployment (Recommended)

```bash
# Build the Docker image
docker build -t ai-chatbot .

# Run with docker-compose
docker-compose up -d
```

### Google Cloud Run

This application is optimized for Google Cloud Run deployment:

1. **Build and push to Google Container Registry:**
```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/ai-chatbot
```

2. **Deploy to Cloud Run:**
```bash
gcloud run deploy ai-chatbot \
  --image gcr.io/PROJECT-ID/ai-chatbot \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Environment Setup for Production

- **Database**: Use Google Cloud SQL for PostgreSQL
- **Cache**: Use Google Memorystore for Redis  
- **Secrets**: Store API keys in Google Secret Manager
- **Networking**: Configure VPC connector for private database access

## 📖 Usage

### Getting Started

1. **Sign Up/Login**: Create an account or sign in
2. **API Key Setup**: Add your OpenRouter API key in settings or during onboarding
3. **Choose a Model**: Browse the model marketplace and select your preferred AI model
4. **Start Chatting**: Begin conversations with your chosen AI model

### Key Features

- **Model Switching**: Use the marketplace button to change models mid-conversation
- **Reply to Messages**: Click the reply button on any bot message to reference it
- **Settings Management**: Access the settings panel (gear icon) to manage API keys
- **Chat History**: All conversations are automatically saved and synced across devices

### API Key Management

1. **Get API Key**: Visit [OpenRouter](https://openrouter.ai/keys) to get your API key
2. **Add Key**: Use the settings panel or onboarding flow to add your key
3. **Usage Tracking**: Monitor your API usage through the settings panel

## 🔧 API Routes

The application provides several API endpoints:

- `GET/POST /api/settings` - Manage user settings and API keys
- `GET /api/models` - Fetch available models from OpenRouter
- `POST /api/chat` - Send chat messages and receive AI responses
- `GET /api/history` - Retrieve chat history
- `POST /api/auth/*` - Authentication endpoints

## 🏗 Architecture

### Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL, Redis
- **AI**: OpenRouter API integration  
- **Authentication**: NextAuth.js
- **Deployment**: Docker, Google Cloud Run

### Key Design Decisions
- **Stateless Architecture**: Compatible with serverless deployment
- **Edge-First**: Optimized for edge computing and CDN delivery
- **Database Agnostic**: Easy to switch between database providers
- **Security First**: API keys encrypted, no hardcoded secrets

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js, OpenRouter, and modern web technologies.**

Before running the application locally, you need to set up the following services:

#### 1. PostgreSQL Database

**Option A: Using Docker (Recommended)**
```bash
# Run PostgreSQL container
docker run --name fereelab-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=fereelab \
  -p 5432:5432 \
  -d postgres:15
```

**Option B: Install PostgreSQL locally**
- Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
- Create a database named `fereelab`
- Create a user with appropriate permissions

#### 2. Redis

**Option A: Using Docker (Recommended)**
```bash
# Run Redis container
docker run --name fereelab-redis \
  -p 6379:6379 \
  -d redis:7-alpine
```

**Option B: Install Redis locally**
- Install Redis from [redis.io](https://redis.io/download)
- Start the Redis server on default port 6379

#### 3. OpenRouter API Key

1. Sign up at [OpenRouter](https://openrouter.ai)
2. Navigate to [API Keys](https://openrouter.ai/keys)
3. Create a new API key
4. Copy the key for use in your environment variables

### Setup and Installation

1. **Clone the repository and install dependencies:**
```bash
git clone <your-repository-url>
cd fereelab-1
npm install
```

2. **Set up environment variables:**
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your actual values
# AUTH_SECRET=your-generated-secret
# OPENROUTER_API_KEY=your-openrouter-api-key
# POSTGRES_URL=postgresql://postgres:password@localhost:5432/fereelab
# REDIS_URL=redis://localhost:6379
```

3. **Generate AUTH_SECRET:**
```bash
# Generate a random secret
openssl rand -base64 32
# Or visit https://generate-secret.vercel.app/32
```

4. **Run database migrations:**
```bash
npm run db:migrate
```

5. **Start the development server:**
```bash
npm run dev
```

Your app should now be running on [localhost:3000](http://localhost:3000).

### Production Build

For production builds, make sure to run migrations before building:

```bash
# Run migrations first
npm run db:migrate

# Then build
npm run build

# Start production server
npm start
```

### Database Management

```bash
# Generate new migration
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio

# Push schema changes directly (development only)
npm run db:push
```

### Development Workflow

1. **Start services** (if using Docker):
```bash
# Start both PostgreSQL and Redis
docker start fereelab-postgres fereelab-redis
```

2. **Development server**:
```bash
npm run dev
```

3. **Building for production**:
```bash
npm run build
npm start
```

### Troubleshooting

**Database connection issues:**
- Ensure PostgreSQL is running on port 5432
- Check that the database `fereelab` exists
- Verify connection string in `.env.local`

**Redis connection issues:**
- Ensure Redis is running on port 6379
- Check Redis connection with: `redis-cli ping`

**OpenRouter API issues:**
- Verify your API key is valid
- Check your OpenRouter account balance
- Ensure the API key has appropriate permissions

### Docker Compose (Alternative Setup)

Create a `docker-compose.yml` file for easier local development:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: fereelab
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

Then run:
```bash
docker-compose up -d
```
