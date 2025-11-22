
const express = require("express");
const router = express.Router();
const db = require("../database");
const { generateAccessToken, generateRefreshToken, storeRefreshToken, verifyToken, deleteRefreshToken, deleteRefreshTokensByUserId } = require("../utils/jwt");
const { requireAuth } = require("../middleware/auth");
const bcrypt = require("bcrypt");
//I used ai autocorrect for some of the endpoints, especially with error handling
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
        //hash password
        const hashedPassword = bycrypt.hash(password, 10);

        //insert user into the database
        const insertQuery = 'INSERT INTO users (name, age, favProf, email, password) VALUES (?, ?, ?, ?, ?)';
        db.run(insertQuery, [name, ageNum, favProf, email, hashedPassword], function(err){
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
    db.get(emailQuery, [email], function(err, user){
        if (err){
            return res.status(500).send(err.message);
        }
        
        // Generic error message for security (don't reveal if email exists)
        if (!user){
            return res.status(401).send("Invalid email or password");
        }

        // Compare password with hashed password using bcrypt
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch){
            return res.status(401).send("Invalid email or password");
        }

        // Password matches - proceed with login
        const accessToken = generateAccessToken(user.id, email);
        const refreshToken = generateRefreshToken(user.id);
        
        // Delete old refresh tokens
        deleteRefreshTokensByUserId(user.id);
        
        // Store new refresh token
        storeRefreshToken(user.id, refreshToken);
        
        // Set cookies
        res.cookie("accessToken", accessToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        res.cookie("refreshToken", refreshToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
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

/*
4. Post method for refresh
    - Get refresh token from the cookies (req.cookies.reftoken)
    - if refresh token not there return error (prolly 401)
    - Verify the token (jwt.verify)
    - check if token exists in db 
    - check if token has expired 
    - if invalid/expired then return error and delete from db
    - generate a new access token 
    - set new accesstoken cookie 
    -return a success
*/

router.post("/refresh", (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).send("Refresh token not found");
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded || decoded.type !== 'refresh') {
        return res.status(401).send("Invalid refresh token");
    }

    const tokenExistsQuery = 'SELECT * FROM refreshtokens WHERE token = ?';
    db.get(tokenExistsQuery, [refreshToken], function(err, row){
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!row) {
            return res.status(401).send("Refresh token not found");
        }

        const now = new Date();
        const expiresAt = new Date(row.expires_at);
        if (expiresAt <= now) {
            deleteRefreshToken(refreshToken);
            return res.status(401).send("Refresh token expired");
        }

        // Generate new access token and set cookie
        const newAccessToken = generateAccessToken(decoded.userId, decoded.email);
        res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, maxAge: 3600000 });

        return res.status(200).json({ success: true, accessToken: newAccessToken });
    });
})

/*
5. Logout- post request.
    - Get refreshToken from cookies
    - If token exists, delete from database
    - Clear both cookies:
        -res.clearCookie('accessToken')
        - res.clearCookie('refreshToken')
    - Return sauccess
*/

router.post("/logout", (req,res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken){
        const deleteTokenQuery = "DELETE FROM refreshtokens WHERE token = ?";
        db.run(deleteTokenQuery, [refreshToken], function(err){
            if (err){
                return res.status(500).send(err.message);
            }
        });
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    }
})

/* Who am I endpoint
6. Get method to check who is logged in using the access token cookie
    - Get accessToken from cookies
    -  verify token
    - extract userId from token
    - Fetch user from database
    - return user details
    -if invalid return 401
*/

router.get("/me", (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (!verifyToken(accessToken)){
        return res.status(401).send("Invalid access token");
    }
    const userID = verifyToken(accessToken).userId;
    const userQuery = 'SELECT * FROM users WHERE id = ?';
    db.get(userQuery, [userID], function(err, row){
        if (err){
            return res.status(500).send(err.message);
        }
        return res.status(200).json({
            success: true,
            user: {
                id: row.id,
                name: row.name,
                email: row.email
            }
        });
    });
})

module.exports = router;