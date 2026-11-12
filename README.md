```markdown
# 🧘‍♂️ GenAI Wellness Dashboard (PJ2)

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Streamlit](https://img.shields.io/badge/Streamlit-Framework-FF4B4B.svg)
![Gemini](https://img.shields.io/badge/GenAI-Google_Gemini-8E75B2.svg)

A personalized, interactive Wellness Dashboard built with Python and Streamlit. This project fulfills the **PJ2 (Wellness Dashboard)** requirements by combining data logging, interactive UI components, and Google's Gemini Generative AI to provide personalized health, nutrition, and sleep recommendations.

## ✨ Features

- **🔐 User Authentication**: Mock Login and Sign-Up pages to capture user data (Age, Weight) for personalized AI analysis.
- **🧭 Interactive Sidebar**: Easy navigation between different dashboard modules.
- **📊 Overview Dashboard**: A quick-glance view of daily metrics (Steps, Calories, Water) and a log of recent physical activities.
- **🏃‍♂️ Activity Logger**: A dedicated form to log physical activities, including date, type of workout, duration, and intensity slider.
- **🤖 AI Nutrition & Sleep Coach**: Integrates with Google Gemini API to analyze your recent physical activities and biometric data to suggest:
  - Daily nutritional needs and recovery foods.
  - Optimal sleep patterns, duration, and deep-sleep tips.
- **⚙️ Dynamic Settings**: Toggle which metric widgets (Steps, Calories, Water) appear on your Overview page using session-state memory.

## 🛠️ Tech Stack

- **Frontend & Backend UI**: [Streamlit](https://streamlit.io/)
- **Data Handling**: [Pandas](https://pandas.pydata.org/)
- **Artificial Intelligence**: [Google Generative AI (Gemini Pro)](https://ai.google.dev/)

## 🚀 Installation & Setup

Follow these steps to run the project locally on your machine.

### 1. Prerequisites
- Python 3.8 or higher installed.
- A free [Google Gemini API Key](https://aistudio.google.com/app/apikey).

### 2. Clone the Repository
```bash
git clone https://github.com/TheKrishanKant/Wellness-Dashboard-SIC-Proj-.git
cd Wellness-Dashboard-SIC-Proj-
```

### 3. Install Dependencies
It is recommended to use a virtual environment, but you can install the required libraries directly using pip:
```bash
pip install streamlit pandas google-generativeai
```

### 4. Add your API Key
Open `app.py` in your code editor and locate the configuration section at the top. Replace the placeholder string with your actual Google Gemini API key:
```python
# Replace this line in app.py
API_KEY = "YOUR_GEMINI_API_KEY" 
```

### 5. Run the Application
Run the Streamlit server from your terminal:
```bash
streamlit run app.py
```
The app will automatically open in your default web browser at `http://localhost:8501`.

## 📂 Project Structure

```text
├── app.py               # Main application code (UI, Logic, AI Integration)
├── README.md            # Project documentation
└── requirements.txt     # (Optional) List of dependencies
```

## 🧠 How it Works (Under the Hood)
- **`st.session_state`**: Used extensively to remember if the user is logged in, their profile data, their logged workouts, and their UI preferences across different pages.
- **Prompt Engineering**: The app dynamically injects user stats (Age/Weight) and recent activities into a strict prompt template sent to Gemini, ensuring the AI behaves exactly like a professional wellness coach.

## 📄 License
This project is created for educational purposes as part of a Python/GenAI curriculum. Feel free to use and modify it!
```
