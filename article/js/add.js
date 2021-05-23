// tinymce_setup.js就是封装的这个富文本编辑器 直接调用就可以
initEditor()

// 页面处理 获取文章分类
axios.get('/my/category/list').then(res => {
  // console.log(res.data)
  // 获取选择分类的内容
  let {status, data} = res.data
  if (status === 0) {
    let str = ''
    // 将获取的分类进行遍历 追加到下拉菜单内
    data.forEach(item => {
      str += `<option value="${item.id}">${item.name}</option>`
    });
    // $('#select').html(str)   // html()会覆盖select里面的所有代码
    $('.cate_id').append(str)  // append()是在后面追加 不会将最开始的给覆盖了
    // 有些时候，你的有些表单元素可能是动态插入的。
    // 这时 form 模块 的自动化渲染是会对其失效的。
    // 虽然我们没有双向绑定机制（因为我们叫经典模块化框架） 
    // 但没有关系，你只需要执行 form.render(type, filter); 方法即可。
    let form = layui.form
    form.render('select')
  }
})

// ----------初始化剪裁框
//  初始化图片裁剪器
let image = $('#image')
// 裁剪选项
let options = {
  aspectRatio: 400 / 280,
  preview: '.img-preview'
}
// 初始化裁剪区域
image.cropper(options)

// 点击选择封面  可以选择图片
$('.btn_select').on('click', function () {
  // 用好看的按钮 代替原生的input 的文件域按钮  利用自触发事件
  $('#file').trigger('click');
});

// 图片切换的时候，更换剪裁区的图片
$('#file').on('change', function () {
  if (this.files.length > 0) {
    // 找到文件对象
    var fileObj = this.files[0];
    // 创建url
    var url = URL.createObjectURL(fileObj);
    // 更换图片  剪切图片内自己封装的更换图片的方法
    image.cropper('replace', url);
  }
});

// ----------表单提交  收集数据
$('form').on('submit', function (e) {
  e.preventDefault()
  // 利用FormData()才可以收集到文件域的文件对象
  let fd = new FormData(this)
  // 遍历才可以得到fd里面的files
  // 修改content  富文本编辑器的值
  // 整个网页只有一个富文本编辑器时
  // 获取内容 ：tinyMCE.activeEditor.getContent()
  fd.set('content', tinyMCE.activeEditor.getContent())
  let canvas = image.cropper('getCroppedCanvas', {width : 400, height : 280})
  // canvas.toDataURL()

  // // url = URL.createObjectURL(blob);
  // console.log(url);
  // //blob:http://localhost:63342/d869ed9c-cad0-49f9-9965-e9959a15e0c0
  // console.log(blob);
  // 返回一个blob对象

  canvas.toBlob(function (blob) {
    // console.log(blob)  // Blob {size: 289544, type: "image/png"}
    // blob对象 追加到fd中之后 就会转成文件对象
    fd.append('cover_img', blob)
    // cover_img -->  文件对象
    // // 遍历fd 查看获取的内容
    // fd.forEach((item, index) => {
    //   console.log(item, index)   // index --> name属性   item --> 当前项的值
    // })
    axios.post('/my/article/add', fd).then(res => {
      // console.log(res.data)
      let {status, message} = res.data
      if (status === 0) {
        layer.msg(message)
        location.href = './list.html'
      }
    })
  })
 
})