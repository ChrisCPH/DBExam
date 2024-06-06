require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const connectSQLServer = require('./db/sql');
const connectMongoDB = require('./db/mongodb');
const connectNeo4j = require('./db/neo4j');

const app = express();
const port = 3000;

app.use(express.json());

connectSQLServer();
connectMongoDB();
// neo4j closes the connection this is just to see that it works
connectNeo4j();

app.use('/', routes);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
