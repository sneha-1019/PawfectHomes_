import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Token decode error:', error);
      return true;
    }
  };

  // Configure axios defaults and load user
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        
        if (storedToken && !isTokenExpired(storedToken)) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setToken(storedToken);
          
          try {
            const res = await axios.get('/api/auth/me');
            const userData = res.data.user;
            setUser(userData);
            setIsAdmin(userData?.isAdmin || false);
            setIsAuthenticated(true);
            console.log('User authenticated:', userData);
          } catch (error) {
            console.error('Load user error:', error);
            logout();
          }
        } else {
          if (storedToken) {
            console.log('Token expired, logging out...');
          }
          logout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // FIXED: Login function with proper state management
  const login = async (newToken, userData) => {
    try {
      if (!newToken || !userData) {
        throw new Error('Invalid login parameters');
      }

      if (isTokenExpired(newToken)) {
        throw new Error('Received expired token');
      }

      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      // Update ALL state variables synchronously
      setToken(newToken);
      setUser(userData);
      setIsAdmin(userData?.isAdmin || false);
      setIsAuthenticated(true);

      console.log('Login successful, user:', userData.name);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // FIXED: Logout function clears everything
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];

    setToken(null);
    setUser(null);
    setIsAdmin(false);
    setIsAuthenticated(false);

    console.log('Logged out successfully');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
