import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from './Auth.jsx';

import Login from './Login.jsx'; 

import ServerIndex from './components/server/Index.jsx';
import ServerCreate from './components/server/Create.jsx';
import ServerEdit from './components/server/Edit.jsx';
import ServerShow from './components/server/Show.jsx';

// RequireAuth component
const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user || !user.token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter> 
    
      <Routes> 
        <Route path="/" element={<Login />} />
        <Route path="/servers" element={
          <RequireAuth><ServerIndex/></RequireAuth>
        } />
        <Route path="/servers/create" element={
          <RequireAuth><ServerCreate/></RequireAuth>
        } />
        <Route path="/servers/edit/:id" element={
          <RequireAuth><ServerEdit/></RequireAuth>
        } />
        <Route path="/servers/:id" element={
          <RequireAuth><ServerShow/></RequireAuth>
        } />
 
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>

      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}

export default App;
