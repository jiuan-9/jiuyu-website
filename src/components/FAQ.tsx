import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "九语是什么？",
    answer: "九语是一个 AI 工具平台。目前桌面端提供多模型 AI 聊天功能；新一代 Agent AI 工具「Quiddity」正在开发中，将支持自主任务执行、工具调用等高级能力。移动端将作为独立的全新 AI 工具推出。",
  },
  {
    question: "Quiddity 和现在的九语桌面端有什么区别？",
    answer: "当前九语桌面端 (v1.0.0) 是一款多模型 AI 聊天应用。Quiddity 则是正在开发的全新 Agent AI 工具，它不仅能聊天，更能自主规划、调用工具、执行复杂任务。两者是同一品牌下的不同产品。",
  },
  {
    question: "九语需要付费吗？",
    answer: "九语桌面端完全免费使用，无需付费、无需注册账号。你只需要自行准备所用 AI 服务商的 API Key 即可使用。",
  },
  {
    question: "我的对话数据安全吗？",
    answer: "九语的所有对话记录和 API 密钥均使用加密算法存储在本地设备上，不会上传到任何远程服务器。你的数据完全由你自己掌控。",
  },
  {
    question: "如何获取和配置 API Key？",
    answer: "在你使用的 AI 服务商官网注册并获取 API Key，然后在九语设置界面中粘贴即可。配置好的密钥会加密保存在本地。目前支持深度求索、阿里云通义千问、硅基流动等服务商。",
  },
  {
    question: "移动端什么时候上线？",
    answer: "移动端正处于规划阶段，将作为一个全新的 AI 工具独立开发，不包含 Agent 能力。具体上线时间请关注后续公告。",
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState("0px");

  useEffect(() => {
    if (isOpen) {
      const el = contentRef.current;
      if (el) {
        const h = el.scrollHeight;
        setContentHeight(`${h}px`);
        const timer = setTimeout(() => setContentHeight("auto"), 300);
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
    <div className="border-b border-white/[0.04] last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-sm font-medium text-dark-200 group-hover:text-white transition-colors pr-4">
          {item.question}
        </span>
        <div
          className={`w-6 h-6 rounded-full bg-white/[0.04] flex items-center justify-center shrink-0 transition-all duration-300 ${
            isOpen ? "bg-brand-500/10 rotate-180" : ""
          }`}
        >
          <ChevronDown size={14} className="text-dark-400" />
        </div>
      </button>
      <div
        className="overflow-hidden transition-[height] duration-300 ease-out"
        style={{ height: contentHeight }}
      >
        <div ref={contentRef} className="pb-4">
          <p className="text-xs text-dark-400 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/80 to-transparent" />

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            常见<span className="text-gradient"> 问题</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-sm md:text-base">
            关于九语和 Quiddity，你可能想知道的都在这里
          </p>
        </ScrollReveal>

        <ScrollReveal threshold={0.1}>
          <div className="max-w-2xl mx-auto glass rounded-2xl glow-border p-6 md:p-8">
            {faqs.map((faq) => (
              <FAQAccordion key={faq.question} item={faq} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
