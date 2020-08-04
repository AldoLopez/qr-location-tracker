import React from 'react';
import './App.css';
import netlifyIdentity from 'netlify-identity-widget';
import { loginUser, logoutUser } from './identityActions';
import auth from './hoc/AuthHOC';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Table from './Table/Table';
import CreateQR from './CreateQR/CreateQR';
import { Button } from '@material-ui/core';
import SendData from './SendData/SendData';

netlifyIdentity.init();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }
  componentDidMount() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.setState({ user: JSON.parse(user) });
    } else {
      loginUser();
    }
    netlifyIdentity.on('login', (user) => this.setState({ user }, loginUser()));
    netlifyIdentity.on('logout', (user) =>
      this.setState({ user: null }, logoutUser())
    );
  }

  handleLogIn = () => {
    netlifyIdentity.open();
  };

  handleLogOut = () => {
    netlifyIdentity.logout();
  };

  render() {
    return (
      <div className='root'>
        <Router>
          <div>
            {this.state.user ? (
              <header className='App-header'>
                <Link to='/create-qr' className='home' alt='qr'>
                  <Button variant='contained' color='primary'>
                    <span>Create QR Code</span>
                  </Button>
                </Link>
                <Link to='/table' className='home' alt='table'>
                  <Button variant='contained' color='secondary'>
                    <span>Table</span>
                  </Button>
                </Link>
                <Button variant='contained' onClick={this.handleLogOut}>
                  Logout
                </Button>
              </header>
            ) : (
              <header>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.handleLogIn}
                >
                  Login to Access
                </Button>
              </header>
            )}
            <section>
              <Route exact path='/table' component={auth(Table)} />
              <Route exact path='/create-qr' component={auth(CreateQR)} />
              <Route exact path='/sendData' component={SendData} />
            </section>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
