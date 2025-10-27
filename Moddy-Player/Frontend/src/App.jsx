// App.jsx
import { useState } from 'react'
import FacialExpression from './components/FacialExpression'
import MoodSongs from './components/MoodSongs'
import './App.css'

function App() {
  const [Songs, setSongs] = useState([])
  const [detectedMood, setDetectedMood] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>MoodTunes</h1>
          <p>Let your face choose the music</p>
        </div>
      </header>
      
      <main className="app-main">
        <div className="container">
          <FacialExpression 
            setSongs={setSongs} 
            setDetectedMood={setDetectedMood}
            setIsLoading={setIsLoading}
          />
          
          {detectedMood && (
            <div className="mood-indicator">
              <span className="mood-label">Detected Mood:</span>
              <span className="mood-value">{detectedMood}</span>
            </div>
          )}
          
          {isLoading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Finding songs for your mood...</p>
            </div>
          )}
          
          {Songs.length > 0 && <MoodSongs Songs={Songs} />}
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 MoodTunes - Music for every emotion</p>
        </div>
      </footer>
    </div>
  )
}

export default App