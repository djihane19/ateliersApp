// utils/userSession.js
export const getOrCreateUserSessionId = () => {
    let sessionId = localStorage.getItem('userSessionId');
  
    if (!sessionId) {
      // Generate a random session ID
      sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('userSessionId', sessionId);
    }
  
    return sessionId;
  };