interface AnalyticsEvent {
  event: string;
  timestamp: string;
  data?: Record<string, any>;
  sessionId: string;
  userId?: string;
}

interface UserMetrics {
  userId: string;
  totalSessions: number;
  totalPlayTime: number;
  gamesCompleted: number;
  averageScore: number;
  systemsPlayed: string[];
  lastActive: string;
  difficulty: { [key: string]: number };
  achievements: string[];
}

interface EngagementMetrics {
  totalUsers: number;
  activeUsers: number;
  averageSessionDuration: number;
  completionRate: number;
  retentionRate: number;
  popularSystems: { [system: string]: number };
  dailyActiveUsers: number;
  feedbackScore: number;
}

class AnalyticsManager {
  private static instance: AnalyticsManager;
  private sessionId: string;
  private startTime: number;
  private events: AnalyticsEvent[] = [];

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.loadStoredData();
    this.trackSessionStart();
  }

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadStoredData(): void {
    try {
      const stored = localStorage.getItem('equilibrium-analytics-events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load analytics data:', error);
    }
  }

  private saveData(): void {
    try {
      // Keep only last 1000 events to prevent storage bloat
      const recentEvents = this.events.slice(-1000);
      localStorage.setItem('equilibrium-analytics-events', JSON.stringify(recentEvents));
      
      // Save summary metrics
      const metrics = this.generateMetrics();
      localStorage.setItem('equilibrium-analytics-summary', JSON.stringify(metrics));
    } catch (error) {
      console.warn('Failed to save analytics data:', error);
    }
  }

  public track(event: string, data?: Record<string, any>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      timestamp: new Date().toISOString(),
      data,
      sessionId: this.sessionId,
      userId: this.getUserId()
    };

    this.events.push(analyticsEvent);
    this.saveData();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', analyticsEvent);
    }
  }

  private getUserId(): string {
    let userId = localStorage.getItem('equilibrium-user-id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('equilibrium-user-id', userId);
    }
    return userId;
  }

  private trackSessionStart(): void {
    this.track('session_start', {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      referrer: document.referrer
    });
  }

  public trackSessionEnd(): void {
    const sessionDuration = Date.now() - this.startTime;
    this.track('session_end', {
      duration: sessionDuration,
      events_count: this.events.length
    });
  }

  // Game-specific tracking methods
  public trackGameStart(system: string, difficulty: string): void {
    this.track('game_start', {
      system,
      difficulty,
      timestamp: Date.now()
    });
  }

  public trackGameEnd(system: string, difficulty: string, score: number, completed: boolean): void {
    this.track('game_end', {
      system,
      difficulty,
      score,
      completed,
      duration: Date.now() - this.startTime
    });
  }

  public trackCardPlay(cardName: string, system: string, effect: any): void {
    this.track('card_played', {
      cardName,
      system,
      effect
    });
  }

  public trackTutorialStep(step: number, stepName: string, completed: boolean): void {
    this.track('tutorial_step', {
      step,
      stepName,
      completed
    });
  }

  public trackUIInteraction(element: string, action: string): void {
    this.track('ui_interaction', {
      element,
      action
    });
  }

  public trackError(error: string, context?: string): void {
    this.track('error', {
      error,
      context,
      userAgent: navigator.userAgent
    });
  }

  public trackFeatureUsage(feature: string, metadata?: Record<string, any>): void {
    this.track('feature_usage', {
      feature,
      ...metadata
    });
  }

  public trackFeedback(rating: number, comment?: string, category?: string): void {
    this.track('user_feedback', {
      rating,
      comment,
      category
    });
  }

  public trackPerformance(metric: string, value: number, context?: string): void {
    this.track('performance', {
      metric,
      value,
      context
    });
  }

  // Analytics data retrieval
  public getEvents(filter?: Partial<AnalyticsEvent>): AnalyticsEvent[] {
    if (!filter) return [...this.events];
    
    return this.events.filter(event => {
      return Object.entries(filter).every(([key, value]) => 
        event[key as keyof AnalyticsEvent] === value
      );
    });
  }

  public generateMetrics(): EngagementMetrics {
    const now = Date.now();
    const dayAgo = now - (24 * 60 * 60 * 1000);
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);

    const uniqueUsers = new Set(this.events.map(e => e.userId)).size;
    const recentUsers = new Set(
      this.events
        .filter(e => new Date(e.timestamp).getTime() > dayAgo)
        .map(e => e.userId)
    ).size;

    const gameSessions = this.events.filter(e => e.event === 'game_start');
    const completedGames = this.events.filter(e => e.event === 'game_end' && e.data?.completed);
    
    const sessionDurations = this.events
      .filter(e => e.event === 'session_end')
      .map(e => e.data?.duration || 0)
      .filter(d => d > 0);

    const systemUsage: { [system: string]: number } = {};
    gameSessions.forEach(session => {
      const system = session.data?.system;
      if (system) {
        systemUsage[system] = (systemUsage[system] || 0) + 1;
      }
    });

    const feedbackEvents = this.events.filter(e => e.event === 'user_feedback');
    const avgFeedback = feedbackEvents.length > 0
      ? feedbackEvents.reduce((sum, e) => sum + (e.data?.rating || 0), 0) / feedbackEvents.length
      : 0;

    return {
      totalUsers: uniqueUsers,
      activeUsers: recentUsers,
      dailyActiveUsers: recentUsers,
      averageSessionDuration: sessionDurations.length > 0 
        ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
        : 0,
      completionRate: gameSessions.length > 0 
        ? (completedGames.length / gameSessions.length) * 100
        : 0,
      retentionRate: this.calculateRetentionRate(weekAgo),
      popularSystems: systemUsage,
      feedbackScore: avgFeedback
    };
  }

  private calculateRetentionRate(timeThreshold: number): number {
    const usersBeforeThreshold = new Set(
      this.events
        .filter(e => new Date(e.timestamp).getTime() < timeThreshold)
        .map(e => e.userId)
    );

    const usersAfterThreshold = new Set(
      this.events
        .filter(e => new Date(e.timestamp).getTime() > timeThreshold)
        .map(e => e.userId)
    );

    const returningUsers = [...usersBeforeThreshold].filter(user => 
      usersAfterThreshold.has(user)
    );

    return usersBeforeThreshold.size > 0 
      ? (returningUsers.length / usersBeforeThreshold.size) * 100
      : 0;
  }

  public getUserMetrics(userId?: string): UserMetrics {
    const targetUserId = userId || this.getUserId();
    const userEvents = this.events.filter(e => e.userId === targetUserId);

    const gameStarts = userEvents.filter(e => e.event === 'game_start');
    const gameEnds = userEvents.filter(e => e.event === 'game_end');
    const completedGames = gameEnds.filter(e => e.data?.completed);

    const scores = completedGames.map(e => e.data?.score || 0).filter(s => s > 0);
    const systems = [...new Set(gameStarts.map(e => e.data?.system).filter(Boolean))];
    
    const difficultyCount: { [key: string]: number } = {};
    gameStarts.forEach(game => {
      const diff = game.data?.difficulty;
      if (diff) difficultyCount[diff] = (difficultyCount[diff] || 0) + 1;
    });

    const sessionDurations = userEvents
      .filter(e => e.event === 'session_end')
      .map(e => e.data?.duration || 0);

    return {
      userId: targetUserId,
      totalSessions: new Set(userEvents.map(e => e.sessionId)).size,
      totalPlayTime: sessionDurations.reduce((a, b) => a + b, 0),
      gamesCompleted: completedGames.length,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      systemsPlayed: systems,
      lastActive: userEvents.length > 0 ? userEvents[userEvents.length - 1].timestamp : '',
      difficulty: difficultyCount,
      achievements: this.calculateAchievements(userEvents)
    };
  }

  private calculateAchievements(userEvents: AnalyticsEvent[]): string[] {
    const achievements: string[] = [];
    const completedGames = userEvents.filter(e => e.event === 'game_end' && e.data?.completed);

    // Basic achievements
    if (completedGames.length >= 1) achievements.push('first_game');
    if (completedGames.length >= 10) achievements.push('game_veteran');
    if (completedGames.length >= 50) achievements.push('game_master');

    // Score achievements
    const highScores = completedGames.filter(e => (e.data?.score || 0) > 1500);
    if (highScores.length >= 1) achievements.push('high_scorer');

    // System achievements
    const systems = new Set(completedGames.map(e => e.data?.system));
    if (systems.size >= 3) achievements.push('system_explorer');

    // Tutorial completion
    const tutorialCompleted = userEvents.some(e => 
      e.event === 'tutorial_step' && e.data?.completed && e.data?.step >= 10
    );
    if (tutorialCompleted) achievements.push('tutorial_complete');

    return achievements;
  }

  // Data export for beta testing
  public exportData(): string {
    const data = {
      events: this.events,
      metrics: this.generateMetrics(),
      userMetrics: this.getUserMetrics(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    return JSON.stringify(data, null, 2);
  }

  public clearData(): void {
    this.events = [];
    localStorage.removeItem('equilibrium-analytics-events');
    localStorage.removeItem('equilibrium-analytics-summary');
    localStorage.removeItem('equilibrium-user-id');
  }

  // Integration hooks for React components
  public usePageView(pageName: string): void {
    React.useEffect(() => {
      this.track('page_view', { page: pageName });
    }, [pageName]);
  }

  public useComponentMount(componentName: string): void {
    React.useEffect(() => {
      this.track('component_mount', { component: componentName });
      return () => {
        this.track('component_unmount', { component: componentName });
      };
    }, [componentName]);
  }
}

// React hook for analytics
export const useAnalytics = () => {
  const analytics = React.useMemo(() => AnalyticsManager.getInstance(), []);

  return {
    track: analytics.track.bind(analytics),
    trackGameStart: analytics.trackGameStart.bind(analytics),
    trackGameEnd: analytics.trackGameEnd.bind(analytics),
    trackCardPlay: analytics.trackCardPlay.bind(analytics),
    trackUIInteraction: analytics.trackUIInteraction.bind(analytics),
    trackFeedback: analytics.trackFeedback.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    getMetrics: analytics.generateMetrics.bind(analytics),
    getUserMetrics: analytics.getUserMetrics.bind(analytics),
    exportData: analytics.exportData.bind(analytics)
  };
};

export default AnalyticsManager;