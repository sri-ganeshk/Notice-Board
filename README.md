# Notice Board & Event Management App

A full-stack application built with Angular (Frontend) and Express/MongoDB (Backend) to manage academic, sports, and cultural notices, as well as upcoming events. It includes user authentication, role-based access, and commenting systems for both events and notices.

The project is structured as a monorepo and configured to be easily deployed to **Vercel** with a single click.

## 🚀 Technologies Used
* **Frontend**: Angular, TypeScript, RxJS
* **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth
* **Deployment**: Vercel (Serverless Functions for the API + Static Build for Angular)

---

## 🛠️ How to Run Locally

### 1. Run the Backend
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the **root of the project** containing your configuration:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/taskinn
   JWT_SECRET=your_jwt_secret_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The backend will run at `http://localhost:3000`*

### 2. Run the Frontend
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
   *The frontend will run at `http://localhost:4200`. The frontend is automatically configured to point to your local backend API via `environment.development.ts`.*

---

## ☁️ Deployment (Vercel)

This repository contains a `vercel.json` file at its root. To deploy the application:
1. Import the repository into your Vercel dashboard.
2. Add your production `.env` variables (like `MONGO_URI` and `JWT_SECRET`) in the Vercel project settings.
3. **Deploy!** Vercel will automatically build the Angular app and deploy the Express endpoints as Serverless Functions (`/api/*`).
