const Mongo = require('mongodb').MongoClient
let databases = {}

const DB = function (dbName, onReady) {
	if (!databases[dbName]) {
		databases[dbName] = (function () {
      var _db = {};
      var connection = {
        dbName,
        db() {
          return _db
        }
      }

      const mongoDbUrl = `mongodb://127.0.0.1:27017/${dbName}?authSource=admin`
      Mongo.connect(mongoDbUrl,
      // MongoClient.connect(appConfig.mongoDbUrl + dbName + '?authSource=admin',
      function (err, db) {
          if (err) {
            throw(err)
          }
          _db = db

          if (onReady) {
            onReady(connection.db)
          }
      });

      return connection
    })()
	} else if (onReady) {
    onReady(databases[dbName].db)
  }
	return databases[dbName]
}

module.exports = DB
