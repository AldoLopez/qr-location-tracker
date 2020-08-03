import React from 'react';
import './CreateQr.css';
import QRCode from 'qrcode.react';
import { TextField, Button } from '@material-ui/core';
class CreateQR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceId: null,
      qrUrl: null,
    };
  }

  setUrlForQR = () => {
    const qrUrl = `https://qr-location.netlify.app/sendData/deviceId=${this.state.deviceId}`;
    this.setState({
      qrUrl,
    });
  };

  setDeviceId = (e) => {
    this.setState({
      deviceId: e.target.value,
    });
  };
  render() {
    return (
      <div className='container'>
        <div>Create QR Code</div>
        <TextField
          id='deviceId'
          label='Device ID'
          className='inputField'
          onChange={(e) => this.setDeviceId(e)}
        />
        <div className='qrButton'>
          <Button
            variant='contained'
            color='primary'
            onClick={this.setUrlForQR}
            disabled={false}
          >
            Generate QR Code
          </Button>
        </div>
        <br />
        <div>{this.state.qrUrl && <QRCode value={this.state.qrUrl} />}</div>
      </div>
    );
  }
}

export default CreateQR;
