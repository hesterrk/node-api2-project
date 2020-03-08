// In here: endpoints that begin with `/api/posts`

const express = require('express');


const router = express.Router()
//data file
const db = require('./data/db.js')



// GET.find() handler for: '/api/posts'
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

// -GET `findById()`: this method expects an `id` as it's only parameter and returns the post corresponding to the `id` provided or an empty array if no post with that `id` is found.
///api/posts/:id 
//Returns the post object with the specified id
//- If the _post_ with the specified `id` is not found:
// - return HTTP status code `404` (Not Found).
// - return the following JSON object: `{ message: "The post with the specified ID does not exist." }`.

// - If there's an error in retrieving the _post_ from the database:
// - cancel the request.
// - respond with HTTP status code `500`.
// - return the following JSON object: `{ error: "The post information could not be retrieved." }`.

router.get('/:id', (req, res) => {
    const { id } = req.params

    db.findById(id)
    .then(post => {
        if(post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: "The post information could not be retrieved."
        })
    })
})






module.exports = router