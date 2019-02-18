import React from 'react';
import Timeseries from './Timeseries';

export default class Application extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      averages: []
    };
  }

  componentDidMount() {
    // socket = new WebSocket('wss://ws.blockchain.info/inv');

    // socket.onopen = function () {
    //   socket.send(JSON.stringify({ op: "unconfirmed_sub"}));
    // };
    // socket.onmessage = this.handleSocketMessage.bind(this);
  }

  componentWillUnmount() {
    //socket.close();
  }

  render() {
    return (
      <div>
        <div className="title">CPU Performance</div>
        <div className="streamContainer container">
          <Timeseries></Timeseries>
        </div>
      </div>
    );
  }
}