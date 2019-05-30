///////////////////////////////////////////////
//弹出表单选择器
//v 1.0
//creat by miracleren 
//creat date 2019 05 30
//url https://github.com/miracleren/GirdGrid
//说明：运行基础 jquery库 layui框架 
//////////////////////////////////////////////
$(function () {
    $('head').append($("<style>.GridGird + .layui-table-view thead tr th:first-child {text-align: right;}</style>"));
});

; (function ($) {
    $.fn.extend({
        GridGrid: function (setting) {
            var that = this;
            var gridid = $(that).attr("id");
            $(that).addClass("GridGird");
            layui.use('table', function () {
                var table = layui.table;
                grid = table.render({
                    id: gridid,
                    elem: '#' + gridid,
                    method: "post",
                    height: setting.height,
                    cols: setting.cols,
                    limit: 300,
                    response: {
                        statusName: "status",
                        statusCode: 200,
                        countName: "total",
                        dataName: "rows"
                    },
                    page: false
                });

                var btadd = $('<div>+</div>');
                btadd.css({
                    "z-index": "1",
                    "position": "absolute",
                    "background-color": "rgb(68,197,189)",
                    "height": "30px",
                    "line-height": "30px",
                    "text-align": "center",
                    "width": "30px",
                    "font-size": "20px",
                    "border-radius": "20px",
                    "color": "#5a5a5a",
                    "margin": "14px 0px 0px 3px"
                });
                $(that).prepend(btadd);
                var sbox = $('<div style="display:none;" id="' + gridid + '_box" ><div>');
                
                var search = $('<div style="padding:5px;" id="' + gridid + '_search" class="layui-row"><div class=" layui-col-xs8 col-1"><input type="text" class="layui-input"></div><div class="layui-col-xs4 col-2" style="text-align: center;"><button  data="' + gridid + '" class="layui-btn layui-btn-sm ">查找</button></div></div>');
                var sgrid = $('<table id="' + gridid + '_s" lay-filter="' + gridid + '_s"></table>');
                sbox.append(search);
                sbox.append(sgrid);
                $(that).prepend(sbox);

                //成生查找框内容
                if ($('#' + gridid + '_s').next("div").length === 0) {
                    var newcols = $.extend(true, [], setting.cols);
                    if (setting.multiple)
                        newcols[0].unshift({ type: 'checkbox' });
                    table.render({
                        url: setting.url,
                        id: gridid + '_s',
                        elem: '#' + gridid + '_s',
                        method: "post",
                        height: (setting.area[1]-60),
                        width: (setting.area[0]),
                        cols: newcols,
                        limit: 1000,
                        response: {
                            statusName: "status",
                            statusCode: 200,
                            countName: "total",
                            dataName: "rows"
                        },
                        page: false,
                        clickrow: function (row) {
                            if (!setting.multiple) {
                                layui.table.reload(gridid, {
                                    url: "",
                                    data: [row]
                                });
                            }
                        },
                        data:setting.data,
                        done: function () {
                           
                        }
                    });


                    table.on('checkbox(' + gridid + '_s)', function (obj) {
                        var checkdata = layui.table.checkStatus(gridid + '_s').data;
                        layui.table.reload(gridid, {
                            url: "",
                            data: checkdata
                        });
                        setting.selected(obj.data);
                    });
                }

                //查找
                var sbutton = search.find("button");
                var sinput = search.find("input");
                sbutton.click(function () {
                    reload($(this).attr("data") + '_s', $('#' + $(this).attr("data") + '_search').find('input').val());
                    return false;
                });


                btadd.click(function () {
                    layer.open({
                        title: null,
                        type: 1,
                        area: setting.area,
                        content: sbox,
                        yes: function (index, layero) {
                        }
                    });

                });
                
            });

            setting.done();
        },
        GridGridValue: function () {
            var ele = $(this).attr("id");
            var key = $(this).attr("values-key");
            var table = layui.table.cache[ele];
            if (key === 'undefined' || key === null || key === '')
                return table;
            else {
                var datalist = [];
                for (var i = 0; i < table.length; i++) {
                    datalist.push(table[i][key]);
                }
                return datalist;
            }
            
            
        }
    })

    //表数据重载
    function reload(ele,key) {
        layui.use('table', function () {

            var newdata = layui.table.cache[ele];
            var checklength = layui.table.checkStatus(ele).data.length;
            var indexcheck = 0;
            var indexnocheck = checklength;
            var datalength = newdata.length;
            for (var i = 0; i < newdata.length; i++) {
                if (newdata[i].LAY_CHECKED === true) {
                    newdata[i].LAY_TABLE_INDEX = indexcheck;
                    indexcheck++;
                }
                else {
                    if (key !== "" || key !== null) {
                        var query = JSON.stringify(newdata[i]);
                        if (insearch(key, query)) {
                            newdata[i].LAY_TABLE_INDEX = indexnocheck;
                            indexnocheck++;
                        }
                        else {
                            newdata[i].LAY_TABLE_INDEX = datalength;
                            datalength--;
                        }
                    }
                    else {
                        newdata[i].LAY_TABLE_INDEX = indexnocheck;
                        indexnocheck++;
                    }
                }

            }
            newdata.sort(function (a, b) {
                return a.LAY_TABLE_INDEX - b.LAY_TABLE_INDEX;
            });

            layui.table.reload(ele, {
                url: "",
                data: newdata
            });
        });
    }

    //全匹配直接查询
    function insearch(query, text) {
        if (text.indexOf(query) > 0) {
            return true;
        }
        else
            return false;
    }


    //模糊查询
    function fuzzysearch(query, text) {
        var tlen = text.length;
        var qlen = query.length;
        if (qlen > tlen) {
            return false;
        }
        if (qlen === tlen && query === text) {
            return true;
        }
        outer: for (var i = 0, j = 0; i < qlen; i++) {
            var qch = query.charCodeAt(i);
            while (j < tlen) {
                if (text.charCodeAt(j++) === qch) {
                    continue outer;
                }
            }
            return false;
        }
        return true;
    }
})(jQuery);