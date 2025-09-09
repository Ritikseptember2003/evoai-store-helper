# EvoAI Store Helper

A chat-style store assistant with a Node.js/Express backend and a React/Vite frontend. It allows users to search products, add items to a cart, and check order status through a simple chat interface. This project was completed as a full-stack mini-assignment, including all "Nice-to-Have" bonus features.

## Live Demo

**[Deployed Application URL]**

---

## Features

### Core MVP
* **Chat Interface:** Simple, rule-based intent recognition for a smooth user experience.
* **Product Search:** Filter products by title or tags.
* **Shopping Cart:** Add items to a persistent in-memory cart.
* **Order Tracking:** Securely check order status with an Order ID and email.
* **Audit Logging:** All API interactions are logged for observability.

### Bonus Features
* **Rate Limiting:** The `/order/status` endpoint is rate-limited to prevent abuse.
* **Privacy:** Emails are masked in the audit log to protect user privacy.
* **Price Filters:** The `/search` endpoint accepts `minPrice` and `maxPrice` filters.
* **Analytics:** A `/metrics` endpoint provides basic counts of user interactions.
* **Dockerized:** The backend is fully containerized with Docker for easy setup and deployment.

---

## Project Structure

This project is a monorepo with two main folders:

* **/api**: The Node.js, Express, and TypeScript backend.
* **/web**: The React, Vite, and TypeScript frontend client.

---

## Getting Started

### Prerequisites

* Node.js (v18 or later)
* npm
* Docker & Docker Compose (for the containerized method)

### Method 1: Local Development (Recommended)

#### 1. Backend Setup (API)

First, set up and run the backend server.

```bash
# Navigate to the API directory
cd api

# Install dependencies
npm install

# Run the development server (with hot-reloading)
npm run dev
```

**Note**: The API will now be running on http://localhost:3001

---

#### 2. Frontend Setup (Web)

In a **new terminal window**, set up and run the frontend client.

```bash
# Navigate to the web directory
cd web

# Install dependencies
npm install

# Run the development server
npm run dev
```

**Note**: The frontend application will now be available at http://localhost:5173.

### Method 2: Running the Backend with Docker

This method runs the final build of the backend inside a container.

```bash
# Navigate to the root project directory
cd Evoai-Helper

# Build the image and start the container
docker-compose up --build
```

The API will be available at http://localhost:3001. You can then start the frontend using the `npm run dev` command as shown in Method 1.

## Running Tests

To run the backend API tests, navigate to the `/api` directory and use the test script.

```bash
# Navigate to the API directory
cd api

# Run the Jest test suite
npm test
```

## API Endpoints & Examples

You can test the API endpoints using curl.

### Health & Metrics

* **GET /health**: Checks the status of the API server.

```bash
curl http://localhost:3001/health
```

* **GET /metrics**: Returns a JSON object with interaction counts.

```bash
curl http://localhost:3001/metrics
```

### Search Products

* **GET /search**: Filters products by a query string.

**Query Params:**
* `q` (required): The search term.
* `minPrice` (optional): Minimum product price.
* `maxPrice` (optional): Maximum product price.

```bash
# Basic search
curl "http://localhost:3001/search?q=winter"

# Search with price filter
curl "http://localhost:3001/search?q=a&minPrice=50"
```

### Cart & Orders

* **POST /cart/add**: Adds an item to the cart.

```bash
curl -X POST -H "Content-Type: application/json" -d '{"productId":"p1", "qty":2}' http://localhost:3001/cart/add
```

* **POST /order/status**: Securely retrieves order status. (This endpoint is rate-limited).

```bash
curl -X POST -H "Content-Type: application/json" -d '{"orderId":"ORD-1001", "email":"alice@example.com"}' http://localhost:3001/order/status
```