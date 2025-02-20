const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middelware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwhf0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const userCollection = client.db("task").collection('users');
    const taskCollection = client.db("task").collection("allTask")

    // save user
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email };

      // check if user exists
      const isExists = await userCollection.findOne(query);
      if (isExists) return res.send({ message: 'user already exist!' });

      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    // save all task
    app.post('/task', async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result)
    })

    // get all task filter by email
    app.get('/tasks/:email', async (req, res) => {
      const email = req.params.email;
      const query = { user: email };
      const result = await taskCollection.find(query).sort({ date: -1 }).toArray();
      res.send(result)
    })

    // get single task
    app.get('/single-task/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    })

    // delete task
    app.delete('/tasks/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result)
    })

    // update task
    app.patch('/task/:id', async (req, res) => {
      const id = req.params.id;
      const item = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          title: item.title,
          description: item.description,
          category: item.category,
        }
      }
      const result = await taskCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Task management server is runing.")
})

app.listen(port, () => {
  console.log(`Server is runing on port: ${port}`);
})