const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://end-game:egyHvm4I2YE5Yjfc@cluster0.myonw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
    // const userCollection = client.db("authentication").collection("users");
    const postCollection = client.db("authentication").collection("posts");

    async function ran() {
        try {
            await client.connect();
            app.post('/post', async (req, res) => {
                const post = req.body;
                const result = await postCollection.insertOne(post);
                res.send(result)
            })
            app.get('/posts', async (req, res) => {
                const posts = await postCollection.find({}).toArray();
                res.send(posts);
            })
            app.delete('/posts/:id', async (req, res) => {
                const id = req.params.id
                const query = { _id: ObjectId(id) }
                const deleteData = await postCollection.deleteOne(query);
                res.send(deleteData);
            })

            app.patch('/postUpdate/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) }
                const body = req.body;
                const updateDoc = {
                    $set: {
                        title:body.title,
                        description: body.description
                    },
                };
                const update = await postCollection.updateOne(query, updateDoc)
                res.send(update);
            })
            app.patch('/comment/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) }
                const body = req.body;
                const updateDoc = {
                    $set: {
                       comment: body.comment
                    },
                };
                const comment = await postCollection.updateOne(query, updateDoc)
                res.send(comment);
            })
        }
        finally { }
    }
    ran().catch(console.dir)
});


app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(port, () => {
    console.log('Listening port', port);
})
