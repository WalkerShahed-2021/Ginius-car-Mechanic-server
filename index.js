const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rzrcq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
       await client.connect();
       const database = client.db('carMechanic');
       const servicesCollection = database.collection('services');

      //get single services
         app.get('/services/:id', async (req, res) =>{
            const id = req.params.id;  
            console.log('geting specific services', id)
             const quary = {_id: objectId(id)};
             const services = await servicesCollection.findOne(quary);
             res.json(services)
         })
      
       //get api

       app.get('/services', async(req, res) =>{
           const cursor = servicesCollection.find({});
           const services = await cursor.toArray();
           res.send(services);
       })

       //post api
          app.post('/services', async (req, res) =>{
              const services = req.body;
              console.log('hit the post api', services);
              res.send('post hitting')
            const result = await servicesCollection.insertOne(services);
            console.log(result); 
              res.json(result)
          })

          //delete api
          app.delete('/services/:id', async(req, res) =>{
              const id = req.params.id;
              const query = {_id: objectId(id)};
              const result = await servicesCollection.deleteOne(query);
              res.json(result);
          })

    }
    finally{
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Runing Genis server !!!!!!')
})

app.listen(port, () => {
   console.log('Runing Genius server on port!!', port)
})
