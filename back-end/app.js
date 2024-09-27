const fs = require('fs');
const http = require('http');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const helpers = require('./src/helpers');
const app = require('./config/express');

const server = http.createServer(app);

// eslint-disable-next-line import/order
const socketIO = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

mongoose.Promise = global.Promise;
mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`, {
  autoIndex: false,
  // useNewUrlParser: true,
  // useFindAndModify: false,
  // useUnifiedTopology: true,
});
mongoose.connection.on('error', (err) => {
  if (err) {
    throw new Error(`Unable to connect to database: ${err.toString()}`);
  }
});

if (process.env.NODE_ENV === 'production') {
  const dir = './logs';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  app.use(morgan('combined', {
    stream: fs.createWriteStream(`${__dirname}/logs/access.log`, { flags: 'a' }),
  }));
} else {
  app.use(morgan('dev'));
}

const routes = require('./src/modules/routes');

app.use('/admin', (req, res, next) => {
  res.locals.formatDate = helpers.formatDate;
  res.locals.truncateText = helpers.truncateText;

  res.locals.flash_messages = req.session.flash;
  delete req.session.flash;

  next();
});

app.use(routes);

const PORT = process.env.PORT || 3000;

socketIO.on('connection', (socket) => { // /Handle khi có connect từ client tới
  console.log('🔥🔥🔥««««« New client connected »»»»»🚀🚀🚀', socket.id);

  console.log('🔥🔥🔥««««« getId »»»»»🚀🚀🚀', socket.id);

  socket.on('sendDataClient', (data) => { // Handle khi có sự kiện tên là sendDataClient từ phía client
    socketIO.emit('sendDataServer', { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  });

  socket.on('disconnect', () => {
    console.log('🔥🔥🔥««««« Client disconnected »»»»»🚀🚀🚀');
  });
});

global.io = socketIO;

server.listen(PORT, (err) => {
  if (err) {
    throw new Error(`Unable to list to port: ${err.toString()}`);
  }

  // eslint-disable-next-line no-console
  console.info(`🚀 Server running on http://${process.env.HOST}:${PORT}`);
});
