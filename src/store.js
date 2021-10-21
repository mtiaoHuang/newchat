/**
 * Vuex
 * http://vuex.vuejs.org/zh-cn/intro.html
 */
import Vue from 'vue';
import Vuex from 'vuex';
import Axios from "axios";
//import apiUrl from '../src/api/apiUrl'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // 初始化状态
        userId:'',//登陆用户的id
        access_token:'',//登陆用户的token
        sysMsgNum:0,// 系统消息数量
        friendsMsgNum:[], // 好友消息数量列表 userId
        friendsMap:{}, // 好友列表
        myRooms:{}, // 使用jid保存
        rooms:{},// 使用id保存
        lastChatList:[], // 最后一条消息记录列表
        msgList:[],// 消息列表保存某一个人的消息列表
        newMsgList:[],// 最新一条消息列表
        openUserId:"",// 会话窗口userId
        openUserName:"", // 会话窗口userName
        openIsRoom:0,// 会话窗口是否为群组
        roomInfo:{},// 群组信息
        roomId:"",//最新打开群组的jid
        allMember:[],//最新打开群组的群成员信息
        newFriendMsgList:null,//新的好友验证消息列表
        newMessageJid:null,//新消息的jid
        backID:[],//message已读ID
        blackList:[], //黑名单列表
        showReadNum:{} ,//已读人数个数
        readDel:{},//开启阅后即焚的会话
        readDelRecord:{},//每个会话的阅后即焚记录
        delMsg:{},//记录收到505那条消息
        newMyRooms:'',
        newRooms:'',
        // 当前选中的会话
        currentSessionId: 1,
        currentGroupId: 1,
        // 过滤出只包含这个key的会话
        filterKey: ''
    },
    mutations: {
        setfriendsMap(state,map){
            for(let i=0;i<map.length;i++){
                let obj=map[i];
                state.friendsMap[obj.toUserId] =obj;
            }
            sessionStorage.setItem("friendsMap",JSON.stringify(state.friendsMap));
            // sessionStorage.setItem("friendsMap",state.friendsMap);

        },
        setRoomList(state,list){
            for(let i=0;i<list.length;i++){
                let obj=list[i];
                state.myRooms[obj.jid]=obj;
                state.rooms[obj.id]=obj;
            }
        },
        setMyRooms(state,map){
            state.myRooms = map;
            sessionStorage.setItem("myRooms",map);
        },
        setRooms(state,map){
            state.rooms = map;
        },
        setNewRoomList(state,list){
                state.newMyRooms = list;
        },
        setLastChatMsg(state,list){
            state.lastChatList = list;
            sessionStorage.setItem("lastChatList",list);
        },
        setNewLastChatMsg(state,list){
            state.newLastChatList = list;
            sessionStorage.setItem("newLastChatList",list);
        },
        setUserId(state,userId){
            state.userId = userId;
        },
        setAccess_token(state,access_token){
            state.access_token = access_token;
        },
        setOpenUserId(state,userId){
            state.openUserId = userId;
        },
        setOpenUserName(state,userName){
            state.openUserName = userName;
        },
        setOpenIsRoom(state,isRoom){
            state.openIsRoom = isRoom;
        },
        setToUser(state,toUser){
            state.toUser = toUser;
        },
        setIsBlack(state,isBlack){
            state.isBlack = isBlack
        } ,
        setChatUser(state,chatUser){
            state.chatUser = chatUser;
        },
        setMsgList(state,list){
            for(let i = 0; i<list.length;i++){
                // list[i].longShow = false
                Vue.set(list[i],'longShow', false)
                Vue.set(list[i],'display', true)
                //这个判断确保赋值一次
                if(list[i].time===undefined){
                    Vue.set(list[i],"time",10)
                }
                // list[i].display = true
                // list[i].setWords = false
            }
            state.msgList = list;
        },
        setMsgListOne(state,msg){
            state.msgList.push(msg);
        },
        setRoomInfo(state,room){
            state.roomInfo = room;
        },
        setBlackList(state,list){
            state.blackList = list
        },
        setNewUser(state,list){
            state.toNewUser = list
        }

    },
    getters:{
        getUserId(state){
            return state.userId;
            },
        getAccess_token(state){
            return state.access_token;
        }
    },
    actions: {
        toUserData(state){
            return state.toUser
        },
    }

});

store.watch(
    (state) => state.toUser,
    (val) => {
        console.log('CHANGE: ', val);
        //sessionStorage.setItem('vue-chat-session', JSON.stringify(val));
        sessionStorage.setItem('toUser', JSON.stringify(val));
        //this.$store.commit("setToUser",val);

    },
    {
        deep: true
    }
);
export default store;
export const actions = {

    initData: ({ dispatch }) => dispatch('INIT_DATA'),
    friendData: ({ dispatch }) => dispatch('setfriendsMap'),
    initGroupData: ({ dispatch }) => dispatch('INIT_GROUP_DATA'),
    sendMessage: ({ dispatch }, content) => dispatch('SEND_MESSAGE', content),
    sendGroupMessage: ({ dispatch }, content) => dispatch('SEND_GROUP_MESSAGE', content),
    selectSession: ({ dispatch }, id) => dispatch('SELECT_SESSION', id),
    selectGroupSession: ({ dispatch }, id) => dispatch('SELECT_GROUP_SESSION', id),
    search: ({ dispatch }, value) => dispatch('SET_FILTER_KEY', value),
};
