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
    logo: '/smart_plc.png',
    //搜索
		search: {
			provider: "local"
		},
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '例子', link: '/guide/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/guide/markdown-examples'},
          { text: 'Runtime API Examples', link: '/guide/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

  }
})
