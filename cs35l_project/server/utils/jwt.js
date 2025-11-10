
function generateAccessToken(userId, email) {
    jwt.sign({ userId, email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_ACCESS_EXPIRY });
    return token;
}

function generateRefreshToken(userId) {
    jwt.sign({ userId, type: refresh}, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_REFRESH_EXPIRY });
    return token;
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        console.log(error.message);
    }
}

function storeRefreshToken(userId, token) {
    const expires_at = new Date(Date.now() + process.env.JWT_REFRESH_EXPIRY);
    const query = 'INSERT INTO refreshtokens (user_id, token, expires_at) VALUES (?, ?, ?)';
    db.run(query, [userId, token, expires_at], function(err){
        if (err){
            console.log(err.message);
        }
    });
}

function deleteRefreshToken(token) {
    const query = "DELETE FROM refreshtokens WHERE token = ?";
    db.run(query, [token], function(err){
        if (err){
            console.log(err.message);
        }
    });
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    storeRefreshToken,
    deleteRefreshToken
}


/*
1. **generateAccessToken(userId, email):**

   - Use `jwt.sign()` with payload: `{ userId, email }`
   - Secret: `process.env.JWT_SECRET`
   - Expires: `process.env.JWT_ACCESS_EXPIRY` (default '15m')
   - Returns token string

2. **generateRefreshToken(userId):**

   - Use `jwt.sign()` with payload: `{ userId, type: 'refresh' }`
   - Secret: `process.env.JWT_SECRET`
   - Expires: `process.env.JWT_REFRESH_EXPIRY` (default '7d')
   - Returns token string

3. **verifyToken(token):**

   - Use `jwt.verify()` with secret
   - Returns decoded payload or throws error
   - Wrap in try-catch for error handling

4. **Store refresh token in database:**

   - Function: `storeRefreshToken(userId, token)`
   - Calculate expires_at: current time + 7 days
   - Insert into refresh_tokens table
   - Handle duplicate token errors

5. **Delete refresh token:**

   - Function: `deleteRefreshToken(token)`
   - DELETE FROM refresh_tokens WHERE token = ?
*/