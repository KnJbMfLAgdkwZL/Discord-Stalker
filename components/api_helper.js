class api_helper {
    static GetSearchResult(data) {
        data = data['messages']
        let res = []
        for (let key in data) {
            let val = data[key]
            for (let k in val) {
                let v = val[k]
                if (v['hit']) {
                    res.push(v['content'])
                }
            }
        }
        return res
    }

    static GetUsers(users) {
        let res = []
        for (let k in users) {
            let v = users[k]
            res.push(v['user'])
        }
        return res
    }
}

module.exports = api_helper