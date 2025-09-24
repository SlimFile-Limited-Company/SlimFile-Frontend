# SlimFile - File Compression Service

A modern, full-stack file compression service that compresses images and PDFs with Google OAuth authentication. Built with React, TypeScript, Node.js, and MongoDB.

## 🌟 Features

- **🔐 Secure Authentication:** Google OAuth integration with JWT tokens
- **📁 File Compression:** Compress images (JPEG, PNG) and PDFs
- **🖼️ Image Processing:** Resize and optimize images using Sharp
- **📄 PDF Compression:** Convert PDF pages to images and rebuild
- **📱 PWA Ready:** Progressive Web App with offline support
- **🎨 Modern UI:** Beautiful interface built with Tailwind CSS and shadcn/ui
- **🚀 Production Ready:** Deployed on Vercel (frontend) and Render (backend)
- **🔒 Protected Routes:** Authentication guard for secure access

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **React Router** for navigation
- **Google Identity Services** for OAuth

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Sharp** for image processing
- **Poppler** for PDF compression
- **Multer** for file uploads
- **CORS** for cross-origin requests

## 🚀 Live Demo

- **Frontend:** [https://www.slim-file.com](https://www.slim-file.com)
- **Backend API:** [https://slimfile-fb.onrender.com](https://slimfile-fb.onrender.com)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB database
- Google Cloud Console account

### 1. Clone the Repository
```bash
git clone https://github.com/ikaydreams/SlimFile-on-render.git
cd SlimFile-on-render
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

**Environment Variables (.env.local):**
```env
VITE_API_BASE_URL=https://slimfile-fb.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Backend Setup
```bash
# Navigate to backend directory (if separate)
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Environment Variables (.env):**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=https://www.slim-file.com
PORT=4000
```

### 4. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `https://www.slim-file.com`
   - `http://localhost:5173` (for development)
6. Copy the Client ID to your environment variables

### 5. Development
```bash
# Frontend (from root directory)
npm run dev

# Backend (from backend directory)
npm start
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:4000](http://localhost:4000)

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL`
   - `VITE_GOOGLE_CLIENT_ID`
4. Deploy

### Backend (Render)
1. Connect GitHub repository to Render
2. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `FRONTEND_URL`
3. Deploy

## 📚 API Documentation

### Authentication

#### Google OAuth Login
```http
POST /api/auth/google
Content-Type: application/json

{
  "credential": "google_jwt_token"
}
```

**Response:**
```json
{
  "token": "jwt_token_here"
}
```

### File Compression

#### Compress File
```http
POST /api/compress
Authorization: Bearer jwt_token
Content-Type: multipart/form-data

file: [binary_file_data]
```

**Response:**
- Binary compressed file
- Headers: `Content-Type`, `Content-Disposition`

**Supported Formats:**
- Images: JPEG, PNG, GIF, WebP
- Documents: PDF

## 🔧 Project Structure

```
SlimFile-on-render/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── FileUpload.tsx  # File upload component
│   │   ├── Header.tsx      # Navigation header
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Login.tsx       # Google OAuth login
│   │   ├── Compress.tsx    # File compression
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── utils/              # Helper functions
├── public/                 # Static assets
├── backend/                # Backend server (if separate)
└── package.json
```

## 🔒 Security Features

- **JWT Authentication:** Secure token-based auth
- **CORS Protection:** Domain-specific access control
- **File Validation:** Type and size checking
- **Protected Routes:** Authentication guards
- **Environment Variables:** Secure configuration

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

- **Isaac Abakah** - [@ikaydreams](https://github.com/ikaydreams)

## 🆘 Support

If you encounter any issues:
1. Check the [Issues](https://github.com/ikaydreams/SlimFile-on-render/issues) page
2. Create a new issue with detailed information
3. Include error logs and steps to reproduce

## 🔮 Roadmap

- [ ] API key system for third-party integration
- [ ] Batch file compression
- [ ] Advanced compression options
- [ ] Usage analytics dashboard
- [ ] Premium features
- [ ] White-label solutions

---

**Built with ❤️ using modern web technologies**

