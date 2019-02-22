import React from 'react';
import Timeseries from './Timeseries';
import Alerts from './Alerts';

//Check to see if we have 2 minutes of data. 
//2 minutes = 120 seconds
//120 seconds / 10 seconds = 12 intervals
const TWO_MINUTE_INTERVAL = 12;
const HIGH_LOAD_ALERT = 'highLoad';
const RETURN_TO_NORMAL_LOAD = 'normalLoad';

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
          {time: 50, val: 1.5},
          {time: 60, val: 1.55},
          {time: 70, val: 1.75},
          {time: 80, val: 1.5},
          {time: 40, val: 1.5},
          {time: 50, val: 1.5},
          {time: 60, val: 1.55},
          {time: 70, val: 1.75},
          {time: 80, val: 1.5},
      ],
      time: 80,
      alerts: []
    };
    //TODO REMOVE
    this.fetchCPUData(1.1);
  }

  componentDidMount() {
    this.interval = setInterval(this.fetchCPUData.bind(this), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  /**
   * Fetches the average CPU load from the server
   *TODO remove test
   */
  fetchCPUData(test) {
    return fetch('/loadTimes')
    .then(response => response.json())
    .then(response => {
      const {time, cpuData, alerts} = this.state;
      const newTime = time + 10;
      const newDataPoint = {
        time: newTime,
        val: response.average
      };
      cpuData.push(newDataPoint);
      const loadAverage = Application.calculateTwoMinuteLoadAverage(cpuData);
      //TODO REMOVE
      // let loadAverage;
      // if (test) {
      //   loadAverage = test;
      // } else {
      //   loadAverage = Application.calculateTwoMinuteLoadAverage(cpuData);
      // }
      const alert = this.createAlert(loadAverage);
      if (alert) {
        alerts.push(alert);
      }
      console.log('alerts: ', alerts);
      this.setState({
        cpuData,
        alerts,
        time: newTime,
      });
    })
  }
  /**
   * Checks the load average over the last 2 minutes
   * @param {Object[]} cpuData
   * @returns {Number}
   */
  static calculateTwoMinuteLoadAverage(cpuData) {
    if (cpuData.length < TWO_MINUTE_INTERVAL) {
      return 0;
    }
    const lastTwelve = cpuData.slice(cpuData.length - TWO_MINUTE_INTERVAL);
    const loadSum = lastTwelve.reduce((accumulator, currentData) => {
      accumulator + currentData.val;
    }, 0)
    return loadSum / TWO_MINUTE_INTERVAL;
  }

  createAlert(loadAverage) {
    const alerts = this.state.alerts;
    const lastAlert = alerts[alerts.length - 1];
    const now = Date.now(); 
    const isLoadHigh = loadAverage > 1;
    const isLastAlertAWarning = lastAlert && lastAlert.alertType === HIGH_LOAD_ALERT;

    if(isLoadHigh && !isLastAlertAWarning) {
        const message = `High load generated an alert - load = ${loadAverage}, triggered at ${now}`;
        return {
          alertType: HIGH_LOAD_ALERT,
          message,
          triggeredAt: now
        }
    }
    if(!isLoadHigh && isLastAlertAWarning) {
      const totalHighLoadTime = now - lastAlert.triggeredAt;
      const message = `System load back to normal. Total duration of high load = ${totalHighLoadTime}. Resolved at ${now}.`
      return {
        alertType: RETURN_TO_NORMAL_LOAD,
        message,
        triggeredAt: now
      }
    }
  }

  render() {
    return (
      <div>
        <div className="title">CPU Performance</div>
        <div className="container">
          <Timeseries class="timeseries" data={this.state.cpuData}/>
          <Alerts class="alerts" data={this.state.alerts}/>
        </div>
      </div>
    );
  }
}