var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
// telling my router that I have this model
let Grocery = require('../model/grocery.js');
const grocery = require('../model/grocery.js');
let groceryController = require('../controllers/grocery.js')
/* Get route for the grocery list - Read Operation */
/*
GET,
Post,
Put --> Edit/Update
*/
/* Read Operation --> Get route for displaying the grocery list */
router.get('/',async(req,res,next)=>{
try{
    const GroceryList = await Grocery.find();
    res.render('Grocery/list',{
        title:'Grocery List',
        GroceryList:GroceryList
    })}
    catch(err){
        console.error(err);
        res.render('Grocery/list',{
            error:'Error on the server'
        })
    }
    });
/* Create Operation --> Get route for displaying me the Add Page */
router.get('/add',async(req,res,next)=>{
    try{
        res.render('Grocery/add',{
            title: 'Add Grocery Items'
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('Grocery/list',{
            error:'Error on the server'
        })
    }
});
/* Create Operation --> Post route for processing the Add Page */
router.post('/add',async(req,res,next)=>{
    try{
        let newGrocery = Grocery({
            "Name": req.body.Name,
            "Quantity": req.body.Quantity,
            "Category": req.body.Category,
            "Notes": req.body.Notes,
            "Priority": req.body.Priority,
            "Price": req.body.Price
        });
        Grocery.create(newGrocery).then(()=>{
            res.redirect('/grocerylist');
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('Grocery/list',{
            error:'Error on the server'
        })
    }
});
/* Update Operation --> Get route for displaying me the Edit Page */
router.get('/edit/:id',async(req,res,next)=>{
    try{
        const id = req.params.id;
        const groceryToEdit= await Grocery.findById(id);
        res.render('Grocery/edit',
            {
                title:'Edit Grocery Items',
                Grocery:groceryToEdit
            }
        )
    }
    catch(err)
    {
        console.error(err);
        next(err); // passing the error
    }
});
/* Update Operation --> Post route for processing the Edit Page */ 
router.post('/edit/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        let updatedGrocery = Grocery({
            "_id":id,
            "Name": req.body.Name,
            "Quantity": req.body.Quantity,
            "Category": req.body.Category,
            "Notes": req.body.Notes,
            "Priority": req.body.Priority,
            "Price": req.body.Price
        });
        Grocery.findByIdAndUpdate(id,updatedGrocery, {new: true}).then(()=>{
            res.redirect('/grocerylist')
        })
    }
    catch(err){
        console.error(err);
        res.render('Grocery/list',{
            error:'Error on the server'
        })
    }
});
/* Delete Operation --> Get route to perform Delete Operation */
router.get('/delete/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        Grocery.deleteOne({_id:id}).then(()=>{
            res.redirect('/grocerylist')
        })
    }
    catch(error){
        console.error(err);
        res.render('Grocery/list',{
            error:'Error on the server'
        })
    }
});
module.exports = router;