// In here: endpoints that begin with `/api/posts`

const express = require('express');


const router = express.Router()
//data file
const db = require('./data/db.js')



// .find() handler for: '/api/posts'
//Returns an array of all the post objects contained in the database
// - If there's an error in retrieving the _posts_ from the database:
// - cancel the request.
// - respond with HTTP status code `500`.
// - return the following JSON object: `{ error: "The posts information could not be retrieved." }`.

router.get('/', (req, res) => {
db.find().then(hubs => {
res.status(200).json(hubs)
})
.catch(err => {
console.log(err);
res.status(500).json({error: "The posts information could not be retrieved."})
})

});





module.exports = router