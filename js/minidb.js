/* 
 * @Author: leeperfect
 * @Date:   2016-02-22 10:45:25
 * @Last Modified by:   leeperfect
 * @Last Modified time: 2016-02-24 17:30:19
 */

//TODO_LIST
//生成唯一的数据库标识
function get_id() {
    var data = new Date()
    var t = data.toUTCString().split(" ").join("")
    var seed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', "@", "$", "#", "%", "^", "&", "*", "("]
    var str = ""
    for (var i = 0; i < 20; i++) {
        t += seed[Math.round(Math.random() * (seed.length - 1))]
    }
    return "l" + String(CryptoJS.MD5(t)).slice(0, 15)
}
//数据库的数据存储结构

//

function Init_db(db_name) {
    var stor = window.localStorage[db_name]
    if (stor) {
        return JSON.parse(stor)
    } else {
        window.localStorage[db_name] = JSON.stringify("[]")
        var stor_temp = []
        return stor_temp
    }
}

function Set_db(db_name) {
    var stor = Init_db(db_name)
    var add_db = new Object()
    var _id = get_id()
    add_db._id = _id
    add_db.creat_time = Date.now()
    this.set = function(key, value) {
        add_db[key] = value
        return this
    }
    this.save = function() {
            stor.push(add_db)
            window.localStorage[db_name] = JSON.stringify(stor)
            return _id
        }
        //TODO当新建字段是其他字段处理?我猜应该搞一个基准库来保存每一个数据库应有的字段以及是否非空.这样另一个好处是可以节省空间
    return _id
}

function Query_db(db_name) {

    
    var res = Init_db(db_name)
    var limit = 50
    var skip = 0
    var jump = 50

    var query_function_list = new Array()
        // 实现基础的查询

    function query_function() {
        var function_name
        var key_
        var value_
    }

    function set_query_function(function_name, key, value) {
        var fun = new query_function()
        fun.function_name = function_name
        fun.key_ = key
        fun.value_ = value
        query_function_list.push(fun)
    }

    //query functions

    this.equal_to = function(key, value) {
        set_query_function("equal_to", key, value)
        return this
    }
    this.not_equal_to = function(key, value) {
        set_query_function("equal_to", key, value)
        return this

    }
    this.contained_in = function(key, value) {
        set_query_function("contained_in", key, value)
        return this
    }
    this.not_contained_in = function(key, value) {
        set_query_function("not_contained_in", key, value)
        return this
    }
    this.less_than = function(key, value) {
        set_query_function("less_than", key, value)
        return this

    }
    this.grater_than = function(key, value) {
        set_query_function("grater_than", key, value)
        return this

    }
    this.not_less_than = function(key, value) {
        set_query_function("not_less_than", key, value)
        return this

    }
    this.not_greater_than = function(key, value) {
        set_query_function("not_greater_than", key, value)
        return this

    }

    //query options

    this.limit = function(num) {
        limit = num
        jump = skip + limit
            //看来只能暂时做阉割版limit了
    }
    this.skip = function(num) {
            skip = num
            jump = skip + limit
                //看来只能暂时做阉割版skip了

        }
        // 还没写asc排序

    function query_() {
        for (index_ in query_function_list) {
            var query_obj = query_function_list[index_]
            switch (query_obj.function_name) {
                case "equal_to":

                    res = res.filter(function(re) {
                        if (re[query_obj.key_] && re[query_obj.key_] == query_obj.value_) {
                            return re
                        }
                    })
                    break
                case "not_equal_to":
                    res = res.filter(function(re) {
                        if (re[query_obj.key_] && re[query_obj.key_] != query_obj.value_) {
                            return re
                        }
                    })
                    break
                case "contained_in":
                    res = res.filter(function(re) {
                        if (re[query_obj.key_] && re[query_obj.key_] in query_obj.value_) {
                            return re
                        }
                    })
                    break
                case "contained_in":
                    res = res.filter(function(re) {
                        if (re[query_obj.key_] && !re[query_obj.key_] in query_obj.value_) {
                            return re
                        }
                    })
                    break
                case "less_than":
                    res = res.filter(function(re) {
                        if (re[query_obj.key_] && re[query_obj.key_] < query_obj.value_) {
                            return re
                        }
                    })
                    break
                case "not_less_than":
                    res = res.filter(function(re) {
                        if (re[query_obj.key_] && re[query_obj.key_] >= query_obj.value_) {
                            return re
                        }
                    })
                    break
                case "greater_than":
                    res = res.filter(function(re) {
                        if (re[query_obj.key_] && re[query_obj.key_] > query_obj.value_) {
                            return re
                        }
                    })
                    break
                case "not_greater_than":
                    res = res.filter(function(re) {
                        if (re[query_obj.key_] && re[query_obj.key_] <= query_obj.value_) {
                            return re
                        }
                    })
                    break
            }
        }
    }

    this.find = function() {
        query_()
        try {
            if (res.length >= jump) {
                res = res.slice(skip, jump)
            }

            res = res.map(function(res_one) {
                return new Mini_db_obj(res_one, db_name)
            })

        } catch (err) {
            console.log(err)
        }
        return res ? res : []
    }

    this.first = function() {
        //可能逻辑有问题,关于first
        query_()
        try {

            res = new Mini_db_obj(res[0], db_name)

        } catch (err) {
            console.log(err)
        }
        return res ? res : []
    }

    this.destroy = function() {
        var new_arr = new Array()
        window.localStorage[db_name] = JSON.stringify(new_arr)
        return window.localStorage[db_name]
    }


    // 查询结果排序
    // update实现
}

function Mini_db_obj(data, db_name) {
    var _data = data
    var _obj_id = _data["_id"]

    this.get = function(class_) {
        return _data[class_] ? _data[class_] : null
    }
    this.boom = function() {
        var stor = Init_db(db_name)
            //如下算法实在是太蠢了
        stor = stor.filter(function(stor_member) {
            if (stor_member["_id"] != _obj_id) {
                return stor_member
            }
        })
        window.localStorage[db_name] = JSON.stringify(stor)
        return true
    }
    this.update = function(key_, value_) {
        //此处实现方法巨坑,v0.2版本修复
        try {
            var stor = Init_db(db_name)
            stor = stor.map(function(stor_member) {
                if (stor_member["_id"] == _obj_id) {
                    stor_member[key_] = value_
                    return stor_member
                }
            })
            console.log(stor)
            window.localStorage[db_name] = JSON.stringify(stor)
            return this
        } catch (err) {
            console.log(err)
        }

    }

}

function clear_db(db_name) {
    window.localStorage[db_name] = JSON.stringify("[]")
}

function show_db(db_name) {
    if (!db_name) {
        return window.localStorage
    } else {
        return window.localStorage[db_name]
    }
}
