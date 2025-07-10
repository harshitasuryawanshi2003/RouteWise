# RouteWise - Smart Waste Collection System

RouteWise is a full-stack web application designed to optimize garbage collection routes based on bin fill levels (manually updated by Admin) and real road distances. It provides dashboards for Admins, Collectors, and Citizens to manage bins, view routes, and report issues.

---

## Tech Stack

**Frontend (React):**
- React.js (CRA)
- Tailwind CSS
- React Router
- Axios
- Leaflet.js (Map)
- Lucide React (Icons)

**Backend (Node.js):**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for Auth
- Dijkstra's Algorithm + Greedy approach for route planning
- OpenRouteService API (for real road distances between bins)

---

## 👥 Roles

- **Admin:** Add/edit/remove bins, mark depot, update bin fill levels manually, view reports
- **Collector:** View optimized route for collecting full bins (>=75% fill level)
- **Citizen:** Report bin-related issues 

---

## 📦 Key Features

- Add bins/depot via interactive map (Admin)
- Admin updates fill levels manually
- Automatic road-distance edge creation using ORS API
- MongoDB stores bin and edge data
- Optimized route computed using Dijkstra + Greedy logic
- Citizens can report bin issues
- Role-based dashboards and JWT-based authentication

---

## 🔧 Project Setup

### Prerequisites
- Node.js and npm
- MongoDB running locally or via Atlas
- OpenRouteService (ORS) API key

---


### 🚀 Installation & Running the App

1. Clone the repository:
   ```bash
   git clone https://github.com/harshitasuryawanshi2003/RouteWise.git
   cd RouteWise
   ```

2. Install root dependencies (for concurrently):
   ```bash
   npm install
   ```

3. Install backend dependencies:
  ```bash
  cd server
  npm install
  ```

4. Add a .env file in the /server folder with:
```bash
    PORT=4000
    MONGODB_URL=your_mongodb_connection_uri
    JWT_SECRET=your_jwt_secret_key
    ORS_API_KEY=your_ors_api_key
```

5. Go back to root and run both servers:
   ```bash
    cd ..
    npm run dev
   ```

 This will start:

Backend on: http://localhost:4000

Frontend on: http://localhost:3000
