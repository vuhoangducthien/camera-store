import { createContext, useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/auth/profile')
        .then(res => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser({
      id: res.data.id,
      email: res.data.email,
      name: res.data.name,
      role: res.data.role,
      phone: res.data.phone || null,
      address: res.data.address || null,
      cccd: res.data.cccd || null,
    });
    
    // Điều hướng dựa trên vai trò
    if (res.data.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  const refreshProfile = async () => {
    const res = await axios.get('/auth/profile');
    setUser(res.data);
    return res.data;
  };

  const updateProfile = async (payload) => {
    const res = await axios.put('/users/me', payload);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
