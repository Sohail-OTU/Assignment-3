const express =  require ('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('../model/user');

const router =  express.Router();

//Post route for processing Register Page
router.post('/register', async(req, res, next)=>{
    try {
        const {email, password} = req.body;
        const user = new User({email, password});
        await user.save();
        res.redirect('/login')
    }
    catch(err) {
        res.status(400).send('Registration Failed');
    }
});

//Post route for processing the Login Page
router.post('/login', async(req,res,next)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findone({email});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid email or password.');
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token', token, {httpOnly: true});
        res.redirect('/grocerylist')
    }
    catch(err) {
        res.status(400).send('Login Failed');
    }
});

//Get route for getting the login page
router.get('/logout', (req,res,next)=> {
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;