
const express = require("express");
const router = express.Router();
const db = require("../database");
const { generateAccessToken, generateRefreshToken, storeRefreshToken, deleteRefreshToken } = require("../utils/jwt");

/*
When a user submits their login details we need to write a post request to the db to store them
then we need to verify using get requests to the db

1. Post request into db for signup
    - Get all credentials that user entered
    - Check if they are all full
    - Check if they fulfil requirements (maybe regex?)
    - Check if user already exists in the DB (if yes redirect to log in page with error message)
    - Insert user into db
    - Generate access and refresh tokens
    - Store refresh token in db
    - set cookies (i have no idea how to do this)
    return {sucess: true, user: {name, id, email}}
    error handling: 400 for operation failed, 409 conflict for duplicate, 500 for internal server errors
*/
function passwordCheck(password){
    if (password.length < 8){
        return "Password should be at least 8 characters"
    }
    if (password.includes(" ")){
        return "Password should not contain spaces"
    }
    if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password))) {
        return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    }
    return true;
}
//////////////////////////////////////////////////////////////////////
////IMPORTANT: the password isnt hashed yet so we need to do that////
//////////////////////////////////////////////////////////////////////

router.post('/signup', (req, res) => {
    const {name, age, favProf, email, password} = req.body;
    if(name.trim() === ""){
        return res.status(400).send("Your name cannot be empty");
    }
    if(age.trim() === ""){
        return res.status(400).send("Your age cannot be empty");
    }
    if(favProf.trim() === ""){
        return res.status(400).send("Your security question cannot be empty");
    }
    if(email.trim() === ""){
        return res.status(400).send("Your email cannot be empty");
    }
    if(password.trim() === ""){
        return res.status(400).send("Your password cannot be empty");
    }

    const ageNum = Number(age.trim());
    if (isNaN(Number(age))) {
        return res.status(400).send("Age must be a number");
    }
    if (age.trim() <= 8 || age.trim() >= 100){
        return res.status(400).send("Please enter a valid age(9-99)");
    }

    if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)){
        return res.status(400).send("Please enter a valid email address")
    }

    const passwordResult = passwordCheck(password);
    if (passwordResult !== true){
        return res.status(400).send(passwordResult);
    }

    //check if user already exists in the database
    const emailQuery = 'SELECT * FROM users WHERE email = ?';
    db.get(emailQuery, [email], function(err, row){
        if (err){
            return res.status(500).send(err.message);
        }
        if (row){
            return res.status(409).send("User already exists please log in instead");
        }

        //insert user into the database
        const insertQuery = 'INSERT INTO users (name, age, favProf, email, password) VALUES (?, ?, ?, ?, ?)';
        db.run(insertQuery, [name, ageNum, favProf, email, password], function(err){
            if (err){
                return res.status(500).send(err.message);
            }

            const userId = this.lastID;

            //generate access and refresh tokens
            const accessToken = generateAccessToken(userId, email);
            const refreshToken = generateRefreshToken(userId);

            //store refresh token in the database
            storeRefreshToken(userId, refreshToken);

            //set cookies

            res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: 3600000 });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 3600000 });

            return res.status(201).json({
                sucess: true,
                user: {
                    id: userId,
                    name: name,
                    age: ageNum,
                    favProf: favProf,
                    email: email
                }
            });
        });
    });
});

//log in post request

/* 
1. Get the email and password
2. Check if the email exists in db if not prompt to sign up page
3. If email does exist then check if password matches, if not send error code and point to reset password
4. If password matches generate new refresh and access tokens for the user
5. delete the old tokens (maybe 5 happens before 4)
6. set cookies like in signup 
7. return a success
*/
router.post("/login", (req, res) => {
    const {email, password} = req.body;

    const emailQuery = 'SELECT * FROM users WHERE email = ?';
    db.get(emailQuery, [email], function(err, row){
        if (err){
            return res.status(500).send(err.message);
        }
        if (!row){
            return res.status(401).send("Email not found, please sign up instead")
        }
        if (row){
            db.get(passwordQuery, [email], function(err,row){
                if (err){
                    return res.status(500).send(err.message);
                }
                if (row.password !== password){
                    return res.status(401).send("Password doesn't match, try again or resetting it")
                }
                if (row.password === password){
                    const accessToken = generateAccessToken(row.id, email);
                    const refreshToken = generateRefreshToken(row.id);
                    deleteRefreshToken(row.id);
                    deleteAccessToken(row.id);
                    storeRefreshToken(row.id, refreshToken);
                    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: 3600000 });
                    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 3600000 });
                    return res.status(200).json({
                        success: true,
                        message: "Login successful"
                    });
                }
            });
        }
    });
});

//get method to display the db

router.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    db.all(query, (err, rows) => {
        if (err){
            return res.status(500).send(err.message);
        }
        return res.status(200).json(rows);
    });
})

module.exports = router;