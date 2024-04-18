import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.scss';

function Login() {
    const baseUrl = 'https://back1-fs9h.onrender.com';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(baseUrl+'/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setMessage(`Logged in successfully`);
            navigate('/home');
        } catch (error) {
            setMessage('Invalid credentials');
        }
    };

    useEffect(() => {
        const checkToken = async () => {
            try {
                if(localStorage.getItem('token')) {
                    const response = await axios.get(baseUrl+'/verifyToken', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if(response.data.data === 'Token valid') {
                        navigate('/home');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkToken();
    }, [navigate]);

    return (
        <body className='login-body'>
            <div className="container">
                <h1>Login Now</h1>
                <div className="login-form">
                    <input className="email-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="password-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="login-btn" onClick={handleLogin}>Login</button>
                    <br/> <br/>
                    <button className="signup-btn" size="small" onClick={() => { navigate('/register'); }}> Register </button>
                </div>
                <p className="message">{message}</p>
            </div>
        </body>
    );
}

export default Login;
