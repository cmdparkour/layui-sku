/*
 * author: 罗茜
 */

layui.use(['jquery', 'form'], function() {
  var $ = layui.jquery,
      form = layui.form;
  var elem = '#sku';
  var skuItem = [
    {
      id: 1,
      label: '颜色',
      key: 'color',
      children: [
        { id: 1, label: '红色' },
        { id: 2, label: '阿曼湾色' },
        { id: 3, label: '白色' },
        { id: 4, label: '哈色' },
        { id: 5, label: '绿色' },
        { id: 6, label: '蓝色' },
        { id: 7, label: '黑色' }
      ]
    },
    {
      id: 2,
      label: '尺寸',
      key: 'size',
      children: [
        { id: 1, label: 'M' },
        { id: 2, label: 'X' },
        { id: 3, label: 'XL' },
        { id: 4, label: 'XM' },
        { id: 5, label: 'S' },
        { id: 6, label: 'ML' }
      ]
    },
    {
      id: 3,
      label: '用途',
      key: 'use',
      children: [
        { id: 1, label: '吃饭' },
        { id: 2, label: '睡觉' },
        { id: 3, label: '游戏' },
        { id: 4, label: '开心' },
        { id: 5, label: '讲故事' }
      ]
    },
  ];
  var skuData = [];
  var sku = function() {
    this.item = [];
    this.data = [];
    this.elem = null;
    this.tableId = null;
    this.options = {
      head: ['价格','库存'],
      name: ['price', 'sku'],
      body: [
        `<input type="text" name="price" placeholder="请输入价格" autocomplete="off" class="layui-input">`,
        `<input type="text" name="sku" placeholder="请输入库存" autocomplete="off" class="layui-input">`
      ]
    }; // 所有类似价格、库存等的dom
    this.chooseItem = {}; // 已选项父类集合
    this.descartData = []; // 所有可能的笛卡儿积集合
    this.chooseData = []; // 已选中的笛卡儿积集合
  }
  sku.prototype = {
    render: function(elem, item, data) {
      this.elem = elem;
      this.tableId = this.elem + '-table';
      this.item = item;
      this.data = data;
      this.calcDescartes(); 
      this.initForm();
      this.initTable();
      this.watch();
    },
    // 初始化form表单
    initForm: function() {
      var itemList = [];
      for (var i in this.item) {
        var row = this.item[i];
        var inputList = [];
        for (var y in row.children) {
          var input = `<input type="checkbox" name="${ row.key }" value="${ row.children[y].id }" lay-skin="primary" title="${ row.children[y].label }" lay-filter="skuform">`;
          inputList.push(input);
        }
        var item = `
          <div class="layui-form-item">
            <label class="layui-form-label">${ row.label }</label>
            <div class="layui-input-block">
              ${ inputList.join('') }
            </div>
          </div>
        `;
        itemList.push(item);
      }
      var html = `
        <div class="layui-form">
        ${ itemList.join('') }
        </div>
      `;
      $(this.elem).append(html);
      form.render();
      form.on('checkbox(skuform)', (data) => {
        var key = $(data.elem).attr('name'),
            label = $(data.elem).attr('title'),
            value = data.value,
            checked = data.elem.checked;
        if (!this.chooseItem[key]) {
          this.chooseItem[key] = new Array();
        }
        if (checked) {
          this.chooseItem[key].push({ value: value, label: label });
        } else {
          for (var i in this.chooseItem[key]) {
            if (this.chooseItem[key][i].value === value) {
              this.chooseItem[key].splice(i, 1);
            }
          }
        }
        var newData = this.calcDescartObj(this.chooseItem);
        this.chooseData = this.connectOldNew(newData);
        this.renderInTable();
      });
    },
    // 合并相同项的数据
    connectOldNew: function(newData) {
      for (var n in newData) {
         for (var c in this.chooseData) {
           
         }
      }
      return newData;
    },
    initTable: function() {
      $(this.elem).append(`
        <table id="${ this.tableId.replace('#', '') }" class="layui-table" cellspacing="0" cellpadding="0">
        </table>
      `);
    },
    // 计算数组笛卡尔积
    calcDescartes: function() {
      if (this.item.length < 2) return this.item[0] || [];
      this.descartData = [].reduce.call(this.item, function(col, set){
        var res = [];
        var key = '';
        if (col.children) {
          key = col.key;
          col = col.children;
        }
        col.forEach(function (c) {
          set.children.forEach(function(s) {
            var item = {
              [set.key]: s
            };
            if (key) {
              item[key] = c;
            } else {
              Object.assign(item, c);
            }
            res.push(item);
          });
        });
        return res;
      });
    },
    // 计算对象笛卡儿积
    calcDescartObj: function(obj) {
      var arr = [];
      for (var i in obj) {
        var list = [];
        for (var y in obj[i]) {
          list.push({ [i]: obj[i][y] });
        }
        arr.push(list);
      }
      var data = [].reduce.call(arr, function(col, sol) {
        var res = [];
        if (sol.length === 0) {
          return col;
        }
        if (col.length === 0) {
          return sol;
        }
        col.forEach(function(a) {
          sol.forEach(function(b) {
            var c = JSON.parse(JSON.stringify(a));
            Object.assign(c, b);
            res.push(c);
          });
        });
        return res;
      })
      return data;
    },
    // 渲染进页面，合并相同项
    renderInTable: function() {
      // 表格头部数据生成
      var theadArr = [];
      for (var y in this.item) {
        for (var i in this.chooseItem) {
          if (i === this.item[y].key && this.chooseItem[i].length !== 0) {
            theadArr.push(this.item[y].label);
          }
        }
      }
      theadArr = theadArr.concat(this.options.head);
      for (var i in theadArr) {
        theadArr[i] = `<td style="text-align: center;">${ theadArr[i] }</td>`;
      }
      // 表格body数据生成
      var tbodyArr = [];
      for (var i in this.chooseData) {
        var tr = [];
        for (var y in this.chooseData[i]) {
          var count = this.calcRowspan(i, y);
          if (count === 0) {
            continue;
          }
          var td = `<td rowspan="${ count }" style="text-align: center;">${ this.chooseData[i][y].label }</td>`;
          tr.push(td);
        }
        for (var x in this.options.body) {
          tr.push(`<td>${ this.options.body[x] }</td>`);
        }
        tr = `<tr key="${ i }">${ tr.join('') }</tr>`;
        tbodyArr.push(tr);
      }
      var table = `
        <thead>
          <tr>
            ${ theadArr.join('') }
          </tr>
        </thead>
        <tbody>
          ${ tbodyArr.join('') }
        </tbody>
      `;
      $(this.tableId).html(table);
    },
    // 计算间隔数据
    calcRowspan: function(index, type) {
      var length = [],
          typeArr = [];
      for (var i in this.chooseItem) {
        if (this.chooseItem[i].length) {
          length.push(this.chooseItem[i].length);
          typeArr.push(i);
        }
      }
      // 开始计算
      for (var i in typeArr) {
        if (type === typeArr[i]) {
          var count = 1;
          for (var y in length) {
            if (parseInt(i) < parseInt(y)) {
              count *= length[y];
            }
          }
          if (index % count === 0) {
            return count;
          } else {
            return 0;
          }
        }
      }
    },
    // 监听事件
    watch: function() {
      var _this = this;
      $(document).on('blur', '[name="price"], [name="sku"]', function() {
        var row = {
          name: $(this).attr('name'),
          value: this.value,
          key: $(this).parents('tr').attr('key')
        }
        _this.chooseData[row.key][row.name] = row.value;
      });
    },
    // 获取总数据
    getData: function() {
      return this.chooseData;
    }
  }

  var SKU = new sku();
  SKU.render('#sku', skuItem, skuData);
  $('#getData').click(function() {
    console.log(SKU.getData())
  });
});