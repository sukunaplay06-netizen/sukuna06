// // backend/middleware/admin.js
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const adminMiddleware = async (req, res, next) => {
//   const token = req.headers.authorization?.replace('Bearer ', '');


//   if (!token) {
//     return res.status(401).json({ success: false, message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select('-password');

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     if (!user.isAdmin) {
//       return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
//     }

//     req.user = user; // Attach full user object for downstream use
//     next();
//   } catch (err) {
//     console.error('Admin token error:', err.message);
//     res.status(401).json({ success: false, message: 'Invalid token' });
//   }
// };

// module.exports = adminMiddleware;
