import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectAuthUser } from '../features/auth/auth-slice';

interface Props {
  children?: any;
  permission?: string;
}

export default function PrivateRoute({ children, permission }: Props) {  
  const user = useAppSelector(selectAuthUser);

  const auth = !!user && (!permission || user.permissions.includes(permission));

  return auth ? children : <Navigate to="/login" />;
}
