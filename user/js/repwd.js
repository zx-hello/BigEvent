// ---------表单的验证
let form = layui.form
// console.log(form)
// 三个输入框的密码长度限制要求相同
// 新密码和原密码不能相同
// 两次输入的新密码必须相同
form.verify({
  len : [/^\S{6,12}$/, '密码长度必须在6~12位且不能出现空格'],
  diff : function (val) {
    if (val === $('#oldPwd').val()) {
      return '新密码不能和原密码一致'
    }
  },
  same : function (value) {
    if (value !== $('input[name=newPwd]').val()) {
      return '两次输入的新密码不一致'
    }
  }
});

// 请求服务器  重置密码
$('form').on('submit', function (e) {
  e.preventDefault()
  let data = $(this).serialize()
  axios.post('/my/user/updatepwd', data).then(res => {
    let {status, message} = res.data
    if (status === 0) {
      layer.msg(message)
      // 并且修改成功密码后 应该直接退出当前页面 让用户重新使用新密码登录
      localStorage.removeItem('token')
      window.parent.location.href = '../login.html'
    }
  })
})
