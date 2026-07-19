/**
 * Admin — 公告管理系统
 *
 * 功能：
 *   1. 密码门（默认密码，可修改）
 *   2. 公告列表（重要/最新分类，编辑/删除）
 *   3. 公告编辑器（标题/日期/标签/内容/分类）
 *   4. 导出 JSON / 导入 JSON
 *
 * 工作流：localStorage 暂存 → 导出 announcements.json → 部署到 public/
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  Save,
  X,
  Megaphone,
  AlertTriangle,
  CheckCircle,
  KeyRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/store/i18n";
import { ScrollReveal, EnergyRing } from "@/components/animation";
import GitHubStatsPanel from "./GitHubStatsPanel";
import {
  type AnnouncementsData,
  type AnnouncementItem,
  type AnnouncementCategory,
  loadDraft,
  saveDraft,
  clearDraft,
  exportToJson,
  importFromJson,
  verifyPassword,
  changePassword,
  isDefaultPassword,
  todayStr,
  nextId,
} from "@/lib/announcement-store";

// 双语文案
const TXT = {
  title: { zh: "公告管理", en: "Announcement Admin" },
  subtitle: { zh: "管理网站公告内容", en: "Manage website announcements" },
  backHome: { zh: "返回首页", en: "Back to Home" },
  passwordLabel: { zh: "管理员密码", en: "Admin Password" },
  passwordPlaceholder: { zh: "请输入密码", en: "Enter password" },
  login: { zh: "登录", en: "Login" },
  wrongPassword: { zh: "密码错误", en: "Wrong password" },
  defaultPasswordHint: {
    zh: "默认密码：quiddity-admin（建议修改）",
    en: "Default: quiddity-admin (change recommended)",
  },
  important: { zh: "重要公告", en: "Important" },
  latest: { zh: "最新公告", en: "Latest" },
  addNew: { zh: "新增公告", en: "Add New" },
  edit: { zh: "编辑", en: "Edit" },
  delete: { zh: "删除", en: "Delete" },
  titleField: { zh: "标题", en: "Title" },
  dateField: { zh: "日期", en: "Date" },
  tagField: { zh: "标签", en: "Tag" },
  categoryField: { zh: "分类", en: "Category" },
  contentField: { zh: "内容（支持换行）", en: "Content (line breaks supported)" },
  save: { zh: "保存", en: "Save" },
  cancel: { zh: "取消", en: "Cancel" },
  export: { zh: "导出 JSON", en: "Export JSON" },
  import: { zh: "导入 JSON", en: "Import JSON" },
  clear: { zh: "清除草稿", en: "Clear Draft" },
  changePassword: { zh: "修改密码", en: "Change Password" },
  newPassword: { zh: "新密码", en: "New Password" },
  confirmPassword: { zh: "确认密码", en: "Confirm Password" },
  passwordMismatch: { zh: "两次密码不一致", en: "Passwords don't match" },
  passwordChanged: { zh: "密码已修改", en: "Password changed" },
  logout: { zh: "退出登录", en: "Logout" },
  empty: { zh: "暂无公告", en: "No announcements" },
  saved: { zh: "已保存", en: "Saved" },
  deleted: { zh: "已删除", en: "Deleted" },
  confirmDelete: { zh: "确认删除此公告？", en: "Delete this announcement?" },
  confirmClear: { zh: "确认清除所有草稿？此操作不可恢复。", en: "Clear all drafts? This cannot be undone." },
  unsavedWarn: { zh: "未导出的更改会丢失，建议先导出", en: "Export before leaving to save changes" },
} as const;

const AUTH_KEY = "quiddity-admin-authed";

export default function Admin() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(AUTH_KEY) === "1";
  });

  if (!authed) {
    return <PasswordGate onSuccess={() => setAuthed(true)} />;
  }

  return <AdminPanel onLogout={() => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  }} />;
}

// ==================== 密码门 ====================

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPassword(password)) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-dark-950 to-black" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand-500/[0.04] blur-[180px] pointer-events-none" />

      <ScrollReveal className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <EnergyRing size={64} strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{t(TXT.title)}</h1>
          <p className="text-xs text-dark-400">{t(TXT.subtitle)}</p>
        </div>

        <form onSubmit={handleSubmit} className="glass glow-border rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-xs text-dark-300 mb-2 font-medium">
              {t(TXT.passwordLabel)}
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder={t(TXT.passwordPlaceholder)}
                autoFocus
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-dark-900 border border-white/[0.06] text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-brand-500/40 transition-colors"
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <AlertTriangle size={12} />
                {t(TXT.wrongPassword)}
              </p>
            )}
          </div>

          {isDefaultPassword() && (
            <p className="text-[10px] text-amber-400/70 bg-amber-500/[0.05] border border-amber-500/10 rounded-lg px-3 py-2">
              {t(TXT.defaultPasswordHint)}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold hover:from-brand-400 hover:to-brand-500 transition-all"
          >
            {t(TXT.login)}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full text-xs text-dark-500 hover:text-dark-300 transition-colors flex items-center justify-center gap-1"
          >
            <ArrowLeft size={12} />
            {t(TXT.backHome)}
          </button>
        </form>
      </ScrollReveal>
    </div>
  );
}

// ==================== 管理面板 ====================

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [data, setData] = useState<AnnouncementsData>({ important: [], latest: [] });
  const [editing, setEditing] = useState<AnnouncementItem | null>(null);
  const [editCategory, setEditCategory] = useState<AnnouncementCategory>("important");
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // 初始化：从 localStorage 加载草稿，无则用空结构
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setData(draft);
    }
  }, []);

  // 自动保存到 localStorage
  const persist = useCallback((newData: AnnouncementsData) => {
    setData(newData);
    saveDraft(newData);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleAdd = () => {
    setEditing({
      id: 0,
      title: "",
      content: "",
      date: todayStr(),
      tag: "",
    });
    setEditCategory("important");
    setIsNew(true);
  };

  const handleEdit = (item: AnnouncementItem, category: AnnouncementCategory) => {
    setEditing({ ...item });
    setEditCategory(category);
    setIsNew(false);
  };

  const handleSave = (item: AnnouncementItem, category: AnnouncementCategory) => {
    if (!item.title.trim() || !item.content.trim()) {
      showToast("标题和内容不能为空");
      return;
    }
    const newData = { ...data };
    if (isNew) {
      // 新增：从源分类移除（如果是切换分类）
      const targetList = newData[category];
      item.id = nextId([...newData.important, ...newData.latest]);
      newData[category] = [...targetList, item];
    } else {
      // 编辑：先从两个分类中移除旧项，再添加到目标分类
      newData.important = newData.important.filter((x) => x.id !== item.id);
      newData.latest = newData.latest.filter((x) => x.id !== item.id);
      newData[category] = [...newData[category], item];
    }
    persist(newData);
    setEditing(null);
    showToast(t(TXT.saved));
  };

  const handleDelete = (id: number) => {
    if (!confirm(t(TXT.confirmDelete))) return;
    const newData = {
      important: data.important.filter((x) => x.id !== id),
      latest: data.latest.filter((x) => x.id !== id),
    };
    persist(newData);
    showToast(t(TXT.deleted));
  };

  const handleExport = () => {
    exportToJson(data);
    showToast(t(TXT.export));
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importFromJson(file);
      persist(imported);
      showToast(t(TXT.import) + " ✓");
    } catch (err) {
      showToast("导入失败：" + (err as Error).message);
    }
    e.target.value = "";
  };

  const handleClear = () => {
    if (!confirm(t(TXT.confirmClear))) return;
    clearDraft();
    setData({ important: [], latest: [] });
    showToast("已清除");
  };

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-dark-950 to-black" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full bg-brand-500/[0.03] blur-[160px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        {/* 顶栏 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-brand-400 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {t(TXT.backHome)}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04] text-xs text-dark-300 hover:text-brand-400 hover:border-brand-500/20 transition-all"
            >
              <KeyRound size={12} />
              {t(TXT.changePassword)}
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04] text-xs text-dark-300 hover:text-red-400 hover:border-red-500/20 transition-all"
            >
              <LogOut size={12} />
              {t(TXT.logout)}
            </button>
          </div>
        </div>

        {/* Header */}
        <ScrollReveal className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <EnergyRing size={56} strokeWidth={2} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t(TXT.title)}</h1>
          <p className="text-xs text-dark-400">{t(TXT.subtitle)}</p>
        </ScrollReveal>

        {/* GitHub 真实数据面板（替代虚假数据） */}
        <div className="mb-6">
          <GitHubStatsPanel />
        </div>

        {/* 密码修改区 */}
        <AnimatePresence>
          {showPasswordChange && (
            <PasswordChangeForm
              onClose={() => setShowPasswordChange(false)}
              onSuccess={() => {
                setShowPasswordChange(false);
                showToast(t(TXT.passwordChanged));
              }}
            />
          )}
        </AnimatePresence>

        {/* 工具栏 */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs font-semibold hover:from-brand-400 hover:to-brand-500 transition-all"
          >
            <Plus size={14} />
            {t(TXT.addNew)}
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04] text-xs text-dark-200 hover:text-brand-400 hover:border-brand-500/20 transition-all"
          >
            <Download size={12} />
            {t(TXT.export)}
          </button>
          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04] text-xs text-dark-200 hover:text-brand-400 hover:border-brand-500/20 transition-all cursor-pointer">
            <Upload size={12} />
            {t(TXT.import)}
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04] text-xs text-dark-200 hover:text-red-400 hover:border-red-500/20 transition-all ml-auto"
          >
            <Trash2 size={12} />
            {t(TXT.clear)}
          </button>
        </div>

        {/* 草稿提示 */}
        <div className="text-[10px] text-amber-400/60 bg-amber-500/[0.03] border border-amber-500/10 rounded-lg px-3 py-2 mb-6 flex items-center gap-1.5">
          <AlertTriangle size={11} />
          {t(TXT.unsavedWarn)}
        </div>

        {/* 公告列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnnouncementList
            title={t(TXT.important)}
            items={data.important}
            category="important"
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyText={t(TXT.empty)}
          />
          <AnnouncementList
            title={t(TXT.latest)}
            items={data.latest}
            category="latest"
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyText={t(TXT.empty)}
          />
        </div>
      </div>

      {/* 编辑器弹窗 */}
      <AnimatePresence>
        {editing && (
          <AnnouncementEditor
            item={editing}
            category={editCategory}
            isNew={isNew}
            onSave={handleSave}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-lg bg-dark-800 border border-brand-500/30 text-sm text-white flex items-center gap-2"
          >
            <CheckCircle size={14} className="text-brand-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== 公告列表 ====================

function AnnouncementList({
  title,
  items,
  category,
  onEdit,
  onDelete,
  emptyText,
}: {
  title: string;
  items: AnnouncementItem[];
  category: AnnouncementCategory;
  onEdit: (item: AnnouncementItem, category: AnnouncementCategory) => void;
  onDelete: (id: number) => void;
  emptyText: string;
}) {
  return (
    <div className="glass glow-border rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <Megaphone size={14} className="text-brand-400" />
        {title}
        <span className="text-xs text-dark-500 ml-auto">{items.length}</span>
      </h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-xs text-dark-600 text-center py-8">{emptyText}</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="group p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-brand-500/20 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-xs font-semibold text-white flex-1 line-clamp-2">
                  {item.title}
                </h4>
                <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(item, category)}
                    className="p-1 rounded hover:bg-brand-500/10 text-dark-400 hover:text-brand-400 transition-colors"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1 rounded hover:bg-red-500/10 text-dark-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-dark-500">
                <span>{item.date}</span>
                {item.tag && (
                  <span className="px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400">{item.tag}</span>
                )}
              </div>
              <p className="text-[11px] text-dark-400 mt-1 line-clamp-2 whitespace-pre-wrap">
                {item.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==================== 编辑器 ====================

function AnnouncementEditor({
  item,
  category,
  isNew,
  onSave,
  onClose,
}: {
  item: AnnouncementItem;
  category: AnnouncementCategory;
  isNew: boolean;
  onSave: (item: AnnouncementItem, category: AnnouncementCategory) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [draft, setDraft] = useState<AnnouncementItem>(item);
  const [cat, setCat] = useState<AnnouncementCategory>(category);

  const field = "w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/[0.06] text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-brand-500/40 transition-colors";
  const label = "block text-xs text-dark-300 mb-1.5 font-medium";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="glass glow-border rounded-2xl p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">
            {isNew ? t(TXT.addNew) : t(TXT.edit)}
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/[0.05] text-dark-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={label}>{t(TXT.titleField)}</label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className={field}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>{t(TXT.dateField)}</label>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label className={label}>{t(TXT.tagField)}</label>
              <input
                type="text"
                value={draft.tag ?? ""}
                onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
                className={field}
              />
            </div>
          </div>

          <div>
            <label className={label}>{t(TXT.categoryField)}</label>
            <div className="flex gap-2">
              {(["important", "latest"] as AnnouncementCategory[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    cat === c
                      ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                      : "bg-white/[0.02] text-dark-400 border border-white/[0.04] hover:text-dark-200"
                  }`}
                >
                  {c === "important" ? t(TXT.important) : t(TXT.latest)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={label}>{t(TXT.contentField)}</label>
            <textarea
              value={draft.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              rows={6}
              className={`${field} resize-none`}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onSave(draft, cat)}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold hover:from-brand-400 hover:to-brand-500 transition-all flex items-center justify-center gap-1.5"
            >
              <Save size={14} />
              {t(TXT.save)}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04] text-sm text-dark-300 hover:text-white transition-colors"
            >
              {t(TXT.cancel)}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== 密码修改 ====================

function PasswordChangeForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t } = useI18n();
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [mismatch, setMismatch] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      setMismatch(true);
      return;
    }
    if (newPwd.length < 4) {
      setMismatch(true);
      return;
    }
    changePassword(newPwd);
    onSuccess();
  };

  const field = "w-full px-3 py-2 rounded-lg bg-dark-900 border border-white/[0.06] text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-brand-500/40 transition-colors";
  const label = "block text-xs text-dark-300 mb-1.5 font-medium";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden mb-4"
    >
      <form onSubmit={handleSubmit} className="glass glow-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <KeyRound size={14} className="text-brand-400" />
            {t(TXT.changePassword)}
          </h3>
          <button type="button" onClick={onClose} className="p-1 text-dark-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
        <div>
          <label className={label}>{t(TXT.newPassword)}</label>
          <input
            type="password"
            value={newPwd}
            onChange={(e) => {
              setNewPwd(e.target.value);
              setMismatch(false);
            }}
            className={field}
            autoFocus
          />
        </div>
        <div>
          <label className={label}>{t(TXT.confirmPassword)}</label>
          <input
            type="password"
            value={confirmPwd}
            onChange={(e) => {
              setConfirmPwd(e.target.value);
              setMismatch(false);
            }}
            className={field}
          />
        </div>
        {mismatch && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <AlertTriangle size={11} />
            {t(TXT.passwordMismatch)}
          </p>
        )}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-semibold hover:bg-brand-500/30 transition-colors"
        >
          {t(TXT.save)}
        </button>
      </form>
    </motion.div>
  );
}
