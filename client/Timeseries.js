import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default class Timeseries extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('current data: ', this.props.data);
    //We have to copy the array here to create a new Object reference
    //Otherwise the graph won't trigger a render update
    const data = Array.from(this.props.data);
    return (
      <ResponsiveContainer width="80%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis dataKey="val" domain={[0, 'auto']}/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="val" stroke="#8884d8" name="time (seconds)"/>
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
