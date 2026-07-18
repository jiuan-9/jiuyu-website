import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Calendar,
  Tag,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  date: string;
  tag?: string;
}

interface AnnouncementsData {
  important: AnnouncementItem[];
  latest: AnnouncementItem[];
}

const STORAGE_KEY = "quiddity_announcements";

export default function AnnouncementAdmin() {
  const navigate = useNavigate();
  const [data, setData] = useState<AnnouncementsData>({ important: [], latest: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    tag: "",
    date: "",
    category: "important" as "important" | "latest",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        const res = await fetch(`${import.meta.env.BASE_URL}announcements.json`);
        const json = await res.json();
        setData(json);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
      }
    } catch {
      const res = await fetch(`${import.meta.env.BASE_URL}announcements.json`);
      const json = await res.json();
      setData(json);
    }
    setLoading(false);
  };

  const saveData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSuccess("保存成功！");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setForm({
      title: "",
      content: "",
      tag: "",
      date: new Date().toISOString().split("T")[0],
      category: "important",
    });
    setShowModal(true);
  };

  const handleEdit = (item: AnnouncementItem, category: "important" | "latest") => {
    setEditingItem(item);
    setForm({
      title: item.title,
      content: item.content,
      tag: item.tag || "",
      date: item.date,
      category,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number, category: "important" | "latest") => {
    if (!confirm("确定要删除这条公告吗？")) return;
    setData((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setError("请输入公告标题");
      return;
    }
    if (!form.content.trim()) {
      setError("请输入公告内容");
      return;
    }
    if (!form.date) {
      setError("请选择日期");
      return;
    }

    setError("");

    if (editingItem) {
      setData((prev) => ({
        ...prev,
        [form.category]: prev[form.category].map((item) =>
          item.id === editingItem.id
            ? { ...item, ...form, id: editingItem.id }
            : item
        ),
      }));
    } else {
      const newId = Math.max(
        ...data.important.map((i) => i.id),
        ...data.latest.map((i) => i.id),
        0
      ) + 1;
      setData((prev) => ({
        ...prev,
        [form.category]: [...prev[form.category], { ...form, id: newId }],
      }));
    }

    setShowModal(false);
    setEditingItem(null);
  };

  const handleReset = () => {
    if (!confirm("确定要恢复到初始状态吗？所有修改将丢失。")) return;
    localStorage.removeItem(STORAGE_KEY);
    loadData();
    setSuccess("已恢复到初始状态");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handlePublish = () => {
    saveData();
    navigate("/");
  };

  const authenticate = () => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("密码错误，请联系管理员获取正确密码");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass glow-border rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                <LockIcon />
              </div>
              <h1 className="text-xl font-bold text-white mb-2">公告管理</h1>
              <p className="text-sm text-dark-400">请输入密码以进入管理界面</p>
            </div>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && authenticate()}
                placeholder="请输入密码"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder-dark-500 focus:outline-none focus:border-brand-500/50 transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              onClick={authenticate}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 text-white font-medium hover:opacity-90 transition-opacity"
            >
              进入管理
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-dark-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <nav className="border-b border-white/[0.04] sticky top-0 bg-dark-950/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white">Quiddity</span>
            <span className="text-xs text-dark-500">公告管理</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-dark-400 hover:text-dark-200 hover:bg-white/[0.03] transition-colors"
            >
              <RotateCcw size={16} />
              恢复初始
            </button>
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-400 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Save size={16} />
              保存并推送
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
            <Check size={16} />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass glow-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-brand-400" />
                <h2 className="text-lg font-semibold text-white">重要公告</h2>
              </div>
              <button
                onClick={() => {
                  setForm((prev) => ({ ...prev, category: "important" }));
                  handleAdd();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-medium hover:bg-brand-500/20 transition-colors"
              >
                <Plus size={14} />
                添加
              </button>
            </div>
            <div className="space-y-3">
              {data.important.length === 0 ? (
                <div className="py-8 text-center text-dark-500 text-sm">暂无重要公告</div>
              ) : (
                data.important.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-white">{item.title}</h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(item, "important")}
                          className="p-1.5 rounded-lg text-dark-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, "important")}
                          className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-dark-500 mb-2">
                      {item.tag && (
                        <span className="flex items-center gap-1">
                          <Tag size={10} />
                          {item.tag}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {item.date}
                      </span>
                    </div>
                    <p className="text-xs text-dark-400 line-clamp-2">{item.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass glow-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-white/70" />
                <h2 className="text-lg font-semibold text-white">最新公告</h2>
              </div>
              <button
                onClick={() => {
                  setForm((prev) => ({ ...prev, category: "latest" }));
                  handleAdd();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] text-dark-300 text-xs font-medium hover:bg-white/[0.08] transition-colors"
              >
                <Plus size={14} />
                添加
              </button>
            </div>
            <div className="space-y-3">
              {data.latest.length === 0 ? (
                <div className="py-8 text-center text-dark-500 text-sm">暂无最新公告</div>
              ) : (
                data.latest.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium text-white">{item.title}</h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(item, "latest")}
                          className="p-1.5 rounded-lg text-dark-500 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, "latest")}
                          className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-dark-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {item.date}
                      </span>
                    </div>
                    <p className="text-xs text-dark-400 line-clamp-2">{item.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="w-full max-w-lg glass glow-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {editingItem ? "编辑公告" : "添加公告"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
                className="p-1.5 rounded-lg text-dark-500 hover:text-dark-300 hover:bg-white/[0.03] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-dark-400 mb-1.5">分类</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value as "important" | "latest" }))
                  }
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-brand-500/50"
                >
                  <option value="important">重要公告</option>
                  <option value="latest">最新公告</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-dark-400 mb-1.5">标题</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="请输入公告标题"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white placeholder-dark-500 text-sm focus:outline-none focus:border-brand-500/50"
                />
              </div>

              <div>
                <label className="block text-xs text-dark-400 mb-1.5">标签（仅重要公告）</label>
                <input
                  type="text"
                  value={form.tag}
                  onChange={(e) => setForm((prev) => ({ ...prev, tag: e.target.value }))}
                  placeholder="如：重要更新"
                  disabled={form.category === "latest"}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white placeholder-dark-500 text-sm focus:outline-none focus:border-brand-500/50 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs text-dark-400 mb-1.5">日期</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-brand-500/50"
                />
              </div>

              <div>
                <label className="block text-xs text-dark-400 mb-1.5">内容</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="请输入公告内容，支持换行"
                  rows={5}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white placeholder-dark-500 text-sm focus:outline-none focus:border-brand-500/50 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 rounded-lg text-sm text-dark-400 hover:text-dark-200 hover:bg-white/[0.03] transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-400 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {editingItem ? "保存修改" : "添加公告"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}