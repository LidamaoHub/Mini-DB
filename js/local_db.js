/* 
* @Author: leeperfect
* @Date:   2016-02-22 10:45:25
* @Last Modified by:   leeperfect
* @Last Modified time: 2016-02-23 17:46:21
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
        return "ldb"+String(CryptoJS.MD5(t)).slice(0,25)
    }
    //数据库的数据存储结构

    function init_db(db_name) {
        var stor = window.localStorage[db_name]
        if (stor) {
            return JSON.parse(stor)
        } else {
            window.localStorage[db_name] = JSON.stringify("[]")
            var a = []
            return a
        }
    }

    function set_db(db_name) {
        var stor = init_db(db_name)
        var add_db = new Object()
        add_db._id = 
        this.name = "todo database"
        this.set = function(key, value) {
            add_db[key] = value
        }
        this.save = function() {
                stor.push(add_db)
                window.localStorage[db_name] = JSON.stringify(stor)
            }
            //TODO当新建字段是其他字段处理?我猜应该搞一个基准库来保存每一个数据库应有的字段以及是否非空.这样另一个好处是可以节省空间
            //TODO 按道理应该返回不重复的hash值
    }

    function query_db(db_name) {

        //================ query function =============================
        //查询的方式,该选项只能使用如下方法中一种,用于规定查询的逻辑
        //equal_to/not_equal_to 
        //=> 传入特定值,查询目标字段的值是否等于特定值
        //contained_in/not_contained_in
        //=> 传入list,并查询目标字段的值是否在list中
        //less_than/not_less_than/greater_than/not_greater_than 
        //=> 传入特定值,查询目标字段值是否满足比较大小的逻辑

        //TODO 如果方法重了怎么办?或者可以实现多个条件一起查询呢?数据结构不一样怎么办呢?
        //方法执行排序,先让能大量减少数据量的方法执行

        //================  query option ==============================
        //查询的选项,该选项可以复用,主要用来控制查询结果的数量
        //skip 
        //=> 传入数字,用来跳过前x个结果,可以用来做翻页器
        //limit
        //=> 传入数字,用来限制返回结果数量,默认条件下返回50个结果,最多不超过1000
        //asc/desc
        //=> 传入字段名称,用来返回结果时根据字段排序(简单的排序)
        //=> v0.1中只允许一层排序好啦

        //TODO 如果是多条件查询的话该如何规定limit呢?
        //================   query body  ==============================
        //规定所有query规则后查询的步骤
        //find/first
        //=> 如果是find则返回搜索体,如果是first则为只查询第一条
        //=============================================================
        var res = init_db(db_name)
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
            } catch (err) {
                console.log(err)
            }
            return res ? res : []
        }

        this.first = function() {
            query_()
            try {
                if (res.length >= jump) {
                    res = res.slice(skip, jump)
                }
            } catch (err) {
                console.log(err)
            }
            return res ? res[0] : []
        }
        var stor = init_db(db_name)
        this.show = function() {
            //这样好么?
            var stor = init_db(db_name)
            return JSON.stringify(stor)
        }
        this.destroy = function() {
            var new_arr = new Array()
            window.localStorage[db_name] = JSON.stringify(new_arr)
            return window.localStorage[db_name]
        }

        // TODO 实现链式调用
        // 查询结果排序
        // update实现
    }

    function show_db(db_name) {
        if (!db_name) {
            return window.localStorage
        } else {
            return window.localStorage[db_name]
        }
    }