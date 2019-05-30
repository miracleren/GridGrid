# GridGrid
弹出表单内容多选工具

该控件是引用jquery库开、layui库开发的，必需引入这些库（部分layui库版本不同可能会有部分问题）。
该控件是一个表单数据查询多选工具，选定的内容会以表单结构展示，支持多选单选，并返回值。

# 初始化方法

## 定义控件
```html
<script src="./js/GridGrid.js" charset="utf-8"></script>
<!-- values-key 为表数据关键值 -->
<table id="gridCar" name="gridCar" values-key="VEHICLEID" lay-filter="gridCar"> </table>
```

## 控件数据结构
```json
与layui表格数据一样
```

## 初始化控件数据
```javascript
$(function(){
			$("#gridCar").GridGrid({
                height: "300px",
                width:"300px",
                url: "",
                cols: [[
                    { field: "VEHICLENUM", title: "车牌号", sort: true ,width:150},
                    { field: "VEHICLETYPE", title: "车型", sort: true },
                    { field: "ALLOWMAXLOADAMT", title: "装载量", sort: true }
                ]],
                area: ['500', '300'],
                multiple: true,
                data:cardata,
                selected:function(val){
                	//选定行值 
                	console.log(val);
                	//选定的所有值 
                	console.log($("#gridCar").GridGridValue());
                },
                done:function(){
                	console.log("gridGrid is ok!");
                }
            });
		});
```

## 运行效果如下
![image](https://github.com/miracleren/tagTree/blob/master/img/show.png)
