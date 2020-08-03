import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router';

class SendData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 'not-supported',
      deviceId: useParams(),
    };
  }
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getPosition);
      this.sendData();
    }
  }

  getPosition = (location) => {
    this.setState({
      location,
    });
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

export default SendData;
