"""
Quiddity 网站管理后台

功能：公告管理（增删改查 + 实时预览 + 模板） + 网站监测 + 一键推送上线
启动：双击 start.bat 或网站根目录的启动管理后台.bat
"""

from __future__ import annotations

import os
import sys
import threading
from datetime import datetime
from pathlib import Path
from tkinter import messagebox

import customtkinter as ctk

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from announcements import AnnouncementItem, AnnouncementStore
from deployer import full_deploy
from github_client import GitHubClient
from config_store import load_config

# ====================================================================
# 公告编辑常量
# ====================================================================

# 公告模板：一键填充表单（不再使用标签，只填标题和内容）
ANNOUNCEMENT_TEMPLATES = {
    "新版本发布": {
        "title": "Quiddity vX.X.X 发布",
        "content": "本次更新内容：\n\n1. 新功能：\n2. 优化：\n3. 修复：\n\n欢迎下载体验！",
    },
    "重要通知": {
        "title": "重要通知",
        "content": "尊敬的用户：\n\n[在此填写通知内容]\n\n感谢您的支持。",
    },
    "活动公告": {
        "title": "活动公告",
        "content": "🎉 [活动名称] 开始啦！\n\n活动时间：\n参与方式：\n\n期待您的参与！",
    },
    "清空模板": None,  # 特殊：清空表单
}

# ====================================================================
# 自动检测项目根目录（管理后台/ -> 网站根目录）
# ====================================================================

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent

# ====================================================================
# 样式
# ====================================================================

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

BG = "#0a0e1a"
BG_PANEL = "#0f1623"
BG_CARD = "#1a1f2e"
BG_HOVER = "#252a3a"
BORDER = "#2a3041"
ACCENT = "#14b0ff"
ACCENT_DARK = "#0072bc"
RED = "#ef4444"
TEXT = "#ffffff"
TEXT_MUTED = "#8a94b4"
TEXT_DIM = "#555884"


# ====================================================================
# 主窗口
# ====================================================================

