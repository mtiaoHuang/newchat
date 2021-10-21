import protobuf from "./protobuf.js"
import SKIMSDK from './websocket_sdk.js'
import store from '../store'
import msgRequest from './msgRequest.js'
import apiServer from './apiServer.js'
import CryptoJS from 'crypto-js'
import md5 from 'js-md5';
/*
	web IM 相关的处理与UI 解耦
	依赖于 具体 协议相关的 比如 xmpp-sdk 或者 websocket_sdk js
	UI调用 当前类  不直接调用 协议相关类  做得协议类 逻辑 解耦
*/
let backID = []
var WEBIM={
	/*消息ID 前缀 */
	cont:"skimweb_",
	resource:"web",
	/*单聊标识*/
	CHAT:"chat",
	/*群聊标识*/
	GROUPCHAT:"groupchat",
	token:null,
	userId:null,
	nickName:"",
	isReadDel:0,
	/*用户 jid 10004541/web */
    userIdStr:null,
    /*服务器连接地址 ws://localhost:5260 */
    serverUrl:null,
    server:null,
    /*消息超时 时间 默认 15 秒*/
    sendTimeOut:15,
    /*等待消息回执的 消息Id 数组*/
    waitReceiptMessageIds:{},

    /*初始化*/
    initWebIM:function(url,userId,nickName,resource,token,pingTime,server){
        WEBIM.token=token;
        WEBIM.serverUrl=url;
        WEBIM.server=server;
        WEBIM.resource=resource;
				WEBIM.userId=userId;
				WEBIM.nickName=nickName;
        SKIMSDK.initApi(url,userId,resource,token,pingTime,server);
				WEBIM.userIdStr=SKIMSDK.userIdStr;
        SKIMSDK.messageReceiver=WEBIM.handlerMessage;
        SKIMSDK.handlerMsgReceipt=WEBIM.handlerMsgReceipt;
        SKIMSDK.handlerLoginConflict=WEBIM.handlerLoginConflict;
    },
    loginIM:function(callback){
    	SKIMSDK.loginIM(function(message){
    		//var resource=WEBIM.getResource(message.from);
    		if(callback)
                callback();
    	});
    },
    disconnect:function(e){
        SKIMSDK.disconnect(e);
    },
    isConnect:function(){
        return SKIMSDK.isConnect();
    },
    updateMyDeviceStatus:function(message){
    	console.log("updateMyDeviceStatus  "+JSON.stringify(message));
    	var resources = message.resources;
    	var from = message.from;
    	var fromResource = WEBIM.getResource(from);
    	if(WEBIM.isContains(resources,fromResource)){
    		DeviceManager.updateDeviceStatus(fromResource,1);
    	}else{
    		DeviceManager.updateDeviceStatus(fromResource,0);
    	}
    	/*var array=resources.split(",");
    	for (resource in array) {
    		if(WEBIM.resource==resource)
    			continue;
    		DeviceManager.updateDeviceStatus(,);
    	}*/
    },
    sendMessage:function(message){
    	SKIMSDK.sendMessage(message);

    	console.log("send  message "+JSON.stringify(message));
    	/*调用等待消息回执*/
    	WEBIM.waitMessageReceipt(message.messageId);
    },
    /*收到服务端的聊天消息*/
    handlerMessage:function(message){
    	console.log("收到 message22 "+JSON.stringify(message));
			WEBIM.handlerMessageByType(message);
    },
    /*根据消息类型处理逻辑*/
    handlerMessageByType:function(message){
			console.log(message,9090)
			if(store.state.blackList.length>0){
				let flag = false
				for(let i=0;i<store.state.blackList.length;i++){
					if(message.fromUserId == store.state.blackList[i].toUserId){
						flag = true
						return
					}
				}
			}
			if(message.isReadDel==1){
				let msg = message
				console.log(7575)
				let readDelRecord = store.state.readDelRecord
				if(readDelRecord[msg.fromUserId]){
					readDelRecord[msg.fromUserId].push(msg)
				}else{
					readDelRecord[msg.fromUserId] = []
					readDelRecord[msg.fromUserId].push(msg)

				}
					store.commit("setReadDelRecord",readDelRecord)
			}

			let list = store.state.lastChatList
			for(let i = 0; i<list.length; i++){
				if(list[i].jid == message.toUserId||list[i].to == message.fromUserId){
					list[i].timeSend = apiServer.getCurrentSeconds()
				}
			}
			store.commit("setLastChatMsg",list)
			// this.$store.state.backID.push(message.messageId)
			// window.sessionStorage.setItem("backID",[1,4])
		console.log(" 消息type "+ message.type,message);
		store.commit("setBackID",message.content);
		window.sessionStorage.setItem("backID",JSON.stringify(store.state.backID))
		console.log(store.state.backID)
    	// message.content=WEBIM.decryptMessage(message);
			message.recall = message.content
    	if(parseInt(message.type/100)==9||401==message.type||402==message.type){// 群控制消息
			return WEBIM.handlerGroupGontrolMessage(message);
		}else if (message.type>99&&message.type<130){// 语音或视频消息
			return WEBIM.handlerAudioOrVideoMessage(message);
		}else if (parseInt(message.type/100)==5){// 新朋友消息
			return WEBIM.handlerNewFriendMessage(message);
		}
		switch (message.type){
	        case MessageType.Type.READ:
	            WEBIM.handlerReadReceipt(message);
	            break;
	        case MessageType.Type.INPUT:
	            WEBIM.handlerInputingMessage(message)
	            break;
	        case MessageType.Type.REVOKE:
	            WEBIM.handlerRevokeMessage(message)
	            break;
	       default:
				// console.log(message);
				// message.direction = 1;
				if(message.fromUserId == window.sessionStorage.getItem("userId")){
					break;
				}
				console.log("发消息的人id   "+message.fromUserId)
				let list = [];
				console.log(message,11111)
				if(message.isEncrypt==1){
					message.content = this.decryptMessage(message);
				}
				if(message.type == 5){
					message.content = "/static/assets/gif/"+message.content;
					// message.content = "/mobileWeb/static/assets/gif/"+message.content;
				}
				if(message.chatType == 1){// 收到单聊消息
					if(store.state.openUserId==message.fromUserId){
						console.log("已经打开了")
						if(message.type==1){
							message=msgRequest.changeText(message);
						}
						store.commit("setMsgListOne",message);
						break ;
					}
					if(!apiServer.isNull(window.sessionStorage.getItem("friendsMsgNum"))){
						list = JSON.parse(window.sessionStorage.getItem("friendsMsgNum"));
						if(list.indexOf(message.fromUserId)<0){

							list.push(message.fromUserId);
							window.sessionStorage.setItem("friendsMsgNum",JSON.stringify(list));
						}
					}else{
						console.log("走else")
						list.push(message.fromUserId);
						window.sessionStorage.setItem("friendsMsgNum",JSON.stringify(list));
					}

					let msgNumUserId=0;
					if(apiServer.isNull(window.sessionStorage.getItem("msgNum"+message.fromUserId))){
						console.log("消息为空 "+window.sessionStorage.getItem("msgNum"+message.fromUserId))
					}else{
						msgNumUserId = window.sessionStorage.getItem("msgNum"+message.fromUserId);
					}
					console.log("设置用户对应的消息数量")
					window.sessionStorage.setItem("msgNum"+message.fromUserId,parseInt(msgNumUserId)+1);// 设置用户对应的消息数量
					console.log("设置最新一条消息")
					window.sessionStorage.setItem("newMsgUserId",message.fromUserId);// 设置最新一条消息发送者

					// 保存一个未读消息map  userId:[message]
					let userUnreadList=[];
					let msgMap={};
					if(!apiServer.isNull(window.sessionStorage.getItem("userUnread"))){
						if(!apiServer.isNull(JSON.parse(window.sessionStorage.getItem("userUnread"))[message.fromUserId])){
							console.log("map中有")
							console.log(JSON.parse(window.sessionStorage.getItem("userUnread"))[message.fromUserId]);
							var haveList=JSON.parse(window.sessionStorage.getItem("userUnread"))[message.fromUserId];
							haveList.push(message);
							console.log(haveList);
							msgMap[message.fromUserId]=haveList;
							window.sessionStorage.setItem("userUnread",JSON.stringify(msgMap));
						}else{
							console.log("map存在 map中没有")
							userUnreadList.push(message);
							msgMap=JSON.parse(window.sessionStorage.getItem("userUnread"));
							msgMap[message.fromUserId]=userUnreadList;
							window.sessionStorage.setItem("userUnread",JSON.stringify(msgMap));

						}
					}else{
						// msgMap.push({key:message.fromUserId,value:message});
						// let
						userUnreadList.push(message);
						msgMap[message.fromUserId]=userUnreadList;
						window.sessionStorage.setItem("userUnread",JSON.stringify(msgMap));
					}
				}else if(message.chatType == 2){// 收到群组消息
					if(store.state.openUserId==message.toUserId){
						console.log("已经打开了")
						if(message.type==1){
							message=msgRequest.changeText(message);
						}
						store.commit("setMsgListOne",message);
						break ;
					}
					if(!apiServer.isNull(window.sessionStorage.getItem("friendsMsgNum"))){
						list = JSON.parse(window.sessionStorage.getItem("friendsMsgNum"));
						if(list.indexOf(message.toUserId)<0){
							console.log('走if')
							list.push(message.toUserId);
							window.sessionStorage.setItem("friendsMsgNum",JSON.stringify(list));
						}
					}else{
						console.log("走else")
						list.push(message.toUserId);
						window.sessionStorage.setItem("friendsMsgNum",JSON.stringify(list));
					}
					let msgNumUserId=0;
					if(apiServer.isNull(window.sessionStorage.getItem("msgNum"+message.toUserId))){
						console.log("消息为空 "+window.sessionStorage.getItem("msgNum"+message.toUserId))
					}else{
						msgNumUserId = window.sessionStorage.getItem("msgNum"+message.toUserId);
					}
					console.log("设置用户对应的消息数量")
					window.sessionStorage.setItem("msgNum"+message.toUserId,parseInt(msgNumUserId)+1);// 设置用户对应的消息数量
					window.sessionStorage.setItem("newMsgUserId",message.toUserId);// 设置最新一条消息发送者

					// 保存一个未读消息map  userId:[message]
					let userUnreadList=[];
					let msgMap={};
					if(!apiServer.isNull(window.sessionStorage.getItem("userUnread"))){
						if(!apiServer.isNull(JSON.parse(window.sessionStorage.getItem("userUnread"))[message.toUserId])){
							console.log("map中有")
							console.log(JSON.parse(window.sessionStorage.getItem("userUnread"))[message.toUserId]);
							var haveList=JSON.parse(window.sessionStorage.getItem("userUnread"))[message.toUserId];
							haveList.push(message);
							console.log(haveList);
							msgMap[message.toUserId]=haveList;
							window.sessionStorage.setItem("userUnread",JSON.stringify(msgMap));
						}else{
							console.log("map存在 map中没有")
							userUnreadList.push(message);
							msgMap=JSON.parse(window.sessionStorage.getItem("userUnread"));
							msgMap[message.toUserId]=userUnreadList;
							window.sessionStorage.setItem("userUnread",JSON.stringify(msgMap));
						}
					}else{
						// msgMap.push({key:message.fromUserId,value:message});
						// let
						userUnreadList.push(message);
						msgMap[message.toUserId]=userUnreadList;
						window.sessionStorage.setItem("userUnread",JSON.stringify(msgMap));
					}
				}
				// store.commit("setMsgListOne",message);
				store.commit("setNewMsgList",message);
				store.commit("setSysMsgNum",1);
				console.log("设置总的消息数量")
				if(apiServer.isNull(window.sessionStorage.getItem("sysMsgNum"))){
					window.sessionStorage.setItem("sysMsgNum",parseInt(1));// 设置总的消息数量
				}else{
					window.sessionStorage.setItem("sysMsgNum",parseInt(window.sessionStorage.getItem("sysMsgNum"))+1);
				}

	         break ;
	    }

	},
    /*收到消息回执*/
    handlerMsgReceipt:function(messageId){
    	// ConversationManager.processReceived(messageId);
    	delete WEBIM.waitReceiptMessageIds[messageId];
    },
    /*收到 群控制消息 */
    handlerGroupGontrolMessage:function(message){
    	msgRequest.handlerGroupGontrolMessage(message);
    },
    /*收到音视频通话消息*/
    handlerAudioOrVideoMessage:function(message){
		// ConversationManager.handlerAudioOrVideoMessage(message);
    },
    /*处理新的朋友消息*/
    handlerNewFriendMessage:function(message){
		msgRequest.handlerNewFriendMessage(message);
    },
    /*处理正在输入消息*/
    handlerInputingMessage:function(message){

    },
    /*处理撤回消息*/
    handlerRevokeMessage:function(message){
		msgRequest.handlerRevokeMessage(message);
    },
    /*设备登陆冲突 被挤下线*/
    handlerLoginConflict:function(e){
			console.log(e,566)
    },
    /*发送消息已读回执*/
    sendMessageReadReceipt:function(to,messageId){
    	var msg=WEBIM.createMessage(26,messageId,null,null);
		msg.to=to;
		var msgObj=msg;
		WEBIM.sendMessage(msgObj);
		return msg;
    },
    /*收到消息已读回执*/
    handlerReadReceipt:function(message){
		// ConversationManager.handlerReadReceipt(message);
		//收到阅后即焚已读消息如果是消息列表最后一条时
		let list = store.state.lastChatList
		for(let i=0;i<list.length;i++){
			if(message.content == list[i].messageId){
				if(list[i].isReadDel == 1){
					list[i].content = "对方查看了您这条阅后即焚消息"
					break
				}
			}
		}
    },
    /*处理 漫游的历史聊天记录*/
    handlerHistoryMessageResult:function(message){
    	console.log("handlerHistoryMessageResult "+JSON.stringify(message));
    },
     /*处理 批量群组的 离线消息数量*/
    handlerGroupMessageCountResult:function(message){
    	console.log("handlerGroupMessageCountResult "+JSON.stringify(message));
    },
    /*等待服务器消息回执*/
    waitMessageReceipt:function(messageId){
    	WEBIM.waitReceiptMessageIds[messageId]=1;
    	setTimeout(function(){
			//消息 发送失败 没有收到回执
			if (WEBIM.waitReceiptMessageIds[messageId]) {
				WEBIM.sendMessageTimeOut(messageId);
			}

		},WEBIM.sendTimeOut*1000,messageId);
    },
    /*发送消息超时 没有收到消息回执 处理 页面逻辑*/
    sendMessageTimeOut:function(messageId){
    	// ConversationManager.sendTimeout(messageId);
    },
    /**
	 * 加入群聊
	 * @param  {[type]} groupJid [群组Jid]
	 */
	joinGroupChat : function(groupJid,userId,seconds) {
		if(seconds!=0){
		 	var logOutTime=JSON.parse(window.sessionStorage.getItem("login")).offlineTime;
			if(logOutTime>0)
			  seconds=getCurrentSeconds()-JSON.parse(window.sessionStorage.getItem("login")).loginTime;
			else
			    seconds=0;
		}
		console.log(groupJid+"  joinGroup seconds "+seconds);
		SKIMSDK.joinGroupChat(groupJid,userId,seconds);

	},
	/*退出群聊*/
	exitGroupChat:function(groupJid){
		SKIMSDK.exitGroupChat(groupJid);
	},

	refreshMessage:function(msg,toUserId){
		var timeSend =WEBIM.getTimeSecond();
		var messageId=WEBIM.randomUUID();
		var message={};
			message.messageId=messageId;
			message.fromUserId = myData.userId + "";
			message.fromUserName = myData.nickname;
			message.toUserId=toUserId+"";
			message.timeSend = timeSend;
			if(10==msg.type){
				message.type=msg.contentType;
				message.content=msg.text;
			}else{
				message.type=msg.type;
				message.content=msg.content;
			}
			if(1==myData.isEncrypt)
				message.isEncrypt=myData.isEncrypt;
			if(1==myData.isReadDel)
				message.isReadDel=myData.isReadDel;
		return message;
	},
	/*构建一条消息*/
	createMessage :function(type,content,toUserId,toUserName){
		console.log(content,"9999")
		var timeSend =WEBIM.getTimeSecond();
		let chatType = 1;
		if(window.localStorage.getItem("isOpenRoom")==1){
			chatType =2;
		}
		var messageId=WEBIM.randomUUID();
			var msg = {
				messageId:messageId,
				fromUserId : WEBIM.userId + "",
				fromUserName : WEBIM.nickName,
				content : content,
				timeSend : timeSend,
				type : type,
				chatType:chatType
			};
			if(1==JSON.parse(window.sessionStorage.getItem("Usersetting")).isEncrypt){
				msg.isEncrypt=JSON.parse(window.sessionStorage.getItem("Usersetting")).isEncrypt;
				msg.content = this.encryptMessage(msg);
			}
			// // if(4>type&&6!=type&&1==WEBIM.isReadDel)
			// console.log(JSON.parse(sessionStorage.getItem('Usersetting')).isEncrypt)
				// if(JSON.parse(sessionStorage.getItem('Usersetting')).isEncrypt){
				// 	if(msg.type==1){
				// 		msg.content=WEBIM.decryptMessage(msg);
				// 		// msg = msgRequest.changeText(msg);
				// 	}
				// }
			if(toUserId)
				msg.toUserId=toUserId+"";
			else
				msg.toUserId=store.state.openUserId+"";
			msg.to=msg.toUserId;
			console.log(msg,"create")
// 			if(5==parseInt(type/100)){
// 				if(!toUserName){
// 					msg.toUserName=toUserName;
// 					callback(msg);
// 				}
//
// 				mySdk.getUser(toUserId,function(result){
// 					msg.toUserName=result.nickname;
// 					callback(msg);
// 				});
// 			}else{
				return msg;
			// }
	},
	/*创建一个 语音纤细*/
	createVoiceMessage:function(type,content,size,time){
		var timeSend =WEBIM.getTimeSecond();
		var messageId=WEBIM.randomUUID();
			var msg = {
				messageId:messageId,
				fromUserId : window.sessionStorage.getItem("userId") + "",
				fromUserName : window.sessionStorage.getItem("nickName"),
				content : content,
				fileSize:size,
				timeLen:time,
				timeSend : timeSend,
				type : type
			};
			if(1==JSON.parse(window.sessionStorage.getItem("Usersetting")).isEncrypt)
				msg.isEncrypt=JSON.parse(window.sessionStorage.getItem("Usersetting")).isEncrypt;
			if(1==JSON.parse(window.sessionStorage.getItem("Usersetting")).isReadDel)
				msg.isReadDel=JSON.parse(window.sessionStorage.getItem("Usersetting")).isReadDel;
			return msg;
	},
	/*转换为 客户端的 消息*/
    convertToClientMsg:function(message){
      return SKIMSDK.convertToClientMsg(message);
    },
    /*是否是 群组消息*/
    isGroupType:function(chatType){
		return WEBIM.GROUPCHAT==chatType;
    },
    /*是否是 单聊消息*/
    isChatType:function(chatType){
    	return WEBIM.CHAT==chatType;
    },
    randomUUID : function() {
        return WEBIM.cont+WEBIM.userId+WEBIM.getTimeSecond()+Math.round(Math.random()*1000);
    },
    getTimeSecond:function(){
		return Math.round(new Date().getTime());
	},
	toDateTime : function(timestamp) {
		return (new Date(timestamp * 1000)).format("yyyy-MM-dd hh:mm");
	},
	toDate : function(timestamp) {
		return (new Date(timestamp * 1000)).format("yyyy-MM-dd");
	},
	isContains: function(str, substr) {
		if(!str)
			return false;
    	return str.indexOf(substr) >= 0;
	},
	isNil : function(s) {
		return undefined == s ||"undefined"==s|| null == s || $.trim(s) == "" || $.trim(s) == "null"||NaN==s;
	},
	notNull : function(s) {
		return !this.isNil(s);
	},
	getFullUserJid:function(userId){
		return SKIMSDK.getFullUserJid(userId);
	},
	getFullGroupJid:function(jid){
		return SKIMSDK.getUserIdFromJid(jid);
	},
    getUserIdFromJid:function (jid){
    	return SKIMSDK.getUserIdFromJid(jid);
    },
	getBareJid: function (jid){
		return SKIMSDK.getBareJid(jid);
    },
	getResource : function(jid) {
		return SKIMSDK.getResource(jid);
	},
	/*是否为群组 Jid*/
	isGroup : function(userId) {
		var reg = /^[0-9]*$/;
		if(!reg.test(userId))
			return 1;
		else
			return 0;
	},
	/*判断消息是否加密*/
	isEncrypt:function(msg){
		var isEncrypt = 0;  //是否为加密  0:不是  1:是
			if(!msg.content)
				return false;
			if(null!=msg.isEncrypt)
				isEncrypt=msg.isEncrypt;
			if(isEncrypt=="1"||1==isEncrypt)
				return true;
			else false;
	},
	//消息加密
	encryptMessage:function(msg,cb){
		var key=WEBIM.getMsgKey(msg);

		console.log("encryptMsg content  "+msg.content);
		var content=WEBIM.encryptDES(msg.content,key);
		//msg.content=content;
		console.log( "encryptMsg key "+key+"  content "+content);
		return content;
	},//消息解密
	decryptMessage:function(msg,cb,o) {
		//检查消息是否加密 并解密
		/*if(msg.type==26){
			return cb(msg,o);
		}*/
		console.log(55)
		if(WEBIM.isEncrypt(msg)){
			console.log(77)
			var key=WEBIM.getMsgKey(msg);
			console.log("decryptMsg content  "+msg.content,1);
			var content=WEBIM.decryptDES(msg.content,key);
			console.log(content,88)
			if(apiServer.isNull(content)){
				console.log(msg.content,99)
				return msg.content;
			}
			console.log( "decryptMsg key "+key+"  content "+content);
			return content;

		}else{
			return msg.content;
		}

	},
	createOpenApiSecret(obj){
		if(!obj){
			obj={};
		}
		obj.time=getCurrentSeconds();
		var api_time=apiServer.sysConfig.apiKey+obj.time;

		var md5Key=md5(api_time);
		obj.secret=md5Key;
		return obj;
	},
	//创建 密钥
	createCommApiSecret(obj){
		obj.time=getCurrentSeconds();
		var key=AppConfig.apiKey+obj.time+myData.userId+myData.access_token;
		var md5Key=$.md5(key);
		obj.secret=md5Key;
		return obj;
	},
	createRedSecret(obj){
		obj.time=getCurrentSeconds();
		var api_time=AppConfig.apiKey+obj.time;
		var userId_token=myData.userId+myData.access_token;
		var md5ApiTime=$.md5(api_time);
		var md5Password=$.md5(obj.password);
		var key=md5ApiTime+userId_token+md5Password;
		var md5Key=$.md5(key);
		obj.secret=md5Key;
		return obj;
	},
	receiveRedSecret(obj){
		obj.time=getCurrentSeconds();
		var api_time=AppConfig.apiKey+obj.time;
		var userId_token=myData.userId+myData.access_token;
		var md5ApiTime=$.md5(api_time);
		var key=md5ApiTime+userId_token;
		var md5Key=$.md5(key);
		obj.secret=md5Key;
		return obj;
	},
	getMsgKey:function(msg){
		msg.timeSend = parseInt(msg.timeSend);
		var key= apiServer.sysConfig.apiKey+msg.timeSend+msg.messageId;
		return md5(key);
	},
	encryptDES:function(message,key){
	 	var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.TripleDES.encrypt(
                       message,
                        keyHex, {
                        iv:CryptoJS.enc.Utf8.parse(iv),
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                        });
        //encrypted=CryptoJS.enc.Utf8.stringify(decrypted);
       // console.log("encryptDES "+encrypted);
       var result= encrypted.ciphertext.toString(CryptoJS.enc.Base64);
       return result;
	},
	decryptDES:function(message,key){
		  //把私钥转换成16进制的字符串
				var keyHex = CryptoJS.enc.Utf8.parse(key);
        // console.log(message,keyHex,9999)
        //把需要解密的数据从16进制字符串转换成字符byte数组
        var decrypted = CryptoJS.TripleDES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(message)
        }, keyHex, {
            iv:CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
				});
				console.log(decrypted,9999)
         // console.log("decryptDES   "+ decrypted);
        //以utf-8的形式输出解密过后内容
        var result = decrypted.toString(CryptoJS.enc.Utf8);
		console.log("decryptDES   "+ result);
        return result;
	},
	//格式化 要显示的 消息标题 如 [图片] [位置]
	parseShowMsgTitle:function(msg){
		var content;
		switch (msg.type){
			case 1:
				content=msg.content;
			  break;
			case 2:
				content="[图片]";
			  break;
			case 3:
				content="[语音]";
			  break;
			case 4:
				content="[位置]";
			  break;
			case 5:
				content="[动画]";
			  break;
			case 6:
				content="[视频]";
			  break;
			case 8:
				content="[名片]";
			  break;
			case 9:
				content="[文件]";
			  break;
			case 10:
				/*控制消息和通知*/
				content=msg.content[0].data;
			  break;
			case 28:
				content="[红包]";
			  break;
			case 83:
				content="[领取了红包]";
				break;
			case 202:
				content=msg.fromUserName + "撤回了一条消息";
			default://默认 其他
				content="";
				break ;
		}
		if(apiServer.isNull(content)){
			if((99<msg.type&&130>msg.type)||(99<msg.contentType&&130>msg.contentType)){
				//音视频 消息
				 content=msg.content;
			}else if(400<msg.type)
				content="[群控制消息]";
		}
		if(apiServer.isNull(content))
			content="[不支持 请在手机端查看]";
		return content;
	},
	/*转换 群控制消息*/
	converGroupMsg : function(msg) {
		var content =null;
		msg.text=msg.content;
		var appendTime=true;
		switch(msg.type){
			case 83:
			  msg.content=msg.fromUserName+" 领取了你的红包 ";
			  break;
			case 401:
				var fileName=msg.fileName.substring(msg.fileName.lastIndexOf("/")+1);
			  msg.content=msg.fromUserName+" 上传了群文件 "+fileName;
			  break;
			case 402:
			  msg.content=msg.fromUserName+" 删除了群文件 ";
			  break;
			case 901:
			  msg.content=msg.fromUserName+" 群昵称修改为 "+msg.content;
			  break;
			case 902:
			   msg.content="群组名称修改为： "+msg.content;
			  break;
			case 903:
			   msg.content="群组被删除";
			  break;
			case 904:
				if(msg.fromUserId==msg.toUserId)
			 		  msg.content=msg.toUserName+" 已退出群组";
			 	else
			 		 msg.content=msg.toUserName+" 已被移出群组";
			  break;
			case 905:
			   msg.content="新公告为: "+msg.content;
			  break;
			case 906:
				msg.talkTime=msg.content;
				if(0==msg.content||"0"==msg.content)
					 msg.content=msg.toUserName+" 已被取消禁言 ";
				else
			  		 msg.content=msg.toUserName+" 已被禁言 ";
			  break;
			case 907:
				if(msg.fromUserId==msg.toUserId)
			   		msg.content=msg.fromUserName+" 已加入群组";
			   	else msg.content=msg.fromUserName+" 邀请 "+msg.toUserName+" 加入群组";
			  break;
			  case 913:
			  		if(1==msg.content||"1"==msg.content)
					 	msg.content=msg.toUserName+" 被设置管理员 ";
					 else
					 	msg.content=msg.toUserName+" 被取消管理员 ";
			  break;
			case 915:
			  //群已读消息开关
			 	if(1==msg.content||"1"==msg.content){
			  		msg.content=msg.fromUserName+" 开启了显示消息已读人数";
			  	}else
			  	 	msg.content=msg.fromUserName+" 关闭了显示消息已读人数";
			 break;
			case 916:
			  	if(myFn.isNil(msg.content)){
			  		//邀请好友
			  		appendTime=false;
			  		var inviteObj=eval("(" +msg.objectId+ ")");
			  		if("0"==inviteObj.isInvite||0==inviteObj.isInvite){
			  			var count=inviteObj.userIds.split(",").length;
			  			msg.content=msg.fromUserName+" 想邀请 "+count+" 位朋友加入群聊 ";
			  		}else{
			  			msg.content=msg.fromUserName+" 申请加入群聊 ";
					}
			  		msg.content+=GroupManager.createGroupVerifyContent(msg.messageId);
			  	}else{
			  		if(1==msg.content||"1"==msg.content){
			  		msg.content=msg.fromUserName+" 开启了进群验证";
			  	}else
			  	 	msg.content=msg.fromUserName+" 关闭了进群验证";
			  	}
			 break;
			 case 917:
			  //群公开状态
			 	if(1==msg.content||"1"==msg.content){
			  		msg.content=msg.fromUserName+" 修改为隐私群组";
			  	}else
			  	 	msg.content=msg.fromUserName+" 修改为公开群组";
			 break;
			 case 918:
			 	if(1==msg.content||"1"==msg.content){
			  		msg.content=msg.fromUserName+" 开启了显示群成员列表";
			  	}else
			  	 	msg.content=msg.fromUserName+" 关闭了显示群成员列表";
			 break;
			 case 919:
			  if(1==msg.content||"1"==msg.content){
			  		msg.content=msg.fromUserName+" 开启了允许普通群成员私聊";
			  	}else
			  	 	msg.content=msg.fromUserName+" 关闭了允许普通群成员私聊";
			 break;
			 case 920:
			  if(0==msg.content||"0"==msg.content){
			  		msg.content=msg.fromUserName+"已取消全体禁言";
			  	}else{
			  		msg.content=msg.fromUserName+"已开启全体禁言";
			  	}
			 break;
			 case 921:
			  if(1==msg.content||"1"==msg.content){
			  		msg.content=msg.fromUserName+" 开启了允许普通成员邀请好友";
			  	}else
			  	 	msg.content=msg.fromUserName+" 关闭了允许普通成员邀请好友";
			 break;
			 case 922:
			  if(1==msg.content||"1"==msg.content){
			  		msg.content=msg.fromUserName+" 开启了允许普通成员上传群共享文件";
			  	}else
			  	 	msg.content=msg.fromUserName+" 关闭了允许普通成员上传群共享文件";
			 break;
			 case 923:
			  if(1==msg.content||"1"==msg.content){
			  		msg.content=msg.fromUserName+" 开启了允许普通成员召开会议";
			  	}else
			  	 	msg.content=msg.fromUserName+" 关闭了允许普通成员召开会议";
			 break;
			  case 924:
			  if(1==msg.content||"1"==msg.content){
			  		msg.content=msg.fromUserName+" 开启了允许普通成员讲课";
			  	}else
			  	 	msg.content=msg.fromUserName+" 关闭了允许普通成员讲课";
			 break;
			 case 925:
			 	msg.content=msg.toUserName+" 已成为新群主";
			 break;
			default:
				break;
		}
		msg.contentType=msg.type;
		msg.type=10;
		if(true==appendTime)
			msg.content+="  ("+myFn.toDateTime(msg.timeSend/1000)+")";
		console.log(msg.content);
		return msg;
	},
    initConfig:function(){
		mySdk.getConfig(function(result){
			console.log("====> initConfig > "+JSON.stringify(result));
			if(myFn.isNil(result))
				return;
			/*if(result.apiUrl.endWith("/")){
				result.apiUrl+="__";
				result.apiUrl=result.apiUrl.replace("/__","");
			}


			*/


			//AppConfig.apiUrl=result.apiUrl;
			/*
				判断是否 访问 https
			*/
			/*if(AppConfig.apiUrl.startWith("https:")){
				if(result.apiUrl.startWith("https:"))
					AppConfig.apiUrl=result.apiUrl;

				AppConfig.uploadUrl="https://"+AppConfig.boshDomain+":8443"+"/upload/UploadifyServlet";
				AppConfig.uploadAvatarUrl="https://"+AppConfig.boshDomain+":8443"+"/upload/UploadifyAvatarServlet";
				AppConfig.uploadVoiceUrl="https://"+AppConfig.boshDomain+":8443"+"/upload/UploadVoiceServlet";
				AppConfig.deleteFileUrl="https://"+AppConfig.boshDomain+":8443"+"/upload/deleteFileServlet";
			}else{

				AppConfig.apiUrl=result.apiUrl;
				AppConfig.uploadUrl=result.uploadUrl+"upload/UploadifyServlet";
				AppConfig.uploadAvatarUrl=result.uploadUrl+"upload/UploadifyAvatarServlet";
				AppConfig.uploadVoiceUrl=result.uploadUrl+"upload/UploadVoiceServlet";
				AppConfig.deleteFileUrl=result.uploadUrl+"upload/deleteFileServlet";
			}*/


			if(!myFn.isNil(result.meetingHost)){
				AppConfig.meetingHost=result.meetingHost;
			}
			if(!myFn.isNil(result.jitsiServer)){
				AppConfig.jitsiServer=result.jitsiServer;
			}
			AppConfig.uploadUrl=AppConfig.uploadServer+"upload/UploadifyServlet";
			AppConfig.uploadAvatarUrl=AppConfig.uploadServer+"upload/UploadifyAvatarServlet";
			AppConfig.uploadVoiceUrl=AppConfig.uploadServer+"upload/UploadVoiceServlet";
			AppConfig.deleteFileUrl=AppConfig.uploadServer+"upload/deleteFileServlet";
			AppConfig.avatarBase=AppConfig.fileServer+"avatar/o/";
			AppConfig.defaultAvatarUrl=AppConfig.fileServer+"avatar/t/104/10000104.jpg";
			AppConfig.defaultAvatarUrl=AppConfig.fileServer+"image/ic_avatar.png";

			if(myFn.isNil(result.xmppPingTime)){
				myData.keepalive=result.xmppPingTime;
			}

			AppConfig.isOpenReceipt=result.isOpenReceipt;
			if(!myFn.isNil(AppConfig.isOpenReceipt)){
				AppConfig.isOpenReceipt=1;
			}

			AppConfig.isOpenReceipt=1;

			AppConfig.isOpenSMSCode=result.isOpenSMSCode;
			AppConfig.registerInviteCode=result.registerInviteCode;
		});
	},



}
var ivKey=[1,2,3,4,5,6,7,8];
function getStrFromBytes (arr) {
    var r = "";
    for(var i=0;i<arr.length;i++){
        r += String.fromCharCode(arr[i]);
    }
    //console.log(r);
    return r;
}
var iv=getStrFromBytes(ivKey);

