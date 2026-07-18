import type { ChatSession, MobileHighlight } from "./types";

/**
 * 在线体验 Demo 聊天数据
 * 4 个会话，覆盖编程/学习/工作/生活四类场景
 * 每个会话中英双语，切换语言时无缝切换
 *
 * 注意：代码块用 ``` 包裹，由 syntax-highlight.ts 解析渲染
 */
export const demoChats: ChatSession[] = [
  {
    id: "coding",
    name: { zh: "编程助手", en: "Coding Assistant" },
    model: "DeepSeek V4 Pro",
    messages: [
      {
        role: "user",
        text: {
          zh: "帮我写一段 Python 爬虫代码",
          en: "Help me write a Python web scraper",
        },
      },
      {
        role: "ai",
        text: {
          zh: "好的呀～你需要爬取什么类型的数据呢？网页、API 还是文件？告诉我具体需求，我帮你写完整的爬虫代码 😊",
          en: "Sure! What type of data do you need to scrape? Web pages, APIs, or files? Tell me your requirements and I'll write the full scraper code 😊",
        },
      },
      {
        role: "user",
        text: {
          zh: "想爬一个新闻网站的文章标题和链接",
          en: "I want to scrape article titles and links from a news site",
        },
      },
      {
        role: "ai",
        text: {
          zh: "明白了！给你写一个用 requests + BeautifulSoup 的实现：\n\n```python\nimport requests\nfrom bs4 import BeautifulSoup\n\nurl = \"https://example.com/news\"\nresp = requests.get(url)\nsoup = BeautifulSoup(resp.text, \"html.parser\")\n\nfor article in soup.select(\".article-title\"):\n    print(article.text.strip(), article[\"href\"])\n```\n\n先用这个试试，如果网站结构不一样，告诉我具体网址，我帮你调选择器～",
          en: "Got it! Here's an implementation using requests + BeautifulSoup:\n\n```python\nimport requests\nfrom bs4 import BeautifulSoup\n\nurl = \"https://example.com/news\"\nresp = requests.get(url)\nsoup = BeautifulSoup(resp.text, \"html.parser\")\n\nfor article in soup.select(\".article-title\"):\n    print(article.text.strip(), article[\"href\"])\n```\n\nTry this first. If the site structure differs, share the URL and I'll adjust the selectors.",
        },
      },
    ],
  },
  {
    id: "english",
    name: { zh: "英语学习", en: "English Learning" },
    model: "Kimi K2.6",
    messages: [
      {
        role: "user",
        text: {
          zh: "How do I use 'nevertheless' in a sentence?",
          en: "How do I use 'nevertheless' in a sentence?",
        },
      },
      {
        role: "ai",
        text: {
          zh: "好问题！'Nevertheless' 意思是「尽管如此」/「不过」，用来表示转折。\n\n结构是：Sentence 1. Nevertheless, Sentence 2.\n\n来看两个例句：\n• It was raining heavily. Nevertheless, we went hiking.\n  虽然下着大雨，但我们还是去远足了。\n\n• The exam was difficult. Nevertheless, she passed with flying colors.\n  考试很难，但她依然高分通过。\n\n要不要自己造个句子试试？我帮你检查～",
          en: "Great question! 'Nevertheless' means 'in spite of that' / 'however', used to express contrast.\n\nStructure: Sentence 1. Nevertheless, Sentence 2.\n\nTwo examples:\n• It was raining heavily. Nevertheless, we went hiking.\n\n• The exam was difficult. Nevertheless, she passed with flying colors.\n\nWant to try making your own sentence? I'll check it for you.",
        },
      },
      {
        role: "user",
        text: {
          zh: "I'm tired. Nevertheless, I'll finish this report.",
          en: "I'm tired. Nevertheless, I'll finish this report.",
        },
      },
      {
        role: "ai",
        text: {
          zh: "完全正确，而且用得很自然！👏\n\n再教你一个进阶用法：'Nevertheless' 也可以放句尾——\n「The plan had flaws. We succeeded, nevertheless.」\n\n中文习惯把「尽管如此」放前面，英语放句尾也很常见，这是两种语言思维上的一个小差异，注意到了就会让你的表达更地道。",
          en: "Completely correct, and used very naturally! 👏\n\nHere's an advanced usage: 'Nevertheless' can also go at the end of a sentence:\n\"The plan had flaws. We succeeded, nevertheless.\"\n\nChinese tends to put「尽管如此」at the front, while English often places it at the end — a small difference in how the two languages think. Once you notice it, your expression becomes more native.",
        },
      },
    ],
  },
  {
    id: "brainstorm",
    name: { zh: "产品脑暴", en: "Product Brainstorm" },
    model: "Qwen 3.7 Max",
    messages: [
      {
        role: "user",
        text: {
          zh: "我们正在做一个面向设计师的 AI 工具，帮我起几个产品名",
          en: "We're building an AI tool for designers — help me brainstorm product names",
        },
      },
      {
        role: "ai",
        text: {
          zh: "有意思！帮你从几个不同角度想想：\n\n— 灵感向：灵犀 — 取自「心有灵犀」，暗示 AI 能秒懂设计师的想法\n— 专业向：像素笔记 — 精准、细节，设计师的日常\n— 诗意向：墨迹 — 简洁有中国味，水墨与 AI 的碰撞\n\n你的目标用户是国内设计师还是面向全球呢？这个会影响命名方向～",
          en: "Interesting! Let me think from a few angles:\n\n— Inspiration: LingXi (灵犀) — from the idiom「心有灵犀」, hinting AI instantly understands designers\n— Professional: Pixel Notes (像素笔记) — precise, detailed, designer's daily tool\n— Poetic: MoJi (墨迹) — clean with a Chinese flair, ink meets AI\n\nIs your target audience domestic designers or global? This affects naming direction.",
        },
      },
      {
        role: "user",
        text: {
          zh: "国内为主，偏好简洁好记的中文名",
          en: "Mostly domestic, prefer clean memorable Chinese names",
        },
      },
      {
        role: "ai",
        text: {
          zh: "那推荐这几个方向，都控制在两三个字：\n\n灵感 — 直白有力，用户一看就懂\n素记 — 「素」是素描的素，简洁大气\n设计力 — 直接传达「给设计师赋能」这个卖点\n\n我个人最推荐「灵感」，中文有温度，拼音 LingGan 也能注册域名。你觉得哪个方向比较对味？",
          en: "Then I recommend these directions, all kept to 2-3 characters:\n\nLingGan (灵感) — direct and powerful, instantly understood\nSuJi (素记) — 「素」as in sketch, clean and elegant\nSheJiLi (设计力) — directly conveys「empowering designers」\n\nPersonally I recommend「灵感」— warm in Chinese, pinyin LingGan also works as a domain. Which direction feels right?",
        },
      },
    ],
  },
  {
    id: "chat",
    name: { zh: "日常闲聊", en: "Casual Chat" },
    model: "豆包 Seed 2.1 Pro",
    messages: [
      {
        role: "user",
        text: {
          zh: "推荐几部冷门但特别好看的科幻电影吧",
          en: "Recommend some underrated but excellent sci-fi films",
        },
      },
      {
        role: "ai",
        text: {
          zh: "这个我擅长！给你挑几部口碑好但不算热门的：\n\n🎬 《月球》(2009) — 一个人在月球基地的孤独与反转，山姆·洛克威尔演技封神\n🎬 《降临》(2016) — 语言学家与外星文明的哲学碰撞，看完会想很久\n🎬 《机械姬》(2014) — 图灵测试演绎到极致，氛围感拉满\n🎬 《她》(2013) — 人与 AI 的情感连接，温暖又让人深思\n\n看过哪部？按你的口味我再精准推荐～",
          en: "This is my specialty! Here are some critically acclaimed but not-so-mainstream picks:\n\n🎬 Moon (2009) — A lone man on a lunar base, with a twist. Sam Rockwell's acting is god-tier.\n🎬 Arrival (2016) — A linguist's philosophical collision with alien civilization. Stays with you.\n🎬 Ex Machina (2014) — The Turing test taken to its limits. Atmosphere dialed up to 11.\n🎬 Her (2013) — A human-AI emotional connection. Warm and thought-provoking.\n\nWhich have you seen? Tell me your taste and I'll recommend more precisely.",
        },
      },
      {
        role: "user",
        text: {
          zh: "《她》看了两遍，特别喜欢",
          en: "I've watched Her twice, really loved it",
        },
      },
      {
        role: "ai",
        text: {
          zh: "那你的品味我们很合拍！《她》的内核是「孤独与连接」，顺着这个方向推荐：\n\n🎬 《暖暖内含光》(2004) — 如果记忆可以删除，你还会爱上同一个人吗？\n🎬 《龙虾》(2015) — 荒诞设定下的情感寓言，冷幽默里藏着深深的孤独\n🎬 《成为约翰·马尔科维奇》(1999) — 同一导演的脑洞神作，关于身份与意识\n\n这三部都不是传统科幻，但都在探讨「人为什么是人」——跟《她》一脉相承。看完来找我聊感受～",
          en: "Then our tastes align! Her's core is「loneliness and connection」— in that direction:\n\n🎬 Eternal Sunshine of the Spotless Mind (2004) — If memories could be erased, would you still love the same person?\n🎬 The Lobster (2015) — An emotional fable in absurdity. Cold humor hiding deep loneliness.\n🎬 Being John Malkovich (1999) — Same director's mind-bending masterpiece on identity and consciousness.\n\nNone of these are traditional sci-fi, but all explore「what makes us human」— a lineage with Her. Come chat with me after watching!",
        },
      },
    ],
  },
];

