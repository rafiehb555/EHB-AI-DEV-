const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getInvoices, createInvoice } = require('../controllers/invoiceController');

router.get('/', auth, getInvoices);
router.post('/', auth, createInvoice);

module.exports = router;
