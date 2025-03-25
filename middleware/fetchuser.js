const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: "C:\\Users\\Admin\\OneDrive\\Desktop\\web development\\Assignment\\Binnys_Backend\\.env.local" })
const jwt_key = process.env.JWT_SECRET_KEY;
//This is a custom userdefined middleware function which verifies the token and decodes it to access userid and it is passed to next middleware function 
const fetchuser = (req, res, next) => {
    try {
        const auth_token = req.header('auth-token');//this is a token which we have to pass in header of request
        if (!auth_token) {
            return res.status(401).json({ error: "Please use a valid token" });
        }//Using return inside an if function will terminate the exceution of code and returns the response (in our case ) or any thing based on scenario
        console.log(jwt_key);
        const verify_user_with_auth_token = jwt.verify(auth_token, jwt_key);//verify() function decodes the token and returns the payload data
        console.log(verify_user_with_auth_token);//{ user_id: '66b5f1c1a86b7376003f5778', iat: 1723292768 }<--This is payload data
        req.userid = verify_user_with_auth_token.userid;
        req.role = verify_user_with_auth_token.role;//66b5f1c1a86b7376003f5778 accessing userid and passing to request object with key userid
        console.log(req.userid);
        next();//next is the next middleware function which will be called in our case it is residing in auth.js getuser endpoint 
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ error: "Please authenticate using a  valid token" });
    }
}
module.exports = fetchuser;
