const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


app.use(cors())
app.use(bodyParser.json())

// database user's credentials
const uri = process.env.DB_PATH;


let client = new MongoClient(uri, { useNewUrlParser: true });

// client.connect(err => {
//     const collection = client.db("powerXgym").collection("packages");
//     collection.insertOne({
//         // console.log("Data Successfully Inserted to Cloud DB", result);
//         name:"laptop",
//         price: 1500,
//         stock: 7
//     }, (err, res) => {
//         console.log('successfully inserted');
        
//     })
//     console.log('Database Connected...');
    
//     client.close();
// });



// get data
app.get('/packages', function (req, res) {
    client = new MongoClient(uri, { useNewUrlParser: true });
    // read data from database
    client.connect(err => {
        const collection = client.db("powerXgym").collection("packages");
        collection.find().toArray((err, documents) =>{
            if(err){
                console.log(err);
                res.status(500).send({message: err});
            }
            else{
                res.send(documents);
            }
        })
        client.close();
    });
})

app.get('/packages/:key', (req, res) => {
    
    const key = req.params.key;

    client = new MongoClient(uri, { useNewUrlParser: true });
    // read data from database
    client.connect(err => {
        const collection = client.db("powerXgym").collection("packages");
        collection.find({key}).toArray((err, documents) =>{
            if(err){
                console.log(err);
                res.status(500).send({message: err});
            }
            else{
                res.send(documents[0]);
            }
        })
        client.close();
    });    
});

app.post('/getPackagesByKey', (req, res) => {
    
    const key = req.params.key;
    const packageKeys = req.body;
    console.log(packageKeys);
    

    client = new MongoClient(uri, { useNewUrlParser: true });
    // read data from database
    client.connect(err => {
        const collection = client.db("powerXgym").collection("packages");
        collection.find({key: { $in: packageKeys }}).toArray((err, documents) =>{
            if(err){
                console.log(err);
                res.status(500).send({message: err});
            }
            else{
                res.send(documents);
            }
        })
        client.close();
    });    
});

// update
// delete

// post data
app.post('/addPackages', (req, res) => {
    // console.log('data recieved', req.body);
    const package = req.body;
    console.log(package);   

    // save data to database
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("powerXgym").collection("packages");
        collection.insert(package, (err, result) =>{
            // console.log("Data Successfully Inserted to Cloud DB", result);
            if(err){
                console.log(err);
                res.status(500).send({message: err});
            }
            else{
                res.send(result.ops[0]);
            }
            
        })
        client.close();
    });
})

// place order
app.post('/placeOrder', (req, res) => {
    // console.log('data recieved', req.body);
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();
    console.log(orderDetails);
    

    // save data to database
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("powerXgym").collection("orders");
        collection.insert(orderDetails, (err, result) =>{
            // console.log("Data Successfully Inserted to Cloud DB", result);
            if(err){
                console.log(err);
                res.status(500).send({message: err});
            }
            else{
                res.send(result.ops[0]);
            }
            
        })
        client.close();
    });
})


const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Listening to port 5000'))