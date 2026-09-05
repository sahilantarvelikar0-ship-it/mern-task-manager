import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://mern-task-manager-wa8z.onrender.com';

function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Direct Login Call
        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
        const tokenValue = res.data.token;

        if (tokenValue) {
          localStorage.setItem('token', tokenValue);
          setToken(tokenValue);
        } else {
          setError('Token missing in login response');
        }
      } else {
        // Step 1: Register User
        await axios.post(`${API_BASE_URL}/api/auth/register`, { email, password });

        // Step 2: Auto-login right after registration to get token
        const loginRes = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
        const tokenValue = loginRes.data.token;

        if (tokenValue) {
          localStorage.setItem('token', tokenValue);
          setToken(tokenValue);
        } else {
          setIsLogin(true); // Switch to login view if token missing
          alert('Registered successfully! Please login.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {error && <p style={{ color: '#ef4444', marginBottom: '10px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '15px', cursor: 'pointer', color: '#60a5fa' }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
      </p>
    </div>
  );
}

export default Auth;