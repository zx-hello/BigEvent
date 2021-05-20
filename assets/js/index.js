// // 响应拦截器  当身份认证失败需要跳转到登陆页面 
// // 并且不允许直接强行登录index页面 必须通过登录才可以进入
// axios.interceptors.response.use(
//   function (response){
//     // console.log(response)
//     let {status, message} = response.data
//     if (status === 1) layer.msg(message)
//     return response
//   },
//   function (error) {
//     // 错误的时候也可以拿到结果 是error.response
//     // console.log(error.response)
//     let {status, message} = error.response.data
//     // 判断token过期或者错误
//     if (status === 1 && message === '身份认证失败！') {
//       localStorage.removeItem('token')
//       location.href = './login.html'
//     }
//     layer.msg(message)
//     return Promise.reject(error)
//   }
// )

// -------发送请求 获取用户信息
function getUserInfo() {
  axios.get('/my/user/userinfo').then(res => {
    // console.log(res)
    // 解构  看清楚结构！！！！ res.data.data
    let {nickname, user_pic, username} = res.data.data
    // 设置欢迎 名称  若用户有昵称就使用 没有就使用username
    let name = nickname || username
    $('.username').text(name)
    // 显示头像 新用户没有头像 使用name的第一个字符  当有头像时 使用头像图片
    if (user_pic) {
      // 说明有头像
      $('.layui-nav-img').attr('src', user_pic).show()
    } else {
      // 说明没有头像  截取字符串三种方式  substr substring splice
      // 截取第一个字符串当作头像  若是字母转成大写
      let first = name.substring(0, 1).toUpperCase()
      // 此处使用show()方法 会显示元素本身的display状态 所以不适合使用show()
      $('.user-avatar').text(first).css('display', 'inline-block')
    }
  })
}

getUserInfo()

// ---------退出
$('#logout').on('click', function () {
  layer.confirm('确定退出吗？', {icon: 3, title:'提示'}, function(index){
    //do something
    // 点击确定 删除token
    localStorage.removeItem('token')
    // 如果点击确定就会执行 跳转到登录页面
    location.href = './login.html'
    // 关闭弹出层
    layer.close(index);
  });
})