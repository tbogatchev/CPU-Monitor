const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const os = require('os');

app.use( express.static( __dirname + '/style' ));
app.use( express.static( __dirname + '/static' ));

app.set('view engine', 'ejs');

//serve our app
app.get( '/', function(req, res) {
  res.render(path.join( __dirname, './', 'index'));
});

app.get('/loadTimes', function(req, res) {
	const cpus = os.cpus().length; // in the land of multi-cpu computers the avg needs to be normalized by number of CPUs 
	const avg = os.loadavg()[0]/cpus;
	res.json({ average: avg });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));