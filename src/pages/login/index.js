import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.scss';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try{
                if(localStorage.getItem('token')){
                    const res = await axios.get('/users/verifyToken',{
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if(res.data.data === 'Token valid'){
                        navigate('/home');
                    }else if(localStorage.getItem('refreshToken')){
                        const response = await axios.post('/users/refreshToken', { userId: localStorage.getItem('userId')}, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
                            }
                        });
                        if(response.data.token){
                            localStorage.setItem('token', response.data.token);
                            navigate('/home');
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const getUserId = async () => {
        try {
            const response = await axios.get('/users/id', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            localStorage.setItem('userId', response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('/users/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            setMessage(`Logged in successfully`);
            await getUserId();
            if(localStorage.getItem('token')){
                navigate('/home');
            }
        } catch (error) {
            setMessage('Invalid credentials');
        }
    };

    function handleClick(){
        if(localStorage.getItem('token'))
            localStorage.removeItem('token');
        if(localStorage.getItem('refreshToken'))
            localStorage.removeItem('refreshToken');
        if(localStorage.getItem('userId'))
            localStorage.removeItem('userId');
        handleLogin();
    }

    return (
        <body className='login-body'>
            <div className="container">
                <h1>Login Now</h1>
                <div className="login-form">
                    <input className="email-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="password-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="login-btn" onClick={handleClick}>Login</button>
                    <br/> <br/>
                    <button className="signup-btn" size="small" onClick={() => { navigate('/register'); }}> Register </button>
                </div>
                <p className="message">{message}</p>
            </div>
        </body>
    );
}

export default Login;
