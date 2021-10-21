export function socketConnect(_this) {
    let websocketUrl = "ws://1.14.180.113:526";
    let ws = new WebSocket(websocketUrl);
    ws.onopen = function () {
        // Web Socket 已连接上，使用 send() 方法发送数据
        console.log('数据发送中...')
    },
        ws.onmessage = function (e) {
            let toFrom = '';
            //数据接收
            console.log("数据接收开始");
        },
        ws.onclose = function () {
            // 关闭 websocket
            console.log('连接已关闭...')
        },
        // 组件销毁时调用，中断websocket链接
        _this.socketOver = () => {
            ws.close()
        }
    _this.websocket = ws;

}
export function socketSend(type, wsContent, result, _this) {
    _this.websocket.socketSend = function (type, wsContent, result) {
        let wsData = {};
        wsData = {
            "chatType": type,//1:单聊；2：群聊
            "cmd": 11,
            "content": {
                "result": result, //执行成功或者失败 
                "message": wsContent //执行返回的信息
            },
            "createTime": "",
            "from": "bsEditor",
            "groupId": "1625",
            "msgType": "0",

        }

        _this.websocket.send(JSON.stringify(wsData));

    }
    _this.websocket.socketSend(type, wsContent, result);
}