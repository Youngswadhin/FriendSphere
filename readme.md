

### 📌 **README.md**  

# **Authentication API**  
This API provides user authentication functionalities including Sign-Up, Login, JWT-based authentication, and user location-based suggestions.

---

## 🚀 **Getting Started**  

### **1️⃣ Sign-Up & Login**  
If you're unable to sign up, you can use the following test credentials:  

| User  | Email               | Password      |
|-------|---------------------|--------------|
| Neha  | neha@example.com    | neha@pass123 |
| Amit  | amit@example.com    | amit@pass    |
| Sita  | sita@example.com    | sita123      |

📌 **Steps to Login:**  
1. Send a **POST request** to `/login` with your email and password.  
2. If authentication is successful, you'll receive a JWT token in cookies.  

---

### **2️⃣ How It Works?**  

✅ **After Sign-Up / Login:**  
- You will see **user suggestions** based on your location.  
- Simply **click** or **press enter** in the suggestion bar to see nearby users.  

✅ **Operations Available:**  
- **Update Profile** – Modify your name, email, age, hobbies, or address.  
- **Update Password** – Change your password securely.  
- **Logout** – End your session and remove JWT.  

---

## 🔧 **API Endpoints**  

### 🔹 **User Authentication**  
- `POST /sign-up` – Register a new user  
- `POST /login` – Authenticate and receive a JWT token  
- `GET /` – Fetch logged-in user details  
- `POST /logout` – Logout user  

### 🔹 **User Operations**  
- `PUT /update` – Update user profile  
- `PUT /password-update` – Update user password  

---

## 💡 **Tech Stack Used**  
- **Backend:** Express.js, Node.js, Prisma  
- **Database:** MongoDB (via Prisma ORM)  
- **Security:** JWT Authentication, Bcrypt for password hashing  

---



