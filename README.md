<a href="https://chat.vercel.ai/">
  <img alt="Next.js 14 and App Router-ready AI chatbot." src="app/(chat)/opengraph-image.png">
  <h1 align="center">Chat SDK</h1>
</a>

<p align="center">
    Chat SDK is a free, open-source template built with Next.js and the AI SDK that helps you quickly build powerful chatbot applications.
</p>

<p align="center">
  <a href="https://chat-sdk.dev"><strong>Read Docs</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports OpenRouter (default) for access to multiple AI providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - PostgreSQL for saving chat history and user data
  - Redis for session storage and caching
- [Auth.js](https://authjs.dev)
  - Simple and secure authentication

## Model Providers

This template uses [OpenRouter](https://openrouter.ai) as the AI provider, giving you access to a wide variety of language models from different providers. You can easily switch between models and providers through OpenRouter's unified API.

## Deploy Your Own

You can deploy your own version of the Next.js AI Chatbot to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET&envDescription=Learn+more+about+how+to+get+the+API+Keys+for+the+application&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&demo-title=AI+Chatbot&demo-description=An+Open-Source+AI+Chatbot+Template+Built+With+Next.js+and+the+AI+SDK+by+Vercel.&demo-url=https%3A%2F%2Fchat.vercel.ai&products=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22ai%22%2C%22productSlug%22%3A%22grok%22%2C%22integrationSlug%22%3A%22xai%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22neon%22%2C%22integrationSlug%22%3A%22neon%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22upstash-kv%22%2C%22integrationSlug%22%3A%22upstash%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

## Running locally

### Prerequisites

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
