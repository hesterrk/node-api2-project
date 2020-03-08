
const express = require('express');

const server = express();
server.use(express.json());

const dbRouter = require('./db-router')

server.use('/api/posts', dbRouter)



server.get('/', (req, res) => {
res.send("working as should")
})


const port = 4000;

server.listen(port, () => {
console.log(`Server stated at ${port}`);
});