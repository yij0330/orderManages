import axios from 'axios'

//配置根目录
const IP = 'http://127.0.0.1:5000'
axios.defaults.baseURL = IP

//---------------------------------商品图片------------------------------------------//
export const ITEM_IMG_UPDATA = IP + "/goods/goods_img_upload"
export const SHOW_ITEM_IMG = IP + "/upload/imgs/goods_img/"
///shop/upload
export const ITEM_SHOP_UPDATA = IP + "/shop/upload"
export const SHOW_SHOP_IMG = IP + "/upload/shop/"

//---------------------------------账号------------------------------------------//
export const ACC_IMG_UPDATA = IP + "/users/avatar_upload"




//---------------------------------账号------------------------------------------//

//登录
//account账号   password密码
export const login = (account, password) => axios.post('/users/checkLogin', {
    account,
    password
})

//验证token是否失效
//token字符串 身份令牌
export const checkToken = token => axios.get('/users/checktoken', {
    params: {
        token
    }
})

//添加账号
//account账号  password密码  userGrounp分组
export const accAdd = (account, password, userGroup) => axios.post('/users/add', {
    account,
    password,
    userGroup
})

//获取账号列表
//currentPage当前页数  pageSize每页页数
export const accList = (currentPage, pageSize) => axios.get('/users/list', {
    params: {
        currentPage,
        pageSize
    }
})

//删除账号
//id用户id
export const accDel = id => axios.get('/users/del', {
    params: {
        id
    }
})

//批量删除账号
//ids用户id组成的数组字符串
export const batchdel = ids => axios.get('/users/batchdel', {
    params: {
        ids
    }
})

//修改账号名
//id用户id, account账号名, userGroup用户组
export const editAcc = (id, account, userGroup) => axios.post('/users/edit', {
    id,
    account,
    userGroup
})

//检查旧密码是否正确
//oldPwd旧密码, id账号id
export const checkPwd = (oldPwd, id) => axios.get('/users/checkoldpwd', {
    params: {
        oldPwd,
        id
    }
})

//修改密码
//id用户id, newPwd新密码
export const editPwd = (newPwd, id) => axios.post('/users/editpwd', {
    newPwd,
    id
})

//获取账号（个人中心）信息
//id用户id
export const accountinfo = id => axios.get('/users/accountinfo', {
    params: {
        id
    }
})

//上传用户图片
//id用户id
export const avatar_upload = id => axios.post('/users/avatar_upload', {
    id
})

//---------------------------------商品------------------------------------------//

//获取分类
//currentPage: 当前页  pageSize：每页条数
export const cateList = (currentPage, pageSize) => axios.get('/goods/catelist', {
    params: {
        currentPage,
        pageSize
    }
})

//添加分类
//cateName：分类名  state：是否启用
export const addCate = params => axios.post('/goods/addcate', params)

//删除分类
//id：分类id
export const delCate = id => axios.get('/goods/delcate', {
    params: {
        id
    }
})

//修改分类名称
//id：分类id cateName：分类名 state: 分类状态
export const editCate = params => axios.post('/goods/editcate', params)

//获取所有商品分类名称
//id：分类id cateName：分类名 state: 分类状态
export const categories = () => axios.get('/goods/categories')

//添加商品
//name：商品名 category：商品分类 price价格 imgUrl：图片地址 goodsDesc描述
export const additem = params => axios.post('/goods/add', params)

//修改商品
//name：商品名 category：商品分类 price价格 imgUrl：图片地址 goodsDesc描述 id id名
export const edititem = (name, category, price, imgUrl, goodsDesc, id) => axios.post('/goods/edit', {
    name,
    category,
    price,
    imgUrl,
    goodsDesc,
    id
})

//获取商品列表
//currentPage,当前页   pageSize 每页条数 
export const goodList = (currentPage, pageSize) => axios.get('/goods/list', {
    params: {
        currentPage,
        pageSize
    }
})

//修改分类名称
//id：分类id 
export const goodDel = id => axios.get('/goods/del', {
    params: {
        id
    }
})

//---------------------------------订单管理------------------------------------------//


//订单管理
///currentPage 当前页  pageSize每页条数  orderNo订单号(可选) consignee收货人(可选) phone电话(可选) orderState订单状态(可选) date时间范围(可选)
export const orderList = (params) => axios.get('/order/list', {params})

//订单详情
///currentPage 当前页  pageSize每页条数  orderNo订单号(可选) consignee收货人(可选) phone电话(可选) orderState订单状态(可选) date时间范围(可选)
export const orderDetail = id => axios.get('/order/detail', {
    params: {
        id
    }
})

//修改订单  /order/edit
///orderNo订单号 consignee收货人 phone电话 orderState订单状态 deliverAddress地址 deliveryTime送达时间 remarks备注 orderAmount金额 orderState状态
export const orderEdit = params => axios.post('/order/edit', params)

//---------------------------------店铺信息------------------------------------------//

///shop/info
//获取店铺信息  
///id, name 店铺名称, bulletin 公告, avatar 店铺头像, deliveryPrice 配送费,deliveryTime送达时间  description 描述, score 评分, sellCount销量, supports活动, pics 店铺图片, date 营业时间, minPrice起送价格
export const shopInfo = () => axios.get('/shop/info')


///shop/edit
//修改商店信息  
///id, name 店铺名称, bulletin 公告, avatar 店铺头像, deliveryPrice 配送费,deliveryTime送达时间  description 描述, score 评分, sellCount销量, supports活动, pics 店铺图片, date 营业时间, minPrice起送价格
export const shopEdit = params => axios.post('/shop/edit', params)

//---------------------------------统计------------------------------------------//
///order/totaldata
export const totaldata = () => axios.get('/order/totaldata')

///order/ordertotal
export const ordertotal = (date) => axios.get('/order/ordertotal', {params : {date}})