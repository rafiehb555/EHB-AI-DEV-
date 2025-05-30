import React from 'react';

const AchievementBadges = ({ badges }) => {
  return (
    <div 
      style={{ 
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px',
        backgroundColor: 'white'
      }}
    >
      <h2 
        style={{ 
          fontSize: '1.2rem', 
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#333'
        }}
      >
        Your Achievements
      </h2>
      
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '20px'
        }}
      >
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            style={{
              padding: '15px',
              borderRadius: '8px',
              backgroundColor: badge.earned ? '#f8f9fa' : '#f1f3f5',
              border: badge.earned ? '1px solid #e9ecef' : '1px dashed #ced4da',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              opacity: badge.earned ? 1 : 0.7
            }}
          >
            <div 
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: badge.earned ? '#e3f2fd' : '#e9ecef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                fontSize: '1.5rem'
              }}
            >
              {badge.earned ? (
                badge.id === 'first-steps' ? '🚀' :
                badge.id === 'code-ninja' ? '🥷' :
                badge.id === 'perfect-score' ? '🏆' :
                badge.id === 'path-master' ? '🎓' :
                badge.id === 'streak-7' ? '🔥' : '⭐'
              ) : '🔒'}
            </div>
            
            <div 
              style={{ 
                fontWeight: 'bold', 
                fontSize: '0.9rem',
                marginBottom: '5px',
                color: badge.earned ? '#333' : '#6c757d'
              }}
            >
              {badge.name}
            </div>
            
            <div 
              style={{ 
                fontSize: '0.8rem',
                color: badge.earned ? '#555' : '#868e96',
                marginBottom: badge.earned ? '5px' : 0
              }}
            >
              {badge.description}
            </div>
            
            {badge.earned && badge.earnedDate && (
              <div 
                style={{ 
                  fontSize: '0.7rem',
                  color: '#0064db',
                  marginTop: '5px'
                }}
              >
                Earned on {new Date(badge.earnedDate).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div 
        style={{
          marginTop: '15px',
          fontSize: '0.9rem',
          color: '#666',
          textAlign: 'center'
        }}
      >
        Complete more challenges to unlock additional badges!
      </div>
    </div>
  );
};

export default AchievementBadges;