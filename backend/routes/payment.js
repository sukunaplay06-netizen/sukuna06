// routes/payment.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Correct import

const purchaseController = require('../controllers/purchaseController'); // This can stay if you're using this controller

// ✅ Use `protect` not `auth`
router.post('/create-order', protect, purchaseController.createOrder);
router.post('/verify', protect, purchaseController.verifyPayment);

module.exports = router;
