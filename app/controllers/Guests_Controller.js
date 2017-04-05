const db 				= require('../db/guest_db')
const XLSX 			= require('xlsx')
const fs 				= require('fs')
const _ 				= require('lodash')
const ObjectID 	= require( 'mongodb' ).ObjectID;
const uuidV4		= require('uuid/v4')

const Guests = {
	// Load
	loadList(req) {
		return new Promise((resolve, reject) => {
			const workbook = XLSX.readFile(`${__dirname}/../assets/Mammoth_Invitation_List.xlsx`, { type: 'file' })
			const firstSheetName = workbook.SheetNames[0]
			const sheet = workbook.Sheets[firstSheetName]
			let currentUuids = new Set([])
			const rows = XLSX.utils.sheet_to_json(sheet).map((row) => {
				let uuid = uuidV4().slice(-4)
				while (currentUuids.has(uuid)) {
					uuid = uuidV4().slice(-4)
				}
				currentUuids.add(uuid)
				row.code = uuid
				row._id  = uuid
				return row
			})
			db.guest_list.insert(rows).then(
			(results) => {
				resolve(results)
			}).catch(
			(error) => {
				console.log(error)
				reject(error)
			})
		})
	},
	// Get
	getGuest(id) {
		return new Promise((resolve, reject) => {
			db.guest_list.findOne({ _id: id }).then(
			(guest) => {
				resolve(guest)
			}).catch(
			(error) => {
				reject(error)
			})
		})
	},
	findGuestsBy(query) {
		return new Promise((resolve, reject) => {
			db.guest_list.find(query).toArray().then(
			(results) => {
				resolve(results)
			}).catch(
			(error) => {
				reject(error)
			})
		})
	},
	getAllGuests() {
		return new Promise((resolve, reject) => {
			db.guest_list.find({}).toArray().then(
			(list) => {
				resolve(list)
			}).catch(
			(error) => {
				reject(error)
			})
		})
	},
	// Update
	updateGuest(id, data) {
		return new Promise((resolve, reject) => {
			let selector = { _id: id || data.code }
			let updated = db.guest_list.findOneAndUpdate(
				{ _id: selector },
				data,
				{ returnNewDocument: true }
			)
			resolve(updated)
		})
	},

	// Test
	test(req) {
		return new Promise((resolve, reject) => {
			db.guest_list.insert({
				test: 'test'
			}).then(
			(results) => {
				console.log(results)
				resolve(results)
			}).catch(
			(error) => {
				reject(error)
			})
		})
	},
	getTest(req) {
		return new Promise((resolve, reject) => {
			const cursor = db.guest_list.find({})
			cursor.then(
			(results) => {
				resolve(cursor)
			})
		})
	}
}

module.exports = Guests
