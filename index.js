const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.port || 5055;

app.use(cors());
app.use(bodyParser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.slxtz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error', err);
  const groceryCollection = client.db("grocery").collection("products");

  app.get('/home', (req, res) => {
    groceryCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/manage', (req, res) => {
    groceryCollection.find()
      .toArray((err, products) => {
        res.send(products)
      })
  })


  app.post('/admin', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product', newProduct);

    groceryCollection.insertOne(newProduct)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/product/:id', (req, res) => {
    const id = ObjectId(req.params.id);
    groceryCollection.find({ _id: id })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.delete('/delete/:id', (req, res) => {

    groceryCollection.findOneAndDelete({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
    console.log(req.params.id);
  })

})
//CheckOut collection

client.connect(err => {
  console.log('connection error', err);
  const checkoutCollection = client.db("grocery").collection("checkout");
   
  app.post('/addCheckout', (req, res)=>{
    const newCheckout= req.body;
    checkoutCollection.insertOne(newCheckout)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
    console.log(newCheckout);
  })

  app.get('/order', (req, res) =>{
    checkoutCollection.find({email: req.query.email})
    .toArray((err, documents)=>{
      res.send(documents)

    })
  })

})

  console.log(process.env.DB_USER);
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })


  // console.log(process.env.DB_USER);
  // app.get('/', (req, res) => {
  //   res.send('Hello World!')
  // })

  // app.listen(port, () => {
  //   console.log(`Example app listening at http://localhost:${port}`)
  // })
// })