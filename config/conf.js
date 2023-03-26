var mysql = require('mysql');
module.exports = {
    pool: mysql.createPool({
        port:3306, //mysql端口
        user     : 'shuangxiang', //mysql用户名
        password : 'shuangxiang', //mysql密码
        database : 'shuangxiang', //mysql数据库
    }),
    token: '5935850388:AAHEssKugiFBhFDxbBP1hOtMq9S7Bm2X78c', //机器人的token
    adminid:-1001971441758 //管理员或管理群的id    使用机器人 @qunid_bot 获取id
}