/**
 * 移动端亮点（4 项）
 * 用于移动端 AppPreview 的高亮展示
 */
export const mobileHighlights: MobileHighlight[] = [
  {
    id: "responsive",
    icon: "Smartphone",
    title: { zh: "全屏适配", en: "Full-Screen Adaptive" },
    desc: {
      zh: "完美适配手机屏幕，单手操作无压力",
      en: "Perfectly fits phone screens, one-hand friendly",
    },
  },
  {
    id: "dark-mode",
    icon: "Moon",
    title: { zh: "深色模式", en: "Dark Mode" },
    desc: {
      zh: "默认深色主题，护眼且高级",
      en: "Default dark theme, easy on the eyes",
    },
  },
  {
    id: "gesture",
    icon: "Hand",
    title: { zh: "手势交互", en: "Gesture Interactions" },
    desc: {
      zh: "侧滑切换会话，长按多选管理",
      en: "Swipe to switch sessions, long-press to manage",
    },
  },
  {
    id: "offline-read",
    icon: "BookOpen",
    title: { zh: "离线回看", en: "Offline Review" },
    desc: {
      zh: "历史会话本地缓存，断网也能查阅",
      en: "History cached locally — readable offline",
    },
  },
];

/** Demo 区标题 */
export const demoSectionTitle = {
  zh: "在线体验 Quiddity",
  en: "Try Quiddity Online",
};

export const demoSectionSubtitle = {
  zh: "无需下载，直接在浏览器里感受流畅的 AI 对话",
  en: "No download needed — experience fluid AI chat right in your browser",
};

/** 聊天角色名 */
export const chatRoleNames = {
  user: { zh: "你", en: "You" },
  ai: { zh: "小九", en: "Xiao Jiu" },
};

/** 输入框占位 */
export const chatInputPlaceholder = {
  zh: "输入消息...（Enter 发送，Shift+Enter 换行）",
  en: "Type a message... (Enter to send, Shift+Enter for newline)",
};
