import type { I18nText, ChatMessage } from "./types";

/** 应用场景区 eyebrow */
export const useCasesBadge: I18nText = {
  zh: "Use Cases",
  en: "Use Cases",
};

/** 应用场景区标题 */
export const useCasesSectionTitle: I18nText = {
  zh: "Quiddity 能做什么",
  en: "What Quiddity Can Do",
};

/** 应用场景区副标题 */
export const useCasesSectionSubtitle: I18nText = {
  zh: "不止聊天，更是工作、学习和生活中的得力助手",
  en: "More than chat — your assistant for work, study, and life.",
};

/** 展开/收起按钮 */
export const expandLabel: I18nText = {
  zh: "展开预览",
  en: "Expand Preview",
};

export const collapseLabel: I18nText = {
  zh: "收起",
  en: "Collapse",
};

/** 聊天角色名 */
export const useCasesSenderLabels = {
  user: { zh: "你", en: "You" } as I18nText,
  ai: { zh: "小九", en: "Xiao Jiu" } as I18nText,
};

/** 代码语言标签兜底 */
export const codeLabelFallback: I18nText = {
  zh: "代码",
  en: "code",
};

/** 头像文字（中文用单字，英文用首字母） */
export const useCasesAvatarLabels = {
  ai: { zh: "九", en: "Q" } as I18nText,
  user: { zh: "你", en: "U" } as I18nText,
};

/** 应用场景列表 */
export interface UseCase {
  id: string;
  icon: string;
  title: I18nText;
  subtitle: I18nText;
  color: string;
  iconBg: string;
  iconColor: string;
  messages: ChatMessage[];
}

