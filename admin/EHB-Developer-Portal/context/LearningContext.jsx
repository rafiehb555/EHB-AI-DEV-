import React, { createContext, useContext, useEffect, useState } from 'react';

// Default values for new users
const DEFAULT_STATS = {
  totalXP: 0,
  level: 1,
  streakDays: 0,
  lastLogin: null,
  completedChallenges: 0,
  completedPaths: 0,
  achievements: []
};

// Create the context
const LearningContext = createContext(null);

/**
 * LearningProvider - Provider component that wraps the application and provides
 * learning progress, achievements, and gamification functionality.
 */
export function LearningProvider({ children }) {
  // State for the user's learning progress
  const [learningStats, setLearningStats] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [challengeProgress, setChallengeProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load learning stats from localStorage on component mount
  useEffect(() => {
    const loadLearningStats = () => {
      setIsLoading(true);
      
      try {
        // Load learning stats from localStorage
        const storedStats = localStorage.getItem('ehb_learning_stats');
        const stats = storedStats ? JSON.parse(storedStats) : DEFAULT_STATS;
        
        // Load completed challenges
        const storedChallenges = localStorage.getItem('ehb_completed_challenges');
        const challenges = storedChallenges ? JSON.parse(storedChallenges) : [];
        
        // Load challenge progress
        const storedProgress = localStorage.getItem('ehb_challenge_progress');
        const progress = storedProgress ? JSON.parse(storedProgress) : {};
        
        // Update streak if necessary
        const updatedStats = updateLoginStreak(stats);
        
        setLearningStats(updatedStats);
        setCompletedChallenges(challenges);
        setChallengeProgress(progress);
      } catch (error) {
        console.error('Error loading learning stats:', error);
        setLearningStats(DEFAULT_STATS);
        setCompletedChallenges([]);
        setChallengeProgress({});
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLearningStats();
  }, []);
  
  // Save learning stats to localStorage whenever they change
  useEffect(() => {
    if (learningStats) {
      try {
        localStorage.setItem('ehb_learning_stats', JSON.stringify(learningStats));
      } catch (error) {
        console.error('Error saving learning stats:', error);
      }
    }
  }, [learningStats]);
  
  // Save completed challenges to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('ehb_completed_challenges', JSON.stringify(completedChallenges));
    } catch (error) {
      console.error('Error saving completed challenges:', error);
    }
  }, [completedChallenges]);
  
  // Save challenge progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('ehb_challenge_progress', JSON.stringify(challengeProgress));
    } catch (error) {
      console.error('Error saving challenge progress:', error);
    }
  }, [challengeProgress]);

  /**
   * Update login streak based on date comparisons
   */
  const updateLoginStreak = (stats) => {
    const today = new Date();
    const lastLogin = stats.lastLogin ? new Date(stats.lastLogin) : null;
    
    // Initialize with current stats
    const updatedStats = { ...stats };
    
    if (!lastLogin) {
      // First login ever
      updatedStats.streakDays = 1;
      updatedStats.lastLogin = today.toISOString();
    } else {
      // Calculate days between logins
      const timeDiff = today.getTime() - lastLogin.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff === 0) {
        // Already logged in today, don't update streak
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        updatedStats.streakDays += 1;
        updatedStats.lastLogin = today.toISOString();
        
        // Check if streak achievements should be awarded
        checkStreakAchievements(updatedStats);
      } else {
        // Streak broken
        updatedStats.streakDays = 1;
        updatedStats.lastLogin = today.toISOString();
      }
    }
    
    return updatedStats;
  };
  
  /**
   * Check and award streak-based achievements
   */
  const checkStreakAchievements = (stats) => {
    const achievements = [...(stats.achievements || [])];
    
    if (stats.streakDays >= 3 && !achievements.includes('streak-3')) {
      achievements.push('streak-3');
    }
    
    if (stats.streakDays >= 7 && !achievements.includes('streak-7')) {
      achievements.push('streak-7');
    }
    
    if (stats.streakDays >= 30 && !achievements.includes('streak-30')) {
      achievements.push('streak-30');
    }
    
    return {
      ...stats,
      achievements
    };
  };
  
  /**
   * Calculate XP needed for next level
   */
  const calculateXPForNextLevel = () => {
    if (!learningStats) return { needed: 100, progressPercentage: 0, nextLevelTotal: 100 };
    
    const { level, totalXP } = learningStats;
    
    // Formula: base 100 XP, increasing by 50 XP per level
    const baseXP = 100;
    const multiplier = 50;
    const xpForCurrentLevel = (level - 1) * (baseXP + (level - 2) * multiplier);
    const xpForNextLevel = level * (baseXP + (level - 1) * multiplier);
    const xpNeededForNextLevel = xpForNextLevel - totalXP;
    const progressPercentage = ((totalXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
    
    return {
      needed: xpNeededForNextLevel,
      progressPercentage: progressPercentage,
      nextLevelTotal: xpForNextLevel
    };
  };
  
  /**
   * Award XP to the user and handle level up if necessary
   */
  const awardXP = (amount) => {
    if (!learningStats) return null;
    
    // Calculate new XP total
    const newTotalXP = learningStats.totalXP + amount;
    
    // Check if level up is needed
    let { level } = learningStats;
    let leveledUp = false;
    
    while (true) {
      const nextLevelXP = level * (100 + (level - 1) * 50);
      if (newTotalXP >= nextLevelXP) {
        level++;
        leveledUp = true;
      } else {
        break;
      }
    }
    
    // Update state
    const updatedStats = {
      ...learningStats,
      totalXP: newTotalXP,
      level
    };
    
    // Check for level-based achievements
    if (level >= 5 && !updatedStats.achievements.includes('level-5')) {
      updatedStats.achievements = [...updatedStats.achievements, 'level-5'];
    }
    
    if (level >= 10 && !updatedStats.achievements.includes('level-10')) {
      updatedStats.achievements = [...updatedStats.achievements, 'level-10'];
    }
    
    if (level >= 20 && !updatedStats.achievements.includes('level-20')) {
      updatedStats.achievements = [...updatedStats.achievements, 'level-20'];
    }
    
    if (level >= 30 && !updatedStats.achievements.includes('level-30')) {
      updatedStats.achievements = [...updatedStats.achievements, 'level-30'];
    }
    
    setLearningStats(updatedStats);
    
    return {
      leveledUp,
      newLevel: level,
      oldLevel: learningStats.level
    };
  };
  
  /**
   * Mark a challenge as completed and award XP
   */
  const completeChallenge = (challengeId, xpReward = 100) => {
    if (!learningStats) return null;
    
    // Don't award XP for already completed challenges
    if (completedChallenges.includes(challengeId)) {
      return { leveledUp: false };
    }
    
    // Update completed challenges
    const newCompletedChallenges = [...completedChallenges, challengeId];
    setCompletedChallenges(newCompletedChallenges);
    
    // Update stats
    const updatedStats = {
      ...learningStats,
      completedChallenges: learningStats.completedChallenges + 1
    };
    
    // Check for challenge count achievements
    if (newCompletedChallenges.length === 1 && !updatedStats.achievements.includes('first-challenge')) {
      updatedStats.achievements = [...updatedStats.achievements, 'first-challenge'];
    }
    
    if (newCompletedChallenges.length >= 5 && !updatedStats.achievements.includes('5-challenges')) {
      updatedStats.achievements = [...updatedStats.achievements, '5-challenges'];
    }
    
    if (newCompletedChallenges.length >= 10 && !updatedStats.achievements.includes('10-challenges')) {
      updatedStats.achievements = [...updatedStats.achievements, '10-challenges'];
    }
    
    if (newCompletedChallenges.length >= 25 && !updatedStats.achievements.includes('25-challenges')) {
      updatedStats.achievements = [...updatedStats.achievements, '25-challenges'];
    }
    
    if (newCompletedChallenges.length >= 50 && !updatedStats.achievements.includes('50-challenges')) {
      updatedStats.achievements = [...updatedStats.achievements, '50-challenges'];
    }
    
    // Update stored stats
    setLearningStats(updatedStats);
    
    // Award XP
    return awardXP(xpReward);
  };
  
  /**
   * Mark a learning path as completed
   */
  const completeLearningPath = (pathId, xpReward = 500) => {
    if (!learningStats) return null;
    
    // Update stats
    const updatedStats = {
      ...learningStats,
      completedPaths: learningStats.completedPaths + 1
    };
    
    // Check for learning path count achievements
    if (updatedStats.completedPaths === 1 && !updatedStats.achievements.includes('first-path')) {
      updatedStats.achievements = [...updatedStats.achievements, 'first-path'];
    }
    
    if (updatedStats.completedPaths >= 3 && !updatedStats.achievements.includes('3-paths')) {
      updatedStats.achievements = [...updatedStats.achievements, '3-paths'];
    }
    
    if (updatedStats.completedPaths >= 5 && !updatedStats.achievements.includes('5-paths')) {
      updatedStats.achievements = [...updatedStats.achievements, '5-paths'];
    }
    
    // Update stored stats
    setLearningStats(updatedStats);
    
    // Award XP
    return awardXP(xpReward);
  };
  
  /**
   * Award a specific achievement
   */
  const awardAchievement = (achievementId) => {
    if (!learningStats) return false;
    
    // Check if already has achievement
    if (learningStats.achievements.includes(achievementId)) {
      return false;
    }
    
    // Add achievement
    const updatedStats = {
      ...learningStats,
      achievements: [...learningStats.achievements, achievementId]
    };
    
    setLearningStats(updatedStats);
    return true;
  };
  
  /**
   * Save progress on a challenge
   */
  const saveChallengeProgress = (challengeId, progressData) => {
    setChallengeProgress(prev => ({
      ...prev,
      [challengeId]: {
        ...prev[challengeId],
        ...progressData,
        lastUpdated: new Date().toISOString()
      }
    }));
  };
  
  /**
   * Get progress for a specific challenge
   */
  const getChallengeProgress = (challengeId) => {
    return challengeProgress[challengeId] || null;
  };
  
  /**
   * Reset all learning progress (for testing purposes)
   */
  const resetProgress = () => {
    setLearningStats(DEFAULT_STATS);
    setCompletedChallenges([]);
    setChallengeProgress({});
    localStorage.removeItem('ehb_learning_stats');
    localStorage.removeItem('ehb_completed_challenges');
    localStorage.removeItem('ehb_challenge_progress');
  };
  
  const contextValue = {
    learningStats,
    completedChallenges,
    challengeProgress,
    isLoading,
    calculateXPForNextLevel,
    awardXP,
    completeChallenge,
    completeLearningPath,
    awardAchievement,
    saveChallengeProgress,
    getChallengeProgress,
    resetProgress,
    // Expose the achievements array as a convenience
    achievements: learningStats?.achievements || []
  };
  
  return (
    <LearningContext.Provider value={contextValue}>
      {children}
    </LearningContext.Provider>
  );
}

/**
 * Custom hook to use the learning context
 */
export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}

export default LearningContext;