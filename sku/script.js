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
    this.chooseItem = {};
    this.descartData = [];
    this.chooseData = [];
  }
  sku.prototype = {
    render: function(elem, item, data) {
      this.elem = elem;
      this.item = item;
      this.data = data;
      this.calcDescartes();
      this.initForm();
    },
    initForm() {
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
        console.log(this.chooseItem);
        // this.calcDescartes(this.chooseItem);
      });
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
              [set.key]: s.label
            };
            if (key) {
              item[key] = c.label;
            } else {
              Object.assign(item, c);
            }
            res.push(item);
          });
        });
        return res;
      });
    },
    // 渲染进页面，合并相同项
    renderInHtml: function() {
      
    }
  }

  var SKU = new sku();
  SKU.render('#sku', skuItem, skuData);
});