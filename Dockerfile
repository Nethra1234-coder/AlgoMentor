# Stage 1: Build the React Frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend-react

# Install dependencies first for better caching
COPY frontend-react/package*.json ./
RUN npm install

# Copy all frontend files and build
COPY frontend-react/ ./
RUN npm run build

# Stage 2: Serve with Python Backend
FROM python:3.11-slim
WORKDIR /app

# Copy backend requirements and install
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the rest of the backend files
COPY backend/ ./backend/

# Copy the built React app into the static folder for FastAPI to serve
COPY --from=frontend-build /app/frontend-react/dist ./backend/static

# Set working directory to backend
WORKDIR /app/backend

# The PORT environment variable will be provided by Cloud Run
CMD ["python", "main.py"]
