const { decode } = require("jsonwebtoken");

const   Checkrole = (req, res, next) => {
	if (!req.user.sub.role) {
		return res.status(403).json({mes:"Ko có quyền "})
	}
	next();
}
module.exports = Checkrole