import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label
} from 'recharts';

export default class Timeseries extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    //We have to copy the array here to create a new Object reference
    //Otherwise the graph won't trigger a render update
    const data = Array.from(this.props.data);
    return (
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time">
            <Label value="Seconds elapsed" position="insideBottom" offset={-10}/>
          </XAxis>
          <YAxis dataKey="load" domain={[0, 'auto']}>
            <Label value="Average Load" angle="-90" position="insideLeft"/>
          </YAxis>
          <Tooltip label="Average Load"/>
          <Line type="monotone" dataKey="load" stroke="#8884d8"/>
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
