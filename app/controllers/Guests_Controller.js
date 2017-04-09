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
			const dbCount = await db.guest_list.find({}).count()
			if (dbCount) {
				resolve('full')
			} else {
				const workbook = XLSX.readFile(`${__dirname}/../assets/Mammoth_Invitation_List.xlsx`, { type: 'file' })
				const firstSheetName = workbook.SheetNames[0]
				const sheet = workbook.Sheets[firstSheetName]
				let currentUuids = new Set([])
				let invitationLookUp = {}
				let familyLookUp = {}
				const rows = XLSX.utils.sheet_to_json(sheet).reduce(
				(rowList, row) => {
					if (row.Inviter) {
						let spaceless = {}
						let lookupTable = row.Invitation
															? invitationLookUp : familyLookUp
						let lookupKey = row.Invitation
															? row.Invitation : row['Invitee Last Name']
						let uuid = lookupTable[lookupKey]
						while (!uuid
								|| (currentUuids.has(uuid)
									&& !lookupTable[lookupKey])) {
							uuid = uuidV4().slice(-4)
						}
						currentUuids.add(uuid)
						lookupTable[lookupKey] = uuid
						row.Code = uuid
						row.Guest = {
							FirstName: '',
							LastName: '',
							Dish: ''
						}
						row.Responded = null
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
			}
		})
	},

	// Get
	getGuests(code, justMammoth) {
		return new Promise(async (resolve, reject) => {
			let query = { Code: code }
			if (justMammoth) query.Mammoth = true
			try {
				let guests = await db.guest_list.find(query).toArray()
				resolve(guests)
			} catch(error) {
				reject(error)
			}
		})
	},

	findGuestsBy(query) {
		return new Promise(async (resolve, reject) => {
			try {
				let guests = await db.guest_list.find(query).toArray()
				resolve(guests)
			} catch(error) {
				reject(error)
			}
		})
	},

	getAllGuests() {
		return new Promise(async (resolve, reject) => {
			try {
				let list = await db.guest_list.find({}).toArray()
				resolve(list)
			} catch(error) {
				reject(error)
			}
		})
	},

	// Update
	updateGuest(data, id) {
		return new Promise(async (resolve, reject) => {
			delete data.$$hashKey
			let _id = ObjectId(id || data._id)
			data._id = _id
			data.Total = Number(data.Total)
			data.Mammoth = data.Mammoth == true
			data.TanakaFarms = data.TanakaFarms == true
			data.Unsure = data.Unsure == true
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
