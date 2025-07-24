# Project Overview
This project is a full-stack AI chatbot application. The backend is built with Next.js API Routes and the frontend with the Next.js App Router (React). The entire application is deployed as a single Docker container to Google Cloud Run, not the Vercel platform.

# Core Technologies & Stack
Application Framework: Next.js (TypeScript, App Router)

AI Integration: Vercel AI SDK, Google Gemini API

Hosting: Google Cloud Run (via Docker)

Database: Google Cloud SQL for PostgreSQL

Caching: Google Memorystore for Redis

Containerization: Docker (multi-stage builds)

CI/CD: Google Cloud Build, triggered from GitHub

# Key Directories & Files
/app: Main source code for Next.js, including API routes and React components.

Dockerfile: Defines the production container build for Cloud Run.

cloudbuild.yaml: Defines the CI/CD pipeline steps for Google Cloud Build.

.env.local: Local development environment variables. Must not be committed to Git.

# Coding & Architectural Standards
Use TypeScript with strict mode enabled.

All React components must be function-based with Hooks.

Use Tailwind CSS for all styling.

All secrets (API keys, DB passwords) must be accessed via process.env.

Database connections should use the node-postgres (pg) library.

The application must be stateless to work correctly on Cloud Run.

# CI/CD & Deployment Workflow
The main branch on GitHub is the production branch.

A git push to main automatically triggers the Google Cloud Build pipeline.

The cloudbuild.yaml file contains the logic to:

Build the Docker image.

Push the image to Google Artifact Registry.

Deploy the new image to the Google Cloud Run service.

# Cautions & Best Practices
Never hardcode secrets or API keys directly in the code.

Always ensure .env.local and other secret files are listed in .gitignore.

For local development, connect to the database using the Cloud SQL Auth Proxy.

In production on Cloud Run, connect to the database using its private IP address via a Serverless VPC Connector.

Write efficient, multi-stage Dockerfiles to create small and secure production images.

Ensure all backend logic is stateless, as Cloud Run can create or destroy instances at any time.