---
# 首页
layout: home

hero:
  name: "SmartPLC"
  text: "昆山佰奥PLC通讯管理服务"
  tagline: 让PLC交互越来越简单
  image:
    src: /logo.png
    alt: 顺发
  actions:
    - theme: alt
      text: 使用背景
      link: /guide/使用背景
    - theme: alt
      text: 实现原理
      link: /guide/实现原理
    - theme: brand
      text: C#范例
      link: /guide/examples/CShapExample
    - theme: alt
      text: Java范例
      link: /guide/examples/JavaExample
features:
  - title: 类似ORM
    icon: 
      src: /orm.png
    details: 采用类似数据ORM框架模式，对象映射PLC地址，通过操作对象即可实现地址内容获取和修改。
  - title: 无需关心底层连接
    icon: 
      src: /base.png
    details: PLC连接断线重连对于使用者是透明的，使用者只需监听和调用Api即可。
  - title: 事件自动处理
    icon: 
      src: /auto.png
    details: 当PLC触发Kstopa自定义协议事件，监听回调。无需编写事件实现逻辑。
  - title: 实时监控
    icon:
      src: /time.png
    details: 服务监控程序可实时监控PLC地址变化，事件详情。
---

