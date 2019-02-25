import React from 'react';
import Timeseries from './Timeseries';
import Alerts from './Alerts';
import moment from 'moment';

//2 minutes = 120 seconds
//120 seconds / 10 seconds = 12 intervals
const TWO_MINUTE_INTERVAL = 12;
//10 minutes = 600 seconds
// 600 seconds /10 seconds = 60 intervals
const TEN_MINUTE_INTERVAL = 60;
const HIGH_LOAD_ALERT = 'highLoad';
const RETURN_TO_NORMAL_LOAD = 'normalLoad';
const LOAD_THRESHOLD = 1.0;

export default class Application extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      cpuData: [],
      time: 0,
      alerts: []
    };
  }

  componentDidMount() {
    //fetch the data every 10 seconds
    this.interval = setInterval(this.fetchCPUData.bind(this), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  /**
   * Fetches the average CPU load from the server
   */
  fetchCPUData() {
    return fetch('/loadTimes')
    .then(response => response.json())
    .then(this.hanldeFetchLoadResponse.bind(this))
  }
  /**
   * Parses new load from the server and sets new cpu data
   * @param {Object} response
   */
  hanldeFetchLoadResponse(response) {
    const {time, cpuData, alerts} = this.state;
    const newTime = time + 10;

    const newData = Application.calculateNewCPUData(cpuData, response.average, newTime);
    const loadAverage = Application.calculateTwoMinuteLoadAverage(newData);
    const alert = Application.createAlert(loadAverage, alerts);

    if (alert) {
      alerts.push(alert);
    }

    this.setState({
      cpuData: newData,
      alerts,
      time: newTime,
    });
  }
  /**
   * Checks the load average over the last 2 minutes
   * @param {Object[]} cpuData
   * @returns {Number}
   */
  static calculateTwoMinuteLoadAverage(cpuData) {
    const dataLength = cpuData.length;
    const start = dataLength > TWO_MINUTE_INTERVAL ? dataLength - TWO_MINUTE_INTERVAL : 0;
    const lastTwelve = cpuData.slice(start, dataLength);

    const loadSum = lastTwelve.reduce((accumulator, currentData) => {
      return accumulator + currentData.load;
    }, 0)
    return loadSum / lastTwelve.length;
  }
  /**
   * Calculates the new CPU data array. We only ever want to keep 10 minutes worth of data.
   * @param {Object[]} oldData
   * @param {Number} newDataPoint
   * @param {Number} time
   * @returns {Object[]}
   */
  static calculateNewCPUData(cpuData, loadAverage, time) {
      const newDataPoint = {
        time,
        load: loadAverage
      };
      cpuData.push(newDataPoint);
      //Keep only 10 minutes of data
      if (cpuData.length > TEN_MINUTE_INTERVAL) {
        cpuData.shift();
      }
      return cpuData;
  }
  /**
   * Creates an alert object if there is an alert condition met
   * @param {Number} loadAverage
   * @param {Object[]} alerts
   * @returns {Object | undefined}
   */
  static createAlert(loadAverage, alerts) {
    const lastAlert = alerts[alerts.length - 1];
    const now = Date.now(); 
    const isLoadHigh = loadAverage > LOAD_THRESHOLD;
    const isLastAlertAWarning = lastAlert && lastAlert.alertType === HIGH_LOAD_ALERT;

    if(isLoadHigh && !isLastAlertAWarning) {
        const message = `High load generated an alert - load = ${loadAverage}, triggered at ${Application.formatDateTime(now)}`;
        return {
          alertType: HIGH_LOAD_ALERT,
          message,
          triggeredAt: now
        }
    }
    if(!isLoadHigh && isLastAlertAWarning) {
      const totalHighLoadTime = now - lastAlert.triggeredAt;
      const message = `System load back to normal. Total duration of high load: ${Application.formatTime(totalHighLoadTime)}. Resolved at ${Application.formatDateTime(now)}.`
      return {
        alertType: RETURN_TO_NORMAL_LOAD,
        message,
        triggeredAt: now
      }
    }
  }
  /**
   * Formats a time to be represented as hours:minutes:seconds:milliseconds
   * @param {Number} time
   * @returns {String}
   */
  static formatTime(time) {
    const momentDateTime = moment.utc(time);
    return momentDateTime.format('HH:mm:ss:SSS')
  }
  /**
   * Formats a dataTime to be represented as months-days-years hours:minutes:seconds
   * @param {Number} time
   * @returns {String}
   */
  static formatDateTime(dateTime) {
    const momentDateTime = moment(dateTime);
    return momentDateTime.format('MM-DD-YYYY HH:mm:ss')
  }

  render() {
    return (
      <div>
        <div className="title">CPU Performance</div>
        <div className="container">
          <Timeseries data={this.state.cpuData}/>
          <Alerts data={this.state.alerts}/>
        </div>
      </div>
    );
  }
}