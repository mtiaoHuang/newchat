<template>
  <div class="main-bar">
    <div class="message-header"  v-show="listItem">
      <div class="name">
        {{header}}<span v-if="$store.state.openIsRoom === 1" class="small-text">({{memberNum}}人)</span>
      </div>
      <div class="message-set" @click="showSet">
        <img width="20px" src="../../../dist/images/more.png">
      </div>
      <div class="setting-box" :class="showSetting?'active':''">
        <div class="setting-contain group" v-show="settingGroup">
          <div class="header">
            <ul>
              <li  v-for="item in groupMember">
                <img class="avatar" :src="item.avatar" width="28px" height="28px" :onerror='imgError' :alt="item.nickname" :title="item.nickname">
                <div class="nickname">{{item.nickname}}</div>
              </li>
            </ul>
            <div class="group-fun">
              <div class="add icon" @click="selectPeople">
                <img src="../../../dist/images/add.png" width="28px" height="28px">
                <div class="nickname" >添加</div>
              </div>
              <div class="remove icon" @click="removePeople(isRole)">
                <img src="../../../dist/images/add.png" width="28px" height="28px">
                <div class="nickname">移除</div>
              </div>
            </div>

          </div>
          <hr>
          <dl>
            <dt>群名称</dt>
            <dd>{{roomName}}</dd>
          </dl>
          <dl>
            <dt>群说明</dt>
            <dd>{{roomDesc}}</dd>
          </dl>
          <dl>
            <dt>群公告</dt>
            <dd>{{roomNotice}}</dd>
          </dl>
          <hr>
          <div class="button-set">
            <button class="btn-red" @click="quitRoom" v-if="isRole !== 1">退出群组</button>
            <button class="btn-red" @click="deleteRoom" v-if="isRole === 1">解散群组</button>
          </div>
        </div>
        <div class="setting-contain member" v-show="settingFriend">
          <div class="header">
            <div class="set-friend">
              <img :src="chatUser.avatar" width="60px" height="60px">
              <div class="friend-name"><strong>{{chatUser.nickName}}</strong></div>
              <div class="friend-desc">{{chatUser.describe}}</div>
            </div>
          </div>
          <hr>
          <dl>
            <dt>性别</dt>
            <dd>{{chatUser.sex}}</dd>
          </dl>
          <dl>
            <dt>生日</dt>
            <dd>{{chatUser.birthday}}</dd>
          </dl>
          <hr>
<!--          <dl>-->
<!--            <dt>消息免打扰</dt>-->
<!--            <dd><input type="radio"></dd>-->
<!--          </dl>-->
<!--          <hr>-->
          <div class="button-set">
            <button class="btn-sub" @click="addBlack">加入黑名</button>
<!--            <button class="btn-sub" @click="cancelBlack">移除黑名单</button>-->
            <button class="btn-red" @click="deleteFriend">删除好友</button>
          </div>
        </div>
      </div>
    </div>
    <div class="empty-item" v-show="blacklistItem">
      <div class="black-list-item">
        <div class="set-friend">
          <img :src="chatUser.avatar" width="60px" height="60px">
          <div class="friend-name"><strong>{{chatUser.nickName}}</strong></div>
          <div class="friend-desc">{{chatUser.describe}}</div>
        </div>
        <div class="button-set">
          <button class="btn-sub" @click="addBlack" v-if="isBlack !== 1">加入黑名</button>
          <button class="btn-sub" @click="cancelBlack" v-if="isBlack === 1">移除黑名单</button>
          <button class="btn-red" @click="deleteFriend">删除好友</button>
        </div>
      </div>
    </div>
    <div class="empty-item" v-show="defaultItem">
      <div class="welcome-center">
        <div class="container">
          <img src="../../../dist/images/newfriends.png" alt="">
          <p>欢迎来到Yline</p>
        </div>
      </div>
    </div>
    <div class="message" v-show="listItem">
      <vuescroll :ops="ops" ref="messageScroll">
      <ul  class="messageList">
        <li v-for="item in items" >
<!--          <p style="text-align: center">Type:{{item.type}}</p>-->
          <p class="time">
            <span>{{item.timeSend | dateFormat}}</span>
          </p>
          <!--对方发言泡泡-->
          <div class="main" v-if="item.fromUserId !== myUserId && item.type<100">
            <img class="avatar" width="36" height="36" :src="getImg(item)" />
            <div class="text images" v-if="item.type === 2"><img :src="item.content" alt="" style="width: 125px" @click="openBig"></div>
            <div class="text images" v-if="item.type === 5"><img :src="item.content" alt="" style="width: 125px"></div>
            <div class="text file" v-if="item.type === 9">
              <div class="file-container">
                <img class="fileIcon" src="../../../dist/images/fileicon.png" alt="" width="50px">
                <div class="file-info">
                  <div class="fileName">{{item.fileName.split("/")[item.fileName.split("/").length-1]}}</div>
                  <div class="fileSize">{{(item.fileSize/1024).toFixed(2)}}KB</div>
                </div>
              </div>
              <div class="file-bottom">
                <div class="fileType"></div>
                <div class="download"><a :href="item.content">下载</a></div>
              </div>
            </div>
            <div class="text" v-if="item.type === 1">{{ item.content }}</div>
            <div class="text" v-if="item.type === 3">[PC端不支持语音消息]</div>
          </div>
          <!--自己发言泡泡-->
          <div class="main self" v-else-if="item.fromUserId === myUserId && item.type<100">
            <img class="avatar" width="36" height="36" :src="getImg(item)" />
            <div class="text images" v-if="item.type === 2"><img :src="item.content" alt="" style="width: 125px"></div>
            <div class="text images" v-if="item.type === 5"><img :src="item.content" alt="" style="width: 125px"></div>
            <div class="text file" v-if="item.type === 9">
              <div class="file-container">
                <img class="fileIcon" src="../../../dist/images/fileicon.png" alt="" width="50px">
                <div class="file-info">
                  <div class="fileName">{{item.fileName.split("/")[item.fileName.split("/").length-1]}}</div>
                  <div class="fileSize">{{(item.fileSize/1024).toFixed(2)}}KB</div>
                </div>
              </div>
              <div class="file-bottom">
                <div class="fileType"></div>
                <div class="download"><a :href="item.content">下载</a></div>
              </div>
            </div>
            <div class="text" v-if="item.type === 1">{{ item.content }}</div>
              <!--<div class="text-tip">已读</div>-->
