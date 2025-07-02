import React, { useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'
import { Navigate } from 'react-router-dom'
import { PathsContext } from './App'

const PrivateRoute = ({ component }) => {

  const {
    adminLogin,
  } = useContext(PathsContext);

  const user_id = localStorage.getItem('admin_id');
  
  // Si no hay admin conectado redirige al login de admin
  return user_id ? (
    <>{component}</>
  ) : (
    <Navigate
      replace={true}
      to={adminLogin}
      state={{ from: `${location.pathname}${location.search}` }}
    />
  )
}

export default PrivateRoute