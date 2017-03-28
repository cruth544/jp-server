const express = require('express')
const router = new express.Router()
const Guests = require('../controllers/Guests_Controller')

router.route('/')
	.get(function (req, res) {
	  res.send('Hello world\n')
	})

router.route('/test')
	.get(function (req, res) {
	  res.send('Hello test\n')
	})

module.exports = router
