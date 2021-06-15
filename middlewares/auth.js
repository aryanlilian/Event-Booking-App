const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('LoginAuthorization');
    if (!authHeader) {
        req.isAuthenticated = false;
        return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.length === '') {
        req.isAuthenticated = false;
        return next();
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.LOGIN_SECRET);
    } catch (err) {
        req.isAuthenticated = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuthenticated = false;
        return next();
    }

    req.isAuthenticated = true;
    req.userId = decodedToken.userId;
    next();
}