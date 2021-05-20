// --------数据回填
// 只要是修改操作 全都需要数据回填
// 数据回填 就是获取到原来的数据 设置输入框的默认值即可
function renderUser() {
  // 获取用户数据  设置输入框默认值
  axios.get('/my/user/userinfo').then(res => {
    // console.log(res)
    // let {username, nickname, email} = res.data.data
    // $('input[name=username]').val(username)
    // $('input[name=nickname]').val(nickname)
    // $('input[name=email]').val(email)

    // 优化  使用layui提供的form.val()进行数据回填
    let form = layui.form
    // form.val('表单 lay-filter 属性值', '{数据} 对象格式 键要等于表单的name属性')
    form.val('abc', res.data.data)
  })
}

renderUser()

// -----------修改昵称和邮箱
$('form').on('submit', function (e) {
  e.preventDefault()
  let data = $(this).serialize()
  axios.post('/my/user/userinfo', data).then(res => {
    // console.log(res)
    let {status, message} = res.data
    if (status === 0) {
      layer.msg(message)
      // 更新欢迎语句的名称
      // 调用父页面的函数 必须有两个条件
      // 1.使用iframe把两个页面联系起来 形成父子页面的结构
      // 2.必须在真是的服务器环境才可以使用 live server
      window.parent.getUserInfo()
    }
  }).catch(error => {
    // console.log(error.response)
    let {message} = error.response.data
    layer.msg(message)

  })
})

// -----------重置按钮
// 点击重置按钮 不会清空所有输入框 而是恢复到修改前的数据
$('button[type=reset]').on('click', function (e) {
  e.preventDefault()
  renderUser()
})