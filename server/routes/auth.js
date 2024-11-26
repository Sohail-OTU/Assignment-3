const express =  require ('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('../model/user');
const User = require('../model/user');

const router =  express.Router();

//Get route for displaying the Register Page
router.get('/register', (req, res, next) => {
    console.log('GET /register route hit');
    res.render('register', { title: 'Register' });
});

//Post route for processing Register Page
router.post('/register', async(req, res, next)=>{
    try {
        const {email, password} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.redirect('/login')
    }
    catch(err) {
        res.status(400).send('Registration Failed');
        res.redirect('/register');
    }
});


//Get route for displaying the Login Page
router.get('/login', (req, res, next) => {
    console.log('GET /login route hit');
    res.render('login', { title: 'Login' });
});

//Post route for processing the Login Page
router.post('/login', async(req,res,next)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid email or password.');
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.cookie('token', token, {httpOnly: true});
        res.redirect('/grocerylist')
    }
    catch(err) {
        res.status(400).send('Login Failed');
        res.redirect('/login')
    }
});

//Get route for getting the login page
router.get('/logout', (req,res,next)=> {
    res.clearCookie('token');
    res.redirect('/login');
});

module.exports = router;