// ----------渲染文章列表的数据 渲染到页面  params : 参数个数
let params = {
  pagenum : 1,  // 获取第一页的数据
  pagesize : 3,  // 每页两条数据
  // state : ,
  // cate_id :
}

// 封装函数 获取文章 渲染到tbody中
function renderArticle() {
  axios.get('/my/article/list', {
    params : params
  }).then(res => {
    // console.log(res.data)
    let {status, data, total} = res.data

    if (status === 0) {
      let str = ''
      data.forEach(item => {
        str += `
                    <tr>
                      <td>${item.title}</td>
                      <td>${item.cate_name}</td>
                      <td>${item.pub_date}</td>
                      <td>${item.state}</td>
                      <td>
                        <button type="button" class="layui-btn layui-btn-xs">
                          编辑
                        </button>
                        <button type="button" class="layui-btn layui-btn-xs layui-btn-danger">
                          删除
                        </button>
                      </td>
                    </tr>
        `
      });
      $('tbody').html(str)
      // 渲染处理完数据 调用分页函数
      showPage(total)
    }
  })
}

renderArticle()

// ----------分页
let laypage = layui.laypage
//执行一个laypage实例
// 将分页封装成函数
function showPage(t) {
  laypage.render({
    elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号！！！！
    count: t, //数据总数，从服务端得到
    limit : params.pagesize,  // 每页显示几条
    curr : params.pagenum,  // 默认当前第几页
    layout : ['prev', 'page', 'next', 'count', 'skip'],
    jump: function(obj, first){
      //首次不执行
      if(!first){
        //do something
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数
        params.pagenum = obj.curr
        params.pagesize = obj.limit
        renderArticle()
      }
    }
  });
}

// ----------筛选
// 获取真实 的分类
axios.get('/my/category/list').then(res => {
  let {status, data} = res.data
  console.log(res.data)
  if (status === 0) {
    // console.log(data)
    let str = ''
    data.forEach(item => {
      str += `<option value="${item.id}">${item.name}</option>`
    })
    $('#category').append(str)
    // 更新渲染
    let form = layui.form
    form.render('select')

  }
})

// 完成筛选
$('#search').on('submit', function (e) {
  e.preventDefault()
  // 获取下拉框的两个值
  let cate_id = $('#category').val()
  let state = $('#state').val()

  // 设置请求参数
  if (cate_id) {
    params.cate_id = cate_id
  } else {
    delete params.cate_id   //删除对象的属性
  }

  if (state) {
    params.state = state
  } else {
    delete params.state
  }
  // 当选择了筛选条件的时候 需要将页面跳转到第一页
  params.pagenum = 1
  // 发送请求 获取文章
  renderArticle()
})