// ── 聊天消息气泡组件 ──
// 自动解析消息内容：文字用气泡显示，代码块用独立代码框显示

import CodeBlock from "./CodeBlock";
import { parseContent } from "@/lib/syntax-highlight";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

/** 简单的文本渲染：支持基础 Markdown（加粗、斜体、行内代码） */
function renderText(text: string): string {
  return text
    // 行内代码 `code`
    .replace(
      /`([^`]+)`/g,
      '<code class="inline-code">$1</code>'
    )
    // 加粗 **text**
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="text-white font-semibold">$1</strong>'
    )
    // 斜体 *text*
    .replace(
      /\*(.+?)\*/g,
      '<em class="text-dark-300">$1</em>'
    );
}

export default function ChatMessage({ content, isUser }: ChatMessageProps) {
  const segments = parseContent(content);

  return (
    <div className={`flex items-start gap-2 sm:gap-3 ${isUser ? "justify-end" : ""}`}>
      {/* AI 头像 */}
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 select-none">
          九
        </div>
      )}

      {/* 消息内容 */}
      <div className="max-w-[88%] sm:max-w-[85%] min-w-0">
        {segments.map((seg, idx) =>
          seg.type === "code" ? (
            <CodeBlock
              key={idx}
              code={seg.content}
              language={seg.language}
            />
          ) : (
            <div
              key={idx}
              className={`p-3 sm:p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                isUser
                  ? "rounded-tr-sm bg-brand-500/10 border border-brand-500/15 text-dark-100"
                  : "rounded-tl-sm bg-dark-900/70 border border-white/[0.05] text-dark-200"
              }`}
              dangerouslySetInnerHTML={{ __html: renderText(seg.content) }}
            />
          )
        )}
      </div>

      {/* 用户头像 */}
      {isUser && (
        <div className="w-7 h-7 rounded-lg bg-dark-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5 select-none">
          你
        </div>
      )}
    </div>
  );
}
