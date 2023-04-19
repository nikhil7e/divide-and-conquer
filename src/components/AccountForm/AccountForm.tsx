import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './AccountForm.css';

export function AccountForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/game');
    }
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    const response = await fetch(process.env.REACT_APP_API_URL + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const res = await response.json();
      localStorage.setItem('token', res.token);
      navigate('/game');
    } else {
      console.error('Login failed');
    }
  };

  const handleSignup = async () => {
    const response = await fetch(process.env.REACT_APP_API_URL + '/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const res = await response.json();
      localStorage.setItem('token', res.token);
      navigate('/game');
    } else {
      console.error('Signup failed');
    }
  };

  return (
    <div>
      <form>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <button type="button" onClick={handleLogin}>
          Log in
        </button>
        <button type="button" onClick={handleSignup}>
          Sign up
        </button>
      </form>
    </div>
  );
}
