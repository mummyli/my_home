import Taro, { Config } from '@tarojs/taro'
import { Component, useState } from 'react'
import { View, Button, Image, Text, Input } from '@tarojs/components'
import './login.less'

type User = {
  nickName: string;
  avatarUrl: string;
}

const handleLogin = (setIsAuthorized) => {
  try {
    Taro.login({
      success: res => {
        // 发送 res.code 到后台换 查看是否已经注册
        if (res.code) {
          Taro.request({
            url: "/login",
            data: {
              code: res.code
            },
            success: res => {
              let logininfo = res.data.data

              if (logininfo != null) {
                if (logininfo.code == 200) {
                  if (logininfo.detail == "not register") {
                    setIsAuthorized(false)
                  } else {
                    Taro.setStorageSync('AUTH_TICKET', logininfo.AUTH_TICKET)
                    Taro.setStorageSync('nickname', logininfo.nickname)
                    Taro.navigateTo({ url: "/pages/index/index" })
                  }
                } else {
                  console.log(logininfo)
                }
              } else {
                console.log(res.data)
              }
            }
          }
          )
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export default () => {

  const [avatar, setAvatar] = useState<string>()
  const [nickName, setNickName] = useState<string>()
  const [isAuthorized, setIsAuthorized] = useState<boolean>()
  const [userInfo, setUserInfo] = useState<User>()

  return (
    <View className='index'>
      {isAuthorized ? (
        <View>
          <Button open-type="chooseAvatar"
            onChooseAvatar={(e) => setAvatar(e.detail.avatarUrl)}  // 在taro中使用的是onChooseAvatar
            className="info-content__btn">
            <Image src={avatar} className="avatar" />
          </Button>
          <Input type="nickname"
            className="info-content__input"
            placeholder="请输入昵称"
            value={nickName}
            onInput={(e) => setNickName(e.detail.value)} />
        </View>
      ) : (
        <Button className='login-btn' onClick={() => handleLogin(setIsAuthorized)}>登录</Button>
      )}
    </View>
  )
}