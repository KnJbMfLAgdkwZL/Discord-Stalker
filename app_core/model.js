class model {
    constructor() {
        this.sqlite = require('better-sqlite3');
        if (!this.sqlite.db) {
            let path = `${__dirname}/../main.db`;
            this.sqlite = new this.sqlite(path);
        }
        this.order = {
            ASC: 'ASC',
            DESC: 'DESC'
        };
        this.table = this.constructor.name;
    }

    close() {
        //this.sqlite.close();
    }

    delete(param) {
        let _param = {};
        let condition = `WHERE 1`;
        if (param) {
            for (let k in param) {
                condition += ` AND ${k} = :p_${k}`;
                _param[`p_${k}`] = param[k];
            }
        }
        let sql = `DELETE FROM ${this.table} ${condition}`;
        let stmt = this.sqlite.prepare(sql);
        stmt.run(_param);
    }

    insert(param) {
        let keys = Object.keys(param);
        for (let k in keys) {
            keys[k] = `:${keys[k]}`
        }
        let str = keys.join(', ');
        let sql = `INSERT INTO ${this.table} VALUES (${str})`;
        let stmt = this.sqlite.prepare(sql);
        stmt.run(param);
    }

    update(param, condition) {
        this.sqlite.update(this.table, param, condition);
        this.close();
    }

    sql(sql) {
        var data = this.sqlite.prepare(sql).all();
        if (data.length)
            return data;
        this.close();
        return false;
    }

    select(param, order_by) {
        let _param = {};
        let condition = `WHERE 1`;
        if (param) {
            for (let k in param) {
                condition += ` AND ${k} = :p_${k}`;
                _param[`p_${k}`] = param[k];
            }
        }
        let order = ``;
        if (order_by) {
            let keys = Object.keys(order_by);
            let last = ``;
            if (keys.length) {
                last = keys[keys.length - 1];
                order = `ORDER BY `;
            }
            for (let k in order_by) {
                let val = order_by[k];
                let str = `${k} ${val}`;
                order += str;
                if (k != last)
                    order += `, `;
            }
        }
        let sql = `SELECT * FROM ${this.table} ${condition} ${order}`;
        var data = this.sqlite.prepare(sql).all(_param);
        if (data.length)
            return data;
        this.close();
        return false;
    }
}

module.exports = model;