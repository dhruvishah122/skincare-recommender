import React, { useState, useEffect } from 'react';
import './SkinCareApp.css';

function SkinCareApp() {
  const [concerns, setConcerns] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('input'); // 'input', 'loading', or 'recommendations'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!concerns.trim()) {
      setError('Please enter your skin concerns');
      return;
    }

    setError('');
    setIsLoading(true); // Start loading
    
    try {
      const response = await fetch('http://localhost:5010/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: concerns }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response from server:', data); // Debugging line
      setRecommendations(data.recommendations);
      setIsLoading(false); // Stop loading
      
      // Now transition to recommendations view
      setCurrentView('recommendations');
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      setIsLoading(false); // Stop loading on error
    }
  };

  const handleBackToInput = () => {
    setCurrentView('input');
  };

  // Helper function to get a color based on skin type
  const getSkinTypeBadgeColor = (skinType) => {
    const types = {
      'Dry': '#64B5F6',
      'Oily': '#4FC3F7',
      'Combination': '#4DD0E1',
      'Normal': '#81D4FA',
      'Sensitive': '#80DEEA'
    };
    
    // Handle multiple skin types separated by commas
    if (skinType && skinType.includes(',')) {
      return '#1E88E5'; // Use a darker blue for multiple skin types
    }
    
    return types[skinType] || '#1E88E5';
  };

  return (
    <div className="skincare-app blue-theme">
      <header>
        <h1>✨ SkinSage ✨</h1>
        <p>Your personal skincare recommendation assistant</p>
      </header>

      <div className={`main-container ${isLoading ? 'backdrop-blur' : ''}`}>
        {/* Input View */}
        {currentView === 'input' && (
          <div className="app-section input-section">
            <h2>Tell us about your skin concerns 🔍</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={concerns}
                onChange={(e) => setConcerns(e.target.value)}
                placeholder="Describe your skin concerns here (e.g., dryness, acne, aging, sensitivity...)"
                rows={5}
              />
              {error && <p className="error-message">{error}</p>}
              <button type="submit" disabled={isLoading}>Get Recommendations 💫</button>
            </form>
          </div>
        )}

        {/* Recommendations View */}
        {currentView === 'recommendations' && (
          <div className="recommendations-page">
            <div className="recommendations-header">
              <h2>Your Personalized Recommendations 🌟</h2>
              <button className="back-button" onClick={handleBackToInput}>
                New Analysis
              </button>
            </div>

            <div className="recommendation-list">
              {recommendations.map((item, index) => {
                const skinType = item['Skin type'];
                const badgeColor = getSkinTypeBadgeColor(skinType);
                
                return (
                  <div className="recommendation-card" key={index}>
                    <div className="skin-type-banner" style={{backgroundColor: badgeColor}}>
                      {skinType}
                    </div>
                    <div className="product-content">
                      <h3>{item.Product}</h3>
                      <div className="info-section">
                        <div className="info-row">
                          <span className="info-label">Addresses:</span>
                          <span className="info-value">{item.Concern}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Best For:</span>
                          <span className="info-value">{skinType} skin types</span>
                        </div>
                      </div>
                      <a href={item.product_url} className="view-product-btn" target="_blank" rel="noopener noreferrer">
                        View Product
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay that appears over content */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <p>Analyzing your skin concerns...</p>
          </div>
        </div>
      )}

      <footer>
        <p>Made with 💙 by SkinSage AI</p>
      </footer>
    </div>
  );
}

export default SkinCareApp;