<!--            </div>-->
          </div>
          <!--通知泡泡-->
          <div class="main notice" v-else>
            <p v-if="item.type === 401">
              {{item.fromUserName}} 上传了群文件：{{item.fileName}}
            </p>
            <p v-if="item.type === 402">
              {{item.fromUserName}} 删除了群文件：{{item.fileName}}
            </p>
            <p v-if="item.type === 902">
              {{item.fromUserName}} 修改群名为:{{item.content}}
            </p>
            <p v-if="item.type === 904">
              {{item.toUserName}} 被踢出群组
            </p>
            <p v-if="item.type === 905">
              {{item.fromUserName}} 发布新公告:{{item.content}}
            </p>
            <p v-if="item.type === 906">
              <span  v-if="!(item.content == 0)">
                {{item.fromUserName}} 对{{item.toUserName}} 设置了禁言，截止{{timeFuntion(item.content)}}
              </span>
                <span v-if="item.content == 0">
                  {{item.fromUserName}} 对{{item.toUserName}} 取消了禁言
              </span>
            </p>
            <p v-if="item.type === 907">
              {{item.fromUserName}} 邀请群成员:{{item.toUserName}}
            </p>
            <p v-if="item.type === 913">
              <span v-if="item.content==1">
                {{item.fromUserName}} 设置{{item.toUserName}} 为管理员
              </span>
                <span v-if="item.content==0">
                {{item.fromUserName}} 取消{{item.toUserName}} 为管理员
              </span>
            </p>
            <p v-if="item.type === 916">
              <span v-if="item.content==1">
                {{item.fromUserName}} motion {{item.toUserName}} forsomeName
              </span>
              <span v-if="item.content==0">
                {{item.fromUserName}} NOmotion {{item.toUserName}} forsomeName
              </span>
            </p>
            <p v-if="item.type === 920">
              已开启全体禁言
            </p>
          </div>
        </li>
      </ul>
      </vuescroll>
    </div>
    <div class="send">
      <div class="toolbar">
        <ul>
          <li class="emoji-fun">
            <a  @click="showEmoji"><img width="24px" height="24px" src="../../../dist/images/expression01.png"></a>
            <div class="emoji" v-show="tabShow">
              <vuescroll :ops="ops">
              <ul>
                <li v-for="emoji in emojis.map">
                  <img slot="icon" :src="(emojis.path+emoji)" @click="selectEmoji(emoji)" alt="" style="width: 30px;max-width: 40px;">
                </li>
              </ul>
              </vuescroll>
            </div>
          </li>
          <li>
            <a href="#" @click="selectFile"><img width="24px" height="24px" src="../../../dist/images/filetransfer.png"></a>
            <input id="fileInput" @change="fileChange" type="file" style="display: none;" ref="file" multiple="multiple">
          </li>
          <li>
            <a href="#" @click="selectImg"><img width="24px" height="24px" src="../../../dist/images/screenshot01.png"></a>
            <input id="photoImg" accept="image/*" @change="imgChange" ref="img" type="file" style="display: none;" >
          </li>
          <li>
            <a href="#" @click="selectAddress"><img width="24px" height="24px" src="../../../dist/images/location01.png"></a>
          </li>
        </ul>
      </div>
      <textarea  v-model="introduct" @input="inputMsg"></textarea>
      <div class="button">
        <button @click="send">发送(S)</button>
      </div>

    </div>

    <select-people v-if="selectCom" v-on:closeSelect="closeSelect" v-bind:groupMember="groupMember" v-bind:refreshCom="refreshCom"></select-people>
    <remove-people v-if="deleteCom" v-on:closeRemove="closeRemove" v-bind:groupMember="groupMember" v-bind:refreshCom="refreshCom"></remove-people>
    <map-components v-if="mapCom" v-on:closeMap="closeMap"></map-components>
    <div class="notice-box" v-show="noticebox">
        {{noticeContent}}
    </div>
  </div>
</template>

