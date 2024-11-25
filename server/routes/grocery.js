var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
// telling my router that I have this model
let Grocery = require('../model/grocery.js');
let groceryController = require('../controllers/grocery.js');

const authenticateToken = require('../../middleware/auth');
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
        GroceryList:GroceryList,
        user: req.user
    })}
    catch(err){
        console.error(err);
        res.render('Grocery/list',{
            error:'Error on the server'
        })
    }
    });
/* Create Operation --> Get route for displaying me the Add Page */
router.get('/add', authenticateToken, async(req,res,next)=>{
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
router.post('/add', authenticateToken, async(req,res,next)=>{
    try{
        let newGrocery = Grocery({
            "Name": req.body.Name,
            "Quantity": req.body.Quantity,
            "Category": req.body.Category,
            "Notes": req.body.Notes,
            "Priority": req.body.Priority,
            "Price": req.body.Price,
            "createdBy": req.user.id
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
router.get('/edit/:id',authenticateToken, async(req,res,next)=>{
    try{
        const id = req.params.id;
        const groceryToEdit= await Grocery.findOne({_id: id, createdBy: req.user.id});
        if (!groceryToEdit) {
            return res.status(403).send('You are not authorized to edit.')
        };
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
router.post('/edit/:id', authenticateToken, async(req,res,next)=>{
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
router.get('/delete/:id', authenticateToken, async(req,res,next)=>{
    try{
        let id=req.params.id;
        Grocery.deleteOne({_id:id, createdBy: req.user.id}).then(()=>{
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