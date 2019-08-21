class model {
    constructor() {
        this.sqlite = require('better-sqlite3');
        if (!this.sqlite.db) {
            let path = `${__dirname}/../main.db`;
            this.sqlite = new this.sqlite(path);
        }
        this.table = this.constructor.name;
    }

    insert(param) {
        let keys = [];
        for (let k in param)
            keys.push(`:${k}`);
        let values = keys.join(', ');
        let sql = `INSERT INTO ${this.table} VALUES (${values})`;
        let stmt = this.sqlite.prepare(sql);
        stmt.run(param);
    }

    static getWhereCondition(param) {
        let condition = `WHERE 1`;
        for (let k in param)
            condition += ` AND ${k} = :${k}`;
        return condition;
    }

    static getSet(param) {
        let arr = [];
        for (let k in param) {
            param[`p_${k}`] = param[k];
            arr.push(`${k} = :p_${k}`);
            delete param[k];
        }
        return arr.join(', ');
    }

    delete(param) {
        let condition = model.getWhereCondition(param);
        let sql = `DELETE FROM ${this.table} ${condition}`;
        let stmt = this.sqlite.prepare(sql);
        stmt.run(param);
    }

    update(param, condition) {
        let where = model.getWhereCondition(condition);
        let set = model.getSet(param);
        let sql = `UPDATE ${this.table} SET ${set} ${where}`;
        let _par = {};
        for (let k in param)
            _par[k] = param[k];
        for (let k in condition)
            _par[k] = condition[k];
        let stmt = this.sqlite.prepare(sql);
        stmt.run(_par);
    }

    select(where = {}, order_by, DESC = false) {
        let condition = model.getWhereCondition(where);
        let order = ``;
        if (order_by) {
            let str = order_by.join(', ');
            order = `ORDER BY ${str}`;
        }
        let desc = '';
        if (DESC)
            desc = 'DESC';
        let sql = `SELECT * FROM ${this.table} ${condition} ${order} ${desc}`;
        return this.sqlite.prepare(sql).all(where);
    }
}

module.exports = model;