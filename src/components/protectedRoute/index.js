import { Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

function ProtectedRoute({ element: Element, ...rest }) {
    const accessToken = localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();

    const verifyToken = async () => {
        try {
            const response = await axios.post('/verifyToken', null, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log(accessToken, '\n', location.pathname);
        } catch (error) {
            navigate('/login');
            console.log('Error verifying token');
        }
    };

    useEffect(() => {
        if(accessToken) {
            verifyToken();
        } else {
            navigate('/login');
            console.log('Token not found');
        }
    }, []);

   return accessToken ? <Route {...rest} element={<Element location={location} />} /> : <Navigate to="/login" /> ;
}

export default ProtectedRoute;
