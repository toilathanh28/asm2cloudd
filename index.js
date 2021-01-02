const express = require('express')
const hbs = require('hbs')

const app = express();
app.set('view engine','hbs');
hbs.registerPartials(__dirname +'/views/partials')

var MongoClient = require('mongodb').MongoClient;
// mongodb+srv://tombo28:lamthanh28@cluster0.lkewq.mongodb.net/test
var url = 'mongodb+srv://lamthanh:lamthanh28@cluster0.lkewq.mongodb.net/test';
app.get('/',async (req,res)=>{
//hàm không đồng bộ async
    let client= await MongoClient.connect(url);
    let dbo = client.db("ASM2");
    let results = await dbo.collection("product").find({}).toArray();
    res.render('index', {model:results})

})
app.get('/insert',(req,res)=>{
    res.render('newProduct');
})

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/doInsert',async (req,res)=>{
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let colorInput = req.body.txtColor;
    let client= await MongoClient.connect(url);  
    let dbo = client.db("ASM2"); 
    let newProduct = {productName:nameInput,price:priceInput,color: colorInput};
    
    console.log(newProduct); //in ra sản phẩm
    await dbo.collection("product").insertOne(newProduct);
   
    res.redirect('/');
})

app.get('/search',(req,res)=>{
    res.render('search')
})
app.post('/doSearch',async (req,res)=>{
    let nameInput = RegExp(req.body.txtName);
    let client= await MongoClient.connect(url);  
    let dbo = client.db("ASM2");  
    // let regex = new RegExp
    let results = await dbo.collection("product").find({productName:nameInput}).toArray();
    res.render('index',{model:results})
})

app.get('/delete', async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);
    let dbo = client.db("ASM2");
    await dbo.collection('product').deleteOne(condition)
    res.redirect('/');
})
app.get('/Edit', async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client= await MongoClient.connect(url);
    let dbo = client.db("ASM2");
    let result = await dbo.collection("product").findOne({"_id" : ObjectID(id)});
    res.render('editSanpham',{model:result});
})
app.post('/doEdit',async (req,res)=>{
    let id= req.body.id;
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let colorInput = req.body.txtColor;
    let newValues ={$set : {productName:nameInput,price:priceInput,color:colorInput}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ASM2");
    await dbo.collection("product").updateOne(condition,newValues)

    res.redirect('/');
})

var PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("Server is running!")