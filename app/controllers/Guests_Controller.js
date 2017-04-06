const db 				= require('../db/guest_db')
const XLSX 			= require('xlsx')
const fs 				= require('fs')
const _ 				= require('lodash')
const ObjectId 	= require('mongodb').ObjectId
const uuidV4		= require('uuid/v4')

const Guests = {
	// Load
	loadList(req) {
		return new Promise(async (resolve, reject) => {
			const workbook = XLSX.readFile(`${__dirname}/../assets/Mammoth_Invitation_List.xlsx`, { type: 'file' })
			const firstSheetName = workbook.SheetNames[0]
			const sheet = workbook.Sheets[firstSheetName]
			let currentUuids = new Set([])
			const rows = XLSX.utils.sheet_to_json(sheet).reduce(
			(rowList, row) => {
				if (row.Inviter) {
					let spaceless = {}
					let uuid
					do {
						uuid = uuidV4().slice(-4)
					} while (currentUuids.has(uuid))
					currentUuids.add(uuid)
					row.Code = uuid
					_.forEach(row, (value, key) => {
						if (/Mammoth|Tanaka\s?Farms|Unsure/i.test(key)) {
							value = value === 'X'
						}
						spaceless[key.replace(/\s/g, '')] = value
					})
					rowList.push(spaceless)
				}
				return rowList
			}, [])
			try {
				let results = await db.guest_list.insert(rows)
				resolve(results)
			} catch(error) {
				console.log(error)
				reject(error)
			}
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
	updateGuest(data, id) {
		return new Promise(async (resolve, reject) => {
			delete data.$$hashKey
			let _id = ObjectId(id || data._id)
			data._id = _id
			try {
				let { lastErrorObject } = await db.guest_list.findOneAndUpdate(
					{ _id },
					{ $set: data }
				)
				if (lastErrorObject.updatedExisting) {
					resolve(data)
				} else {
					throw 'did not update'
				}
			} catch(error) {
				console.log(error)
				reject(error)
			}
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
