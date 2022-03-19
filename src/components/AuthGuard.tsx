import React from 'react';
import { useAppSelector } from '../app/hooks';
import { selectAuthUser } from '../features/auth/auth-slice';

interface Props {
  children: any;
  permission?: string;
}

export default function PermissionGuard({ children, permission }: Props) {
  const user = useAppSelector(selectAuthUser);
  const auth = !!user && (!permission || user.permissions.includes(permission));

  return auth ? children : null;
}
