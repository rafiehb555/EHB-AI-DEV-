import React from 'react';

const UserProgress = ({ userProgress }) => {
  const {
    totalXP,
    level,
    completedChallenges,
    totalChallenges,
    completedPaths
  } = userProgress;
  
  // Calculate progress to next level
  const currentLevelXp = level * 500; // Base XP for current level
  const nextLevelXp = (level + 1) * 500; // XP needed for next level
  const xpToNextLevel = nextLevelXp - currentLevelXp;
  const currentLevelProgress = totalXP - currentLevelXp;
  const progressPercentage = Math.round((currentLevelProgress / xpToNextLevel) * 100);
  
  // Calculate challenge completion rate
  const challengeCompletionRate = Math.round((completedChallenges / totalChallenges) * 100);
  
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
        Your Learning Progress
      </h2>
      
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}
      >
        {/* Current Level Stat */}
        <div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
            Current Level
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
            {level}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>
            {currentLevelProgress} / {xpToNextLevel} XP to Level {level + 1}
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
                backgroundColor: '#2e7d32',
                width: `${progressPercentage}%`,
                height: '100%'
              }}
            />
          </div>
        </div>
        
        {/* Total XP Stat */}
        <div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
            Total XP
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
            {totalXP}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>
            Earned from completed challenges
          </div>
        </div>
        
        {/* Challenges Completed Stat */}
        <div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
            Challenges Completed
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
            {completedChallenges} / {totalChallenges}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>
            {challengeCompletionRate}% completion rate
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
                width: `${challengeCompletionRate}%`,
                height: '100%'
              }}
            />
          </div>
        </div>
      </div>
      
      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '16px 0' }}/>
      
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}
      >
        {/* Recent Activity */}
        <div>
          <div style={{ fontWeight: 'medium', marginBottom: '8px', color: '#333' }}>
            Recent Activity
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            {completedChallenges > 0 ? 
              `You've completed ${completedChallenges} challenges so far. Keep up the good work!` :
              `You haven't completed any challenges yet. Start your learning journey today!`
            }
          </div>
        </div>
        
        {/* Next Milestone */}
        <div>
          <div style={{ fontWeight: 'medium', marginBottom: '8px', color: '#333' }}>
            Next Milestone
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            Complete {Math.min(5, totalChallenges - completedChallenges)} more challenges to earn the "Persistent Learner" badge!
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProgress;