import React from 'react';
import { Button } from '@material-ui/core';
import netlifyIdentity from 'netlify-identity-widget';

const login = () => netlifyIdentity.open();
const Login = () => (
  <div>
    <p>Login to access</p>
  </div>
);

export default Login;
