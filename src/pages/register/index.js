import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            await axios.post('/users/add', { userName, email, password });
            setMessage('User created successfully');
            navigate('/');
        } catch (error) {
            console.error(error);
            setMessage('Error creating user');
        }
    };

    return (
        <div>
            <h1>Authentication</h1>
            <div>
                <h2>Sign Up</h2>
                <input type="text" placeholder="UserName" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleSignUp}>Register</button>
                <button size="small" className="btn-signin" onClick={() => { navigate('/'); }}> Login </button>
            </div>
            <p>{message}</p>
        </div>
    );
}

export default Register;
