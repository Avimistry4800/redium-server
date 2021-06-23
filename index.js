const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require("express-fileupload");
const fs = require("fs-extra");
const ObjectID = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
 
const port = 5000;
 
 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pbmsk.mongodb.net/${process.env.DB_USER}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
  console.log(err);
  const blogCollection = client.db("redium").collection("blogs");

 
  // Add data to database 
 
  app.post('/addblog', (req, res) => {
    const file = req.files.image;
    const title = req.body.title;
    const content = req.body.content;
    const filePath = `${__dirname}/blogs/${file.title}`;
    const newImage = file.data;
    const convertImage = newImage.toString("base64");
    const image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(convertImage, "base64"),
    };
    blogCollection.insertOne({ title, content, image })
      .then((result) => {
        res.send(result.insertedCount > 0);
        console.log("Blog add to database")
      });
 
  });
 
 
});
 
 
 
 
 
app.get('/', (req, res) => {
  res.send('Hello')
})
 
 
 
 
 
app.listen(process.env.PORT || port)