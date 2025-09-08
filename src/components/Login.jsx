import '../css/Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import qs from 'qs';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleLogin() {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    let data = qs.stringify({
      'grant_type': 'password',
      'client_id': import.meta.env.VITE_CLIENT_ID,
      'client_secret': import.meta.env.VITE_CLIENT_SECRET,
      'scope': import.meta.env.VITE_SCOPE,
      'username': username,
      'password': password
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_API_TOKEN_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        if (response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
          navigate('/home'); //if login successful, navigate to home
        } else {
          setError('Login failed. Please check your credentials.');
        }
      })
      .catch((error) => {
        setError('Login failed. Please check your credentials.');
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      {/*background*/}
      <div className="login-bg-decoration"></div>

      {/*container*/}
      <div className="login-container">
        <div className="login-wrapper">
          {/*locklogo*/}
          <div className="login-brand">
            <div className="login-logo">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Please sign in to your account</p>
          </div>

          {/*form*/}
          <div className="login-form">
            {error && (
              <div className="login-error">
                <p className="login-error-text">{error}</p>
              </div>
            )}

            <div className="login-form-fields">
              <div className="login-field login-field-enhanced">
                <label className="login-label">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="login-input"
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>

              <div className="login-field login-field-enhanced">
                <label className="login-label">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="login-input"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="login-button"
              >
                {isLoading ? (
                  <div className="login-loading">
                    <div className="login-spinner"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </div>

          {/*footer*/}
          <div className="login-footer">
            <p className="login-footer-text">
              Secure login powered by advanced encryption
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;