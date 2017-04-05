const express = require('express')
const router = new express.Router()
const Guests = require('../controllers/Guests_Controller')

router.route('/')
	.get((req, res) => {
	  res.send('Hello world\n')
	})

// Load
router.route('/load_list')
	.get(async (req, res) => {
		try {
			let list = Guests.loadList(req)
			res.send(list)
		} catch(error) {
			res.send(error)
		}
	})

// Get
router.route('/find_guests_by')
	.get(async (req, res) => {
		try {
			let guest = await Guests.findGuestsBy(req.query)
			res.send(guest)
		} catch(error) {
			res.send(error)
		}
	})

router.route('/get_guest/:id')
	.get(async (req, res) => {
		try {
			let guest = await Guests.getGuest(req.params.id)
			res.send(guest)
		} catch(error) {
			res.send(error)
		}
	})

router.route('/get_all_guests')
	.get(async (req, res) => {
		try {
			let guests = await Guests.getAllGuests()
			res.send(guests)
		} catch(error) {
			res.send(error)
		}
	})

// Update
router.route('/update_guest')
	.post(async (req, res) => {
		try {
			let updatedGuest = await Guests.updateGuest(req.body)
			res.send(updateGuest)
		} catch(error) {
			res.send(error)
		}
	})

router.route('/update_guest/:id')
	.post(async (req, res) => {
		try {
			let results = await Guests.updateGuest(req.body, req.params.id)
			res.send(results)
		} catch(error) {
			res.send(error)
		}
	})

// Delete
router.route('/delete_guest/:id')
	.post(async (req, res) => {
		try {
			let results = await Guests.deleteGuest(req.params.id, req.body)
			res.send(results)
		} catch(error) {
			res.send(error)
		}
	})

// Test
router.route('/test')
	.get(async (req, res) => {
		try {
			let test = await Guests.test(req)
			res.send(test)
		} catch(error) {
			res.send(error)
		}
	})

router.route('/test_get')
	.get(async (req, res) => {
		try {
			let test = await Guests.getTest(req)
			res.send(test)
		} catch(error) {
			res.send(error)
		}
	})

module.exports = router
