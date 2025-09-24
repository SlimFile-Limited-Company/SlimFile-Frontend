import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/login');
      return;
    }
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
    fetch(`${API_BASE_URL}/protected/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setUser(data.user))
      .catch(() => navigate('/login'));
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 80 }}>
      <h2>Welcome, {user.name}!</h2>
      <img src={user.picture} alt="Profile" style={{ borderRadius: '50%', width: 80, height: 80, margin: 16 }} />
      <div>Email: {user.email}</div>
    </div>
  );
} 