<script>
import apiServer from '../../api/apiServer.js'
import apiRequest from "../../api/apiRequest"
import msgRequest from '../../api/msgRequest.js'
import WEBIM from '../../api/webim'
import store from '../../store'
import Vue from 'vue'
import moment from "moment";
import vuescroll from 'vuescroll'
import SelectPeople from "./selectPeople";
import RemovePeople from "./removePeople";
import MapComponents from "./mapComponents";
let token = sessionStorage.getItem('access_token');
let userId = sessionStorage.getItem("userId")
let nickName = sessionStorage.getItem("nickName")
let pageIndex = 0;
let isDirectives=0;// 控制滚动条的初始位置
let toUser=0;
let timeOutEvent = null
let now = null;
export default {
	name:'Chat',
	directives: {

	},
  props:['listName'],
	created() {
    isDirectives=0;
    pageIndex=0;
    let that = this;
    console.log('msg',that.items)
    console.log('toUser',store.state.toUser)
    console.log('ListName',that.listName)
    if(!store.state.toUser){
      console.log('toUser无数据')
      this.defaultItem = true
      this.listItem = false
    }else{
      this.defaultItem = false
      this.listItem = true
      console.log('toUser有数据，存进STATE')
      store.commit("setOpenUserId",store.state.toUser.jid);
      store.commit("setOpenUserName",store.state.toUser.toNickname);
      store.commit("setOpenIsRoom",store.state.toUser.isRoom);
      this.toUser = store.state.toUser
      that.header = store.state.openUserName;
      console.log('state.openUserId',store.state.openUserId)
      console.log('state.openUserName',store.state.openUserName)
      console.log('state.openIsRoom',store.state.openIsRoom)
    }
		//获取群组人数
    if(store.state.toUser) {
      if (this.$store.state.isRoom === 1 || this.$store.state.openIsRoom === 1) {
        this.getChatRoom()
      }
    }
    String.prototype.replaceAll = function(s1,s2){
      return this.replace(new RegExp(s1,"gm"),s2);
    }
    isDirectives = 0;
    setTimeout(() => {
      // this.reload()
    }, 200)
	},

	updated(){
    let that = this
    if(this.noticebox === true){
      setTimeout(function(){
        that.noticebox = false
        console.log('关闭提示')
      },2000);
    }
	},
	mounted(){
    //获取群详细信息
    let that = this
    if(this.items.length===0 && this.toUser !==''){
      that.getChatHistory()
      that.getChatUser()
      console.log('MOUNTED CHAT')
    }
    this.scrollList()
    that.emojis = apiServer.emojis
	},
	data(){
		return {
      defaultItem:true,
      listItem:false,
      blacklistItem:false,
			header:'',// 标题
      //messageItems:[],// 消息数组
      toUserAvatar:'',
      toUserName:'',
      items:[],
			toUserId:'',
      chatUser:[],
      toUser:'',
      isBlack:'',
			myUserId:window.sessionStorage.getItem("userId"),
      introduct:'',
			addShow:true,
			sendButton:true,// 发送按钮
			isopenSmile:true,// 表情
			emojis:[],
			smileShow:false,// 表情是否显示
			showMenus: false,
			imageShow:false,
			BigImage:"",
			voiceShow:false,
			imgError:'this.src="' + require('../../../dist/images/download.png') + '"',
			isReadShow:false,
			style1:{'position':'relative','align-items':'flex-start','justify-content': 'flex-end'},
			style2:{'display':"none"},
			backID:store.state.backID,
			oldVals:null,
			isShowFire:false,//该会话是否开启阅后即焚
			memberNum:'', //群组人数
      groupMember:[], //群组成员列表
      showSetting:false,
      tabShow:false,
      noticebox:false,
      settingGroup:false,
      settingFriend:false,
      selectCom:false,
      deleteCom:false,
      mapCom:false,
      roomName:'',
      roomDesc:'',
      roomNotice:'',
      isRole:0,
      ops: {
        bar: {
          onlyShowBarOnScroll: false,
          keepShow: true,
          background:'#b2b2b2',
        }
      },
      noticeContent:'',
      websocketObj: null,
      wsHeartflag: false,
      reconnectTime: 0,
		}
	},
  watch:{
    // memberNum:function (){
    //   console.log('watch')
    //   let that = this
    //   that.$nextTick(() =>{
    //     that.memberNum = this.memberNum
    //     console.log('群人数',that.memberNum)
    //   })
    // },
			items(newval,oldVal){
				console.log(newval,oldVal,"updateITEMS")
				let that = this
				if(isDirectives!==1){
          this.scrollList()
					setTimeout(() => {
						//this.scrollList()
					}, 200)
				}
				//socket的消息没有recall这个属性
				// for(let i = 0;i<newval.length;i++){
				// 	if(window.sessionStorage.getItem("userId") != newval[i].fromUserId){
				// 		if(i==newval.length -1&&!newval[i].isReadDel){
				// 			msgRequest.sendReadReceipt(newval[i].fromUserId,newval[i],1);
				// 		}
				// 	}
				// 			// 判断messageId是否存在
				// for(let j = 0;j<newval.length-1;j++){

					// if(newval[newval.length-1].recall === newval[j].messageId){
					// 	// console.log(54)
					// 	that.items[j].content[0].data = newval[newval.length-1].content[0].data
					// 	that.items[j] = newval[newval.length-1]
					// 	that.items.pop(that.items[newval.length-1])
					// }
				// }
				// }
				store.commit("setMsgList",that.items);

			},
			//监听对方是否读取消息
			backID(newVal,oldVal){
				let that = this
			  // console.log(44)
				for(let i = 0;i<this.items.length;i++){
					if(newVal.indexOf(this.items[i].messageId)>0){
						this.items[i].isReadShow = true
							store.commit("setMsgList",that.items);
							window.sessionStorage.setItem("backID",JSON.stringify(store.state.backID))
							//$("#chatMsgContent").click()
					}

					// 已读回执变化，界面改变
					if(store.state.showReadNum){
						for(let j = 0;j<newVal.length;j++){
								if(that.items[i].messageId ===newVal[j]&&that.items[i].isReadDel){
											console.log("对方查看了您的这条阅后即焚消息")
											//对方查看了您的这条阅后即焚消息
											let obj = {}
											obj.hasRead = 1
											// console.log(obj,67679)
											that.items.splice(i,1,obj)
										}
										store.commit("setMsgList",that.items)
						}
						  //若变化来自已读回执
							if(that.items[i].hasOwnProperty('readNum')){
									for(let j = 0;j<newVal.length;j++){
											if(that.items[i].messageId ==newVal[j]){
														// 对最新的回执进行已读+1
												if(j==newVal.length-1){
													// console.log("fsfsf")
														that.items[i].readNum++
														window.localStorage.setItem("readNum"+that.items[i].messageId,that.items[i].readNum)
												}
										}
								}

							}else{
								// 若变化来自新来的消息
								that.items[i].readNum = 0
							}
						// that.$refs.Inputcontent.focus()
						}
				}

			},
			delMsg(msg){
				if(msg.fromUserId === this.toUserId){
					//this.$router.push({path:"/Index"})
				}
			},
    },
  computed:{
			timeFuntion(){
				return function(time){
					return apiServer.toDate(time)
				}
			},
			nowtime(){
				return new Date().getTime()
			},
			delMsg(){
				return store.state.delMsg
			},
    },
  filters:{
    dateFormat(val){
      //return moment(val).calendar();
      return moment(val);
    }
  },
	methods:{
    scrollList() {
      this.$nextTick(() => {
        let container = this.$el.querySelector(".messageList");
        //let containerTop = this.$el.querySelector(".message")
        console.log('scrollHeight',container.scrollHeight);
       //containerTop.scrollTop = container.scrollHeight;
        this.$refs.messageScroll.scrollTo(
            {y:container.scrollHeight},0
        )
      })

    },
    showSet() {
      this.showSetting=!this.showSetting;
      let that = this
      if(this.$store.state.isRoom === 1 || this.$store.state.openIsRoom === 1){
        that.settingGroup = true
        that.settingFriend = false
        //console.log('群组设置显示','group=',that.settingGroup,'friend',that.settingFriend,this.$store.state.openIsRoom)
      }else{
        that.settingGroup =false
        that.settingFriend = true
        //console.log('朋友设置显示','group=',that.settingGroup,'friend',that.settingFriend,this.$store.state.openIsRoom)
      }
    },
    showEmoji(){
      this.tabShow = !this.tabShow
    },
		// 点击空白处取消界面其他焦点事件
		cancelKeyboard(){
			if(!apiServer.isNull(this.$refs.Inputcontent)){
				this.$refs.Inputcontent.blur()
			}
			console.log(this.items);
				for(let i = 0;i<this.items.length;i++){
					this.items[i].longShow = false
				}

		},
		smallImage(){
			this.imageShow = false
			this.BigImage = ''
		},
		openBig(img){
				this.BigImage = img
				this.imageShow = true
		},
		/* 输入框获得焦点 */
		onfocus:function(){
			this.showEmoji()
		},
		inputMsg:function(){
			// console.log();
			if(this.introduct.length>0){
				this.addShow = false;
			}
			if(this.introduct.length===0){
				this.addShow = true;
			}
		},
    getChatHistory(){
      let that = this
      apiRequest.getHistory(0,this.$store.state.openIsRoom,null,this.$store.state.toUser.jid,function(data){
        console.log("openIsRoom",store.state.openIsRoom)
        let list=[];
        data = data.reverse();
        for(let i=0;i<data.length;i++){
          //console.log('Message',JSON.parse(data[i].message.replaceAll("&quot;","\"")))
          let s = JSON.parse(data[i].message.replaceAll("&quot;","\""));
          list.push(s);
        }
        that.items = list
        //console.log('list',list)

        // 获取阅后即焚的消息列表
        let readDelRecord = store.state.readDelRecord
        let array = []
        for(let key in readDelRecord){
          if(key === store.state.openUserId){
            array = readDelRecord[key]
          }
        }
        //给阅后即焚消息添加content.type
        for(let i=0;i<array.length;i++){
          if(array[i].type === 1 && typeof(array[i].content)!="object"){
            array[i].content = [{data:array[i].content,type:'txt'}]
          }
        }
        console.log('阅后即焚消息',array)
        //将阅后即焚消息插入消息列表中
        for(let i = 0;i<array.length;i++){
          Vue.set(array[i],"time",10)
          for(let j = 0; j<list.length-1;j++){
            if(array[i].timeSend>list[j].timeSend&&array[i].timeSend<list[j+1].timeSend){
              console.log(66666)
              list.splice(j+1,0,array[i])
            }
            if(array[i].timeSend>list[list.length-1].timeSend){
              console.log(646646)
              list.push(array[i])
            }
          }


        }
        // if(apiServer.isNull(store.state.msgList)){
        store.commit("setMsgList",list);
        // }
        // if(apiServer.isNull(window.sessionStorage.getItem("newMsgUserId"))||window.sessionStorage.getItem("newMsgUserId")==that.toUserId){
        //that.items = store.state.msgList;
        // }
        console.log('当前对话数组',that.items)
        for(let i = 0;i<that.items.length;i++){
          if(window.sessionStorage.getItem("userId") !== that.items[i].fromUserId){
            if(that.items[i].isRead === 0&&!that.items[i].isReadDel){
              msgRequest.sendReadReceipt(that.items[i].fromUserId,that.items[i],1);
            }
          }
          // 若群开启已读人数设置
          // if(store.state.showReadNum){
          //   // console.log(window.localStorage.getItem("readNum"+that.items[i].messageId))
          //   that.items[i].readNum = window.localStorage.getItem("readNum"+that.items[i].messageId,66)
          //   let backID = JSON.parse(window.sessionStorage.getItem("backID"))
          //   for(let j = 0;j<backID.length;j++){
          //     if(that.items[i].messageId === backID[j]&&!that.items.isReadDel){
          //       if(window.localStorage.getItem("readNum"+that.items[i].messageId)){
          //         // that.items[i].readNum = window.sessionStorage.getItem("readNum"+that.items[i].messageId)
          //         that.items[i].readNum = window.localStorage.getItem("readNum"+that.items[i].messageId)
          //       }else{
          //         that.items[i].readNum = 0
          //         window.localStorage.setItem("readNum"+that.items[i].messageId,that.items[i].readNum)
          //       }
          //     }
          //     if(that.items[i].messageId === backID[j]&&that.items[i].isReadDel){
          //       //对方查看了您的这条阅后即焚消息
          //       let obj = {}
          //       obj.hasRead = 1
          //       // console.log(obj,67678)
          //       that.items.splice(i,1,obj)
          //     }
          //   }
          // }
        }
      })
    },
    getChatRoom(){
      let that = this
      if(store.state.toUser) {
        if (this.$store.state.isRoom === 1 || this.$store.state.openIsRoom === 1) {
          store.state.roomId = store.state.myRooms[store.state.toUser.jid].id
          apiRequest.getRoom(store.state.roomId, function (result) {
            //console.log('群组结果', result.data);
            store.commit("setRoomInfo", result.data);
            that.roomName = that.$store.state.roomInfo.name;
            that.roomDesc = that.$store.state.roomInfo.desc;
            that.roomNotice = that.$store.state.roomInfo.notice.text;
            that.memberNum = that.$store.state.roomInfo.members.length
            if (apiServer.isNull(that.roomNotice)) {
              that.roomNotice = "暂无公告";
            }
            that.isRole = result.data.member.role;
            // console.log(that.isRole);
            that.roomId = result.data.id;
            that.roomJid = result.data.jid;
            that.showReadNum = store.state.showReadNum[that.roomJid]
            // let isReadNum = that.$store.state.showReadNum
            // isReadNum[that.roomJid] = false;
            // store.commit("setshowReadNum",isReadNum)
            // that.showReadNum = isReadNum[that.roomJid]
            that.groupMember = result.data.members
            for (let i = 0; i < that.groupMember.length; i++) {
              that.groupMember[i].avatar = apiServer.getAvatarUrl(that.groupMember[i].userId)
            }
            //that.allMember = that.groupMember
          })
        }
      }
    },
    getChatUser(){
      let that = this
      if(store.state.toUser)
        apiRequest.getUser(store.state.toUser.jid,function(result){
          let chatUser = result
          chatUser.birthday = apiServer.toDate(result.birthday);
          chatUser.avatar =  apiServer.getAvatarUrl(store.state.toUser.jid);
          chatUser.nickName = result.nickname;
          chatUser.sex = result.sex===0?"女":'男';
          that.$store.commit("setChatUser",result);
          that.chatUser = result
          console.log('getChatUser',that.chatUser)
        })
      if(store.state.openIsRoom === 0){
        that.isBlack = store.state.isBlack
        console.log('isBlack',that.isBlack)
      }

    },
    refreshCom:function (){
      let that = this
      this.toUser = store.state.toUser
      this.defaultItem = false
      this.listItem = true
      this.showSetting = false
      that.header = store.state.toUser.toNickname;
      that.scrollList()
      that.getChatHistory()
      that.getChatRoom()
      that.getChatUser()
      if(this.$store.state.isRoom === 1 || this.$store.state.openIsRoom === 1){
        that.settingGroup = true
        that.settingFriend = false
        //console.log('群组设置显示','group=',that.settingGroup,'friend',that.settingFriend,this.$store.state.openIsRoom)
      }else{
        that.settingGroup =false
        that.settingFriend = true
        //console.log('朋友设置显示','group=',that.settingGroup,'friend',that.settingFriend,this.$store.state.openIsRoom)
      }
      if(this.toUser.blacklist === 1){
        this.defaultItem = false
        this.listItem = false
        this.blacklistItem = true
      }else{
        this.blacklistItem = false
      }

    },
    selectPeople(){
      this.selectCom = !this.selectCom
      console.log('激活组件')
    },
    removePeople(isRole){
      if(isRole === 1){
        this.deleteCom = !this.deleteCom
      }else{
        this.noticebox = !this.noticebox
        this.noticeContent = '只有管理员才能操作'
      }
    },
    closeSelect(){
      this.selectCom = !this.selectCom
    },
    closeRemove(){
      this.deleteCom = !this.deleteCom
    },
    closeMap(){
      this.mapCom =!this.mapCom
    },
    quitRoom:function(){
      let that = this;
      that.showToast4 = true
      apiRequest.quitRoom(that.roomId,function(result){
        if(result.resultCode===1){
          that.noticeContent = "退出群组成功";
          that.noticebox = true;
          let rooms=that.$store.state.rooms;
          let myRooms=that.$store.state.myRooms;
          delete rooms[that.roomId];
          delete myRooms[that.roomJid];
          store.commit("setMyRooms",myRooms);
          store.commit("setRooms",rooms);
          //维护消息列表
          let list = that.$store.state.lastChatList
          for(let i=0;i<list.length;i++){
            if(list[i].jid === that.roomJid){
              list.splice(i,1)
              break
            }
          }
          that.$store.commit("setLastChatMsg",list)
          //由于退群还会收到一条消息导致角标异常
          let num = parseInt(window.sessionStorage.getItem("sysMsgNum")||0)
          num--
          window.sessionStorage.setItem("sysMsgNum",num)
          setTimeout(function(){
            that.$router.go(-2);
          },600)

        }
      })
    },
    deleteRoom:function(){
      let that = this;
      that.showToast5 = true
      apiRequest.deleteRoom(that.roomId,function(result){
        if(result.resultCode===1){
          that.noticeContent = "解散群组成功";
          that.noticebox = true;
          let rooms=that.$store.state.rooms;
          let myRooms=that.$store.state.myRooms;
          delete rooms[that.roomId];
          delete myRooms[that.roomJid];
          store.commit("setMyRooms",myRooms);
          store.commit("setRooms",rooms);
          //维护消息列表
          let list = that.$store.state.lastChatList
          for(let i=0;i<list.length;i++){
            if(list[i].jid === that.roomJid){
              list.splice(i,1)
              break
            }
          }
          that.$store.commit("setLastChatMsg",list)
          setTimeout(function(){
            store.commit("setToUser",'');
            that.$router.go(-1);
          },600)

        }
      })
    },
    deleteFriend:function(){
      console.log(store.state.toUser.userId)
      let friends = this.$store.state.friendsMap;
      if(apiServer.isNull(friends[store.state.toUser.userId])){
        this.noticeContent = "好友关系不存在";
        this.noticebox = true;
      }
      let that = this;
      apiRequest.deleteFriend(store.state.toUser.userId,function(result){
        if(result.resultCode===1){
          that.Please = "删除成功";
          that.show = true;
          //msgRequest.sendMessage(505,null,null,null,"",that.$route.query.userId,null);
          //维护消息列表角标
          apiServer.setDelMsgNum(that.userId)
          // 维护通讯录列表
          delete friends[store.state.toUser.userId];
          store.commit("setfriendsMap",friends);
          // let msgList = store.state.msgList;
          // for(let i = 0; i<list.length;i++){
          // 	list[i].display = true
          // }
          //维护消息列表
          let msg = store.state.lastChatList
          for(let i = 0;i<msg.length;i++){
            if(msg[i].jid === that.$route.query.userId){
              msg.splice(i,1)
            }
          }
          store.commit("setLastChatMsg",msg)
          that.$forceUpdate();
        }

      })
    },
    // 加入黑名单
    addBlack(){
      let that = this
      let token = sessionStorage.getItem('access_token');
      apiServer.postData({
        url:'/friends/blacklist/add',
        data:{
          access_token:token,
          toUserId:store.state.toUser.toUserId,
        }
      },function(data){
        that.addblack = true
        that.noticebox = true
        that.noticeContent = '加入黑名单成功'
        setTimeout(function(){
          that.$router.go(-1);
          that.noticebox = false
          console.log('关闭info窗口')
          store.commit("setToUser",'');
        },600)
        console.log('要加入黑名单那的ID',store.state.toUser.toUserId)
        console.log('返回的DATA',data)
        let friends = store.state.friendsMap;
        delete friends[store.state.toUser.toUserId];
        store.commit("setfriendsMap",friends);
        let news = store.state.lastChatList;
        for(let i=0;i<news.length;i++){
          if(news[i].jid === that.userId){
            news.splice(i,1)
          }
        }
        store.commit("setLastChatMsg",news);
        apiRequest.getBlackList(null,null,function(data){
          store.commit("setBlackList",data);
        })
        apiServer.setDelMsgNum(that.userId)
      })
    },
    // 移出黑名单
    cancelBlack(){
      let that = this
      let token = sessionStorage.getItem('access_token');
      apiServer.postData({
        url:'/friends/blacklist/delete',
        data:{
          access_token:token,
          toUserId:store.state.toUser.toUserId
        }
      },function(data){
        console.log('移除黑名单返回数据',data)
        apiRequest.getMyFriends(function(){
          // that.$router.go(-1)
        })
        setTimeout(function(){
          that.$router.go(0);
          that.noticebox = false
          console.log('关闭info窗口')
        },600)
        that.noticebox = true;
        that.noticeContent = '移除黑名单成功';
        let news = store.state.lastChatList;
        news.unshift(apiServer.getOneMsg(that.userId,that.nickName,"我们又是好朋友了"))
        store.commit("setLastChatMsg",news);
        apiRequest.getBlackList(null,null,function(data){
          store.commit("setBlackList",data);
        })
      })
    },

    send:function(type,text,fileName,fileSize){
      // this.$refs.Inputcontent.focus()
      // setTimeout(() => {
      // 	this.$refs.my_scroller.scrollBy(0,700,true)
      // }, 100)
      console.log(this.introduct);
      let content ="";
      // var fileName = "";
      // var fileSize = "";
      // 清空文本框、隐藏发送按钮
      if(type===1){
        content = this.introduct;
        console.log(content,77)
      }else if(type===2){// 图片
        content = text;
      }else if(type===9){// 文件
        content = text;
      }
      console.log(this.toUserId)

      let msg=msgRequest.sendMessage(type,fileName,fileSize,null,content,this.toUserId,this.header);
      if(WEBIM.isEncrypt(msg)){
        msg.content=WEBIM.decryptMessage(msg);
      }
      let mess = msg.content
      console.log(mess,msg.content,"kankana啊啊啊啊啊啊啊啊啊")
      if(type===1){
        msg = msgRequest.changeText(msg);
      }
      store.commit("setMsgListOne",msg);
      if(msg.isReadDel === 1){
        let list = store.state.readDelRecord
        if(apiServer.isNull(list[msg.toUserId])){
          list[msg.toUserId] = []
        }
        list[msg.toUserId].push({})
        Object.assign(list[msg.toUserId][list[msg.toUserId].length-1],msg)
        list[msg.toUserId][list[msg.toUserId].length-1].content = msg.content[0].data
        store.commit("setReadDelRecord",list)
      }
      // 发送消息后更新消息界面此会话的最新条消息
      let lastList = store.state.lastChatList
      let flag = false
      for(let i = 0;i<lastList.length;i++){
        // console.log(9,lastList[i].from,store.state.openUserId)
        if(lastList[i].jid === store.state.openUserId){
          console.log(9,lastList[i],msg)

          // for(let h = 0;h<mess.content;h++){
          // 	if(mess.content[h].type=="emoji"){
          // 		console.log("是表情啊")
          // 		Vue.set(lastList[h],'isemoj', true)
          //    }else{
          // 	   	Vue.set(lastList[h],'isemoj', false)
          //    }
          // }
          if(msg.type===1){
            lastList[i].content =mess
          }else{
            lastList[i].content = mess.content[0].data
          }
          //这个id肯定是要保存的，就是不明白为什么不把整条msg保存起来
          lastList[i].messageId = msg.messageId
          lastList[i].isReadDel = msg.isReadDel
          let last = lastList[i]
          lastList.splice(i,1)
          lastList.unshift(last)
          let flag = true
          // console.log(msg,76)
        }
      }
      // if(!flag){
      // 	let newM = apiServer.getOneMsg(msg.toUserId,this.$route.query.toUser.toNickName)
      // 	if(msg.type==1){
      // 		newM.content = mess
      // 	}else{
      // 		newM.content = mess.content[0].data
      // 	}
      // 	newM.type = msg.type
      // 	newM.isReadDel = msg.isReadDel
      // 	newM.isRoom = msg.isRoom
      // 	newM.messageId = msg.messageId
      // 	// 待改 将msg转化成lastList中的一项
      // 	lastList.unshift(newM)
      // }
      console.log("看看lastlist",lastList)
      //若消息列表没有该会话，则添加该会话记录
      store.commit("setLastChatMsg",lastList)
      // this.items.push(msg);
      this.introduct ="";
      this.addShow = true;
      isDirectives=0;
      if(this.isShowVoice){
        this.$refs.Inputcontent.focus()
      }
      //  this.$forceUpdate()
      // this.reload()


    },
    sendMsg(){

    },



		refresh:function(){
			console.log("下拉刷新");
			isDirectives=1;
			var that = this;
			//this.$refs.my_scroller.finishPullToRefresh();
			console.log(pageIndex);
			pageIndex = pageIndex+1;

			apiRequest.getHistory(pageIndex,this.$store.state.openIsRoom,null,this.toUserId,function(data){
				console.log("item 长度为哦0")
				var list=[];
				data = data.reverse();
				for(var i=0;i<data.length;i++){
					// console.log(55555)
					var s = JSON.parse(data[i].message.replaceAll("&quot;","\""));
					s.content =WEBIM.decryptMessage(s);
					if(s.type==1){
						s =msgRequest.changeText(s)
					}
					if(s.type==5){// gif
						s.content = "/static/assets/gif/"+s.content;
					}
					if(s.type==8){// 名片消息
						s.avatar = apiServer.getAvatarUrl(s.objectId);
					}
					if(s.type==83){
						continue;// 某个成员领取红包
					}
					if(s.type==86){
						continue;// 红包退回通知
					}
// 					if(s.type>100){
// 						continue;// 音视频消息
// 					}
					s.isRead = data[i].isRead;
					list.push(s);
				}

				list = list.concat(that.$store.state.msgList)
				for(let i = 0; i<list.length;i++){
					list[i].display = true
				}
				console.log(that.$store.state.msgList,11)

				// if(apiServer.isNull(that.$store.state.msgList)){
				store.commit("setMsgList",list);
				// }

				that.items = that.$store.state.msgList;
				// console.log(that.items)
					// for(let i = 0;i<that.items.length;i++){
					// if(window.sessionStorage.getItem("userId") != that.items[i].fromUserId){
					// 	console.log(that.items[i])
					// 	msgRequest.sendReadReceipt(that.items[i].fromUserId,that.items[i],1);
					// }

				}

			)

		},

		// 获取聊天界面好友头像
		getImg:function(item){
			if(apiServer.isNull(item.receiver)){
				return apiServer.getAvatarUrl(item.fromUserId);
			}else{
				return apiServer.getAvatarUrl(item.receiver);
			}

		},
		// 获取我的头像
		getMyImg:function(){
			return apiServer.getAvatarUrl(window.sessionStorage.getItem("userId"));
		},
		// 选择表情
		selectEmoji:function(emoji){
			console.log(emoji);
			let txt="";
			for(let key in apiServer.emojis.map){
				if(apiServer.emojis.map[key]===emoji){
					console.log("表情的key:",key);
					txt=key;
				}
			}
      this.introduct =this.introduct+txt;
			//输入框获取焦点
			this.inputMsg();
		},
		selectImg:function(){
			console.log("选择图片")
			this.$refs.img.click();
		},
		// 发送位置
		selectAddress:function(){
      this.mapCom = true
      console.log('打开地图')
		},
		// 选择文件
		selectFile:function(){
			console.log("选择文件")
			this.$refs.file.click();
		},
		// 发送图片
		imgChange:function(){
			//var file=$("#photoImg")[0].files[0];
      let file = this.$refs.img.files[0]
			console.log(file,7777799)
			let formData = new FormData();
			let that = this;
			formData.append("file",file);
			formData.append("validTime",0);
			console.log("上传图片",formData)
			apiServer.postFile({
				data:formData
			},function(result){
				console.log('未设置发送函数send()');
				console.log(result.data.data.images[0].oUrl);
				//that.send(2,result.data.data.images[0].oUrl,null,null);
        //that.introduct = result.data.data.images[0].oUrl
			})
		},
		// 发送文件
		fileChange:function(){
			let file = this.$refs.file.files[0]
			console.log("上传文件");
			let formData = new FormData();
			let that = this;
			let fileSize = file.size;
			formData.append("file",file);
			apiServer.postFile({
				data:formData
			},function(result){
				console.log(result)
				if(!apiServer.isNull(result.data.data.others[0])){
					console.log(result.data.data.others[0].oUrl);
          console.log('文件类型=其他');
					//that.send(9,result.data.data.others[0].oUrl,result.data.data.others[0].oFileName,fileSize);
				}else if(!apiServer.isNull(result.data.data.images[0])){
          console.log('文件类型=图片');
					console.log(result.data.data.images[0].oUrl);
					//that.send(9,result.data.data.images[0].oUrl,result.data.data.images[0].oFileName,fileSize);
				}else if(!apiServer.isNull(result.data.data.audios[0])){
          console.log('文件类型=音频');
					console.log(result.data.data.audios[0]);
					//that.send(9,result.data.data.audios[0].oUrl,result.data.data.audios[0].oFileName,fileSize);
				}else if(!apiServer.isNull(result.data.data.videos[0])){
          console.log('文件类型=视频');
					console.log(result.data.data.videos[0]);
					//that.send(9,result.data.data.videos[0].oUrl,result.data.data.videos[0].oFileName,fileSize);
				}
			})
		},

		// 点击用户头像进入详情
		userInfo:function(item){
			// console.log(item.fromUserId);
			this.$router.push({path:'/UserInfo',query:{userId:item.fromUserId}});
		}

	},
	components:{RemovePeople, SelectPeople, vuescroll,MapComponents}
}
</script>

