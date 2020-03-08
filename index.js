
const express = require('express');

const server = express();
const dbRouter = require('./db-router')

// server.use(express.json());
server.use('/api/posts', dbRouter)



server.get('/', (req, res) => {
res.send("working as should")
})


const port = 4000;

server.listen(port, () => {
console.log(`Server stated at ${port}`);
});