import React from 'react';
import ReactDOM from 'react-dom';
import Application from './client/Application';

window.onload = function()
{
    ReactDOM.render(<Application/>, document.getElementById('root'));
};
