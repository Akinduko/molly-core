class BaseEntity {
    constructor({ orm, name,maps }) {
        this.orm = orm
        this.name = name
        this.maps=maps
    }
    create(model, data) {
        return this.orm.create(model, data)
    }
    delete(model, data) {
        return this.orm.delete(model, data)
    }
    login(model, data){
        return this.orm.login(model, data)
    }
    getAll(model){
        return this.orm.getAll(model)
    }
    update(model,id, data){
        return this.orm.update(model,id, data)
    }
    insert (model,id, data){
        return this.orm.insert(model,id, data)
    }
    find(model, data){
        return this.orm.find(model, data)
    }
    findOne(model, data){
        return this.orm.findOne(model, data)
    }
    findNear(model, data){
        return this.orm.findNear(model, data)
    }
    calculateDistance(data){
        return this.maps.getDistance(data)
    }
    getORM() {
        return this.orm
    }
}
export default BaseEntity