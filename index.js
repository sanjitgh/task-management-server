const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

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
    const userCollection = client.db("task").collection('users')

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


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Server is runingggg")
})

app.listen(port, () => {
  console.log(`Server is runing on port: ${port}`);
})