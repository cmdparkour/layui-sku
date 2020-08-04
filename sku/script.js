/*
 * author: 罗茜
 */

layui.define(['jquery', 'form'], function(exports) {
  var $ = layui.jquery,
      form = layui.form;
  var sku = function(elem) {
    this.item = [];
    this.data = [];
    this.elem = elem;
    this.params = {
      id: 'id',
      label: 'label',
      key: 'key',
      children: 'children',
      childrenParams: {
        id: 'id',
        label: 'label'
      }
    };
    this.tableId = null;
    this.options = {
      head: [
        `<input type="text" name="priceAll" placeholder="请输入价格,批量填充" autocomplete="off" class="layui-input">`,
        `<input type="text" name="skuAll" placeholder="请输入库存，默认不限量" autocomplete="off" class="layui-input">`
      ],
      name: ['price', 'sku'],
      body: [
        `<input type="text" name="price" placeholder="请输入价格" autocomplete="off" class="layui-input">`,
        `<input type="text" name="sku" placeholder="请输入库存" autocomplete="off" class="layui-input">`
      ]
    }; // 所有类似价格、库存等的dom
    this.chooseItem = {}; // 已选项父类集合
    this.chooseData = []; // 已选中的笛卡儿积集合
  }
  sku.prototype = {
    render: function(item, data, params) {
      this.tableId = this.elem + '-table';
      this.item = item;
      if (data) {
        this.data = data;
      }
      if (params) {
        this.params = params;
      }
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
        for (var y in row[this.params.children]) {
          var input = `<input type="checkbox" name="${ row[this.params.key] }" value="${ row[this.params.children][y][this.params.childrenParams.id] }" lay-skin="primary" title="${ row[this.params.children][y][this.params.childrenParams.label] }" lay-filter="skuform">`;
          inputList.push(input);
        }
        var item = `
          <div class="layui-form-item">
            <label class="layui-form-label">${ row[this.params.label] }</label>
            <div class="layui-input-block">
               <input type="text" name="title" placeholder="请选择${ row[this.params.label] }或自定义" autocomplete="off" class="layui-input" style="width: 300px;display: inline;" add="input" key="${ i }" >
               <button type="button" class="layui-btn" key="${ i }" add="click">
                <i class="layui-icon layui-icon-add-circle"></i>
                添加
               </button>
            </div>
            <div class="layui-input-block sku-list layui-bg-gray" style="margin-top: 10px; margin-bottom: 20px; padding: 10px; min-height: 38px;">
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
      // 监听复选事件
      form.on('checkbox(skuform)', (data) => {
        var key = $(data.elem).attr('name'),
            label = $(data.elem).attr('title'),
            value = data.value,
            checked = data.elem.checked;
        if (!this.chooseItem[key]) {
          this.chooseItem[key] = new Array();
        }
        if (checked) {
          this.chooseItem[key].push({ [this.params.childrenParams.id]: value, [this.params.childrenParams.label]: label });
        } else {
          for (var i in this.chooseItem[key]) {
            if (this.chooseItem[key][i][this.params.childrenParams.id] === value) {
              this.chooseItem[key].splice(i, 1);
            }
          }
        }
        var newData = this.calcDescartObj(this.chooseItem);
        this.chooseData = this.connectOldNew(newData);
        this.renderInTable();
      });
    },
    // 初始化表格元素
    initTable: function() {
      $(this.elem).append(`
        <table id="${ this.tableId.replace('#', '') }" class="layui-table" cellspacing="0" cellpadding="0">
        </table>
      `);
    },
    // 合并相同项的数据
    connectOldNew: function(newData) {
//      for (var n in newData) {
//         for (var c in this.chooseData) {
//
//         }
//      }
      return newData;
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
          if (i === this.item[y][this.params.key] && this.chooseItem[i].length !== 0) {
            theadArr.push(this.item[y][this.params.label]);
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
          var td = `<td rowspan="${ count }" style="text-align: center;">${ this.chooseData[i][y][this.params.childrenParams.label] }</td>`;
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
      // 监听单项数据的修改
      $(document).on('blur', '[name="price"], [name="sku"]', function() {
        var row = {
          name: $(this).attr('name'),
          value: this.value,
          key: $(this).parents('tr').attr('key')
        }
        _this.chooseData[row.key][row.name] = row.value;
      });
      // 监听批量数据修改
      $(document).on('keypress', '[name="priceAll"], [name="skuAll"]', function(e) {
        e = e || window.event;
        key = e.keyCode || e.which || e.charCode;
        if (key == 13) {
          var row = {
            name: $(this).attr('name'),
            value: this.value
          }
          for (var i in _this.chooseData) {
            _this.chooseData[i][row.name.replace('All', '')] = row.value;
          }
          $('[name="' + row.name.replace('All', '') + '"]').val(row.value);
        }
      });
      // 监听规格值的新增
      $(document).on('click', '[add="click"]', function() {
        var key = parseInt($(this).attr('key')),
            value = $(this).prev().val();
            $(this).prev().val('');
        add(key, value)
      });
      // 监听新增规格时input框的输入
      $(document).on('keypress', '[add="input"]', function(e) {
        e = e || window.event;
        key = e.keyCode || e.which || e.charCode;
        if (key == 13) {
          var key = parseInt($(this).attr('key')),
              value = $(this).val();
              $(this).val('');
          add(key, value);
        }
      });
      // 新增函数
      function add(key, value) {
        if (!value) {
          layer.msg('规格值不能为空');
          return;
        }
        for (var i in _this.item[key][_this.params.children]) {
          var row = _this.item[key][_this.params.children][i];
          if (row[_this.params.childrenParams.label].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
            layer.msg('规格值不能重复，请重新填写');
            return
          }
        }
        _this.item[key][_this.params.children].push({ label: value });
        var input = `<input type="checkbox" name="${ _this.item[key][_this.params.key] }" value="${ value }" lay-skin="primary" title="${ value }" lay-filter="skuform">`;
        $(_this.elem + ' .layui-form-item:nth-child(' + (key+1) + ') .sku-list' ).append(input);
        form.render('checkbox');
      }
      form.on('input()')
    },
    // 获取总数据
    getData: function() {
      return this.chooseData;
    }
  }

  exports('sku', sku);
});
