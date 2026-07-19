// ── Agent 能力接口预留 ──
// Quiddity未来 Agent 功能的数据结构定义
// 这些类型现在不会影响现有功能，但为后续扩展提供了标准接口

/** 工具参数定义 */
export interface AgentToolParameter {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  description: string;
  required: boolean;
  default?: unknown;
}

/** Agent 可调用的工具 */
export interface AgentTool {
  /** 工具唯一标识 */
  name: string;
  /** 工具描述，告诉 AI 什么时候用这个工具 */
  description: string;
  /** 工具所需的参数列表 */
  parameters: AgentToolParameter[];
  /** 工具执行函数（未来接入真实功能时实现） */
  execute?: (params: Record<string, unknown>) => Promise<unknown>;
}

/** 单个任务步骤 */
export interface AgentTaskStep {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  description: string;
  toolCall?: {
    toolName: string;
    params: Record<string, unknown>;
  };
  result?: string;
  error?: string;
}

/** Agent 执行的任务 */
export interface AgentTask {
  id: string;
  goal: string;
  steps: AgentTaskStep[];
  status: "idle" | "planning" | "executing" | "completed" | "failed";
  createdAt: number;
}

/** Agent 运行时状态 */
export interface AgentState {
  tasks: AgentTask[];
  currentTaskId: string | null;
  availableTools: AgentTool[];
  isRunning: boolean;
}

/** Agent 能力配置（供未来设置页使用） */
export interface AgentConfig {
  /** 是否启用 Agent 模式 */
  enabled: boolean;
  /** 最大自动执行步数 */
  maxSteps: number;
  /** 是否在执行前需要用户确认 */
  requireConfirmation: boolean;
  /** 已启用的工具名称列表 */
  enabledTools: string[];
}

/** Agent 能力列表的类型（用于 UI 展示） */
export type AgentCapability =
  | "web-search"    // 网页搜索
  | "file-read"     // 读取文件
  | "file-write"    // 写入文件
  | "run-command"   // 执行命令
  | "code-execute"  // 运行代码
  | "browse-url";   // 打开网页

/** Agent 事件类型（未来事件驱动架构使用） */
export type AgentEvent =
  | { type: "step-start"; stepId: string }
  | { type: "step-complete"; stepId: string; result: string }
  | { type: "step-error"; stepId: string; error: string }
  | { type: "task-complete"; taskId: string }
  | { type: "task-error"; taskId: string; error: string };