function getCurrentSeconds(){
  return Math.round(new Date().getTime() / 1000);
}
  // 时间统一函数
//type  1 上午10:00  否则 10:00
function getTimeText(argument,type,isSecond) {
  if(0==argument)
    return "";
	argument=new Number(argument);
    var timeDesc="";
    var timeSend =0;
    isSecond=1;
    if(1==isSecond){
    	timeSend=new Date(argument*1000);
    }else{
		timeSend=new Date(argument);
    }
   var nowTime=new Date();
   var delaySeconds=((nowTime.getTime())-timeSend.getTime())/1000;
   if(delaySeconds<65){
      if(type){
                  timeDesc="刚刚";
        }else{
             timeDesc=timeSend.format("hh:mm");
        }
   }else if(delaySeconds<60*30){
       if(type){
                 timeDesc=parseInt(delaySeconds/60)+" 分钟前";
        }else{
             timeDesc=timeSend.format("hh:mm");
        }
    }else if(delaySeconds<60*60*24){
        if(nowTime.getDay()-timeSend.getDay()==0){
            //今天
            if(type){
            	timeDesc=(timeSend.getHours()<13 ? "上午":"下午")+timeSend.format("hh:mm");
            }else{
            	 timeDesc=timeSend.format("hh:mm");
            }
    	}else{
            //昨天
            timeDesc="昨天"+timeSend.format("hh:mm");
            // if(type){
            // 	timeDesc=(timeSend.getHours()<13 ? "昨天上午":"昨天下午")+timeSend.format("hh:mm");
            // }else{
            // 	 timeDesc="昨天"+timeSend.format("hh:mm");
            // }
        }
    }else{
    	 if(type){
            	 timeDesc=timeSend.format("MM-dd hh:mm");
            }else{
            	 timeDesc=timeSend.format("MM-dd hh:mm");
            }
    }

    return timeDesc;


}


