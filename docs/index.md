---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "SmartPLC"
  text: "昆山佰奥PLC通讯管理服务"
  tagline: 让PLC交互越来越简单
  image:
    src: /logo.png
    alt: 顺发
  actions:
    - theme: brand
      text: 使用背景
      link: /guide/markdown-examples
    - theme: alt
      text: 实现原理
      link: /guide/api-examples
    - theme: alt
      text: C#范例
      link: /guide/api-examples

features:
  - title: 类似ORM
    details: 采用类似数据ORM框架模式，对象映射PLC地址，通过操作对象即可实现地址内容获取和修改。
  - title: 无需关心底层连接
    details: PLC连接断线重连对于使用者是透明的，使用者只需监听和调用Api即可。
  - title: 事件自动处理
    details: 当PLC触发Kstopa自定义协议事件，监听回调。无需编写事件实现逻辑。
  - title: 实时监控
    details: 服务监控程序可实时监控PLC地址变化，事件详情。
---

