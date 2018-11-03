const { port, env } = require('./config/vars');
const mongoose = require('./config/mongoose');
const app = require('./config/express');

mongoose.connect();

app.listen(port, () => console.log(`App running on: localhost:${port} env: ${env}`));
