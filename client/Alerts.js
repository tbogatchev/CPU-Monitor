import React from 'react';
import Alert from 'react-bootstrap/Alert';

const loadTypeToAlertVariantMap = {
  highLoad: 'danger',
  normalLoad: 'success'
}

export default class Alerts extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('current data: ', this.props.data);
    return (
      <div class="alerts">
        {this.props.data.map((alert, index) =>
          <Alert variant={loadTypeToAlertVariantMap[alert.alertType]} key={ index }>
            {alert.message}
          </Alert>
        )}
      </div>
    );
  }
}
