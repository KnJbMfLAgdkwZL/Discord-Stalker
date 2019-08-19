class api_helper {
    static GetSearchResult(data) {
        data = data['messages'];
        let res = [];
        for (let key in data) {
            let val = data[key];
            for (let k in val) {
                let v = val[k];
                if (v['hit']) {
                    res.push(v['content']);
                }
            }
        }
        return res;
    }

    static GetUsers(users) {
        let res = [];
        for (let k in users) {
            let v = users[k];
            res.push(v['user']);
        }
        return res;
    }

    static clearResult(data) {
        let result = [];
        for (let k in data) {
            let str = data[k].match(new RegExp('https://discord.gg/([a-zA-Z0-9]+)'));
            if (str && str[0])
                result.push(str[0]);
        }
        return result;
    }

    static removeDuplicat(data) {
        let tmp = {};
        for (let k in data)
            tmp[data[k]] = true;
        let result = [];
        for (let k in tmp)
            result.push(k);
        return result;
    }
}

module.exports = new api_helper();