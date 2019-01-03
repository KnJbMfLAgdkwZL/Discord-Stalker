class model {
    constructor() {
        this.sqlite = require('sqlite-sync')
        if (!this.sqlite.db)
            this.sqlite.connect('../main.db')
        this.order = {
            ASC: 'ASC',
            DESC: 'DESC'
        }
        this.table = this.constructor.name
    }

    set_table(name) {
        this.table = name
    }

    delete(condition) {
        this.sqlite.delete(this.table, condition)
    }

    insert(param) {
        this.sqlite.insert(this.table, param)
    }

    update(param, condition) {
        this.sqlite.update(this.table, param, condition)
    }

    select(param, order_by) {
        let _param = {}
        let condition = `WHERE 1`
        if (param) {
            for (let k in param) {
                condition += ` AND ${k} = :${k}`
                _param[`:${k}`] = param[k]
            }
        }
        let order = ``
        if (order_by) {
            let keys = Object.keys(order_by)
            let last = ``
            if (keys.length) {
                last = keys[keys.length - 1]
                order = `ORDER BY `
            }
            for (let k in order_by) {
                let val = order_by[k]
                let str = `${k} ${val}`
                order += str
                if (k != last)
                    order += `, `
            }
        }
        let sql = `SELECT * FROM ${this.table} ${condition} ${order}`
        let data = this.sqlite.run(sql, _param)
        if (data.length)
            return data
        return false
    }
}

module.exports = model