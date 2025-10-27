// components/MoodSongs.jsx
import React from "react";
import { useState } from "react";
import "./MoodSongs.css";

const MoodSongs = ({ Songs }) => {
  const [isPlaying, setIsPlaying] = useState(null);
  
  const handlePlayPause = (index) => {
    if (isPlaying === index) {
      setIsPlaying(null);
    } else {
      setIsPlaying(index);
    }
  };

  if (Songs.length === 0) {
    return (
      <div className="mood-songs">
        <h2>Recommended Songs</h2>
        <div className="no-songs">
          <div className="no-songs-icon">🎵</div>
          <p>No songs recommended yet. Detect your mood to get personalized music recommendations!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mood-songs">
      <h2>Recommended Songs</h2>
      <div className="songs-list">
        {Songs.map((song, index) => (
          <div className="song" key={index}>
            <div className="song-info">
              <div className="song-title">{song.title}</div>
              <div className="song-artist">{song.artist}</div>
            </div>
            
            <div className="song-controls">
              <audio 
                src={song.audio} 
                className="audio-player"
                controls 
              />
              
              {isPlaying === index && (
                <audio
                  src={song.audio}
                  style={{ display: "none" }}
                  autoPlay={isPlaying === index}
                ></audio>
              )}
              
              <button 
                className="play-pause-button" 
                onClick={() => handlePlayPause(index)}
              >
                {isPlaying === index ? (
                  <b className="ri-pause-line">⏸</b>
                ) : (
                  <b className="ri-play-circle-fill">▶</b>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodSongs;