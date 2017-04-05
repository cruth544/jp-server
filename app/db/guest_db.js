const initCollection = require('./init_collection')
let _db = {}

initCollection('guests', (db) => {
	_db.guest_list = db().collection('GuestList')
})

module.exports = _db