<style lang="less">
.small-text{
  font-size: 14px;
  color: #888888;
}
.main {
  position: relative;
  overflow: hidden;
  //background-color: #eee;
  //display: flex;
  //flex-direction: column;
  //width: 100%;
}
.main-bar {
  width: 537px;
  position: relative;
  .notice-box {
    position: absolute;
    top: 0;
    left: 50%;
    box-shadow: 1px 2px 10px #888888;
    background: #d73a49;
    border-radius: 4px;
    padding: 10px;
    color: #ffffff;
    transform: translate(-50%, 10px);
    z-index: 999999;
    font-size: 12px;
  }
}
.message-header{
  height: 70px;
  padding: 20px;
  border-bottom: 1px solid #ddd;
  background: #f7f7f7;
  .message-set {
    float: right;
    padding: 2px;
    cursor: pointer;
  }
  .setting-box {
  position: absolute;
  right: 0;
  top: 70px;
  z-index: 99;
  background: #ffffff;
  width: 234px;
  padding: 18px;
  height: 530px;
  box-shadow: 1px 0 6px rgba(0, 0, 0, 0.16);
  transform: translate(200%, 0);
  transition: transform .3s;
    &.active{
       transform: translate(0, 0);
     }
    hr{
      border-color: #d9d9d9;
      border-top: none;
    }
    .header{
      margin-bottom: 24px;
      .set-friend {
        text-align: center;
        width: 100%;
        img{
          border-radius: 4px;
        }
      }
    ul{
      //display: block;
      li{
        display: inline-block;
        width: 25%;
        height: 48px;
        padding: 0 5px;
        margin: 5px 0;
          img{
            display: block;
            margin: 0 auto;
            border-radius: 50%;
          }
          .nickname{
            text-align: center;
            font-size: 12px;
            width: 100%;
            zoom: 0.9;
            line-height: 1.4;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      .group-fun{
        display: table;
        .icon{
          float: left;
          padding: 0 10px;
        }
        .nickname{
          text-align: center;
          font-size: 12px;
          width: 100%;
          zoom: 0.9;
          line-height: 1.4;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
dl{
dt{
  font-weight: bold;
  width: 95px;
  display: inline-block;
}
dd{
  text-align: right;
  display: inline-block;
  width: 95px;
  margin: 0;
  color: #969CA2;
}
}

}
  .name{
    font-size: 22px;
    font-weight: 500;
    line-height: 30px;
    float: left;
  }
}

.message {
  //overflow-y: scroll;
  background: #f7f7f7;
  height: 370px;
  .messageList {
    padding: 10px 16px;
  }
  li {
    margin-bottom: 15px;
  }
  .time {
    margin: 7px 0;
    text-align: center;

    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #fff;
      border-radius: 4px;
      background-color: #dcdcdc;
      line-height: 18px;
    }
  }
  .avatar {
    float: left;
    margin: 0 10px 0 0;
    border-radius: 3px;
  }
  .text {
    display: inline-block;
    position: relative;
    padding: 10px;
    max-width: ~'calc(100% - 88px)';
    min-height: 30px;
    line-height: 1.4;
    font-size: 14px;
    text-align: left;
    word-break: break-all;
    background-color: #ffffff;
    border-radius: 4px;
    &:before {
       content: " ";
       position: absolute;
       top: 9px;
       right: 100%;
       border: 6px solid transparent;
       border-right-color: #fafafa;
     }

  }

.self {
  text-align: right;
  .text-tip {
    position: absolute;
    left: -36px;
    top: 0;
    background: #00c9b2;
    border-radius: 4px;
    height: 20px;
    line-height: 20px;
    font-size: 10px;
    text-align: center;
    padding: 0 4px;
  }
  .avatar {
    float: right;
    margin: 0 0 0 10px;
  }
  .text {
    background-color: #00C9B2;
    color: #FFFFFF;
    &:before {
       right: inherit;
       left: 100%;
       border-right-color: transparent;
       border-left-color: #00C9B2;
     }
    &.file{
      background-color: #ffffff;
      color: #000000;
      &:before{
        border-left-color: #ffffff;
      }
    }
    .fileIcon{
      float: right;
    }

  }

}

}
.empty-item{
  position: relative;
  height: 100%;
}
.welcome-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  text-align: center;
}
.message .messageList .text.images{
  background-color: transparent;
  padding: 0;
  &:before{
    content: none;
  }
}
.send {
  height: 160px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
textarea {
  padding: 10px;
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  font-family: "Micrsofot Yahei";
  resize: none;
}
}
.toolbar{
  background: #ffffff;
  border-top: 1px solid #ddd;
  position: relative;
  ul{
    margin-left: 8px;
    margin-top: 5px;
    display: flex;
    li{
      padding: 5px 8px 0 8px;
      img{

      }
    }
  }
  .emoji{
    position: absolute;
    bottom: 51px;
    left: 10px;
    background: #ffffff;
    width: 342px;
    height: 264px;
    overflow: hidden;
    box-shadow: 2px 2px 10px #000000;
    border-radius: 4px;
    padding: 10px 0 10px 10px;
    ul{
      display: block;
      margin: 0;
      li{
        display: inline-block;
      }
    }
  }
}
.button {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  padding: 5px 18px 18px;
button{
  font-size: 12px;
  background: #ffffff;
  border-radius: 4px;
  padding: 2px 12px;
  color: #2C2F43;
  text-align: center;
  height: 22px;
  line-height: 18px;
  border: 1px solid #969CA2;
}
}
.button-set{
  text-align: center;
  margin-top: 24px;
  button{
    border: none;
    color: #ffffff;
    border-radius: 4px;
    padding: 4px 19px;
    width: 108px;
    margin: 6px 0;
  }
  .btn-sub {
    background: #00C9B2;
  }
  .btn-red{
    background: #EF4E4E;
  }
}
.file-container{
  width: 200px;
  .fileIcon{
    float:left
  }
  .file-info {
    padding: 10px 5px;
  }
  .fileName,.fileSize{

  }
  .fileSize{
    color: #b7b7b7;
    font-size: 12px;
  }
}
.file-bottom {
  color: #888888;
  font-size: 12px;
  border-top: 1px solid #eee;
  padding: 3px 10px;
  margin-top: 3px;
  clear: both;
  .fileType {

  }
  .download{
    text-align: right;
    a{
      color: #5c5c5c;
      padding: 3px 5px;
      /* background: #ababab; */
      border-radius: 4px;
      text-decoration: none;
      text-align: center;
      border: 1px solid;
      display: block;
    }
  }

}
.main.notice {
  text-align: center;
  p{
    background: #dcdcdc;
    display: inline-block;
    color: #ffffff;
    padding: 2px 6px;
    border-radius: 4px;
    margin-top: 0;
  }
}
.black-list-item {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  text-align: center;
}
</style>
