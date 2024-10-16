import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/smartplcdoc/',
  title: "SmartPLC",
  description: "昆山佰奥PLC通讯管理服务",
  head: [
    ["meta", {name: "author", content: "shunfa.han"}],
		["meta", {name: "keywords", content: "SmartPLC,"}],
    ["link", {rel: "icon", href: "/smart_plc.png"}],
  ],
  themeConfig: {
    logo: 'docs/smart_plc.ico',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '使用背景', link: '/guide/使用背景' },
      { text: '实现原理', link: '/guide/实现原理' },
      { text: '范例', 
        items: [
          {text: "C#范例", link: '/guide/examples/CShapExample'},
          {text: "Java范例", link: '/guide/examples/JavaExample'}
        ]
       }
    ],

    sidebar: [
      {
        text: '菜单',
        items: [
          { text: '使用背景', link: '/guide/使用背景'},
          { text: '实现原理', link: '/guide/实现原理' },
          {
              text: '范例',
              items: [
                {text: "C#范例", link: '/guide/examples/CShapExample'},
                {text: "Java范例", link: '/guide/examples/JavaExample'}
              ]
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hanshunfa/smartplcdoc' }
    ],
    docFooter: {
      prev: '上一节',
      next: '下一节',
    },
    outline: {
      label: "在这一页"
    },
    // 搜索
    search: {
      provider: 'local',
      options:{
      }
    }
  }
})
