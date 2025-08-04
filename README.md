# 🧩 Form Builder Web App

A full-featured, Figma-accurate form and project builder application built using React, Node.js, and MongoDB. It supports secure authentication, real-time form editing, access control, conditional logic, and draft saving—all without third-party UI libraries.

---

## 🚀 Setup Instructions

### 🔧 Prerequisites
- Node.js >= 18
- MongoDB Atlas account or local MongoDB instance
- A `.env` file with the required secrets (see below)

### 🖥️ Local Setup

#### 1. **Clone the repository**
git clone https://github.com/faiyazansari0010/Canova-Frontend
cd Canova-Frontend

git clone https://github.com/faiyazansari0010/Canova-Backend
cd Canova-Backend

2. Backend and Frontend Setup
cd Canova-Frontend
npm install
npm run dev

cd Canova-Backend
npm install
nom run dev

3. Create a .env file inside Canova-Backend/ with:
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
EMAIL_USER=<your-email@example.com>
EMAIL_PASS=<your-email-password>
FRONTEND_URL=http://localhost:5173

4. Create a constants.js file in Canova-Frontend/ with:
export const API_BASE_URL = <your backend site on render.com>

✨ Features Implemented
🔐 Authentication & Authorization
Custom-built JWT authentication

Secure login/signup with form validation

OTP-based Forgot Password with email verification

JWT stored securely for session persistence

No third-party auth libraries used

🏗️ Form Builder
Create and edit customizable forms with:

Text, image, video, and prompt-based questions

In-place editing of questions/options

Keyboard-driven option handling (Enter to add, Backspace to delete)

Draft saving and management

Visual design customization: background/section colors

Final Layout Review before publishing

Conditional logic with dynamic form redirection

Access control: view/edit/share + public/private modes

📦 Dashboard & Navigation
Sidebar navigation for:

Home

Templates

Projects

Analytics

Create new Form/Project from dashboard

Close modal on outside click

📊 Activity & Collaboration
Recent activity tracking (forms & projects)

Shared forms section with permission enforcement:

Creator = Edit access

Invited users = View-only

Share access control:

Edit, View, Share roles

Public/Selected participants visibility

👤 Profile Page
Update account info, notification settings, preferences

Changes are immediately reflected or on save

📬 Notifications
React Toastify used for all feedback:

Success/failure (login, signup, save draft, etc.)

Real-time UI updates

⚙️ Technical Constraints Respected
No UI libraries like MUI, Bootstrap, Ant Design

All components hand-built per Figma design

One HTTP request per form action (login/signup/reset) verified via Network tab

Fully responsive layout matching Figma breakpoints

🧪 Demo Credentials
Use the following test account for exploring the app:
Email: faiyaz@gmail.com
Password: faiyazansari0010

Live Demo link - https://canova-frontend.netlify.app