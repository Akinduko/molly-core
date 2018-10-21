import moment from 'moment'; 
export default (db) => {
    return {
        /*
        Get db connection
        */
        create: async (collection, data) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const result = await collection.create(data)
                    resolve(result)
                }
                catch (err) {
                    reject({ err: err })
                }
            })
        },
        delete: async (collection, data) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const result = await collection.deleteMany(data)
                    resolve(result)
                }
                catch (err) {
                    reject({ err: err })
                }
            })
        },
        login: async (collection, data) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const result = await collection.findOne({ $and: [{ email: data.email }, { password: data.password }] })
                    resolve(result)
                }
                catch (err) {
                    reject({ err: err })
                }
            })
        },
        /**
         * A handler for retriving a list of records from a collection using their ids.
         * @param {string} name common name
         * @param {db.collection} collection.
         * @param {req} request.
         * @param {res} response.
         */
        findOne: async (collection, data) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const result = await collection.findOne({ $and: data })
                    resolve(result)
                }
                catch (err) {
                    reject({ err: err })
                }
            })
        },
        /**
         * A handler for retriving a list of records from a collection.
         * @param {db.collection} collection.
         * @param {req} request.
         * @param {res} response.
         */
        find: async (collection, data) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const result = await collection.find({$and: data}).sort({ created : -1 }).limit(100)
                    resolve(result)
                }
                catch (err) {
                    reject({ err: err })
                }
            })
        },
        findNear: async (collection, data) => {
            return new Promise(async (resolve, reject) => {
                try {

                    const result = await collection.aggregate([
                        {
                            $geoNear: {
                                near: data[0],
                                key:data[3],
                                distanceField: "dist.calculated",
                                maxDistance: data[1],
                                query:data[2],
                                includeLocs: "dist.location",
                                num: 5,
                                spherical: true
                            }
                        }
                    ])
                    resolve(result)
                }
                catch (err) {
                    reject({ err: err })
                }
            })
        },
        getAll: async (collection, data) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const result = await collection.find({})
                    resolve(result)
                }
                catch (err) {
                    reject({ err: err })
                }
            })
        },
        update: async (collection, id, data) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const result = await collection.updateOne({ _id: id }, { $set: data })
                    resolve(result)
                }
                catch (err) {
                    reject({ err: err })
                }
            })
        },
        insert: async (collection, id, data) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const result = await collection.aggregate([
                        {
                            $addFields: {
                                _id: `${id}`,
                                item: data
                            }
                        }
                    ])
                    resolve(result)
                }
                catch (err) {
                    reject({ err: err })
                }
            })
        },
    }
}
