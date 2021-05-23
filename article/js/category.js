// -----------发送请求 并渲染到页面
function renderCategory() {
  axios.get('/my/category/list').then(res => {
    // console.log(res)
    // console.log(res.data)
    let {status, data} = res.data
    if (status === 0) {
      let str = ''
      data.forEach(item => {
        str += `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.alias}</td>
                    <td>
                      <button type="button" data-id="${item.id}" data-name="${item.name}" data-alias="${item.alias}" class="layui-btn layui-btn-xs editBtn">
                        编辑
                      </button>
                      <button type="button" data-id="${item.id}" class="del layui-btn layui-btn-xs layui-btn-danger">
                        删除
                      </button>
                    </td>
                  </tr>
        `
      });
      // 循环结束 将tr放到tbody中
      $('tbody').html(str)
    }
  })
}

renderCategory()

// -----------删除功能
$('tbody').on('click', '.layui-btn-danger', function (e) {
  let id = $(this).data('id')
  // 询问是否删除
  layer.confirm('确定要删除吗？', {icon: 3, title:'提示'}, function(index){
    //do something
    axios.get(`/my/category/delete?id=${id}`).then(res => {
      // console.log(res)
      let {status, message} = res.data
      if (status === 0) {
        layer.msg(message)
        // 重新渲染页面
        renderCategory()
      }
    })
    // 关闭弹窗
    layer.close(index);
  });
})

// ------------添加类别
let addIndex
$('.add').on('click', function () {
  addIndex = layer.open({
    type : 1,
    title: '添加类别',
    content: $('#tpl-add').html(),
    area : ['500px', '250px']
  });     
})

$('body').on('submit', '#add-form', function (e) {
  e.preventDefault()
  // 收集添加弹窗的表单内容
  let data = $(this).serialize()
  axios.post('/my/category/add', data).then(res => {
    // console.log(res)
    let {status, message} = res.data
    if (status === 0) {
      // 提示成功
      layer.msg(message)
      renderCategory()
      // 关闭弹窗
      layer.close(addIndex)
    }
  }).catch(function (error) {
    // 对于输入的字符超出限制 弹出提示
    // console.log(error.response)
    let {status, message} = error.response.data
    if (status === 1) {
      layer.msg(message)
    }
  })
})

// ----------编辑功能
// 编辑弹窗
let editIndex
$('tbody').on('click', '.editBtn', function () {
  // 获取自定义属性值
  // 若data()括号内不写内容 就是获取所有的【自定义属性】 获取点击编辑按钮的当前数据
  let oldData = $(this).data()

  // console.log(oldData)
  editIndex = layer.open({
    type : 1,
    title: '编辑类别',
    content: $('#tpl-edit').html(),
    area : ['500px', '250px'],
    // 弹层的配置项 指弹层弹出后 数据回填
    success : function () {
      // 必须在弹窗弹出后 数据才回填
      // 可用layui的form模块 快速数据回填
      let form = layui.form
      form.val('edit', oldData)  
    }
  });   
})
// 确认修改按钮
$('body').on('submit', '#edit-form', function (e) {
  e.preventDefault()
  // serialize()可以获取到隐藏域的值
  let data = $(this).serialize()
  axios.post('/my/category/update', data).then(res => {
    let {status, message} = res.data
    if (status === 0) {
      layer.msg(message)
      renderCategory()
      // 关闭弹窗
      layer.close(editIndex)
    }
  })
})
