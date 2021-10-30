const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fae7y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run () {
    try{
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('bookMyHoliday');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('orders');


        //GET services API
        app.get('/services', async(req, res) =>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })
        //Add services API
        app.post('/services', async(req, res) =>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        });
        //Add order API
        app.post('/orders', async(req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        });
        //GET orders API
        app.get('/orders', async(req, res) =>{
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
        //DELETE API
        app.delete('/orders/:id', async(req, res) =>{
            const id = req.params.id;
            // const query = {_id: ObjectId(id)}
            // const result = await orderCollection.deleteOne(query);
            console.log('deleting user with id', id);
            res.json(1);
        })


    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Book My Holiday Server Running');
})


app.listen(port, () =>{
    console.log('Server running at port', port);
})


// user: bookMyHoliday
// pass: y6DAFkheG0RuV05v