// 第一种数据组合

oldData: [
  {
    color: {value: "1", label: "红色"}
    price: "120"
    size: {value: "1", label: "M"}
    sku: "150"
  }
]

newData: [
  {
    color: {value: "1", label: "红色"},
    size: {value: "1", label: "M"}
  },
  {
    color: {value: "1", label: "红色"},
    size: {value: "2", label: "X"}
  }
]

// 第二种数据组合

oldData: [
  {
    color: {value: "1", label: "红色"},
    price: "150",
    size: {value: "1", label: "M"},
    sku: "100"
  },
  {
    color: {value: "1", label: "红色"},
    price: "124",
    size: {value: "2", label: "X"},
    sku: "200"
  }
]

newData: [
  {
    color: {value: "1", label: "红色"},
    size: {value: "1", label: "M"},
    use: {value: "1", label: "吃饭"}
  },
  {
    color: {value: "1", label: "红色"},
    size: {value: "2", label: "X"},
    use: {value: "1", label: "吃饭"}
  }
]