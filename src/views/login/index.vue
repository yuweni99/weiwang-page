<template>
  <div class="login-container">
    <div class="login-qrcode-container">
      <div class="title-container">
        <h3 class="title">微网平台</h3>
      </div>
      <div class="qrcode-container">
        <div v-if="qrCodeShowFlag" ref="qrCodeDiv" class="qrcode" />

        <div v-show="expiresFlag" class="expire">
          <el-button type="primary" icon="el-icon-refresh" @click="getQrCodeLoginKey">
            重新加载
          </el-button>
        </div>

        <div v-show="confirmLoginFlag" class="confirm-login">
          <img src="@/assets/successScan.png" alt="">
          <p>扫描成功</p>
          <p>请在手机上[确认登录]</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { getQRCodeLoginData, getQrCodeLoginKey } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      qrCodeKey: '',
      expiresFlag: false,
      qrCodeShowFlag: false,
      confirmLoginFlag: false,
      redirect: undefined,
      loginType: 'weiWangLogin',
      interval: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // this.$store.dispatch('user/autoLogin', { token: 'fa04d5d7cde447878afb5078f8c8f9a4', userId: 1000 })
    this.getQrCodeLoginKey()
  },
  destroyed() {
    // 清理定时器
    this.interval && clearInterval(this.interval)
  },
  methods: {
    getQrCodeLoginKey() {
      this.confirmLoginFlag = false
      this.expiresFlag = false
      this.qrCodeShowFlag = false

      const loginType = this.loginType
      getQrCodeLoginKey({ loginType }).then(res => {
        const { qrCodeKey } = res.data
        this.qrCodeKey = qrCodeKey

        const qrCodeContent = `https://www.micronet.link?action=${loginType}&qrCodeKey=${qrCodeKey}`
        this.loadQrCode(qrCodeContent)
        this.loopCheckLoginStatus()
      })
    },
    // 加载二维码
    loadQrCode(content) {
      this.qrCodeShowFlag = true

      this.$nextTick(() => {
        new QRCode(this.$refs.qrCodeDiv, {
          text: content,
          width: 200,
          height: 200,
          colorDark: '#333333', // 二维码颜色
          colorLight: '#ffffff', // 二维码背景色
          correctLevel: QRCode.CorrectLevel.L// 容错率，L/M/H
        })
      })
    },
    /**
     * 循环检查登录状态
     */
    loopCheckLoginStatus() {
      this.interval = setInterval(async() => {
        const data = { qrCodeKey: this.qrCodeKey, loginType: this.loginType }
        const result = await getQRCodeLoginData(data)

        // 过期
        if (!result.data) {
          this.$message.info('二维码已过期')
          this.expiresFlag = true
          clearInterval(this.interval)
          return
        }

        const { status } = result.data

        switch (status) {
          // 已扫码等待确认
          case '1': {
            this.confirmLoginFlag = true
            this.qrCodeShowFlag = false
            break
          }
          // 已取消
          case '2': {
            this.$message.info('用户取消确认')
            this.expiresFlag = true
            this.confirmLoginFlag = false
            clearInterval(this.interval)
            break
          }
          // 已确定登录
          case '3': {
            this.$message.success('登陆成功')
            this.handleLogin(result.data)
            clearInterval(this.interval)
            break
          }
          // 过期
          default: {
            break
          }
        }
      }, 2000)
    },

    handleLogin(loginData) {
      this.$store.dispatch('user/autoLogin', loginData)
      this.$router.push({ path: this.redirect || '/' })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;

  .title-container {
    .title {
      font-size: 26px;
      color: #fff;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

  }

  .login-qrcode-container {
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;

  }

  .qrcode-container {
    position: absolute;

    .qrcode {
      position: relative;
      left: 65%;
    }

    .expire {
      position: relative;
      top: -120px;
      left: 85%;
    }

    .confirm-login {
      position: relative;
      text-align: center;
      width: 200px;
      height: 200px;
      background-color: #2d3a4b;
      opacity: 0.999;
      left: 60%;
      color: #fff;
    }
  }

}

</style>
