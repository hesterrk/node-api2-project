
const express = require('express');
const cors = require('cors')
const server = express();
server.use(express.json());
server.use(cors())

const dbRouter = require('./db-router')

server.use('/api/posts', dbRouter)



server.get('/', (req, res) => {
res.status(200).json({ message: process.env.SECRET_MESSAGE  })
})
console.log(process.env.SECRET_MESSAGE);


// const port = 5000;

// server.listen(port, () => {
// console.log(`Server stated at ${port}`);
// });

const port = process.env.PORT || 4000;

server.listen(port, () => {
console.log(`Server stated at ${port}`);
});