class App(ctk.CTk):

    def __init__(self):
        super().__init__()

        self.ann_store = AnnouncementStore(PROJECT_ROOT / "public" / "announcements.json")
        self.is_busy = False

        # 公告编辑状态：当前正在编辑的公告（None=新建模式）
        self.editing_id: int | None = None
        self.editing_category: str = "important"

        self.title("Quiddity 管理后台")
        self.geometry("1280x800")
        self.minsize(1100, 700)
        self.configure(fg_color=BG)

        self._build()

    # ================================================================
    # 布局
    # ================================================================

    def _build(self):
        self.grid_columnconfigure(0, weight=0)
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self._build_sidebar()
        self._build_pages()

    def _build_sidebar(self):
        bar = ctk.CTkFrame(self, fg_color=BG_PANEL, corner_radius=0, width=180)
        bar.grid(row=0, column=0, sticky="nsw")
        bar.grid_propagate(False)

        ctk.CTkLabel(
            bar, text="Quiddity",
            font=ctk.CTkFont(family="Microsoft YaHei", size=20, weight="bold"),
            text_color=TEXT,
        ).pack(padx=20, pady=(24, 2), anchor="w")

        ctk.CTkLabel(
            bar, text="网站管理后台",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED,
        ).pack(padx=20, pady=(0, 28), anchor="w")

        self.nav_btns = {}
        nav_items = [
            ("announcements", "公告管理"),
            ("monitor", "网站监测"),
            ("deploy", "推送上线"),
        ]

        for key, label in nav_items:
            btn = ctk.CTkButton(
                bar, text=label, anchor="w",
                font=ctk.CTkFont(family="Microsoft YaHei", size=14),
                fg_color="transparent", hover_color=BG_HOVER,
                text_color=TEXT_MUTED, height=48, corner_radius=8,
                command=lambda k=key: self._switch_page(k),
            )
            btn.pack(padx=12, pady=3, fill="x")
            self.nav_btns[key] = btn

        self.status_lbl = ctk.CTkLabel(
            bar, text="就绪",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED,
        )
        self.status_lbl.pack(side="bottom", padx=20, pady=20, anchor="w")

    def _switch_page(self, key):
        for k, page in self.pages.items():
            if k == key:
                page.grid(row=0, column=0, sticky="nsew")
            else:
                page.grid_forget()
        for k, btn in self.nav_btns.items():
            if k == key:
                btn.configure(fg_color=ACCENT_DARK, text_color=TEXT)
            else:
                btn.configure(fg_color="transparent", text_color=TEXT_MUTED)

    def _build_pages(self):
        content = ctk.CTkFrame(self, fg_color=BG, corner_radius=0)
        content.grid(row=0, column=1, sticky="nsew")
        content.grid_rowconfigure(0, weight=1)
        content.grid_columnconfigure(0, weight=1)

        self.pages = {}
        self._build_announcements_page(content)
        self._build_monitor_page(content)
        self._build_deploy_page(content)
        self._switch_page("announcements")

    # ================================================================
    # 公告管理页
    # ================================================================

    def _build_announcements_page(self, parent):
        page = ctk.CTkFrame(parent, fg_color=BG, corner_radius=0)
        page.grid_rowconfigure(0, weight=0)
        page.grid_rowconfigure(1, weight=1)
        page.grid_columnconfigure(0, weight=1)

        # 顶部标题 + 状态指示
        header = ctk.CTkFrame(page, fg_color="transparent")
        header.grid(row=0, column=0, sticky="ew", padx=28, pady=(24, 12))
        header.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            header, text="公告管理",
            font=ctk.CTkFont(family="Microsoft YaHei", size=22, weight="bold"),
            text_color=TEXT,
        ).grid(row=0, column=0, sticky="w")

        # 编辑模式指示器（新建/编辑中）
        self.ann_mode_lbl = ctk.CTkLabel(
            header, text="🟢 新建模式",
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            text_color=ACCENT,
        )
        self.ann_mode_lbl.grid(row=0, column=1, sticky="e")

        body = ctk.CTkFrame(page, fg_color="transparent")
        body.grid(row=1, column=0, sticky="nsew", padx=28, pady=(0, 24))
        # 三栏布局：列表(35%) + 编辑(40%) + 预览(25%)
        body.grid_columnconfigure(0, weight=35, uniform="a")
        body.grid_columnconfigure(1, weight=40, uniform="a")
        body.grid_columnconfigure(2, weight=25, uniform="a")
        body.grid_rowconfigure(0, weight=1)

        # --- 左：公告列表（分两个框：重要 + 最新） ---
        left = ctk.CTkFrame(body, fg_color="transparent")
        left.grid(row=0, column=0, sticky="nsew", padx=(0, 6))
        left.grid_rowconfigure(0, weight=1)  # 重要公告框
        left.grid_rowconfigure(1, weight=1)  # 最新公告框
        left.grid_columnconfigure(0, weight=1)

        # 「重要公告」框
        important_box = ctk.CTkFrame(left, fg_color=BG_CARD, corner_radius=12,
                                     border_width=1, border_color="#ef4444")
        important_box.grid(row=0, column=0, sticky="nsew", pady=(0, 6))
        important_box.grid_rowconfigure(1, weight=1)
        important_box.grid_columnconfigure(0, weight=1)

        imp_header = ctk.CTkFrame(important_box, fg_color="transparent")
        imp_header.grid(row=0, column=0, sticky="ew", padx=14, pady=(10, 4))
        ctk.CTkLabel(
            imp_header, text="🔴 重要公告",
            font=ctk.CTkFont(family="Microsoft YaHei", size=13, weight="bold"),
            text_color="#ef4444",
        ).pack(side="left")
        self.imp_count_lbl = ctk.CTkLabel(
            imp_header, text="(0)",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_DIM,
        )
        self.imp_count_lbl.pack(side="left", padx=(6, 0))

        self.list_scroll_important = ctk.CTkScrollableFrame(
            important_box, fg_color="transparent", label_text="")
        self.list_scroll_important.grid(row=1, column=0, sticky="nsew", padx=6, pady=(0, 6))
        self.list_scroll_important.grid_columnconfigure(0, weight=1)

        # 「最新公告」框
        latest_box = ctk.CTkFrame(left, fg_color=BG_CARD, corner_radius=12,
                                   border_width=1, border_color=ACCENT)
        latest_box.grid(row=1, column=0, sticky="nsew")
        latest_box.grid_rowconfigure(1, weight=1)
        latest_box.grid_columnconfigure(0, weight=1)

        lat_header = ctk.CTkFrame(latest_box, fg_color="transparent")
        lat_header.grid(row=0, column=0, sticky="ew", padx=14, pady=(10, 4))
        ctk.CTkLabel(
            lat_header, text="🔵 最新公告",
            font=ctk.CTkFont(family="Microsoft YaHei", size=13, weight="bold"),
            text_color=ACCENT,
        ).pack(side="left")
        self.lat_count_lbl = ctk.CTkLabel(
            lat_header, text="(0)",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_DIM,
        )
        self.lat_count_lbl.pack(side="left", padx=(6, 0))

        self.list_scroll_latest = ctk.CTkScrollableFrame(
            latest_box, fg_color="transparent", label_text="")
        self.list_scroll_latest.grid(row=1, column=0, sticky="nsew", padx=6, pady=(0, 6))
        self.list_scroll_latest.grid_columnconfigure(0, weight=1)

        # 批量操作栏（放在两个框下方不行，空间不够，改到右上角）
        # 保留 cat_var 兼容旧代码（_save_announcement 用），但不再显示为下拉
        self.cat_var = ctk.StringVar(value="important")

        # --- 中：编辑表单 ---
        right = ctk.CTkFrame(body, fg_color=BG_CARD, corner_radius=12,
                             border_width=1, border_color=BORDER)
        right.grid(row=0, column=1, sticky="nsew", padx=6)
        right.grid_columnconfigure(0, weight=1)
        right.grid_rowconfigure(7, weight=1)  # 内容输入框可扩展

        # 表单标题（动态切换"新增/编辑"）
        self.ann_form_title_lbl = ctk.CTkLabel(
            right, text="新增公告",
            font=ctk.CTkFont(family="Microsoft YaHei", size=14, weight="bold"),
            text_color=TEXT,
        )
        self.ann_form_title_lbl.grid(row=0, column=0, sticky="w", padx=16, pady=(12, 4))

        # 模板按钮栏
        tpl_bar = ctk.CTkFrame(right, fg_color="transparent")
        tpl_bar.grid(row=1, column=0, sticky="ew", padx=16, pady=(0, 8))

        ctk.CTkLabel(
            tpl_bar, text="模板:",
            font=ctk.CTkFont(family="Microsoft YaHei", size=10),
            text_color=TEXT_DIM,
        ).pack(side="left", padx=(0, 4))

        for tpl_name in ANNOUNCEMENT_TEMPLATES:
            ctk.CTkButton(
                tpl_bar, text=tpl_name, width=70, height=22,
                font=ctk.CTkFont(family="Microsoft YaHei", size=10),
                fg_color=BG_PANEL, border_color=BORDER, border_width=1,
                text_color=TEXT_MUTED, hover_color=ACCENT_DARK,
                command=lambda n=tpl_name: self._apply_template(n),
            ).pack(side="left", padx=2)

        # 标题输入
        ctk.CTkLabel(
            right, text="标题",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED, anchor="w",
        ).grid(row=2, column=0, sticky="w", padx=16, pady=(4, 2))

        self.ann_title_var = ctk.StringVar()
        self.ann_title_var.trace_add("write", self._update_preview)
        ctk.CTkEntry(
            right, textvariable=self.ann_title_var,
            font=ctk.CTkFont(family="Microsoft YaHei", size=13),
            height=34, fg_color=BG_PANEL, border_color=BORDER,
            text_color=TEXT,
        ).grid(row=3, column=0, sticky="ew", padx=16, pady=(0, 8))

        # 内容输入
        ctk.CTkLabel(
            right, text="内容（支持换行，网站会按段落显示）",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED, anchor="w",
        ).grid(row=4, column=0, sticky="w", padx=16, pady=(4, 2))

        self.ann_content_tb = ctk.CTkTextbox(
            right, font=ctk.CTkFont(family="Microsoft YaHei", size=13),
            fg_color=BG_PANEL, border_color=BORDER, border_width=1,
            text_color=TEXT, height=200, wrap="word",
        )
        self.ann_content_tb.grid(row=5, column=0, sticky="nsew", padx=16, pady=(0, 8))
        self.ann_content_tb.bind("<KeyRelease>", self._update_preview)

        # 日期 + 标签行
        row = ctk.CTkFrame(right, fg_color="transparent")
        row.grid(row=6, column=0, sticky="ew", padx=16, pady=(0, 8))

        # 分类选择（重要/最新）— 对应网站的两个 tab
        ctk.CTkLabel(
            row, text="分类",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED,
        ).grid(row=0, column=0, padx=(0, 4))

        self.ann_category = ctk.StringVar(value="important")
        cat_menu = ctk.CTkSegmentedButton(
            row,
            values=["important", "latest"],
            variable=self.ann_category,
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            fg_color=BG_PANEL,
            selected_color=ACCENT_DARK,
            selected_hover_color=ACCENT,
            text_color=TEXT,
            height=28,
        )
        cat_menu.grid(row=0, column=1, sticky="w", padx=(0, 12))

        ctk.CTkLabel(
            row, text="日期",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED,
        ).grid(row=0, column=2, padx=(0, 4))

        self.ann_date = ctk.StringVar(value=datetime.now().strftime("%Y-%m-%d"))
        date_entry = ctk.CTkEntry(
            row, textvariable=self.ann_date,
            font=ctk.CTkFont(family="Consolas", size=11),
            height=28, width=110, fg_color=BG_PANEL,
            border_color=BORDER, text_color=TEXT,
        )
        date_entry.grid(row=0, column=1, sticky="w", padx=(0, 4))

        # 日期快捷按钮：今天
        ctk.CTkButton(
            row, text="今天", width=40, height=28,
            font=ctk.CTkFont(family="Microsoft YaHei", size=10),
            fg_color=BG_PANEL, border_color=BORDER, border_width=1,
            text_color=TEXT_MUTED, hover_color=BG_HOVER,
            command=lambda: self.ann_date.set(datetime.now().strftime("%Y-%m-%d")),
        ).grid(row=0, column=2, padx=(0, 8))

        # 保存 + 取消编辑按钮
        btn_row = ctk.CTkFrame(right, fg_color="transparent")
        btn_row.grid(row=8, column=0, sticky="ew", padx=16, pady=(4, 16))

        self.save_btn = ctk.CTkButton(
            btn_row, text="保存公告", height=40,
            font=ctk.CTkFont(family="Microsoft YaHei", size=13, weight="bold"),
            fg_color=ACCENT_DARK, hover_color=ACCENT, text_color=TEXT,
            command=self._save_announcement,
        )
        self.save_btn.pack(side="left", fill="x", expand=True, padx=(0, 4))

        self.cancel_edit_btn = ctk.CTkButton(
            btn_row, text="取消编辑", height=40,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            fg_color=BG_PANEL, border_color=BORDER, border_width=1,
            text_color=TEXT_MUTED, hover_color=BG_HOVER,
            command=self._clear_form,
            state="disabled",
        )
        self.cancel_edit_btn.pack(side="left", fill="x", expand=True, padx=(4, 0))

        # --- 右：实时预览 ---
        preview_panel = ctk.CTkFrame(body, fg_color=BG_CARD, corner_radius=12,
                                     border_width=1, border_color=BORDER)
        preview_panel.grid(row=0, column=2, sticky="nsew", padx=(6, 0))
        preview_panel.grid_columnconfigure(0, weight=1)
        preview_panel.grid_rowconfigure(1, weight=1)

        ctk.CTkLabel(
            preview_panel, text="实时预览",
            font=ctk.CTkFont(family="Microsoft YaHei", size=14, weight="bold"),
            text_color=TEXT,
        ).grid(row=0, column=0, sticky="w", padx=14, pady=(12, 4))

        ctk.CTkLabel(
            preview_panel, text="（模拟网站显示效果）",
            font=ctk.CTkFont(family="Microsoft YaHei", size=10),
            text_color=TEXT_DIM,
        ).grid(row=0, column=0, sticky="e", padx=14, pady=(12, 4))

        # 预览容器（CTkScrollableFrame，模拟网站公告卡片）
        self.preview_scroll = ctk.CTkScrollableFrame(
            preview_panel, fg_color=BG, corner_radius=8,
            border_width=1, border_color=BORDER,
        )
        self.preview_scroll.grid(row=1, column=0, sticky="nsew", padx=8, pady=(0, 8))
        self.preview_scroll.grid_columnconfigure(0, weight=1)

        # 预览卡片
        self.preview_card = ctk.CTkFrame(
            self.preview_scroll, fg_color=BG_PANEL, corner_radius=8,
            border_width=1, border_color=ACCENT_DARK,
        )
        self.preview_card.grid(row=0, column=0, sticky="ew", padx=4, pady=4)
        self.preview_card.grid_columnconfigure(0, weight=1)

        self.preview_title_lbl = ctk.CTkLabel(
            self.preview_card, text="（请输入标题）",
            font=ctk.CTkFont(family="Microsoft YaHei", size=14, weight="bold"),
            text_color=TEXT, anchor="w", justify="left", wraplength=220,
        )
        self.preview_title_lbl.grid(row=0, column=0, sticky="ew", padx=12, pady=(10, 4))

        self.preview_meta_lbl = ctk.CTkLabel(
            self.preview_card, text="",
            font=ctk.CTkFont(family="Consolas", size=10),
            text_color=TEXT_DIM, anchor="w",
        )
        self.preview_meta_lbl.grid(row=1, column=0, sticky="w", padx=12, pady=(0, 4))

        self.preview_content_lbl = ctk.CTkLabel(
            self.preview_card, text="（请输入内容）",
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            text_color=TEXT_MUTED, anchor="w", justify="left", wraplength=220,
        )
        self.preview_content_lbl.grid(row=2, column=0, sticky="ew", padx=12, pady=(0, 10))

        self.pages["announcements"] = page
        self._refresh_list()
        self._update_preview()

    # ================================================================
    # 公告编辑辅助方法
    # ================================================================

    def _apply_template(self, tpl_name: str):
        """点击模板按钮时填充表单。"""
        tpl = ANNOUNCEMENT_TEMPLATES.get(tpl_name)
        if tpl is None:
            # "清空模板" 特殊项
            self._clear_form()
            return
        self.ann_title_var.set(tpl["title"])
        self.ann_content_tb.delete("1.0", "end")
        self.ann_content_tb.insert("1.0", tpl["content"])
        self.ann_date.set(datetime.now().strftime("%Y-%m-%d"))
        self._set_status(f"已应用模板：{tpl_name}")
        self._update_preview()

    def _clear_form(self, *_):
        """清空表单，回到新建模式。"""
        self.editing_id = None
        self.editing_category = "important"
        self.ann_title_var.set("")
        self.ann_content_tb.delete("1.0", "end")
        self.ann_date.set(datetime.now().strftime("%Y-%m-%d"))
        self.ann_category.set("important")
        self.ann_form_title_lbl.configure(text="新增公告")
        self.ann_mode_lbl.configure(text="🟢 新建模式", text_color=ACCENT)
        self.save_btn.configure(text="保存公告")
        self.cancel_edit_btn.configure(state="disabled")
        self._update_preview()

    def _edit_announcement(self, ann_id: int, category: str):
        """点列表项「编辑」按钮：加载到表单，进入编辑模式。"""
        try:
            data = self.ann_store.load()
        except Exception as e:
            messagebox.showerror("加载失败", str(e))
            return
        items = data.get(category, [])
        target = next((x for x in items if x.id == ann_id), None)
        if target is None:
            messagebox.showwarning("找不到", f"公告 #{ann_id} 不存在")
            return

        # 填充表单
        self.editing_id = ann_id
        self.editing_category = category
        self.ann_title_var.set(target.title)
        self.ann_content_tb.delete("1.0", "end")
        self.ann_content_tb.insert("1.0", target.content)
        self.ann_date.set(target.date)
        self.ann_category.set(category)  # 同步分类选择

        # 切换 UI 到编辑模式
        self.ann_form_title_lbl.configure(text=f"编辑公告 #{ann_id}")
        self.ann_mode_lbl.configure(text=f"✏️ 编辑模式 · #{ann_id}", text_color="#fbbf24")
        self.save_btn.configure(text="保存修改")
        self.cancel_edit_btn.configure(state="normal")

        # 刷新列表（高亮当前编辑的项）
        self._refresh_list()
        self._set_status(f"正在编辑 #{ann_id}")
        self._update_preview()

    def _update_preview(self, *_):
        """根据表单内容更新右侧预览卡片。"""
        title = self.ann_title_var.get().strip() or "（请输入标题）"
        content = self.ann_content_tb.get("1.0", "end-1c").strip() or "（请输入内容）"
        date = self.ann_date.get().strip() or "—"
        category = self.ann_category.get()
        cat_label = "🔴 重要公告" if category == "important" else "🔵 最新公告"

        self.preview_title_lbl.configure(text=title)
        self.preview_meta_lbl.configure(text=f"{cat_label}  ·  📅 {date}")
        # 内容支持换行显示
        self.preview_content_lbl.configure(text=content)

    # ================================================================
    # 网站监测页
    # ================================================================

    def _build_monitor_page(self, parent):
        page = ctk.CTkFrame(parent, fg_color=BG, corner_radius=0)
        page.grid_rowconfigure(0, weight=0)
        page.grid_rowconfigure(1, weight=1)
        page.grid_columnconfigure(0, weight=1)

        # 顶部标题 + 刷新按钮
        header = ctk.CTkFrame(page, fg_color="transparent")
        header.grid(row=0, column=0, sticky="ew", padx=28, pady=(24, 12))
        header.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            header, text="网站监测",
            font=ctk.CTkFont(family="Microsoft YaHei", size=22, weight="bold"),
            text_color=TEXT,
        ).grid(row=0, column=0, sticky="w")

        self.monitor_status_lbl = ctk.CTkLabel(
            header, text="点击刷新获取最新数据",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED,
        )
        self.monitor_status_lbl.grid(row=0, column=1, sticky="e", padx=(0, 8))

        ctk.CTkButton(
            header, text="刷新数据", width=90, height=32,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            fg_color=ACCENT_DARK, hover_color=ACCENT, text_color=TEXT,
            command=self._refresh_monitor,
        ).grid(row=0, column=2, sticky="e")

        # 主体滚动区
        scroll = ctk.CTkScrollableFrame(page, fg_color="transparent", label_text="")
        scroll.grid(row=1, column=0, sticky="nsew", padx=28, pady=(0, 24))
        scroll.grid_columnconfigure(0, weight=1)

        # === GitHub 仓库概览卡片 ===
        repo_card = ctk.CTkFrame(scroll, fg_color=BG_CARD, corner_radius=12,
                                  border_width=1, border_color=BORDER)
        repo_card.grid(row=0, column=0, sticky="ew", pady=(0, 12))
        repo_card.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            repo_card, text="📦 GitHub 仓库概览",
            font=ctk.CTkFont(family="Microsoft YaHei", size=14, weight="bold"),
            text_color=TEXT,
        ).grid(row=0, column=0, sticky="w", padx=16, pady=(12, 8))

        self.repo_stats_frame = ctk.CTkFrame(repo_card, fg_color="transparent")
        self.repo_stats_frame.grid(row=1, column=0, sticky="ew", padx=16, pady=(0, 12))
        self.repo_stats_frame.grid_columnconfigure((0, 1, 2, 3), weight=1)

        self.repo_stat_labels: dict[str, ctk.CTkLabel] = {}
        for i, (key, label, icon) in enumerate([
            ("stars", "Stars", "⭐"),
            ("forks", "Forks", "🍴"),
            ("issues", "Open Issues", "📌"),
            ("watchers", "Watchers", "👀"),
        ]):
            stat_card = ctk.CTkFrame(self.repo_stats_frame, fg_color=BG_PANEL,
                                     corner_radius=8, border_width=1, border_color=BORDER)
            stat_card.grid(row=0, column=i, sticky="nsew", padx=3, pady=3)
            ctk.CTkLabel(
                stat_card, text=f"{icon} {label}",
                font=ctk.CTkFont(family="Microsoft YaHei", size=10),
                text_color=TEXT_MUTED,
            ).pack(pady=(8, 2))
            val_lbl = ctk.CTkLabel(
                stat_card, text="—",
                font=ctk.CTkFont(family="Microsoft YaHei", size=18, weight="bold"),
                text_color=TEXT,
            )
            val_lbl.pack(pady=(0, 8))
            self.repo_stat_labels[key] = val_lbl

        # === Release 下载量卡片 ===
        dl_card = ctk.CTkFrame(scroll, fg_color=BG_CARD, corner_radius=12,
                                border_width=1, border_color=BORDER)
        dl_card.grid(row=1, column=0, sticky="ew", pady=(0, 12))
        dl_card.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            dl_card, text="📥 安装包下载量",
            font=ctk.CTkFont(family="Microsoft YaHei", size=14, weight="bold"),
            text_color=TEXT,
        ).grid(row=0, column=0, sticky="w", padx=16, pady=(12, 8))

        self.dl_total_lbl = ctk.CTkLabel(
            dl_card, text="总下载量：—",
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            text_color=ACCENT,
        )
        self.dl_total_lbl.grid(row=1, column=0, sticky="w", padx=16, pady=(0, 8))

        self.dl_releases_frame = ctk.CTkFrame(dl_card, fg_color="transparent")
        self.dl_releases_frame.grid(row=2, column=0, sticky="ew", padx=16, pady=(0, 12))
        self.dl_releases_frame.grid_columnconfigure(0, weight=1)

        # === 网站访问统计卡片 ===
        web_card = ctk.CTkFrame(scroll, fg_color=BG_CARD, corner_radius=12,
                                 border_width=1, border_color=BORDER)
        web_card.grid(row=2, column=0, sticky="ew", pady=(0, 12))
        web_card.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            web_card, text="🌐 网站访问统计",
            font=ctk.CTkFont(family="Microsoft YaHei", size=14, weight="bold"),
            text_color=TEXT,
        ).grid(row=0, column=0, sticky="w", padx=16, pady=(12, 8))

        ctk.CTkLabel(
            web_card,
            text="网站是纯静态部署（GitHub Pages / Cloudflare Pages），没有后端数据库。\n"
                 "要实现真实的全站访问统计，推荐接入免费且隐私友好的 Cloudflare Web Analytics：\n\n"
                 "1. 注册 Cloudflare 账号 → Web Analytics → 添加站点\n"
                 "2. 复制 JS Beacon 代码\n"
                 "3. 粘贴到 index.html 的 <head> 末尾\n"
                 "4. 在 CF 后台查看 PV/UV/设备/来源/国家等数据\n\n"
                 "本地访问计数（仅本机）：见下方",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED, anchor="w", justify="left",
        ).grid(row=1, column=0, sticky="w", padx=16, pady=(0, 8))

        # 本地访问计数（前端 localStorage 上报，仅本机可见）
        self.local_pv_lbl = ctk.CTkLabel(
            web_card, text="本机访问次数：—",
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            text_color=ACCENT,
        )
        self.local_pv_lbl.grid(row=2, column=0, sticky="w", padx=16, pady=(0, 4))

        self.local_uv_lbl = ctk.CTkLabel(
            web_card, text="本机访客数：—",
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            text_color=ACCENT,
        )
        self.local_uv_lbl.grid(row=3, column=0, sticky="w", padx=16, pady=(0, 4))

        self.local_last_visit_lbl = ctk.CTkLabel(
            web_card, text="最后访问：—",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED,
        )
        self.local_last_visit_lbl.grid(row=4, column=0, sticky="w", padx=16, pady=(0, 12))

        # === API 配额信息 ===
        self.rate_limit_lbl = ctk.CTkLabel(
            scroll, text="",
            font=ctk.CTkFont(family="Consolas", size=10),
            text_color=TEXT_DIM, anchor="w",
        )
        self.rate_limit_lbl.grid(row=3, column=0, sticky="w", pady=(0, 8))

        self.pages["monitor"] = page

    def _refresh_monitor(self):
        """从 GitHub API 拉取最新数据并刷新监测页面。"""
        self.monitor_status_lbl.configure(text="⏳ 正在获取数据...")
        try:
            cfg = load_config()
            client = GitHubClient(repo=cfg.github_repo, token=cfg.github_token)
        except Exception as e:
            self.monitor_status_lbl.configure(text=f"❌ 配置加载失败：{e}")
            return

        def worker():
            try:
                stats = client.fetch_full_stats()
                self.after(0, lambda: self._render_monitor_data(stats))
            except Exception as e:
                err = str(e)
                self.after(0, lambda: self.monitor_status_lbl.configure(
                    text=f"❌ 获取失败：{err[:80]}"))

        threading.Thread(target=worker, daemon=True).start()

    def _render_monitor_data(self, stats):
        """渲染 GitHub 数据到监测页面。"""
        from github_client import format_count, format_file_size, format_relative_time

        # 仓库概览
        self.repo_stat_labels["stars"].configure(text=format_count(stats.repo.stars))
        self.repo_stat_labels["forks"].configure(text=format_count(stats.repo.forks))
        self.repo_stat_labels["issues"].configure(text=format_count(stats.repo.open_issues))
        self.repo_stat_labels["watchers"].configure(text=format_count(stats.repo.watchers))

        # 下载量
        self.dl_total_lbl.configure(
            text=f"总下载量：{format_count(stats.total_downloads)} 次")

        # 清空旧的 Release 列表
        for child in self.dl_releases_frame.winfo_children():
            child.destroy()

        if not stats.releases:
            ctk.CTkLabel(
                self.dl_releases_frame, text="（暂无 Release）",
                font=ctk.CTkFont(family="Microsoft YaHei", size=11),
                text_color=TEXT_DIM,
            ).grid(row=0, column=0, sticky="w", padx=4, pady=4)
        else:
            # 每个 Release 一行
            for i, rel in enumerate(stats.releases[:10]):  # 最多显示 10 个
                rel_card = ctk.CTkFrame(
                    self.dl_releases_frame, fg_color=BG_PANEL, corner_radius=8,
                    border_width=1, border_color=ACCENT_DARK if rel.is_latest else BORDER,
                )
                rel_card.grid(row=i, column=0, sticky="ew", padx=2, pady=4)
                rel_card.grid_columnconfigure(0, weight=1)

                # Release 标题行
                title_text = f"{'🟢 ' if rel.is_latest else '📦 '}{rel.tag_name}"
                if rel.prerelease:
                    title_text += " (预发布)"
                title_text += f"  ·  发布于 {rel.published_at_display}"
                title_text += f"  ·  下载 {format_count(rel.download_count)} 次"

                ctk.CTkLabel(
                    rel_card, text=title_text,
                    font=ctk.CTkFont(family="Microsoft YaHei", size=12, weight="bold"),
                    text_color=TEXT, anchor="w",
                ).grid(row=0, column=0, sticky="w", padx=12, pady=(8, 4))

                # 资产清单
                if rel.assets:
                    for asset in rel.assets:
                        asset_text = (
                            f"  └─ {asset.name}  "
                            f"({format_file_size(asset.size)})  "
                            f"下载 {format_count(asset.download_count)} 次"
                        )
                        ctk.CTkLabel(
                            rel_card, text=asset_text,
                            font=ctk.CTkFont(family="Consolas", size=11),
                            text_color=TEXT_MUTED, anchor="w",
                        ).grid(row=1, column=0, sticky="w", padx=12, pady=(0, 4))
                else:
                    ctk.CTkLabel(
                        rel_card, text="  └─ （无资产文件）",
                        font=ctk.CTkFont(family="Microsoft YaHei", size=11),
                        text_color=TEXT_DIM, anchor="w",
                    ).grid(row=1, column=0, sticky="w", padx=12, pady=(0, 4))

        # API 配额
        self.rate_limit_lbl.configure(
            text=f"GitHub API 配额：{stats.rate_limit_remaining}/{stats.rate_limit_limit}  "
                 f"·  数据获取于 {stats.fetched_at_display}"
        )

        self.monitor_status_lbl.configure(text="✓ 数据已更新")

    # ================================================================
    # 推送上线页
    # ================================================================

    def _build_deploy_page(self, parent):
        page = ctk.CTkFrame(parent, fg_color=BG, corner_radius=0)
        page.grid_rowconfigure(0, weight=0)
        page.grid_rowconfigure(1, weight=0)
        page.grid_rowconfigure(2, weight=1)
        page.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            page, text="推送上线",
            font=ctk.CTkFont(family="Microsoft YaHei", size=22, weight="bold"),
            text_color=TEXT,
        ).grid(row=0, column=0, sticky="w", padx=28, pady=(24, 12))

        ops = ctk.CTkFrame(page, fg_color=BG_CARD, corner_radius=12,
                           border_width=1, border_color=BORDER)
        ops.grid(row=1, column=0, sticky="ew", padx=28, pady=(0, 12))
        ops.grid_columnconfigure(1, weight=1)

        ctk.CTkLabel(
            ops, text="提交信息",
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            text_color=TEXT_MUTED,
        ).grid(row=0, column=0, sticky="w", padx=16, pady=(16, 4))

        self.msg_var = ctk.StringVar(
            value=f"chore: 更新网站 ({datetime.now().strftime('%Y-%m-%d')})")
        ctk.CTkEntry(
            ops, textvariable=self.msg_var,
            font=ctk.CTkFont(family="Microsoft YaHei", size=13),
            height=38, fg_color=BG_PANEL, border_color=BORDER,
            text_color=TEXT,
        ).grid(row=1, column=0, columnspan=2, sticky="ew", padx=16, pady=(0, 8))

        self.build_var = ctk.BooleanVar(value=False)
        ctk.CTkCheckBox(
            ops, text="构建网站  (npm run build)",
            variable=self.build_var, onvalue=False, offvalue=True,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            text_color=TEXT_MUTED, fg_color=ACCENT_DARK,
        ).grid(row=2, column=0, sticky="w", padx=16, pady=(4, 4))

        ctk.CTkButton(
            ops, text="一键推送上线", height=48, width=200,
            font=ctk.CTkFont(family="Microsoft YaHei", size=15, weight="bold"),
            fg_color=ACCENT_DARK, hover_color=ACCENT, text_color=TEXT,
            command=self._do_deploy,
        ).grid(row=2, column=1, sticky="e", padx=16, pady=(4, 16))

        ctk.CTkLabel(
            ops, text=f"项目目录：{PROJECT_ROOT}",
            font=ctk.CTkFont(family="Microsoft YaHei", size=10),
            text_color=TEXT_DIM, anchor="w",
        ).grid(row=3, column=0, columnspan=2, sticky="w", padx=16, pady=(0, 12))

        log_frame = ctk.CTkFrame(page, fg_color=BG_CARD, corner_radius=12,
                                 border_width=1, border_color=BORDER)
        log_frame.grid(row=2, column=0, sticky="nsew", padx=28, pady=(0, 24))
        log_frame.grid_rowconfigure(1, weight=1)
        log_frame.grid_columnconfigure(0, weight=1)

        log_hdr = ctk.CTkFrame(log_frame, fg_color="transparent")
        log_hdr.grid(row=0, column=0, sticky="ew", padx=14, pady=(12, 4))
        log_hdr.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            log_hdr, text="运行日志",
            font=ctk.CTkFont(family="Microsoft YaHei", size=13, weight="bold"),
            text_color=TEXT,
        ).grid(row=0, column=0, sticky="w")

        ctk.CTkButton(
            log_hdr, text="清空", width=60, height=26,
            font=ctk.CTkFont(family="Microsoft YaHei", size=10),
            fg_color="transparent", hover_color=BG_HOVER,
            text_color=TEXT_DIM,
            command=lambda: self.log_tb.delete("1.0", "end"),
        ).grid(row=0, column=1)

        self.log_tb = ctk.CTkTextbox(
            log_frame, font=ctk.CTkFont(family="Consolas", size=11),
            fg_color="transparent", text_color=TEXT_MUTED,
            wrap="word", activate_scrollbars=True,
        )
        self.log_tb.grid(row=1, column=0, sticky="nsew", padx=14, pady=(0, 14))

        self.pages["deploy"] = page

    # ================================================================
    # 日志
    # ================================================================

    def _log(self, msg):
        self.after(0, lambda: self.log_tb.insert("end", msg))
        self.after(0, lambda: self.log_tb.see("end"))

    def _set_status(self, text):
        self.after(0, lambda: self.status_lbl.configure(text=text))

    # ================================================================
    # 公告管理逻辑
    # ================================================================

    def _refresh_list(self, *_):
        """同时刷新「重要公告」和「最新公告」两个列表框。"""
        try:
            data = self.ann_store.load()
        except Exception as e:
            messagebox.showerror("加载失败", str(e))
            return

        # 刷新重要公告框
        for child in self.list_scroll_important.winfo_children():
            child.destroy()
        important_items = data.get("important", [])
        self.imp_count_lbl.configure(text=f"({len(important_items)})")
        if not important_items:
            ctk.CTkLabel(
                self.list_scroll_important, text="（暂无重要公告）",
                font=ctk.CTkFont(family="Microsoft YaHei", size=11),
                text_color=TEXT_DIM,
            ).grid(row=0, column=0, sticky="w", padx=8, pady=8)
        else:
            items_sorted = sorted(important_items, key=lambda x: x.date, reverse=True)
            for i, item in enumerate(items_sorted):
                self._render_item(self.list_scroll_important, item, i, "important")

        # 刷新最新公告框
        for child in self.list_scroll_latest.winfo_children():
            child.destroy()
        latest_items = data.get("latest", [])
        self.lat_count_lbl.configure(text=f"({len(latest_items)})")
        if not latest_items:
            ctk.CTkLabel(
                self.list_scroll_latest, text="（暂无最新公告）",
                font=ctk.CTkFont(family="Microsoft YaHei", size=11),
                text_color=TEXT_DIM,
            ).grid(row=0, column=0, sticky="w", padx=8, pady=8)
        else:
            items_sorted = sorted(latest_items, key=lambda x: x.date, reverse=True)
            for i, item in enumerate(items_sorted):
                self._render_item(self.list_scroll_latest, item, i, "latest")

    def _render_item(self, container, item, idx, category):
        """渲染单个公告卡片到指定容器。"""
        card = ctk.CTkFrame(
            container, fg_color=BG_PANEL, corner_radius=8,
            border_width=1, border_color=BORDER)
        card.grid(row=idx, column=0, sticky="ew", padx=4, pady=4)
        card.grid_columnconfigure(0, weight=1)

        # 高亮当前正在编辑的公告
        is_editing = self.editing_id == item.id and self.editing_category == category
        if is_editing:
            card.configure(border_color=ACCENT, border_width=2)

        title = item.title
        ctk.CTkLabel(
            card, text=title,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12, weight="bold"),
            text_color=TEXT if not is_editing else ACCENT, anchor="w", justify="left",
        ).grid(row=0, column=0, sticky="ew", padx=12, pady=(8, 2))

        ctk.CTkLabel(
            card, text=f"#{item.id} \u00b7 {item.date}",
            font=ctk.CTkFont(family="Consolas", size=10),
            text_color=TEXT_DIM, anchor="w",
        ).grid(row=1, column=0, sticky="w", padx=12, pady=(0, 4))

        preview = item.content[:100] + ("\u2026" if len(item.content) > 100 else "")
        ctk.CTkLabel(
            card, text=preview,
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED, anchor="w", justify="left",
            wraplength=280,
        ).grid(row=2, column=0, sticky="ew", padx=12, pady=(0, 4))

        # 编辑 + 删除按钮
        btn_row = ctk.CTkFrame(card, fg_color="transparent")
        btn_row.grid(row=3, column=0, sticky="e", padx=8, pady=(0, 8))

        ctk.CTkButton(
            btn_row, text="编辑", width=50, height=22,
            font=ctk.CTkFont(family="Microsoft YaHei", size=10),
            fg_color="transparent", hover_color=ACCENT_DARK,
            text_color=ACCENT, border_width=1, border_color=ACCENT_DARK,
            command=lambda i=item, c=category: self._edit_announcement(i.id, c),
        ).pack(side="left", padx=(0, 4))

        ctk.CTkButton(
            btn_row, text="删除", width=50, height=22,
            font=ctk.CTkFont(family="Microsoft YaHei", size=10),
            fg_color="transparent", hover_color=RED,
            text_color=RED,
            command=lambda i=item, c=category: self._delete_announcement(i.id, c),
        ).pack(side="left")

    def _save_announcement(self):
        # 分类从表单的 ann_category 读取（决定公告去哪个区显示）
        category = self.ann_category.get()
        title = self.ann_title_var.get().strip()
        content = self.ann_content_tb.get("1.0", "end-1c").strip()
        date = self.ann_date.get().strip()

        if not title:
            messagebox.showwarning("标题不能为空", "请输入公告标题")
            return
        if not content:
            messagebox.showwarning("内容不能为空", "请输入公告内容")
            return

        try:
            if self.editing_id is not None:
                # 编辑模式：更新现有公告
                item = self.ann_store.update(
                    category=self.editing_category,
                    announcement_id=self.editing_id,
                    title=title, content=content,
                    date=date or datetime.now().strftime("%Y-%m-%d"),
                )
                if item is None:
                    messagebox.showerror("保存失败", f"找不到公告 #{self.editing_id}")
                    return
                self._set_status(f"✓ 已更新公告 #{item.id}：{item.title}")
                # 如果改了分类，需要同步刷新
                if self.editing_category != category:
                    self.ann_store.move(self.editing_id, self.editing_category, category)
                    self.editing_category = category
            else:
                # 新建模式
                item = self.ann_store.add(
                    category=category, title=title, content=content,
                    date=date or datetime.now().strftime("%Y-%m-%d"),
                )
                self._set_status(f"✓ 已新增公告 #{item.id}：{item.title}")

            self._clear_form()
            self._refresh_list()
        except Exception as e:
            messagebox.showerror("保存失败", str(e))

    def _delete_announcement(self, ann_id, category):
        if not messagebox.askyesno(
            "确认删除", f"确定要删除公告 #{ann_id} 吗？\n\n此操作仅修改本地文件，需在「推送上线」页面同步到线上后才生效。"):
            return
        try:
            if self.ann_store.delete(category, ann_id):
                # 如果正在编辑被删除的公告，清空表单
                if self.editing_id == ann_id and self.editing_category == category:
                    self._clear_form()
                self._set_status(f"✓ 已删除公告 #{ann_id}")
                self._refresh_list()
            else:
                messagebox.showwarning("未找到", f"未找到公告 #{ann_id}")
        except Exception as e:
            messagebox.showerror("删除失败", str(e))

    # ================================================================
    # 推送逻辑
    # ================================================================

    def _do_deploy(self):
        if self.is_busy:
            self._log("已有任务在执行中，请等待完成\n")
            return

        msg = self.msg_var.get().strip()
        if not msg:
            messagebox.showwarning("提交信息不能为空", "请输入提交信息")
            return

        skip_build = self.build_var.get()
        steps = [
            "1. npm run sync:downloads",
            "2. npm run sync:version",
        ]
        if not skip_build:
            steps.append("3. npm run build")
        steps.append("4. git add .")
        steps.append(f"5. git commit -m \"{msg}\"")
        steps.append("6. git push")

        if not messagebox.askyesno(
            "确认推送", "即将执行：\n\n" + "\n".join(steps) + "\n\n是否继续？"):
            self._log("用户取消推送\n")
            return

        self.is_busy = True
        self._set_status("推送中...")
        self.log_tb.delete("1.0", "end")
        self._log("=" * 60 + "\n")
        self._log("开始推送\n")
        self._log("=" * 60 + "\n")

        def worker():
            success = full_deploy(
                project_root=PROJECT_ROOT,
                commit_message=msg,
                log=self._log,
                skip_build=skip_build,
                skip_tests=True,
            )
            if success:
                self._log("\n" + "=" * 60 + "\n")
                self._log("推送成功！网站将在 1-2 分钟后自动部署。\n")
                self._log("=" * 60 + "\n")
                self.after(0, lambda: messagebox.showinfo(
                    "推送成功", "网站将在 1-2 分钟后自动部署。"))
            else:
                self._log("\n[失败] 推送过程中断，请查看上方日志\n")
                self.after(0, lambda: messagebox.showerror(
                    "推送失败", "推送过程中断，请查看日志了解详情。"))
            self.after(0, lambda: self._set_status("就绪"))
            self.after(0, lambda: setattr(self, "is_busy", False))

        threading.Thread(target=worker, daemon=True).start()


# ====================================================================
# 入口
# ====================================================================

def main():
    try:
        app = App()
        app.mainloop()
    except Exception as e:
        import traceback
        print(f"[FATAL] 启动失败：{e}")
        traceback.print_exc()
        input("\n按回车键退出...")


if __name__ == "__main__":
    main()