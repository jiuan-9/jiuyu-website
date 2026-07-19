// ── 代码块展示组件 ──
// 深色背景框 + 语法高亮 + 语言标签 + 一键复制

import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { useI18n } from "@/store/i18n";
import {
  demoCodeFallbackLabel,
  demoCopyCodeTooltip,
  demoCopiedText,
  demoCopyButtonLabel,
} from "@/content";
import { highlightCode } from "@/lib/syntax-highlight";

interface CodeBlockProps {
  code: string;
  language?: string;
}

/** 语言名称映射（英文 → 中文/标志） */
const LANG_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  python: "Python",
  py: "Python",
  css: "CSS",
  html: "HTML",
  json: "JSON",
  bash: "Bash",
  sh: "Bash",
  shell: "Shell",
  sql: "SQL",
  tsx: "TSX",
  jsx: "JSX",
  yaml: "YAML",
  yml: "YAML",
  xml: "XML",
  markdown: "Markdown",
  md: "Markdown",
  java: "Java",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  go: "Go",
  rust: "Rust",
  php: "PHP",
  ruby: "Ruby",
  rb: "Ruby",
  swift: "Swift",
  kotlin: "Kotlin",
};

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const langLabel = language ? LANG_LABELS[language.toLowerCase()] || language : undefined;
  const highlighted = highlightCode(code, language || "");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级方案：textarea 复制
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <div className="code-block-wrapper my-2.5 rounded-xl overflow-hidden border border-white/[0.08] bg-[#0d1117] shadow-lg shadow-black/30">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.05] bg-[#161b22]/80">
        <div className="flex items-center gap-2">
          {langLabel ? (
            <span className="text-[10px] font-medium text-dark-400 tracking-wide">
              {langLabel}
            </span>
          ) : (
            <span className="text-[10px] font-medium text-dark-500 tracking-wide">
              {t(demoCodeFallbackLabel)}
            </span>
          )}
          {/* 三个圆点装饰 */}
          <div className="flex items-center gap-1 ml-1">
            <span className="w-2 h-2 rounded-full bg-red-500/30" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/30" />
            <span className="w-2 h-2 rounded-full bg-green-500/30" />
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] text-dark-400 hover:text-brand-400 hover:bg-white/[0.06] active:scale-95 transition-all duration-200"
          title={copied ? t(demoCopiedText) : t(demoCopyCodeTooltip)}
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-400" />
              <span className="text-green-400">{t(demoCopiedText)}</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>{t(demoCopyButtonLabel)}</span>
            </>
          )}
        </button>
      </div>

      {/* 代码内容区 */}
      <div className="overflow-x-auto">
        <pre className="code-block-content px-4 py-3 text-[13px] leading-relaxed overflow-x-auto">
          <code
            className={`language-${language || "plaintext"}`}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
}