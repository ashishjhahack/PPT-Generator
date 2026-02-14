# AI PPT Generator 🚀

An AI-powered PowerPoint generator that creates professional presentations instantly from user input.
This web app uses **Gemini AI** to generate slide content and **ImageKit** to handle image optimization, delivering fast, clean, and visually appealing presentations.

---

## 🌐 Live Demo

*(Add your deployed link here)*

---

## 📌 Features

* ✨ Generate complete presentations using **AI (Gemini)**
* 🧠 Automatic slide content creation (titles, bullet points)
* 🖼️ AI-relevant image integration via **ImageKit**
* 🔐 Secure authentication using **Clerk**
* ⚡ Fast and responsive UI with **React + Tailwind**
* 📄 Download or view generated PPT content
* 🔥 Cloud data management using **Firebase**
* 🌙 Modern UI with dark/light theme support
* 📱 Fully responsive design

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS

### Backend / Services

* Firebase (Database / Hosting)
* Clerk (Authentication)
* Gemini API (AI content generation)
* ImageKit.io (Image optimization & delivery)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/ashishjhahack/PPT-Generator.git
cd PPT-Generator
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file and add:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_GEMINI_API_KEY=your_gemini_key
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_key
VITE_IMAGEKIT_URL_ENDPOINT=your_imagekit_url
```

---

### 4️⃣ Run the project

```bash
npm run dev
```

App will run on:

```
http://localhost:5173
```

---

## 🔐 Authentication

User authentication is handled using **Clerk**, providing:

* Secure login/signup
* Session management
* Protected routes

---

## 🧠 How It Works

1. User enters a presentation topic.
2. Gemini AI generates structured slide content.
3. Relevant images are fetched and optimized via ImageKit.
4. Slides are displayed in a presentation format.
5. Data is stored and managed using Firebase.

---

## 🚀 Future Improvements

* PPT download (.pptx) support
* Multiple presentation templates
* AI design themes
* Export to Google Slides
* Team collaboration feature

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Ashish Jha**

* GitHub: https://github.com/ashishjhahack

---

⭐ If you like this project, please give it a star!
