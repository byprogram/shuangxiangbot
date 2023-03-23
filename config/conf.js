var mysql = require('mysql');
module.exports = {
    pool: mysql.createPool({
        port:3306, //mysql端口
        user     : 'shuangxiang', //mysql用户名
        password : 'shuangxiang', //mysql密码
        database : 'shuangxiang', //mysql数据库
        multipleStatements: true //不要改这个
    }),
    token: '6189733286:AAHyRn0z3-ikYQTwyZubLBbAl2lYXUWY1VU', //机器人的token
    adminid:"5197702141"
}