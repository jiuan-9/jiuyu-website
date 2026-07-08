import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "九语需要付费吗？",
    answer: "九语完全免费使用，无需付费、无需注册账号。你只需要自行准备所用 AI 服务商的 API Key 即可畅聊。",
  },
  {
    question: "我的对话数据安全吗？",
    answer: "九语的所有对话记录和 API 密钥均使用加密算法存储在本地设备上，不会上传到任何远程服务器。你的数据完全由你自己掌控。",
  },
  {
    question: "如何获取和配置 API Key？",
    answer: "在你使用的 AI 服务商官网注册并获取 API Key，然后在九语设置界面中粘贴即可。配置好的密钥会加密保存在本地。",
  },
  {
    question: "支持 macOS 系统吗？",
    answer: "当前 v1.0.0 版本支持 Windows 10 及以上系统。macOS 版本正在开发中，敬请期待。",
  },
  {
    question: "可以同时使用多个 AI 模型吗？",
    answer: "当然！九语内置 11 家服务商、62+ 个模型，你可以在不同会话中切换不同模型，也可以在同一会话中随时切换。",
  },
  {
    question: "什么是 AI 人设精调？",
    answer: "你可以在设置中自定义 AI 的名字、性格、外貌和说话风格。九语的精调引擎会将这些描述自动编译成 AI 最能理解的高质量提示词，让 AI 按照你设定的方式来回应。",
  },
];

function FAQAccordion({ item, defaultOpen = false }: { item: FAQItem; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/[0.04] last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-sm font-medium text-dark-200 group-hover:text-white transition-colors pr-4">
          {item.question}
        </span>
        <ChevronDown
          size={16}
          className={`text-dark-500 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-xs text-dark-400 leading-relaxed">{item.answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-950/80 to-transparent" />

      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-brand-400 mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            常见<span className="text-gradient"> 问题</span>
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto text-base md:text-lg">
            关于九语，你可能想知道的都在这里
          </p>
        </ScrollReveal>

        <ScrollReveal threshold={0.1}>
          <div className="max-w-2xl mx-auto glass rounded-2xl glow-border p-6 md:p-8">
            {faqs.map((faq, index) => (
              <FAQAccordion key={faq.question} item={faq} defaultOpen={index === 0} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
