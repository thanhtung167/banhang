const { refreshtoken,verifyToken,encodeToken,encodeTokenfresh} = require("../Controller/user")

const Check =(req,res,next)=>{
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient) {
    try {
      const decoded = verifyToken(tokenFromClient,"thanhtung")
      req.jwtDecoded = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: 'lỗi.',
      });
    }
  } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
          message: 'No token provided.',
        });
    
  }
}
module.exports = Check