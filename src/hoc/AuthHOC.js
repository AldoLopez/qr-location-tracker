import React from 'react';
import Login from '../Login';

export default function requireAuthentication(Component) {
  class AuthHOC extends Component {
    render() {
      const user = localStorage.getItem('currentUser');
      return user ? <Component {...this.props} /> : <Login />;
    }
  }
  return AuthHOC;
}