export const useCases: UseCase[] = [
  {
    id: "coding",
    icon: "Code",
    title: { zh: "编程助手", en: "Coding Assistant" },
    subtitle: { zh: "调试、学习、优化——专属技术顾问", en: "Debug, learn, optimize — your dedicated tech consultant" },
    color: "from-blue-500/20 to-cyan-500/5",
    iconBg: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-400",
    messages: [
      {
        role: "user",
        text: {
          zh: "帮我写一个 Python 脚本，自动整理桌面文件",
          en: "Help me write a Python script to organize desktop files automatically",
        },
      },
      {
        role: "ai",
        text: {
          zh: "好的。我帮你写一个脚本，按文件扩展名自动分类到不同文件夹。支持自定义规则，可设为开机自启或手动运行。",
          en: "Sure. I'll write a script that sorts files by extension into different folders. Supports custom rules and can run on startup or manually.",
        },
      },
      {
        role: "user",
        text: {
          zh: "再加个功能：超过 30 天的文件自动归档到 Archive 文件夹",
          en: "Add one more feature: files older than 30 days auto-archive to an Archive folder",
        },
      },
      {
        role: "ai",
        text: {
          zh: "没问题。我在脚本里加上日期判断逻辑，匹配超过 30 天的文件移动到 Archive，保留原有的分类结构。",
          en: "No problem. I'll add date-checking logic to move files older than 30 days to Archive while preserving the existing category structure.",
        },
      },
    ],
  },
  {
    id: "learning",
    icon: "BookOpen",
    title: { zh: "学习伴侣", en: "Learning Partner" },
    subtitle: { zh: "用通俗语言讲透复杂概念", en: "Complex concepts explained in plain language" },
    color: "from-purple-500/20 to-pink-500/5",
    iconBg: "from-purple-500/20 to-pink-500/10",
    iconColor: "text-purple-400",
    messages: [
      {
        role: "user",
        text: {
          zh: "什么是量子纠缠？用简单的比喻解释",
          en: "What is quantum entanglement? Explain with a simple analogy",
        },
      },
      {
        role: "ai",
        text: {
          zh: "想象你有两只手套，一左一右。把它们分别装进两个盒子，打乱后随机寄到北京和上海。当你在北京打开盒子看到左手套的瞬间，你就立刻知道上海那只一定是右手套——无论距离多远。量子纠缠也是类似，两个粒子的状态始终关联。",
          en: "Imagine two gloves, left and right. Put them in separate boxes, shuffle, and mail them to Beijing and Shanghai. The moment you open the Beijing box and see a left glove, you instantly know the Shanghai one must be right — no matter the distance. Quantum entanglement is similar: two particles remain correlated.",
        },
      },
      {
        role: "user",
        text: {
          zh: "那跟普通逻辑有什么不同？",
          en: "How is that different from ordinary logic?",
        },
      },
      {
        role: "ai",
        text: {
          zh: "关键区别：手套「左」和「右」在装盒时就确定了。但量子粒子在被观测前，处于「既左又右」的叠加态！观测的瞬间才坍缩成确定状态——这才是真正神奇的地方。",
          en: "Key difference: the gloves were already left or right when packed. But quantum particles exist in a superposition of both states before observation! They only collapse into a definite state at the moment of measurement — that's the truly magical part.",
        },
      },
    ],
  },
  {
    id: "creation",
    icon: "Palette",
    title: { zh: "创作灵感", en: "Creative Spark" },
    subtitle: { zh: "文案、点子、策划——突破创意瓶颈", en: "Copy, ideas, planning — break through creative blocks" },
    color: "from-orange-500/20 to-yellow-500/5",
    iconBg: "from-orange-500/20 to-yellow-500/10",
    iconColor: "text-orange-400",
    messages: [
      {
        role: "user",
        text: {
          zh: "帮我写一段面向 Z 世代用户的 AI 产品 slogan",
          en: "Help me write an AI product slogan targeting Gen Z users",
        },
      },
      {
        role: "ai",
        text: {
          zh: "几个方向供你参考：\n\n「不设限，才无限」—— 简洁有力，暗示 AI 没有边界\n「你的智能，你做主」—— 强调用户掌控\n「聪明，无需条件」—— 暗示免费/易得\n\n你倾向哪种调性？我可以针对性地深化。",
          en: "A few directions:\n\n\"No limits, infinite possibilities\" — clean and powerful, hinting AI has no boundaries\n\"Your intelligence, your rules\" — emphasizes user control\n\"Smart, no strings attached\" — implies free and accessible\n\nWhich tone do you prefer? I can develop it further.",
        },
      },
      {
        role: "user",
        text: {
          zh: "第一个方向不错，帮我展开写一段产品描述",
          en: "The first direction is good. Expand it into a product description",
        },
      },
      {
        role: "ai",
        text: {
          zh: "好的。「不设限，才无限。」\n\n在这个信息过载的时代，你需要的不是又一个工具，而是一个真正懂你的伙伴。Quiddity接入主流 AI，自由切换模型，精调 AI 人设——你的创造力，从此不受限。",
          en: "Sure. \"No limits, infinite possibilities.\"\n\nIn an age of information overload, you don't need another tool — you need a partner that truly gets you. Quiddity connects mainstream AIs, switches models freely, and fine-tunes AI personas — your creativity, finally unlimited.",
        },
      },
    ],
  },
  {
    id: "companion",
    icon: "MessageCircle",
    title: { zh: "日常陪伴", en: "Daily Companion" },
    subtitle: { zh: "聊天、倾诉、解闷——随时在你身边", en: "Chat, vent, unwind — always by your side" },
    color: "from-green-500/20 to-emerald-500/5",
    iconBg: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-green-400",
    messages: [
      {
        role: "user",
        text: {
          zh: "推荐几部冷门但特别好看的科幻电影",
          en: "Recommend some underrated but excellent sci-fi films",
        },
      },
      {
        role: "ai",
        text: {
          zh: "推荐这几部：\n🎬 《月球》(2009) — 孤独宇航员的困境，反转惊艳\n🎬 《降临》(2016) — 语言学+外星人的神作\n🎬 《机械姬》(2014) — 图灵测试的极致演绎\n🎬 《她》(2013) — AI 与人的情感连接，温暖又深刻",
          en: "Here are some picks:\n🎬 Moon (2009) — A lone astronaut's dilemma with a stunning twist\n🎬 Arrival (2016) — A masterpiece of linguistics and aliens\n🎬 Ex Machina (2014) — The Turing test pushed to its limit\n🎬 Her (2013) — A warm, profound emotional bond between human and AI",
        },
      },
      {
        role: "user",
        text: {
          zh: "《她》确实很好看。你觉得未来 AI 真的会有情感吗？",
          en: "Her was really good. Do you think AI will ever truly have emotions?",
        },
      },
      {
        role: "ai",
        text: {
          zh: "这是个迷人的问题。目前 AI 能模拟情感表达，但离真正的「感受」还很远。不过换个角度想——如果一只狗摇尾巴我们认为是「开心」，那当 AI 展现出足够复杂的情感行为时，我们真的能分清「模拟」和「感受」的界限吗？",
          en: "That's a fascinating question. Right now AI can simulate emotional expression, but true feeling is still far away. Yet think about it — if a wagging tail means a dog is happy, when AI displays sufficiently complex emotional behavior, can we really draw the line between simulation and feeling?",
        },
      },
    ],
  },
];
