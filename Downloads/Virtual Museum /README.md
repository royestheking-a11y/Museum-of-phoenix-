<div align="center">
  <img src="public/museum_exterior_night.jpg" alt="Museum of Phoenix" width="100%" />
  
  <h1>🏛️ Museum of Phoenix</h1>
  <p><strong>Ancient History, Artifacts & Cultural Heritage Museum</strong></p>
  <p><em>متحف العنقاء للتراث والحضارة</em></p>
</div>

---

## 🌟 Overview

The **Museum of Phoenix** is a fully immersive, state-of-the-state virtual museum web application. Designed to preserve history, heritage, and human civilization, the platform provides an interactive digital experience for exploring rare artifacts, historical collections, and immersive exhibitions that connect visitors with the past.

Built with modern web technologies, the platform features a stunning glassmorphism design, full bilingual support (English and Arabic), interactive exhibit halls, and a robust backend for complete administrative control.

## ✨ Key Features

### 🏛️ Immersive Exhibit Halls
* **Quran Hall:** Explore ancient manuscripts and religious history.
* **History Hall:** Walk through the ages of civilization.
* **Semiotics Hall:** Uncover the deep meanings of historical symbols.
* **Cryptography Hall:** Discover ancient codes and ciphers.

### 🌐 Full Bilingual Support
* Seamlessly switch between **English (LTR)** and **Arabic (RTL)**.
* UI components, typography, and layout automatically adjust based on the selected language.

### 💎 Premium User Experience
* Gorgeous **Glassmorphism UI** with blurred backdrops and gold accents.
* Interactive 3D particle animations and smooth page transitions.
* Custom audio system with background ambiance.

### 🎓 Education & Research
* **Research Library:** Access historical documents, research papers, and ancient texts.
* **Courses Dashboard:** Enroll in specialized courses taught by top researchers.
* **Membership Tiers:** Visitor, Researcher, Scholar, and VIP Guest access levels.

### ⚙️ Robust Admin Panel
* Full CRUD (Create, Read, Update, Delete) management.
* Manage Users, Artifacts, Courses, and Published Articles.
* Review membership payments and applications.

## 🛠️ Technology Stack

**Frontend:**
* React (Vite)
* Tailwind CSS (Customized for glassmorphism)
* Framer Motion (Animations)
* Radix UI & Lucide React (Icons)
* TypeScript

**Backend:**
* Node.js & Express.js
* MongoDB (Mongoose)
* JWT Authentication
* RESTful API

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB Cluster (Atlas) or local instance

### 1. Installation
Clone the repository and install dependencies:
```bash
# Install frontend and concurrently
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Variables
Create a `.env` file in the `server` directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5005
```

If deploying, set up the frontend `.env` (or pass it through your hosting provider):
```env
VITE_API_BASE_URL=http://localhost:5005
```

### 3. Run Locally
We use `concurrently` to run both the frontend and backend simultaneously:
```bash
npm run dev
```
* **Frontend** will start at `http://localhost:5173`
* **Backend** will start at `http://localhost:5005`

## 🌍 Deployment Options

This project is perfectly optimized for modern cloud hosting:
* **Frontend:** Deploy effortlessly on **Vercel** or **Netlify** (Set build command to `npm run build` and output to `dist`).
* **Backend:** Deploy on **Render**, **Railway**, or **Heroku**. Simply point the root directory to the `server/` folder and set the start command to `npm start`.

---
*Inspired by the symbolic phoenix, we represent rebirth, knowledge, and timeless legacy through education, research, and preservation.*