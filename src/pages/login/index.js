import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.scss';

function Login() {
    const baseUrl = 'https://back2-1.onrender.com';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const getUserId = async () => {
        try {
            const response = await axios.get(baseUrl+'/users/id', {
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
            const response = await axios.post(baseUrl+'/users/login', { email, password });
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
        handleLogin();
    }

    useEffect(() => {
        const fetchData = async () => {
            try{
                if(!localStorage.getItem('token') && !localStorage.getItem('refreshToken')) navigate('/');

                let checkAT = false, checkRT = false;
                let typeToken = 'AT';

                if(localStorage.getItem('token')){
                    const res = await axios.post(baseUrl+'/users/verifyToken',{typeToken},{
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if(res.data.data === 'Token valid') checkAT=true;
                }
                typeToken = 'RT';
                if(localStorage.getItem('refreshToken')){
                    const res = await axios.post(baseUrl+'/users/verifyToken',{typeToken},{
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
                        }
                    });
                    if(res.data.data === 'RFToken valid') checkRT=true;
                }

                if(!checkAT && checkRT){
                    const response = await axios.post(baseUrl+'/users/addAccessToken', { userId: localStorage.getItem('userId')});
                    if(response.data.token){
                        localStorage.setItem('token', response.data.token);
                        navigate('/home');
                    }
                }else if(checkAT && !checkRT){
                    if(localStorage.getItem('refreshToken')){
                        await axios.post(baseUrl+'/users/refreshToken/delete', null, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
                            }
                        });
                    }
                    const response = await axios.post(baseUrl+'/users/addRefreshToken', { userId: localStorage.getItem('userId')});
                    if(response.data.refreshToken){
                        localStorage.setItem('refreshToken', response.data.token);
                        navigate('/home');
                    }
                }else if(checkAT && checkRT){
                    navigate('/home');
                }else{
                    if(localStorage.getItem('token'))
                        localStorage.removeItem('token');
                    if(localStorage.getItem('refreshToken')){
                        await axios.post(baseUrl+'/users/refreshToken/delete', null, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
                            }
                        });
                        localStorage.removeItem('refreshToken');
                    }
                    if(localStorage.getItem('userId'))
                        localStorage.removeItem('userId');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

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
