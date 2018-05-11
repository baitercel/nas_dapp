'use strict';

var NasDapp = function () {

    //确定数据结构
    LocalContractStorage.defineMapProperty(this, "timeMap");
    LocalContractStorage.defineMapProperty(this, "authorMap");
    LocalContractStorage.defineMapProperty(this, "dataMap");
    LocalContractStorage.defineProperty(this, "size");

};

NasDapp.prototype = {
    init: function () {
        this.size = 0;
    },
    //插入数据
    save: function (time, data) {

        var from = Blockchain.transaction.from;
        var index = this.size;
        this.timeMap.set(index, time);
        this.authorMap.set(index, from);
        this.dataMap.set(time, data);

        this.size += 1;
    },
    get: function (time) {
        return this.dataMap.get(time);
    },


    // 获取分页数据
    forEach: function (num, page) {


        page = parseInt(page);
        num = parseInt(num);
        if (page == 0 || num == 0) {
            throw new Error("page or num is not empty");
        }


        if (page <= 0) {
            page = 1
        }


        //求得总共的页数
        var total = Math.ceil(this.size / num);


        if (page > total) {
            throw new Error("page is not valid");
        }


        var result = [];
        var start = 0;

        if (page > 1) {
            start = (page - 1) * num;

        }


        for (var i = start; i < (page * num); i++) {
            var time = this.timeMap.get(i);
            if (time == null) {
                break;
            }
            var author = this.authorMap.get(i);
            var obj = this.dataMap.get(time);
            var temp = {
                index: i,
                time: time,
                author: author,
                info: obj
            }
            result.push(temp);
        }


        var handleResult = [{total: total, page: page}, result];

        return JSON.stringify(handleResult);

    },

};

module.exports = NasDapp;