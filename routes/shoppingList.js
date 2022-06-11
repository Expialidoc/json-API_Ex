/* Routes for json API "shopping List" */
const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require("../fakeDB")

//const Items = [{name: 'popsicle', price: 1.45}, {name: 'cheerios', price: 3.40}];

router.get("/", function(req,res){
  res.json({items: items})
})

router.get("/:name", function (req, res) {
    const foundItem = items.find(item => item.name === req.params.name)
    if(foundItem === undefined){
      throw new ExpressError("Item not found", 404)
    }
    res.json({ items: foundItem })
  })

router.post("/", function (req, res, next) {
  try{
    if(!req.body.item) throw new ExpressError("Item is required", 400);
    const newItem = { name: req.body.item.name, price: req.body.item.price }
    items.push(newItem)
    return res.status(201).json({ item: newItem }) 
  }catch(e){
    return next(e)
  }
 
})

router.patch("/:name", function (req, res) {
  const foundItem = items.find(item => item.name === req.params.name)
  if(foundItem === undefined){
    throw new ExpressError("Item not found", 404)
  }
  foundItem.name = req.body.name 
  res.json({ item: foundItem }) //updated:
})

router.delete("/:name", function (req, res) {
  const foundItem = items.findIndex(item => item.name === req.params.name)
  if(foundItem === -1) {
    throw new ExpressError("Item not found", 404)
  }
  items.splice(foundItem, 1)
  res.json({ message: "Deleted" })
})

module.exports = router;