import React from 'react';
import Link from 'next/link';

const LearningPathCard = ({ path, href }) => {
  const {
    id,
    title,
    description,
    totalChallenges,
    completedChallenges,
    level,
    estimatedTime,
    xpReward,
    image
  } = path;
  
  // Calculate progress percentage
  const progressPercentage = Math.round((completedChallenges / totalChallenges) * 100);
  
  // Determine if path is locked (for demo purposes, blockchain and AI paths are locked)
  const isLocked = id === 'blockchain-basics' || id === 'ai-integration';
  
  // Determine the badge color based on level
  const getLevelBgColor = (level) => {
    switch(level.toLowerCase()) {
      case 'beginner': return '#e8f5e9';
      case 'intermediate': return '#fff3e0';
      case 'advanced': return '#e3f2fd';
      default: return '#f5f5f5';
    }
  };
  
  const getLevelTextColor = (level) => {
    switch(level.toLowerCase()) {
      case 'beginner': return '#2e7d32';
      case 'intermediate': return '#e65100';
      case 'advanced': return '#0d47a1';
      default: return '#666666';
    }
  };
  
  return (
    <div 
      style={{ 
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
        backgroundColor: 'white'
      }}
    >
      {isLocked && (
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgba(0, 0, 0, 0.6)', 
            zIndex: 1, 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <div style={{ fontSize: '2rem', color: 'white', marginBottom: '16px' }}>🔒</div>
          <div style={{ color: 'white', fontWeight: 'bold' }}>Complete previous paths to unlock</div>
        </div>
      )}
      
      <div style={{ padding: '20px' }}>
        <div style={{ position: 'relative', height: '150px', marginBottom: '16px' }}>
          {image ? (
            <img 
              src={image}
              alt={title}
              style={{
                objectFit: 'cover',
                height: '100%',
                width: '100%',
                borderRadius: '4px'
              }}
            />
          ) : (
            <div 
              style={{ 
                backgroundColor: '#f5f5f5', 
                height: '100%', 
                width: '100%', 
                borderRadius: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}
            >
              <div style={{ color: '#777' }}>Image not available</div>
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: '#333' }}>{title}</h3>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <span 
              style={{ 
                fontSize: '0.8rem',
                padding: '3px 8px',
                borderRadius: '12px',
                backgroundColor: getLevelBgColor(level),
                color: getLevelTextColor(level),
              }}
            >
              {level}
            </span>
            
            <span 
              style={{ 
                fontSize: '0.8rem',
                padding: '3px 8px',
                borderRadius: '12px',
                backgroundColor: '#fff9c4',
                color: '#f57f17',
              }}
            >
              {estimatedTime}
            </span>
          </div>
          
          <p 
            style={{ 
              fontSize: '0.9rem', 
              color: '#666', 
              margin: 0,
              height: '40px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </p>
          
          <div>
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '4px' 
              }}
            >
              <span style={{ fontSize: '0.8rem', color: '#777' }}>Progress</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 'medium', color: '#555' }}>
                {completedChallenges}/{totalChallenges} Challenges
              </span>
            </div>
            
            <div 
              style={{ 
                backgroundColor: '#f5f5f5',
                height: '8px',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <div 
                style={{ 
                  backgroundColor: '#0064db',
                  width: `${progressPercentage}%`,
                  height: '100%'
                }}
              />
            </div>
          </div>
          
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginTop: '8px' 
            }}
          >
            <span style={{ color: '#ffc107', marginRight: '4px' }}>⭐</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 'medium', color: '#555' }}>{xpReward} XP</span>
          </div>
          
          <Link 
            href={href}
            style={{
              backgroundColor: isLocked ? '#ccc' : (completedChallenges > 0 ? '#0064db' : 'white'),
              color: isLocked ? '#999' : (completedChallenges > 0 ? 'white' : '#0064db'),
              border: completedChallenges > 0 ? 'none' : '1px solid #0064db',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: isLocked ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              textDecoration: 'none',
              textAlign: 'center',
              width: '100%',
              marginTop: '8px',
              display: 'inline-block'
            }}
          >
            {completedChallenges > 0 ? 'Continue →' : 'Start Path →'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LearningPathCard;