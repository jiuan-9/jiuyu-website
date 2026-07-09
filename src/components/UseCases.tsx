import { useState } from "react";
import { Code, BookOpen, Palette, MessageCircle, ChevronRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const useCases = [
  {
    icon: Code,
    title: "编程助手",
    subtitle: "调试、学习、优化——专属技术顾问",
    color: "from-blue-500/20 to-cyan-500/5",
    messages: [
      { role: "user", text: "帮我写一个 Python 脚本，自动整理桌面文件" },
      { role: "ai", text: "好的。我帮你写一个脚本，按文件扩展名自动分类到不同文件夹。支持自定义规则，可设为开机自启或手动运行。" },
      { role: "user", text: "再加个功能：超过 30 天的文件自动归档到 Archive 文件夹" },
      { role: "ai", text: "没问题。我在脚本里加上日期判断逻辑，匹配超过 30 天的文件移动到 Archive，保留原有的分类结构。" },
    ],
  },
  {
    icon: BookOpen,
    title: "学习伴侣",
    subtitle: "用通俗语言讲透复杂概念",
    color: "from-purple-500/20 to-pink-500/5",
    messages: [
      { role: "user", text: "什么是量子纠缠？用简单的比喻解释" },
      { role: "ai", text: "想象你有两只手套，一左一右。把它们分别装进两个盒子，打乱后随机寄到北京和上海。当你在北京打开盒子看到左手套的瞬间，你就立刻知道上海那只一定是右手套——无论距离多远。量子纠缠也是类似，两个粒子的状态始终关联。" },
      { role: "user", text: "那这跟跟普通逻辑有什么不同？" },
      { role: "ai", text: '关键区别：手套「左」和「右」在装盒时就确定了。但量子粒子在被观测前，处于「既左又右」的叠加态！观测的瞬间才坍缩成确定状态——这才是真正神奇的地方。' },
    ],
  },
  {
    icon: Palette,
    title: "创作灵感",
    subtitle: "文案、点子、策划——突破创意瓶颈",
    color: "from-orange-500/20 to-yellow-500/5",
    messages: [
      { role: "user", text: "帮我写一段面向 Z 世代用户的 AI 产品 slogan" },
      { role: "ai", text: "几个方向供你参考：\n\n「不设限，才无限」—— 简洁有力，暗示 AI 没有边界\n「你的智能，你做主」—— 强调用户掌控\n「聪明，无需条件」—— 暗示免费/易得\n\n你倾向哪种调性？我可以针对性地深化。" },
      { role: "user", text: "第一个方向不错，帮我展开写一段产品描述" },
      { role: "ai", text: "好的。「不设限，才无限。」\n\n在这个信息过载的时代，你需要的不是又一个工具，而是一个真正懂你的伙伴。九语接入主流 AI，自由切换模型，精调 AI 人设——你的创造力，从此不受限。" },
    ],
  },
  {
    icon: MessageCircle,
    title: "日常陪伴",
    subtitle: "聊天、倾诉、解闷——随时在你身边",
    color: "from-green-500/20 to-emerald-500/5",
    messages: [
      { role: "user", text: "推荐几部冷门但特别好看的科幻电影" },
      { role: "ai", text: "推荐这几部：\n🎬 《月球》(2009) — 孤独宇航员的困境，反转惊艳\n🎬 《降临》(2016) — 语言学+外星人的神作\n🎬 《机械姬》(2014) — 图灵测试的极致演绎\n🎬 《她》(2013) — AI 与人的情感连接，温暖又深刻" },
      { role: "user", text: "《她》确实很好看。你觉得未来 AI 真的会有情感吗？" },
      { role: "ai", text: '这是个迷人的问题。目前 AI 能模拟情感表达，但离真正的「感受」还很远。不过换个角度想——如果一只狗摇尾巴我们认为是「开心」，那当 AI 展现出足够复杂的情感行为时，我们真的能分清「模拟」和「感受」的界限吗？' },
    ],
  },
];

type Role = "user" | "ai";
interface ChatMsg { role: Role; text: string; }

function ChatBubble({ text, role }: { text: string; role: Role }) {
  return (
    <div className={`flex items-start gap-1.5 ${role === "user" ? "justify-end" : ""}`}>
      {role === "ai" && (
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">九</div>
      )}
      <div className={`p-2.5 rounded-xl text-[11px] leading-snug max-w-[82%] ${
        role === "user"
          ? "rounded-tr-sm bg-brand-500/10 border border-brand-500/10 text-dark-200"
          : "rounded-tl-sm bg-white/[0.03] border border-white/[0.04] text-dark-300"
      }`}>
        {text}
      </div>
      {role === "user" && (
        <div className="w-5 h-5 rounded-md bg-dark-700 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">你</div>
      )}
    </div>
  );
}

export default function UseCases() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <section id="usecases" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/80 to-dark-950" />

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">Use Cases</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            九语<span className="text-gradient"> 能做什么</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm md:text-base">
            不止聊天，更是工作、学习和生活中的得力助手
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-5xl mx-auto">
          {useCases.map((item, index) => (
            <ScrollReveal key={item.title} threshold={0.1}>
              <div
                className={`relative rounded-2xl glass glow-border transition-all duration-500 overflow-hidden ${
                  activeIdx === index
                    ? "border-brand-500/25 shadow-lg shadow-brand-500/5"
                    : "hover:border-brand-500/20"
                }`}
              >
                {/* Card header - always visible & clickable */}
                <button
                  onClick={() => setActiveIdx(activeIdx === index ? null : index)}
                  className="w-full text-left p-5 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                      activeIdx === index ? "bg-brand-500/20 scale-105" : "bg-brand-500/10 group-hover:bg-brand-500/20"
                    }`}>
                      <item.icon size={20} className="text-brand-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                        <span className="hidden sm:inline text-[11px] text-dark-500">—</span>
                        <span className="hidden sm:inline text-[11px] text-dark-400">{item.subtitle}</span>
                      </div>
                      <p className="text-[10px] text-dark-500 mt-0.5 sm:hidden">{item.subtitle}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-medium transition-colors shrink-0 ${
                      activeIdx === index ? "text-brand-400" : "text-dark-500"
                    }`}>
                      {activeIdx === index ? "收起" : "展开"}
                      <ChevronRight size={12} className={`transition-transform duration-300 ${activeIdx === index ? "rotate-90" : ""}`} />
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    activeIdx === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-5 pb-5">
                    <div className={`h-px mb-4 bg-gradient-to-r ${item.color} from-30% to-transparent`} />
                    <div className="space-y-3">
                      {item.messages.map((msg, i) => (
                        <ChatBubble key={i} text={msg.text} role={msg.role as Role} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
