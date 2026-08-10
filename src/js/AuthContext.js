import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const API_BASE_URL = (
  process.env.REACT_APP_AUTH_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost/react-sps/connection'
).replace(/\/$/, '');

const AUTH_STORAGE_KEY = 'sps_auth_user';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed?.id && parsed?.email && parsed?.role) {
        setUser(parsed);
        setUserRole(parsed.role);
        setIsAuthenticated(true);
      }
    } catch (error) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const saveAuthUser = (authUser) => {
    setUser(authUser);
    setUserRole(authUser.role);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
  };

  const callAuthApi = async (endpoint, payload) => {
    try {
      console.log(`Attempting to fetch: ${API_BASE_URL}/${endpoint}`);
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let data = {};
      try {
        data = await response.json();
      } catch (error) {
        console.error(`Failed to parse JSON from ${endpoint}:`, error);
        data = { message: 'Invalid server response.' };
      }

      if (!response.ok || !data.success) {
        const errorMsg = data.message || `Authentication request failed (${response.status})`;
        console.error(`API Error in ${endpoint}:`, errorMsg, data);
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      console.error(`Fetch error details for ${endpoint}:`, error);
      throw new Error(error.message || `Failed to connect to server. Check if backend is running at ${API_BASE_URL}`);
    }
  };

  const login = async (email, password, role) => {
    const data = await callAuthApi('login.php', { email, password, role });
    saveAuthUser(data.user);
    return data;
  };

  const signup = async (payload) => {
    const data = await callAuthApi('signup.php', payload);
    return data;
  };

  const getProfile = async () => {
    if (!user?.id || !user?.role) {
      throw new Error('User is not logged in.');
    }

    const data = await callAuthApi('get_profile.php', {
      user_id: user.id,
      role: user.role
    });

    return data.profile;
  };

  const updateProfile = async (payload) => {
    if (!user?.id || !user?.role) {
      throw new Error('User is not logged in.');
    }

    const data = await callAuthApi('update_profile.php', {
      ...payload,
      user_id: user.id,
      role: user.role
    });

    const updatedName = payload.name?.trim();
    if (updatedName && updatedName !== user.name) {
      saveAuthUser({ ...user, name: updatedName });
    }

    return data;
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = {
    user,
    userRole,
    isAuthenticated,
    login,
    signup,
    getProfile,
    updateProfile,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