var MessageType={
  	Type:{
  		/**
     * 消息类型：系统广播消息
     */
     _800:800,// 系统广播
     _801:801,// 活动报名
     _802:802,// 奖励促销
    /**
     * 消息类型：群聊提示消息
     */
     _900:900,// 已进群
     _901:901,// 已退群

    /**
     * 消息类型：商务圈消息
     */
     NEW_COMMENT:600,// 新评论
     _601:601,// 新礼物
     _602:602,// 新赞
     _603:603,// 新公共消息


    /**
     * 消息类型：音视频通话 会议消息
     */
    //单聊 语音
    VOICE_ASK:100,//询问能否接听语音通话
    VOICE_ANSWER:101,//确定可以接听语音通话
    VOICE_CONNECT:102,//接听语音通话  无用
    VOICE_CANCEL:103,//拒绝取消语音拨号
    VOICE_STOP:104,//接通后结束语音通话
    //单聊视频
    VIDEO_ASK:110,//询问能否接听通话
    VIDEO_ANSWER:111,//确定可以接听通话
    VIDEO_CONNECT:112,//接听通话  无用
    VIDEO_CANCEL:113,//拒绝取消拨号
    VIDEO_STOP:114,//接通后结束通话
    //视频会议
    Conference_VIDEO_INVITE:115,//邀请进行视频会议
    Conference_VIDEO_JOIN:116,//加入视频会议
    Conference_VIDEO_EXIT:117,//退出视频会议
    Conference_VIDEO_OUT:118,//踢出视频会议
     //语音会议
    Conference_VOICE_INVITE:120,//邀请进行视频会议
    Conference_VOICE_JOIN:121,//加入视频会议
    Conference_VOICE_EXIT:122,//退出视频会议
    Conference_VOICE_OUT:123,//踢出视频会议




    /**
     * 消息类型：新朋友消息
     */
     SAYHELLO:500,// 打招呼
     PASS:501,// 同意加好友
     FEEDBACK:502,// 回话
     NEWSEE:503,// 新关注
     DELSEE:504,// 删除关注
     DELALL:505,// 彻底删除
     RECOMMEND:506,// 新推荐好友
     BLACK:507,// 黑名单
     FRIEND:508,// 直接成为好友
     REFUSED:509,//取消黑名单

     READ:26, // 是否已读的回执类型
     COMMENT:27, // 通知评论消息
     RED:28, // 红包消息

    // //////////////////////////////以上均为广播消息的类型///////////////////////////////////

    // ////////////////////////////以下为在聊天界面显示的类型/////////////////////////////////
     TEXT:1,// 文字
     IMAGE:2,// 图片
     VOICE:3,// 语音
     LOCATION:4,// 位置
     GIF:5,// gif
     VIDEO:6,// 视频
     SIP_AUDIO:7,// 音频
     CARD:8,// 名片
     FILE:9,//文件
     TIP:10,// 自己添加的消息类型,代表系统的提示

     INPUT:201, // 正在输入消息
     REVOKE:202,
     IMAGE_TEXT:80, // 单条
     IMAGE_TEXT_MANY:81, //多条

     //PINGLUN:42, // 正在输入消息

    // 群聊推送
     CHANGE_NICK_NAME:901,// 修改昵称
     CHANGE_ROOM_NAME:902,// 修改房间名
     DELETE_ROOM:903,// 删除房间
     DELETE_MEMBER:904,// 删除成员
     NEW_NOTICE:905,// 新公告
     GAG:906,// 禁言
     NEW_MEMBER:907// 增加新成员
  	},


}

export default WEBIM;
