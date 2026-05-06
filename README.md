# 🏡 BookMyStay

> A full stack property listing platform with maps, reviews & ratings. Booking system coming soon!

🔗 **Live Demo:** [Click here to view](https://full-stack-property-booking-platform.onrender.com)

---

## ✨ Features

- **Property Listings** — Users can create, edit and delete property listings
- **Reviews & Ratings** — Authenticated users can leave reviews on listings
- **Interactive Map** — Each listing shows location using **Mapbox**
- **Authentication** — Secure login & signup using **Passport.js Local Strategy**
- **Session Based Auth** — User sessions managed securely on the server
- **Responsive Design** — Works seamlessly on mobile and desktop
- **Coming Soon:** Booking & payment system is currently under development!

---

## 🛠️ Tech Stack

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MUI](https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### Auth & Maps
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)

---

## 🔐 Authentication Flow

- User registers with **username & password**
- Password is **hashed and stored** securely in MongoDB
- Login handled via **Passport Local Strategy**
- User session is maintained using **express-session**
- Protected routes redirect unauthenticated users to login page

---

## 📁 Project Structure

```
wanderlust/
├── models/
│   ├── listing.js       # Listing schema
│   ├── review.js        # Review schema
│   └── user.js          # User schema
├── routes/
│   ├── listing.js       # Listing routes
│   ├── review.js        # Review routes
│   └── user.js          # Auth routes
├── views/
│   ├── listings/        # EJS templates for listings
│   ├── users/           # Login & signup pages
│   └── partials/        # Navbar, footer
├── public/              # Static CSS, JS files
├── app.js               # Main server file
└── .env                 # Environment variables
```

---

## ⚙️ Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/wanderlust.git

# 2. Navigate to project directory
cd wanderlust

# 3. Install dependencies
npm install

# 4. Create a .env file and add the following
MONGO_URL=your_mongodb_connection_string
SECRET=your_session_secret
MAPBOX_TOKEN=your_mapbox_token

# 5. Start the server
node app.js
```

---

## 🌍 Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URL` | MongoDB connection string |
| `SECRET` | Session secret key |
| `MAPBOX_TOKEN` | Mapbox API token for maps |

---

## 🚀 Deployment

This project is deployed on **Render/Railway**.
- Server: Node.js + Express
- Database: MongoDB Atlas

