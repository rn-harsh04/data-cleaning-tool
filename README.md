# 🛠️ Automated Data Cleaning Tool

![image](https://github.com/user-attachments/assets/6cbf8480-bca4-46a8-b3ff-1974e002e855)

Dashboard By PowerBi


A web-based **data cleaning and preprocessing tool** that allows users to **upload CSV files**, process them, and download the cleaned datasets.

---
✨ Full Features
📤 File upload (CSV)

🧹 Data cleaning:

Duplicate removal

Missing value handling

Text normalization

📊 NEW: Real-time analytics dashboard

📥 Cleaned data export

🎨 Responsive UI (Tailwind CSS)

🆕 New Features (Latest Update)
📊 Real-time Analytics Dashboard:

Visual data statistics with Chart.js

Interactive data visualizations

Live updates during data cleaning

Enhanced user experience
## 🚀 Quick Start

### Clone the Project
```sh
git clone https://github.com/rn-harsh04/data-cleaning-tool.git
cd data-cleaning-tool
🛠️ Setup
1. Backend (FastAPI)
sh
# Create and activate virtual environment(optional but recommended)
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install Python dependencies
pip install fastapi uvicorn pandas python-multipart
2. Frontend (React)
sh
# Install Node.js dependencies
npm install
npm install chart.js axios

# Start both servers:
# In one terminal (backend):
uvicorn main:app --reload

# In another terminal (frontend):
npm run dev
📌 Access:

Backend: http://127.0.0.1:8000

Frontend: http://localhost:5173

API Docs: http://127.0.0.1:8000/docs
