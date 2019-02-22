import React from 'react';

export default class Timeseries extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('current data: ', this.props.data);
    return (
      <div styles={{flex: 1}}>
        Test test
      </div>
    );
  }
}
