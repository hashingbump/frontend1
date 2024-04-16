import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.scss';

function Register() {
    const baseUrl = 'https://back2-1.onrender.com';
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    
    const handleSignUp = async () => {
        try {
            const dk='@gmail.com';

            if(userName.length<8)
                setMessage('UserName must be at least 8 letters');
            else if(!email.includes(dk))
                setMessage('Email must include: @gmail.com');
            else if(password.length<8)
                setMessage('Password must be at least 8 letters');
            else{
                await axios.post(baseUrl+'/users/add', { userName, email, password });
                setMessage('User created successfully');
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            setMessage('Error creating user');
        }
    };

    return (
        <body className='login-body'>
            <div className="container">
                <h1 className='ten'>Register Now</h1>
                <div className="login-form">
                    <input className="userName-input" type="text" placeholder="UserName" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <input className="email-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="password-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="login-btn" onClick={handleSignUp}>Register</button>
                    <br/> <br/>
                    <button className="signup-btn" size="small" onClick={() => { navigate('/'); }}> Login </button>
                </div>
                <p className="message">{message}</p>
            </div>
        </body>
    );
}

export default Register;
