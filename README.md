# 🛠️ Automated Data Cleaning Tool

![image](https://github.com/user-attachments/assets/6cbf8480-bca4-46a8-b3ff-1974e002e855)

Dashboard By PowerBi


A web-based **data cleaning and preprocessing tool** that allows users to **upload CSV/JSON files**, process them, and download the cleaned datasets.

---

## 💄 Clone This Project

To clone this project to your **VS Code**, open the terminal and run:

```sh
git clone https://github.com/yourusername/repo-name.git
```
Then, navigate into the project folder:

```sh
cd repo-name
```

---

## 🚀 Running the Project

### **🔹 1⃣ Backend (FastAPI - Python)**
The backend is built using **FastAPI** and **Pandas** for data processing.

#### **🔧 Setup & Run Backend**
1. **Create a virtual environment** (optional but recommended):
   ```sh
   python -m venv venv
   ```
2. **Activate the virtual environment**:
   - **Windows**:  
     ```sh
     venv\Scripts\activate
     ```
   - **Mac/Linux**:  
     ```sh
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```sh
   pip install -r requirements.txt
   ```

4. **Start the FastAPI server**:
   ```sh
   uvicorn main:app --reload
   ```
5. **Backend is running at:**  
   👉 Open: [`http://127.0.0.1:8000`](http://127.0.0.1:8000)  
   👉 API Docs: [`http://127.0.0.1:8000/docs`](http://127.0.0.1:8000/docs) (Swagger UI)

---

### **🔹 2⃣ Frontend (React - JavaScript)**
The frontend is built using **React.js** with **Axios** for API calls.

#### **🔧 Setup & Run Frontend**
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Start the React development server**:
   ```sh
   npm run dev
   ```
4. **Frontend is running at:**  
   👉 [`http://localhost:5173`](http://localhost:5173)

---

## 🛠️ Features
✔️ Upload CSV/JSON files  
✔️ Automated data cleaning (removes duplicates, fills missing values, converts text to lowercase)  
✔️ Download the cleaned dataset  
✔️ Simple & modern UI  

---

## 🤝 Contributing
Feel free to contribute by submitting a **pull request**! For major changes, open an **issue first** to discuss your ideas.

---

## 📝 License
This project is **open-source** and available under the **MIT License**.

---

