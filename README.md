# AhonNa - Tagbilaran Evacuation & Routing System

AhonNa is a web-based disaster response platform designed for Tagbilaran City, Bohol. It provides interactive map routing to evacuation centers, real-time center occupancy tracking, secure user registration and login, and an integrated emergency relief donation gateway powered by PayMongo.

---

## Features
- **User Authentication**: Secure user registration, password hashing via `bcryptjs`, and session-based authentication (`express-session`).
- **Interactive Evacuation Map**: Dynamic map markers powered by Leaflet.js showcasing evacuation center capacities, status, and precise geographic coordinates.
- **PayMongo Checkout Integration**: Asynchronous checkout initialization using PayMongo test API supporting GCash, Maya, Debit/Credit Cards, and QRPH.
- **Responsive UI**: Built with Bootstrap 5 for desktop and mobile devices.

---

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MySQL (`ahonna_db`)
- **Frontend**: HTML5, Bootstrap 5, Leaflet.js, Vanilla JavaScript
- **Security**: `bcryptjs`, `express-session`, `dotenv`

---

## Setup & Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd ahonna-tagbilaran