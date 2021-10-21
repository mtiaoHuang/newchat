<template>
  <div id="container">
    <div class="wrap">
      <div class="left-content"></div>
      <div class="right-content">
        <div class="title click-pointer" @click="goLogin">登录</div>
        <div class="title active">注册</div>
        <div class="form">
          <label>
            <input class="phone" type="text" placeholder="请输入手机号" v-model="phoneNumber">
          </label>
          <label>
            <input class="password" type="text" placeholder="请输入密码" v-model="password">
          </label>
          <label>
            <input class="catha" type="text" placeholder="请输入验证码" v-model="confirm">
            <span class="send-verify click-pointer" @click="cather">发送验证码</span>
          </label>
          <div class="button-bar">
            <button class="btn-login click-pointer" @click="indexReg">注册</button>
          </div>
          <div >{{showText}}</div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import apiServer from "../../api/apiServer";
import apiRequest from "../../api/apiRequest";
let timer = null
export default {
  created() {
    let that = this
    apiRequest.resConfig(function (data) {
      if(data.data.isOpenSMSCode){
        that.showConfig = true
      }
    })
    //clearInterval(timer)
  },
  methods:{
    goLogin(){
      this.$router.push({path:'/login'});
    },
    indexReg(){
      let that = this
      if(this.phoneNumber === ""){
        this.showText = "请输入手机号码"
      }else if(this.password === "") {
        this.showText = "请输入密码"
      // }else if(this.chart === ""&&this.showConfig===true){
      //   this.showText = "请输入图形码"
      }else if(this.confirm === ""&&this.showConfig===true){
        this.showText = "请输入验证码"
      }else{
        if(this.showConfig){
          //this.chart = this.$refs.chart.value;
          if(this.confirmCode === this.confirm){
            this.showText = "注册成功"
            this.show = true
            this.$router.push({path:'/index'});
          }else{
            this.showText = "验证码错误"
            console.log('验证码',this.confirmCode)
          }
        }else{
          apiServer.postData({
            url:'/verify/telephone',
            data:{
              telephone:that.phoneNumber,
              areaCode:that.dialCode
            }
          },function(result){
            if(!result.resultCode){
              that.showText = "手机号码已注册"
              that.show = true
            }else{
              that.showText = "注册成功"
              that.show = true
              //that.$router.push({path:'/FunInfo',query:{telephone:that.pnumber,password:md5(that.password)}});
              that.$router.push({path:'/index'})
            }
          })
        }

      }
    },
    cather(){
      let that = this
      //this.chart = this.$refs.chart.value;
      if(this.phoneNumber === ""){
        this.show = true
        this.showText = "请输入手机号码"
      }else if(this.password === "") {
        this.show = true
        this.showText = "请输入密码"
      // }else if(this.chart === ""){
      //   this.show = true
      //   this.showText = "请输入图形码"
      }else{
        apiServer.postData({
          url:'/verify/telephone',
          data:{
            telephone:that.phoneNumber,
            areaCode:that.dialCode
          },
        },function(result){
          if(result.resultCode===1){
            apiServer.postData({
              url:'/basic/randcode/sendSms',
              data:{
                version: 1,
                areaCode:that.dialCode,
                imgCode:that.chart,
                telephone:that.phoneNumber,
                isRegister:0
              }
            },function(data){
              console.log("点击发送返回的数据",data);
              if(data.resultCode === 1){
                that.confirmCode = data.data.code
                // that.confirm = that.confirmCode
                // console.log(that.confirmCode)
                that.showText = "发送成功"
                that.show = true
                // 发送成功后按钮禁用
                that.ifDisable = false
                // that.confirm = that.resultCode
                //$(".Ysubmit").attr("disabled", "true");
                // 设置60秒内倒计时发送
                let index = 60
                timer = setInterval(function(){
                  index--
                  if(index < 0){
                    clearInterval(timer)
                    //$(".Ysubmit").text("发送")
                  }
                  if(index === 30){
                    that.Code = true
                  }
                  if(index>=0){
                    //$(".Ysubmit").text(index)
                  }else{
                    index = 0
                  }
                },1000)
                // 30秒后触发 无法发送验证码？
                setTimeout(function(){
                  that.ifDisable = true
                },30000)
                // 60秒后禁用取消，才可重新发送
                setTimeout(function(){
                  //$(".Ysubmit").removeAttr("disabled")
                },60000)
              }else{
                // 若验证码错误次数超过5次，则30秒后再发送
                that.count++
                that.showText = "验证码错误"
                that.show = true
                // if(that.count >= 5){
                // 	that.showText = "请不要频繁发送验证码,请30秒后再次发送"
                // 	that.show = true
                // 	$(".Ysubmit").attr("disabled", "true");
                // 	// 按钮30秒内禁用
                // 	setTimeout(function(){
                // 		that.count =0
                // 		$(".Ysubmit").removeAttr("disabled");
                // 	},30000)
                // }else{
                // 	that.showText = "图形验证码错误"
                // 	that.show = true
                // }
              }
            })
          }else if(result.resultCode === 1040107){
            that.showText = "手机号已注册"
            that.show = true
          }
        })
      }
      // this.show = true
    },
  },
  data() {
    return {
      phoneNumber:"",
      password:"",
      chart:"",
      confirm:"",
      show:false,
      showText:"",
      tel:'',
      ifDisable:true,
      Code:false,
      count:0,
      confirmCode:"",
      showConfig:false,
      dialCode:"86",
      timer:null
    }
  },
  name: 'Register'
}
</script>
<style lang="less" scoped>
.click-pointer{
  cursor: pointer;
}
#container{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: #e6e6e6;
  .wrap{
    background: #ffffff url("../../../dist/images/bg.png") no-repeat;
    background-size: auto 600px;
    width: 830px;
    height: 600px;
    border-radius: 10px;
    display: flex;
    .left-content {
      width: 50%;
    }
    .right-content{
      width: 50%;
      padding: 20px;
      text-align: center;
      .title {
        display: inline-block;
        width: 142px;
        font-size: 28px;
        font-weight: bold;
        text-align: center;
        margin: 70px 0;
        position: relative;
        &.active{
          color: #00C9B2;
          &:after {
            content: "";
            background: #00c9B2;
            position: absolute;
            width: 60px;
            height: 4px;
            bottom: 0;
            border-radius: 6px;
            left: 50%;
            transform: translate(-50%, 14px);
          }
        }

      }
      .form{
        label {
          position: relative;
          input{
            margin: 12px;
            width: 290px;
            height: 40px;
            border-radius: 32px;
            background: #F6F7FB;
            border: none;
            padding: 9px 20px;
            color: #AEB7C1;
            outline: none;

          }
          .send-verify {
            position: absolute;
            right: 36px;
            top: -1px;
            color: #00C9B2;
          }
        }
        .bottom p:nth-child(2) {
          text-align: right;
        }

        .bottom p {
          display: inline-block;
          text-align: left;
          width: 135px;
          margin: 0;
        }
      }
      .button-bar{
        margin-top: 48px;
        .btn-login {
          font-size: 16px;
          width: 290px;
          height: 40px;
          color: #ffffff;
          border-radius: 48px;
          border: navajowhite;
          background: linear-gradient(
              135deg
              , #00E699 0%, #1CD0BB 100%);
        }
      }


    }
  }
}
</style>