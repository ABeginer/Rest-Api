const express = require('express');
const app = express();
app.use(express.json());
const PORT = 8080;

app.listen(PORT,()=>{
    console.log(`device is listening on port: ${PORT}`);
});
let fs = require('fs');
let catData = JSON.parse(fs.readFileSync('./cat-data.json'));
app.get('/allcat',(req,res)=>{
    res.status(200).send({
         catData
    })
})
app.get('/cat',(req, res) => {
    res.status(200).send({
        name: 'Alan',
        species: 'hairless'
    });
});
app.get('/cat/:id',(req,res)=>{
    const {id} = req.params;
    res.status(200).send(
       catData[id-1]
    )
})
app.post('/cat',(req,res)=>{
    const{id} = req.params;
    const{species} = req.body;
    if(!species){
        res.status(418).send({
            message: 'you need to input species for the cat'
        })
    } 
    res.send({
        cat: `your cat belong to: ${species} and have ID of ${id}`
    })
})
app.post('/addcat',(req,res)=>{
    const newID = catData[catData.length-1].id + 1;
    const newCat = Object.assign({id: newID},req.body);
    catData.push(newCat);
    fs.writeFile('./cat-data.json',JSON.stringify(catData),(err)=>{
        res.status(201).json({
            status: "Cat added",
            data:{
                "cat": newCat
            }
        })
    });
  })
module.exports = app