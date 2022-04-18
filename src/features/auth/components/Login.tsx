import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Alert, Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { loginAsync, selectAuthUser } from '../auth-slice';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const authError = useAppSelector((state) => state.auth.authError);

  const handleLogin = (e: any) => {
    e.preventDefault();
    dispatch(loginAsync({ username, password }))
  }

  useEffect(() => {
    if (!!user) navigate("/");
  }, [user])

  return <Form className='mt-5' style={{ maxWidth: '400px', margin: '0 auto' }} onSubmit={handleLogin}>
    <FormGroup className="text-center">
      <h2>Login</h2>
    </FormGroup>
    <FormGroup>
      <Label>Email</Label>
      <Input value={username} onChange={(e) => setUsername(e.target.value)} />
    </FormGroup>
    <FormGroup>
      <Label>Password</Label>
      <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
    </FormGroup>
    <FormGroup className="text-center">
      <Button type='submit' color="primary">Login</Button>
    </FormGroup>
    <FormGroup>
      {authError && <Alert color="danger">Email or Password is incorrect</Alert>}
    </FormGroup>
  </Form>
}
