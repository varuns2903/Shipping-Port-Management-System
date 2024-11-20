
---

# Ship Port Management System 🚢⚓  

## Overview  
The **Ship Port Management System** is a comprehensive application designed to manage port operations efficiently. It enables administrators to oversee ports, ships, employees, and bookings, while providing users a seamless interface for interacting with port services.  

---

## Authors  
- [Varun S](https://github.com/varuns2903)  
- [Vignesh](https://github.com/vignesh3613)  

---

## Prerequisites  

To run the project, ensure you have the following installed:  

### System Requirements  
1. **Operating System:** Windows/Mac/Linux  
2. **Node.js:** Version 16.0.0 or later  
3. **MySQL:** Version 8.0 or later  
4. **npm:** Version 7.0 or later  

### Required Tools  
- **Database Client:** MySQL Workbench, DBeaver, or any compatible client for running `.sql` scripts.  
- **Code Editor:** Visual Studio Code or similar.  

---

## Getting Started  

### Installation  

1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/varuns2903/Shipping-Port-Management-System.git
   cd Shipping-Port-Management-System
   ```  

2. **Database Setup:**  
   - Open your database client.  
   - Execute the `db.sql` file to create the database schema.  

3. **Backend Configuration:**  
   - Navigate to the `server` directory.  
   - Create a `.env` file with the following content:  
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=your_database_name
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```  

4. **Install Dependencies:**  
   - **Root-level dependencies:**  
     ```bash
     npm install
     ```  

   - **Frontend dependencies:**  
     ```bash
     cd client
     npm install
     ```  

   - **Backend dependencies:**  
     ```bash
     cd ../server
     npm install
     ```  

5. **Run the Application:**  
   Make sure your `package.json` in the root directory looks like this :  
   ```json
   {
     "dependencies": {
       "concurrently": "^9.1.0",
       "nodemon": "^3.1.7"
     },
     "scripts": {
       "server": "cd server && nodemon server.js",
       "client": "cd client && npm run dev",
       "dev": "concurrently \"npm run server\" \"npm run client\""
     }
   }
   ```  
   - From the root directory, execute:  
     ```bash
     npm run dev
     ```  
   - This will start both the server and the frontend simultaneously.  

---

## Project Structure  

### Directory Layout  

```
Shipping-Port-Management-System  
│  
├── client/               # Frontend (React powered by Vite)  
│   ├── src/              # Source code for the frontend  
│   ├── public/           # Public assets  
│   ├── package.json  
│   └── vite.config.js  
│  
├── server/               # Backend (Node.js with Express.js)  
│   ├── src/              # Source code for backend logic  
│   ├── package.json  
│   └── .env.example      # Backend environment variables template  
│  
├── db.sql                # Database schema  
├── package.json          # Root-level configurations  
└── README.md             # Project documentation  
```  

---

## Features  

### For Admins  
- Manage countries, ports, ships, employees, and bookings.  
- Add, update, or remove user accounts and assign roles.  
- Access booking logs for auditing.  

### For Users  
- Browse available ports.  
- Book and manage port services.  
- Cancel pending bookings.  
- Update profile details.  

---

## Technology Stack  

- **Frontend:** React (Vite), Bootstrap  
- **Backend:** Node.js (Express.js)  
- **Database:** MySQL  
- **Styling:** Bootstrap  

---

## Learning Resources  

### MySQL  
- [MySQL Documentation](https://dev.mysql.com/doc/)  
- [MySQL Tutorials](https://www.mysqltutorial.org/)  

### React  
- [React Documentation](https://reactjs.org/docs/getting-started.html)  
- [React Beginner Guide](https://www.freecodecamp.org/news/react-beginner-handbook/)  

### JWT (JSON Web Tokens)  
- [JWT Documentation](https://jwt.io/)  
- [Understanding JWTs](https://auth0.com/learn/json-web-tokens/)  

### Node.js and Express.js  
- [Node.js Docs](https://nodejs.org/en/docs/)  
- [Express.js Guide](https://expressjs.com/en/starter/installing.html)  

---

## Future Enhancements  

1. **Advanced Analytics:**  
   - Implement dashboards for admin insights.  

2. **Real-Time Notifications:**  
   - Enable live updates for bookings and changes.  

3. **Enhanced Container Management:**  
   - Add real-time monitoring for containers.  

---

## Screenshots  
- Registration
![image](https://github.com/user-attachments/assets/995887de-bf55-40bb-a68c-7bebdb638952)

- Login
![image](https://github.com/user-attachments/assets/ee2fc421-5643-4db5-9bfe-810ded26024c)


### User Pages  
- User Dashboard
![image](https://github.com/user-attachments/assets/e3c77139-d62c-4fbb-9dce-1f7a59fa8945)

- Browse Ports
![image](https://github.com/user-attachments/assets/76ad796b-66ca-451d-976e-d9a58a03eeee)

- Book Ports
![image](https://github.com/user-attachments/assets/d193a608-be76-4cc2-8a40-1a00d7b22265)

- Manage Bookings  
![image](https://github.com/user-attachments/assets/7cf8bb64-be1c-4e8a-9d6e-351d9ef6d0c5)
- User profile
![image](https://github.com/user-attachments/assets/e75d753b-c7c8-4846-8e5b-93ff5eb40c24)


### Admin Pages  
- Admin Dashboard
![image](https://github.com/user-attachments/assets/a96a1728-ce55-4a27-b524-bcc22d32f333)

- Manage Users
![image](https://github.com/user-attachments/assets/927837fa-fa70-43da-a2ac-fd7ad18828ca)

- Manage Ports
![image](https://github.com/user-attachments/assets/808bffbe-1bb2-47e4-aaa6-d8232c34bb52)

- Manage Bookings
![image](https://github.com/user-attachments/assets/6abbaec9-0afe-4d47-b601-e161af94f286)
- Booking logs
![image](https://github.com/user-attachments/assets/ea87dd8c-fff1-4389-aff3-0ae37b49caf7)

- Manage Countries
![image](https://github.com/user-attachments/assets/4757d2b5-7173-4550-ad73-54d8a7ffa39a)

- Manage Employees
![image](https://github.com/user-attachments/assets/56ea44b0-d436-47f4-9e9b-1bf016b53728)

- Manage Ships
![image](https://github.com/user-attachments/assets/7af12c8f-e249-41d2-aa16-59abf02a6085)

- Manage Conatiner
![image](https://github.com/user-attachments/assets/7a9a7d18-097b-4afd-9531-1047b1d13dd5)

---

## Contributing  

Contributions are welcome! Follow these steps:  
1. **Fork** the repository.  
2. Create a **new branch** for your changes.  
3. Submit a **pull request** with a detailed explanation.  

---

## Contact  

Have questions or feedback? Reach out!  
- **Vignesh:** [vignesh3613@gmail.com](mailto:vignesh3613@gmail.com)  
- **Varun S:** [04varuns@gmail.com](mailto:04varuns@gmail.com)  

---

## Thank You!  

If you find this project helpful, please give it a ⭐️ and share your feedback. 🚢✨  
*"Efficient ports, smooth sailing."*  

---

