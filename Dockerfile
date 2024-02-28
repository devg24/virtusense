# Stage 1: Build the React frontend
FROM FROM node:18-alpine AS react-build
WORKDIR /app
COPY my-app/package.json my-app/package-lock.json ./
RUN npm install
COPY my-app ./
RUN npm run build

# Stage 2: Build the Python backend
FROM python:3.11 AS python-build
WORKDIR /app
COPY python-backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Stage 3: Combine frontend, backend, and server
FROM python:3.11 AS final
WORKDIR /app
COPY --from=react-build /app/build ./my-app/build
COPY --from=python-build /app ./python-backend
COPY my-app/src/server.js ./


# Expose the port your server runs on
EXPOSE 2000

# Command to run your server
CMD ["node", "server.js", "&&", "npm", "start"]
