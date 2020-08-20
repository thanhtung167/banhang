const { refreshtoken,verifyToken,encodeToken,encodeTokenfresh} = require("../Controller/user");
const JWT = require("jsonwebtoken");

const Check =(req,res,next)=>{
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient) {
    try {
      const decoded = JWT.verify(tokenFromClient,"thanhtung")
      req.user = decoded
      console.log(req.user.sub.role)

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