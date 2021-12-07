const app = require('./app');
require("dotenv").config();

const normalizePort = val => {
  const parsedPort = parseInt(val, 10);

  if (isNaN(parsedPort)) {
    return val;
  }
  if (parsedPort >= 0) {
    return parsedPort;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '3000');

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

app.listen(port, err => {
  if(err) return errorHandler(err);
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log(`Listening on ${bind}`);
});