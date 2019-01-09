const { check, validationResult } = require('express-validator/check');

function verifyRegister(req, res, next) {
    
    console.log(check('name').isAlpha());
    check('email').isEmail();
    check('password').isLength({ min: 8 });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Verificar")
        return res.status(422).json({ errors: errors.array() });
    }

    next();
}

module.exports = verifyRegister;
