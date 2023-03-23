var conf = require('./config/conf');
var TelegramBot = require('node-telegram-bot-api');


/*创建实例对象开始*/
var bot = new TelegramBot(conf.token, {polling: true});
/*创建实例对象结束*/

/*监听新消息*/
bot.on('message', (msg) => { 
    if (msg.chat.type=='private') {
        conf.pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(`SELECT * FROM users where telegramid = ${msg.from.id};`,(error, result)=> {
                if (error) throw error;
                if (result.length==0) {
                    connection.query(`Insert into users (username,telegramid,name,register_time) values ("${(msg.from.username?msg.from.username:"")}","${msg.from.id}","${utf16toEntities((msg.from.first_name?msg.from.first_name:"")+(msg.from.last_name?msg.from.last_name:""))}",now());`,(error, result)=> {
                        connection.destroy();
                        if (error) throw error;
                        main(msg)
                    });
                }else{
                    connection.query(`update users set username = "${(msg.from.username?msg.from.username:"")}",name = "${utf16toEntities((msg.from.first_name?msg.from.first_name:"")+(msg.from.last_name?msg.from.last_name:""))}" where telegramid = "${msg.from.id}";`,(error, result)=> {
                        connection.destroy();
                        if (error) throw error;
                        main(msg)
                    });
                }
            });
        })
    }
});

function main(msg) {
    if (msg.text) {
        if (msg.text=="/start") {
            bot.sendMessage(msg.from.id,`<b>👏欢迎使用双向机器人</b>`,{
                parse_mode:"HTML"
            })
        }else if(msg.text.search("/send")==0){
            qunfa(msg)
        }else{
            bot.forwardMessage(conf.adminid,msg.chat.id,msg.message_id,{
                disable_web_page_preview:true
            })
        }
    }else if(msg.reply_to_message && msg.chat.id==conf.adminid){
        if (msg.reply_to_message.forward_from) {
            bot.forwardMessage(msg.reply_to_message.forward_from.id,msg.chat.id,msg.message_id,{
                disable_web_page_preview:true
            })
        }
    }
	
}

function qunfa(msg) {
	conf.pool.getConnection(function(err, connection) {
		if (err) return err;
		connection.query(`SELECT * FROM users order by id;`,(error, result)=> {
			if (error) return error;
			connection.destroy();
			var index = 0;
            var successful = 0;
			bot.sendMessage(msg.from.id,`开始群发`)
			var qunfa = setInterval(function() {
				if (result.length-1<index) {
					bot.sendMessage(msg.from.id,`群发结束`)
					clearInterval(qunfa)
				}else{
					bot.sendMessage(result[index].telegramid, msg.text.split("/send")[1],{
						parse_mode: 'HTML',
						disable_web_page_preview:true,
					})
					.then(res=>{
                        successful++
						if (successful%100==0) {
							bot.sendMessage(msg.from.id,`已成功群发${successful}次`)
						}
						index++
					})
					.catch(res=>{
						index++
					});
				}
			},1000)
		});
	})
}


function utf16toEntities(str) {
    const patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
    str = str.replace(patt, (char) => {
      let H;
      let L;
      let code;
      let s;

      if (char.length === 2) {
        H = char.charCodeAt(0); // 取出高位
        L = char.charCodeAt(1); // 取出低位
        code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
        s = `&#${code};`;
      } else {
        s = char;
      }

      return s;
    });

    return str;
}
