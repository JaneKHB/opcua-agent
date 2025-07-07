import { useState } from 'react';

export default function Login() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
     
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, pw }),
      });

      const data = await res.json();
      console.log(`data : ${JSON.stringify(data)}`)
      if (res.ok) {
        setMessage(`Login Success: ${data.token}`);
      } else {
        setMessage(`Login Fail: ${data.message}`);
      }
    } catch (err) {
      setMessage(`Network Error: ${err}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2> Login Page </h2>
      <input
        type="text"
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="PW"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login Button</button>
      <p>{message}</p>
    </div>
  );
}
