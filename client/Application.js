import React from 'react';
import Timeseries from './Timeseries';

export default class Application extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      cpuData: [
          {time: 0, val: .5},
          {time: 10, val: .55},
          {time: 20, val: .65},
          {time: 30, val: .75},
          {time: 40, val: 1.5},
          {time: 50, val: .5},
          {time: 60, val: .55},
          {time: 70, val: .75},
          {time: 80, val: .5},
      ],
      time: 80
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.fetchCPUData.bind(this), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchCPUData() {
    return fetch('/loadTimes')
    .then(response => response.json())
    .then(response => {
      const newTime = this.state.time + 10;
      const newDataPoint = [{
        time: newTime,
        val: response.average
      }];
      //We do this to create a new object reference
      const newCPUData = this.state.cpuData.concat(newDataPoint);
      this.setState({
        cpuData: newCPUData,
        time: newTime
      });
    })
  }

  render() {
    return (
      <div>
        <div className="title">CPU Performance</div>
        <div className="streamContainer container">
          <Timeseries data={this.state.cpuData}></Timeseries>
        </div>
      </div>
    );
  }
}