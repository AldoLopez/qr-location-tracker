import React from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { withRouter } from 'react-router';

class SendData extends React.Component {
  constructor(props) {
    super(props);
    alert(JSON.stringify(props));
    const parsed = queryString.parse(props.location.search);
    this.state = {
      location: 'not-supported',
      deviceId: parsed.deviceId,
    };
  }
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getPosition);
    }
  }

  getPosition = (location) => {
    this.setState(
      {
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      },
      () => {
        alert(location);
        this.sendData();
      }
    );
  };

  sendData = () => {
    axios
      .get('https://qr-location.netlify.app/.netlify/functions/addToDB', {
        params: {
          location: this.state.location,
          deviceId: this.state.deviceId,
        },
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  render() {
    return <div>Thanks for your submission</div>;
  }
}

export default withRouter(SendData);
