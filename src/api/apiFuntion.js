/**
 * api接口统一管理
 */
import { get, post } from 'apiUrl'
//获取好友列表
export const apiAddress = p => post('/friends/page', p);

export const getMyRooms = p => post('/room/list/his', p);

export const getLastChatList = p => post('/tigase/getLastChatList', p);