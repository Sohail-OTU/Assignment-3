const jwt = require('jsonwebtoken')

function authenticateToken(req,res,next) {
    const token = req.cookies.token;
    if (!token) {
        console.error('No token found. Redirecting to login.');
        return res.redirect('/login');
    };

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=> {
        if (err) {
            console.error('Token verification failed. Redirecting to login:', err.message);
            return res.redirect('/login'); // Redirect if token is invalid
        };
        console.log('Middleware: User decoded from token:', user);
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;