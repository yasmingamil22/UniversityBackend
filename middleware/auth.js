const jwt=require('jsonwebtoken')



const verifyTokenFromBody = (req, res, next) => {
  const{token}=req.body 

  if (token) {
    jwt.verify(token, 'key', (err, dataInToken) => {
      if (err) res.status(403).json("Token is not valid!");
      req.dataInToken = dataInToken;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};



const verifyToken =(req, res,next)=> {  
  const bearerHearder = req.headers['authorization'];  
  if(typeof bearerHearder != 'undefined'){

      const bearer = bearerHearder.split(' ');  
      const bearerToken = bearer[1]; 
       
      jwt.verify(bearerToken, 'key', (err, dataInToken) => {
        if (err) res.status(403).json("Token is not valid!");
        req.dataInToken = dataInToken;
      });     
      next();  
  }else{  
      //Forbidden  
      res.sendStatus(403);  
  }  
}


const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.dataInToken.userId === req.params.id ) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};


const verifyTokenAndDoctor = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.dataInToken.role=="doctor") {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyTokenFromBody,
  verifyTokenAndAuthorization,
  verifyTokenAndDoctor,
   verifyToken
};


/*

const verifyTokenFromHeader = (req, res, next) => {
  const token = req.headers['Authorization'];
  console.log(token)
  if (token) {
    jwt.verify(token, 'key', (err, dataInToken) => {
      if (err) res.status(403).json("Token is not valid!");
      req.dataInToken = dataInToken;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};



const verifyTokenFromHeaderAuthorization = (req, res, next) => {

  const authHeader=req.headers['Authorization'];  

  if (authHeader) {
    const token=authHeader.split(' ')[1]
    jwt.verify(token, 'key', (err, dataInToken) => {
      if (err) res.status(403).json("Token is not valid!");
      req.dataInToken = dataInToken;
      console.log(dataInToken)
  
      next();
    });
  } else {
    console.log("4")

    return res.status(401).json("You are not authenticated!");
  }
};*/