# MoodTunes - Facial Expression Based Music Player 🎵😊

A full-stack web application that detects your facial expressions and recommends music based on your current mood.

🌟 Features

Frontend
- Real-time Facial Expression Detection** using webcam
- Mood-based Song Recommendations** 
- Modern, Responsive UI** that works on all devices
- Interactive Music Player** with play/pause controls
- Beautiful Gradient Design** with smooth animations

Backend
- RESTful API for song management
- Cloud Storage Integration** using ImageKit for audio files
- MongoDB Database for efficient song storage and retrieval
- Mood-based Filtering for personalized recommendations

 🛠 Tech Stack

 Frontend
- React with Vite
- Face-api.js for facial expression detection
- Axios for API calls
- CSS3 with modern design principles

 Backend
- Node.js with Express.js
- MongoDB with Mongoose
- Multer for file uploads
- ImageKit for cloud storage
- CORS enabled for frontend communication

 📁 Project Structure

moodtunes/
├── frontend/                 # React Frontend
│   ├── public/
│   │   └── models/          # Face-api.js models
│   ├── src/
│   │   ├── components/
│   │   │   ├── FacialExpression.jsx
│   │   │   ├── facialExpression.css
│   │   │   ├── MoodSongs.jsx
│   │   │   └── MoodSongs.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/                  # Node.js Backend
    ├── src/
    │   ├── db/
    │   │   └── db.js         # MongoDB connection
    │   ├── models/
    │   │   └── song.model.js # Mongoose schema
    │   ├── routes/
    │   │   └── song.route.js # API routes
    │   ├── service/
    │   │   └── storage.service.js # ImageKit integration
    │   └── app.js           # Express app configuration
    ├── server.js            # Server entry point
    ├── package.json
    └── .env

 🚀 Quick Start

 Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- ImageKit account for file storage

 Installation

1. Clone the repository
git clone https://github.com/yourusername/moodtunes.git
cd moodtunes

2. Backend Setup
cd backend
npm install

3. Environment Configuration
Create a `.env` file in the backend directory:
env
MONGODB_URL=your_mongodb_connection_string
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

4. Start Backend Server

npm run dev

Server runs on `http://localhost:3000`

5. Frontend Setup (in a new terminal)
cd frontend
npm install

6. Start Frontend Development Server
npm run dev

Frontend runs on `http://localhost:5173`

 📚 API Documentation

 Endpoints

 GET `/songs?mood=<mood>`
Retrieve songs based on detected mood.

Query Parameters:
- `mood` (required): Emotional state (happy, sad, angry, fearful, disgusted, surprised, neutral)

Response:
{
  "message": "Songs fetched successfully",
  "songs": [
    {
      "_id": "string",
      "title": "string",
      "artist": "string", 
      "audio": "string",
      "mood": "string"
    }
  ]
}


 POST `/songs`
Upload a new song with mood classification.

Body: (multipart/form-data)
- `title`: Song title
- `artist`: Artist name  
- `mood`: Emotional classification
- `audio`: Audio file

Response:
{
  "message": "Song created successfully",
  "song": {
    "_id": "string",
    "title": "string",
    "artist": "string",
    "audio": "string", 
    "mood": "string"
  }
}

 🎯 How It Works

1. Face Detection: The app accesses your webcam and uses face-api.js to detect facial expressions in real-time
2. Mood Analysis: The system analyzes facial features to determine your current emotional state
3. Song Matching: Based on the detected mood, the backend serves relevant songs from the database
4. Music Playback: Users can play recommended songs directly in the browser

 🎭 Supported Moods

- 😊 Happy
- 😢 Sad  
- 😠 Angry
- 😨 Fearful
- 🤢 Disgusted
- 😲 Surprised
- 😐 Neutral

 🔧 Configuration

 Adding New Songs
Use the POST endpoint to add songs to the database:

curl -X POST http://localhost:3000/songs \
  -F "title=Song Title" \
  -F "artist=Artist Name" \
  -F "mood=happy" \
  -F "audio=@/path/to/audio/file.mp3"

 Face-api.js Models
Download required models and place in `frontend/public/models/`:
- tiny_face_detector_model
- face_expression_model

 🌐 Deployment

 Frontend (Vercel/Netlify)
cd frontend
npm run build


 Backend (Vercel)
- Set environment variables in deployment platform
- Ensure CORS is properly configured for your frontend domain

 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

 🙏 Acknowledgments

- [Face-api.js](https://github.com/justadudewhohacks/face-api.js/) for facial expression recognition
- [ImageKit](https://imagekit.io/) for cloud file storage
- [MongoDB](https://www.mongodb.com/) for database services


---

Note: This application requires camera access for mood detection. Ensure you grant permissions when prompted by your browser.
