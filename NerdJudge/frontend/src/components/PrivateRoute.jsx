import React from 'react';
import { Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
    // Replace this with your authentication logic
    const isAuthenticated = true; // Example: You can check if user is authenticated
    const navigate = useNavigate();

    if (!isAuthenticated) {
        navigate('/'); // Navigate to login page if not authenticated
        return null; // Render nothing or a loading indicator while redirecting
    }

    return <Route {...rest} element={<Component />} />;
};

export default PrivateRoute;
