const express = require("express");
const app = express();
app.use(express.json());
const PORT = 8080;
let balance = 0;

app.listen(PORT, () => {
  console.log(`device is listening on port: ${PORT}`);
});
let fs = require("fs");
let catData = JSON.parse(fs.readFileSync("./cat-data.json"));

app.get("/showcat", (req, res) => {
  res.status(200).send({
    catData,
  });
});

app.get("/showcat/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).send(catData[id - 1]);
});

app.post("/buycat", (req, res) => {
  const newID = catData[catData.length - 1].id + 1;
  const newCat = Object.assign(req.body, { id: newID });
  balance -= newCat.price;
  catData.push(newCat);
  fs.writeFile("./cat-data.json", JSON.stringify(catData), (err) => {
    res.status(201).json({
      status: `Cat named: ${newCat.name} added`,
      data: {
        balance: balance,
        cat: newCat,
      },
    });
  });
});
app.delete("/sellcat/:id", (req, res) => {
  const { id } = req.params;
  let soldCat = catData[id - 1];
  balance += catData[id - 1].price;
  for (let i = id; i < catData.length; i++) {
    catData[i].id = i;
  }
  
  catData.splice(id - 1, 1);

  fs.writeFile("./cat-data.json", JSON.stringify(catData), (err) => {
    res.status(200).json({
      status: "Cat sold",
      balance: balance,
      soldcat: soldCat,
    });
  });
});
module.exports = app;
