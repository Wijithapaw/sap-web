import React, { useState } from 'react';
import { Alert, Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { changePassword } from '../auth-api';
import { ChangePasswordDto } from '../types';

export default function ChangePassword() {
  const [data, setData] = useState<ChangePasswordDto>({ currentPwd: '', newPwd: '', newPwdConfirm: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError('');
    changePassword(data)
      .then((res) => {
        if (res.succeeded) setSuccessMsg('Password changed successfully.');
        else setError(res.errorMessage || "Error while changing password.");
      });
  }

  return <Form className='mt-5' style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
    <FormGroup>
      <h3>Change Password</h3>
      <hr />
    </FormGroup>
    <FormGroup>
      <Label>Current Password</Label>
      <Input type='password' name='currentPwd' value={data.currentPwd} onChange={handleChange} />
    </FormGroup>
    <FormGroup>
      <Label>New Password</Label>
      <Input type='password' name='newPwd' value={data.newPwd} onChange={handleChange} />
    </FormGroup>
    <FormGroup>
      <Label>Confirm New Password</Label>
      <Input type='password' name='newPwdConfirm' value={data.newPwdConfirm} onChange={handleChange} />
    </FormGroup>
    <FormGroup>
      <Button type='submit' disabled={!data.currentPwd || !data.newPwd || data.newPwd != data.newPwdConfirm} color="primary">Save</Button>
    </FormGroup>
    <FormGroup>
      {successMsg && <Alert className='p-2' color='success'>{successMsg}</Alert>}
      {error && <Alert color="danger">{error}</Alert>}
    </FormGroup>
  </Form>
}