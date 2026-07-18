import { useState, useRef, useEffect } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Quiddity是什么？",
    answer: "Quiddity是一款 Windows 桌面 AI 应用（v1.0.0），支持接入 DeepSeek、通义千问、Kimi 等多家 AI 服务商。你可以自由切换模型、自定义 AI 人设、管理无限会话。所有数据加密存储在本地。",
  },
  {
    question: "Quiddity需要付费吗？",
    answer: "Quiddity桌面端完全免费，无需注册账号。你只需要自行准备所用 AI 服务商的 API Key 即可使用。",
  },
  {
    question: "我的对话数据安全吗？",
    answer: "所有对话记录和 API 密钥均使用加密算法存储在本地设备上，不会上传到任何远程服务器。你的数据完全由你掌控。",
  },
  {
    question: "如何获取和配置 API Key？",
    answer: "在你使用的 AI 服务商官网注册并获取 API Key，然后在Quiddity设置界面中粘贴即可。配置好的密钥会加密保存在本地。",
  },
  {
    question: "移动端什么时候上线？",
    answer: "移动端正处于规划阶段，将作为一个全新的 AI 工具独立开发——它不包含 Agent 能力，定位与桌面端不同。具体上线时间请关注后续公告。",
  },
];

function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState("0px");

  useEffect(() => {
    if (isOpen) {
      const el = contentRef.current;
      if (el) {
        const h = el.scrollHeight;
        setContentHeight(`${h}px`);
        const timer = setTimeout(() => setContentHeight("auto"), 350);
        return () => clearTimeout(timer);
      }
    } else {
      const el = contentRef.current;
      if (el) {
        setContentHeight(`${el.scrollHeight}px`);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setContentHeight("0px");
          });
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="border-b border-white/[0.04] last:border-b-0 group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
            isOpen ? "bg-brand-500/20" : "bg-dark-800"
          }`}>
            <HelpCircle size={16} className={isOpen ? "text-brand-400" : "text-dark-500"} />
          </div>
          <span className={`text-sm sm:text-base font-medium pr-4 transition-colors duration-300 ${
            isOpen ? "text-brand-300" : "text-dark-200 group-hover:text-white"
          }`}>
            {item.question}
          </span>
        </div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
            isOpen ? "bg-brand-500/10 rotate-180" : "bg-white/[0.03]"
          }`}
        >
          <ChevronDown size={16} className={isOpen ? "text-brand-400" : "text-dark-500"} />
        </div>
      </button>
      <div
        className="overflow-hidden transition-[height] duration-350 ease-out"
        style={{ height: contentHeight }}
      >
        <div ref={contentRef} className="pb-5 pl-11">
          <div className="absolute left-11 w-px h-[calc(100%-10px)] bg-gradient-to-b from-brand-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <p className="text-xs sm:text-sm text-dark-400 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/80 to-transparent" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[400px] rounded-full bg-brand-500/[0.02] blur-[150px]" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] rounded-full bg-purple-500/[0.02] blur-[120px]" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-10 sm:mb-14">
          <span className="inline-block text-[11px] sm:text-xs tracking-[0.2em] uppercase text-brand-400 mb-3 sm:mb-4">FAQ</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            常见<span className="text-gradient"> 问题</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            关于Quiddity，你可能想知道的都在这里
          </p>
        </ScrollReveal>
        <ScrollReveal threshold={0.1}>
          <div className="max-w-2xl mx-auto glass rounded-2xl glow-border p-4 sm:p-6 md:p-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.02] via-transparent to-purple-500/[0.02]" />
            <div className="relative z-10">
              {faqs.map((faq, index) => (
                <FAQAccordion key={faq.question} item={faq} index={index} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
