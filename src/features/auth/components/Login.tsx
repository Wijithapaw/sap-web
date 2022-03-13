import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Alert, Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { loginAsync, selectAuthUser } from '../auth-slice';

export function Login() {
  const [username, setUsername] = useState('wijithapaw@gmail.com');
  const [password, setPassword] = useState('User@123');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const authError = useAppSelector((state) => state.auth.authError);

  const handleLogin = () => {
    dispatch(loginAsync({ username, password }))
  }

  useEffect(() => {
    if (!!user) navigate("/counter");
  }, [user])

  return <Form className='mt-5' style={{ maxWidth: '400px', margin: '0 auto' }}>
    <FormGroup className="text-center">
      <h2>Login</h2>
    </FormGroup>
    <FormGroup>
      <Label>Email</Label>
      <Input value={username} onChange={(e) => setUsername(e.target.value)} />
    </FormGroup>
    <FormGroup>
      <Label>Password</Label>
      <Input value={password} onChange={(e) => setPassword(e.target.value)} />
    </FormGroup>
    <FormGroup className="text-center">
      <Button color="primary" onClick={handleLogin}>Login</Button>
    </FormGroup>
    <FormGroup>
      {authError && <Alert color="danger">Email or Password is incorrect</Alert>}
    </FormGroup>
  </Form>
}
