// 添加响应拦截器
// axios.interceptors.response.use(函数1, 函数2)
// 1 处理的是成功的状态 状态码是200-399 的响应
// 2 处理的是失败的响应 状态码是400-599 的响应
axios.interceptors.response.use(
  function (response){
    // console.log(response)
    let {status, message} = response.data
    if (status === 1) layer.msg(message)
    return response
  },
  function (error) {
    // 错误的时候也可以拿到结果 是error.response
    // console.log(error.response)
    let {status, message} = error.response.data
    layer.msg(message)
    return Promise.reject(error)
  }
)

// ---------切换登录和注册两个盒子
// 点击登录里面的 a 标签 注册盒子出现
$('.login a').on('click', function () {
  $('.register').show()
  $('.login').hide()
})
// 注册里面 a标签 注册盒子隐藏
$('.register a').on('click', function () {
  $('.register').hide()
  $('.login').show()
})

// ----------登录功能
// 阻止默认行为 收集账号和密码
$('.login form').on('submit', function (e) {
  e.preventDefault()
  let data = $(this).serialize()
  // console.log(data)
  // 这里我们使用axios提交 不使用ajax
  // $.ajax({
  //   type : 'POST',
  //   url : 'http://www.itcbc.com:8080/api/login'
  //   data : data,
  //   success : function (res) {
  //   }
  // })
  // 语法 axios.post(url, 请求体).then(函数 获取返回结果).catch(函数 获取错误结果)
  axios.post('http://www.itcbc.com:8080/api/login', data).then(res => {
    // console.log(res)
    // 解构赋值 获取响应结果中的 status/message/token
    let {status, message, token} = res.data
    if (status === 0){
      // 保存token ===> localStorage
      localStorage.setItem('token', token)
      // 提示框
      layer.msg(message, {
        time : 2000
      }, function () {
        // 做的事情
        // 跳转到 index页面
        location.href = './index.html'
      })
    }
  })
})

// ----------注册功能
// 阻止默认行为 收集账号和密码
$('.register form').on('submit', function (e) {
  e.preventDefault()
  let data = $(this).serialize()
  // console.log(data)
  axios.post('http://www.itcbc.com:8080/api/reguser', data).then(res => {
    // console.log(res)
    let {status, message} = res.data
    if (status === 0) {
      // 提示框
      layer.msg(message)
      // 清空注册内输入框内容 重置表单
      $('.register form')[0].reset()
      // 切换到登录的盒子
      $('.register').hide()
      $('.login').show()
    }
  })
})

// ----------表单验证 自定义验证规则
// 使用layui的内置模块 使用之前 必须先加载模块
// 加载语法 let xxx = layui.模块名
let form = layui.form
// console.log(form)
// 调用verify方法
form.verify({
  // 键(验证规则) : 值(怎样验证) (函数、数组都可)
  // len : [正则表达式, '验证不通过的提示']
  len : [/^\S{6,12}$/, '密码长度6~12为且不能有空格'],
  same : function (value) {
    // 函数的形参表示 使用该验证规则的输入框的值
    // return '验证不通过时的提示'
    // 获取密码
    let pwd = $('.pwd').val()
    if (pwd !== value) return '两次密码不一致'
  }
})
