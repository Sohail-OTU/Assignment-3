//const { Collection, default: mongoose } = require("mongoose");

const mongoose = require("mongoose");

let groceryModel = mongoose.Schema({
    Name: String,
    Quantity: String,
    Category: String,
    Notes: String,
    Priority: String,
    Price: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
{
    collection:"grocerylist"
});
module.exports =mongoose.model('Grocery',groceryModel);