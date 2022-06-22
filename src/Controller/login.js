const authorController = require('../Controller/authorController');
const jwt = require('jsonwebtoken');
const authorModel = require('../Model/authorModel');




const login = async function(req,res)
{
    let email = req.body.email;
    let password = req.body.password;
  
    let user = await authorModel.findOne({ email: email, password: password });
    if (!user)
      return res.status(401).send({
        status: false,
        msg: "username or the password is not corerct",
      });

    let token = jwt.sign(
        {
          authorId: user._id.toString()
        
        },
        "project1"
      );
      res.setHeader("x-api-key", token);
      res.status(200).send({ status: true, token: token });
}

module.exports={login}