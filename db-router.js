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
        if(post.length !== 0) {
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


// GET: /api/posts/:id/comments
//Returns an array of all the comment objects associated with the post with the specified id
//- If the _post_ with the specified `id` is not found:
// - return HTTP status code `404` (Not Found).
// - return the following JSON object: `{ message: "The post with the specified ID does not exist." }`.

// - If there's an error in retrieving the _comments_ from the database:
// - cancel the request.
// - respond with HTTP status code `500`.
// - return the following JSON object: `{ error: "The comments information could not be retrieved." }`.
//- `findPostComments()`: the findPostComments accepts a `postId` as its first parameter and returns all comments on the post associated with the post id.


router.get('/:id/comments', (req, res) => {
    const { id } = req.params

    db.findPostComments(id)
    .then((comments) => {
        if(comments.length !== 0) {
        res.status(200).json(comments)
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist."})

        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: "The comments information could not be retrieved."})
    })
})

//POST: /api/posts 
//Creates a post using the information sent inside the `request body`.
//- If the request body is missing the `title` or `contents` property:
// - cancel the request.
// - respond with HTTP status code `400` (Bad Request).
// - return the following JSON response: `{ errorMessage: "Please provide title and contents for the post." }`.

// - If the information about the _post_ is valid:

// - save the new _post_ the the database.
// - return HTTP status code `201` (Created).
// - return the newly created _post_.

// - If there's an error while saving the _post_:
// - cancel the request.
// - respond with HTTP status code `500` (Server Error).
// - return the following JSON object: `{ error: "There was an error while saving the post to the database" }`.
//- `insert()`: calling insert passing it a `post` object will add it to the database and return an object with the `id` of the inserted post. The object looks like this: `{ id: 123 }`.


router.post('/', (req, res) => {
    const newPost = req.body;
    console.log(req.body)

    if(newPost.title && newPost.contents) {
        db.insert(newPost).then(post => {
        res.status(201).json(post)
    }).catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: "There was an error while saving the post to the database"})
    })

    } else {
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    }
})


//POST   | /api/posts/:id/comments | Creates a comment for the post with the specified id using information sent inside of the `request body`.                                                                   
//- If the _post_ with the specified `id` is not found:

// - return HTTP status code `404` (Not Found).
// - return the following JSON object: `{ message: "The post with the specified ID does not exist." }`.

// - If the request body is missing the `text` property:

// - cancel the request.
// - respond with HTTP status code `400` (Bad Request).
// - return the following JSON response: `{ errorMessage: "Please provide text for the comment." }`.

// - If the information about the _comment_ is valid:

// - save the new _comment_ the the database.
// - return HTTP status code `201` (Created).
// - return the newly created _comment_.

// - If there's an error while saving the _comment_:
// - cancel the request.
// - respond with HTTP status code `500` (Server Error).
// - return the following JSON object: `{ error: "There was an error while saving the comment to the database" }`.
// - `insertComment()`: calling insertComment while passing it a `comment` object will add it to the database and return an object with the `id` of the inserted comment. The object looks like this: `{ id: 123 }`. This method will throw an error if the `post_id` field in the `comment` object does not match a valid post id in the database.


router.post('/:id/comments', (req, res) => {
    const { id } = req.params 
    

    if(!req.body.text) {
        res.status(400).json({errorMessage: "Please provide text for the comment."})

    } else {
        db.findById(id).then((comment) => {
            if(comment) {
               return db.insertComment({text: req.body.text, post_id: id}
                ).then(comment => {
                    res.status(201).json(comment)
                })
                .catch(err => {
                    console.log(err)
                    res.status(404).json({message: "The post with the specified ID does not exist."})
                })
            }
        })
        .catch(err => {
            console.log(err);
                    res.status(500).json({error: "There was an error while saving the comment to the database"})
        })



        // const newText = {...req.body, post_id: id}
        // db.insertComment(newText).then(comment => {
        //     if(comment) {
        //         db.findCommentById(id).then(comment => {
        //             res.status(201).json(comment)
        //         })
        //     } else {
        //         res.status(404).json({message: "The post with the specified ID does not exist."})
        //     }
        // })
        // .catch(err => {
        //     console.log(err);
        //     res.status(500).json({error: "There was an error while saving the comment to the database"})
        // })
    }

})









//DELETE | /api/posts/:id  --> Removes the post with the specified id and returns the **deleted post object**. You may need to make additional calls to the database in order to satisfy this requirement. 
//- `remove()`: the remove method accepts an `id` as its first parameter and upon successfully deleting the post from the database it returns the number of records deleted.

//- If the _post_ with the specified `id` is not found:
// - return HTTP status code `404` (Not Found).
// - return the following JSON object: `{ message: "The post with the specified ID does not exist." }`.

// - If there's an error in removing the _post_ from the database:
// - cancel the request.
// - respond with HTTP status code `500`.
// - return the following JSON object: `{ error: "The post could not be removed" }`.

router.delete('/:id', (req, res) => {
    const { id } = req.params

    db.remove(id)
    .then(post => {
        if(post) {
            res.status(200).json(post)

        } else {
            res.status(404).json({message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: "The post could not be removed" 
        });
      });
})

//COME BACK








module.exports = router