import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.scss'

function Layout() {
    const baseUrl = '';
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            if(localStorage.getItem('token'))
                localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <table class="navigation-buttons">
            <tr>
                <th className='a1'> 
                    <label class="btn btn-home-layout" onClick={() => { navigate('/home'); }}>Movie UI</label> 

                    {localStorage.getItem('token') ? (
                    <button class="btn btn-signout" onClick={handleLogout}>Logout</button>
                    ) : (
                        <button class="btn btn-signin" onClick={() => {navigate('/'); }}>Login</button>
                    )} 
               </th> 
            </tr>
        </table>
    );
}

export default Layout;
