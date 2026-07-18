"""
Quiddity Deploy Dashboard — 网站部署可视化工具

特性：
  - GitHub 实时数据（Stars / Forks / Issues / 总下载量 / 最新版本 / 资产清单）
  - 一键推送（sync → build → git add → commit → push）
  - 公告管理（增删查改 announcements.json）
  - 实时日志反馈（每一步 stdout 实时显示）
  - 后台线程执行，UI 不卡死

依赖：customtkinter、requests（GitHub API 用标准库 urllib，无需 requests）

启动：
  python main.py
  或双击 start.bat
"""

from __future__ import annotations

import os
import sys
import threading
import queue
import time
import webbrowser
from datetime import datetime
from tkinter import filedialog, messagebox

import customtkinter as ctk

# 同目录导入
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from github_client import (
    GitHubClient,
    GitHubFullStats,
    GitHubAPIError,
    RateLimitExceededError,
    format_count,
    format_file_size,
    format_relative_time,
)
from deployer import (
    PROJECT_ROOT,
    PUBLIC_DIR,
    ANNOUNCEMENTS_FILE,
    CommandResult,
    AnnouncementItem,
    load_announcements,
    save_announcements,
    add_announcement,
    delete_announcement,
    sync_downloads,
    sync_version,
    build_website,
    run_tests,
    git_status,
    git_add_all,
    git_commit,
    git_push,
    git_log_recent,
    full_deploy,
)


# ====================================================================
# 全局配置
# ====================================================================

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# 与网站一致的配色（黑+蓝）
COLOR_BG = "#0a0e1a"          # 深色背景
COLOR_BG_PANEL = "#0f1623"    # 面板背景
COLOR_BG_CARD = "#1a1f2e"     # 卡片背景
COLOR_BG_HOVER = "#252a3a"    # 悬停背景
COLOR_BORDER = "#2a3041"      # 边框
COLOR_ACCENT = "#14b0ff"      # 主色（与网站 brand-500 一致）
COLOR_ACCENT_DARK = "#0072bc"
COLOR_SUCCESS = "#22c55e"
COLOR_WARNING = "#f59e0b"
COLOR_ERROR = "#ef4444"
COLOR_TEXT = "#ffffff"
COLOR_TEXT_MUTED = "#8a91b4"
COLOR_TEXT_DIM = "#555884"

AUTO_REFRESH_INTERVAL = 300  # 5 分钟自动刷新（秒）


# ====================================================================
# 应用主窗口
# ====================================================================

class QuiddityDeployApp(ctk.CTk):
    """主窗口：左侧导航 + 右侧内容区"""

    def __init__(self):
        super().__init__()

        # ------------------- 窗口配置 -------------------
        self.title("Quiddity Deploy Dashboard")
        self.geometry("1200x780")
        self.minsize(1000, 700)
        self.configure(fg_color=COLOR_BG)

        # ------------------- 状态 -------------------
        self.github_client = GitHubClient()
        self.github_stats: GitHubFullStats | None = None
        self.is_busy = False  # 是否正在执行后台任务
        self.log_queue: queue.Queue[str] = queue.Queue()
        self._auto_refresh_enabled = True

        # ------------------- 布局 -------------------
        self._build_layout()
        self._refresh_github_threaded()
        self._poll_log_queue()
        self._start_auto_refresh()

    # ====================================================================
    # 布局
    # ====================================================================

    def _build_layout(self):
        """构建主布局：左侧导航栏 + 右侧内容区"""
        # 网格：左 200px 导航 + 右 内容
        self.grid_columnconfigure(0, weight=0, minsize=200)
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        # 左侧导航
        self.sidebar = ctk.CTkFrame(self, fg_color=COLOR_BG_PANEL, corner_radius=0)
        self.sidebar.grid(row=0, column=0, sticky="nsw")
        self._build_sidebar()

        # 右侧内容区
        self.content_area = ctk.CTkFrame(self, fg_color=COLOR_BG, corner_radius=0)
        self.content_area.grid(row=0, column=1, sticky="nsew", padx=0, pady=0)
        self.content_area.grid_rowconfigure(0, weight=1)
        self.content_area.grid_columnconfigure(0, weight=1)

        # 创建各个页面（仅 place 当前页）
        self.pages: dict[str, ctk.CTkFrame] = {}
        self._build_dashboard_page()
        self._build_deploy_page()
        self._build_announcements_page()
        self._build_logs_page()

        # 默认显示 Dashboard
        self._show_page("dashboard")

    def _build_sidebar(self):
        """左侧导航栏"""
        self.sidebar.grid_rowconfigure(10, weight=1)  # 让按钮区在顶部，状态在底部

        # Logo / 标题
        title = ctk.CTkLabel(
            self.sidebar,
            text="Quiddity",
            font=ctk.CTkFont(family="Consolas", size=22, weight="bold"),
            text_color=COLOR_TEXT,
        )
        title.grid(row=0, column=0, padx=20, pady=(24, 4), sticky="w")

        subtitle = ctk.CTkLabel(
            self.sidebar,
            text="Deploy Dashboard",
            font=ctk.CTkFont(family="Consolas", size=11),
            text_color=COLOR_TEXT_MUTED,
        )
        subtitle.grid(row=1, column=0, padx=20, pady=(0, 24), sticky="w")

        # 导航按钮（与项目内存偏好一致：单色几何符号，排除彩色 emoji）
        nav_items = [
            ("dashboard", "▣  Dashboard", "实时数据"),
            ("deploy", "▶  Deploy", "推送操作"),
            ("announcements", "✉  Announcements", "公告管理"),
            ("logs", "≡  Logs", "操作日志"),
        ]
        self.nav_buttons: dict[str, ctk.CTkButton] = {}
        for i, (key, label, hint) in enumerate(nav_items):
            btn = ctk.CTkButton(
                self.sidebar,
                text=label,
                anchor="w",
                font=ctk.CTkFont(family="Microsoft YaHei", size=13),
                fg_color="transparent",
                hover_color=COLOR_BG_HOVER,
                text_color=COLOR_TEXT_MUTED,
                height=44,
                corner_radius=8,
                command=lambda k=key: self._show_page(k),
            )
            btn.grid(row=2 + i, column=0, padx=12, pady=4, sticky="ew")
            self.nav_buttons[key] = btn

        # 底部状态
        self.status_label = ctk.CTkLabel(
            self.sidebar,
            text="● Idle",
            font=ctk.CTkFont(family="Consolas", size=11),
            text_color=COLOR_TEXT_MUTED,
            anchor="w",
        )
        self.status_label.grid(row=11, column=0, padx=20, pady=(0, 4), sticky="w")

        self.sync_time_label = ctk.CTkLabel(
            self.sidebar,
            text="Last sync: —",
            font=ctk.CTkFont(family="Consolas", size=10),
            text_color=COLOR_TEXT_DIM,
            anchor="w",
        )
        self.sync_time_label.grid(row=12, column=0, padx=20, pady=(0, 4), sticky="w")

        # GitHub Token 配置入口
        token_btn = ctk.CTkButton(
            self.sidebar,
            text="⚙  GitHub Token",
            anchor="w",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            fg_color="transparent",
            hover_color=COLOR_BG_HOVER,
            text_color=COLOR_TEXT_DIM,
            height=32,
            corner_radius=6,
            command=self._on_configure_token,
        )
        token_btn.grid(row=13, column=0, padx=12, pady=(4, 24), sticky="ew")

    def _show_page(self, page_key: str):
        """切换页面（互斥显示）"""
        for key, page in self.pages.items():
            if key == page_key:
                page.grid(row=0, column=0, sticky="nsew", padx=0, pady=0)
            else:
                page.grid_forget()

        # 更新导航按钮高亮
        for key, btn in self.nav_buttons.items():
            if key == page_key:
                btn.configure(
                    fg_color=COLOR_ACCENT_DARK,
                    text_color=COLOR_TEXT,
                )
            else:
                btn.configure(
                    fg_color="transparent",
                    text_color=COLOR_TEXT_MUTED,
                )

    # ====================================================================
    # Dashboard 页
    # ====================================================================

    def _build_dashboard_page(self):
        page = ctk.CTkFrame(self.content_area, fg_color=COLOR_BG, corner_radius=0)
        page.grid_rowconfigure(0, weight=0)
        page.grid_rowconfigure(1, weight=1)
        page.grid_columnconfigure(0, weight=1)

        # 顶部：标题 + 刷新按钮
        header = ctk.CTkFrame(page, fg_color="transparent")
        header.grid(row=0, column=0, sticky="ew", padx=24, pady=(20, 8))
        header.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            header,
            text="GitHub 实时数据",
            font=ctk.CTkFont(family="Microsoft YaHei", size=20, weight="bold"),
            text_color=COLOR_TEXT,
        ).grid(row=0, column=0, sticky="w")

        ctk.CTkButton(
            header,
            text="↻  刷新数据",
            width=120,
            height=32,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            command=self._refresh_github_threaded,
            fg_color=COLOR_ACCENT_DARK,
            hover_color=COLOR_ACCENT,
        ).grid(row=0, column=1, padx=(8, 0))

        # 主内容区
        body = ctk.CTkFrame(page, fg_color="transparent")
        body.grid(row=1, column=0, sticky="nsew", padx=24, pady=(8, 24))
        body.grid_columnconfigure(0, weight=1, uniform="stats")
        body.grid_columnconfigure(1, weight=1, uniform="stats")
        body.grid_columnconfigure(2, weight=1, uniform="stats")
        body.grid_columnconfigure(3, weight=1, uniform="stats")
        body.grid_rowconfigure(0, weight=0)
        body.grid_rowconfigure(1, weight=0)
        body.grid_rowconfigure(2, weight=0)
        body.grid_rowconfigure(3, weight=1)

        # 四个统计卡
        self.stars_label = self._stat_card(body, "★  Stars", "—", 0, 0)
        self.forks_label = self._stat_card(body, "⑂  Forks", "—", 0, 1)
        self.issues_label = self._stat_card(body, "◉  Open Issues", "—", 0, 2)
        self.downloads_label = self._stat_card(body, "↓  Total Downloads", "—", 0, 3)

        # 最新版本信息卡（占 2 列）
        self.latest_release_card = self._info_card(
            body,
            "Latest Release",
            "未获取",
            1,
            0,
            colspan=2,
        )

        # 最近推送信息卡
        self.last_push_card = self._info_card(
            body,
            "Last Push",
            "—",
            1,
            2,
            colspan=2,
        )

        # 资产清单（占满第 3 行）
        asset_frame = ctk.CTkFrame(
            body,
            fg_color=COLOR_BG_CARD,
            corner_radius=12,
            border_width=1,
            border_color=COLOR_BORDER,
        )
        asset_frame.grid(row=2, column=0, columnspan=4, sticky="nsew",
                          pady=(8, 0))
        asset_frame.grid_rowconfigure(1, weight=1)
        asset_frame.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            asset_frame,
            text="📦  Release Assets",
            font=ctk.CTkFont(family="Microsoft YaHei", size=13, weight="bold"),
            text_color=COLOR_TEXT,
        ).grid(row=0, column=0, sticky="w", padx=16, pady=(12, 4))

        self.assets_list = ctk.CTkTextbox(
            asset_frame,
            height=160,
            font=ctk.CTkFont(family="Consolas", size=11),
            fg_color="transparent",
            text_color=COLOR_TEXT_MUTED,
            wrap="word",
            activate_scrollbars=True,
        )
        self.assets_list.grid(row=1, column=0, sticky="nsew", padx=12, pady=(0, 12))
        self.assets_list.configure(state="disabled")

        # 速率限制信息
        self.rate_limit_label = ctk.CTkLabel(
            body,
            text="API 速率限制：— / —",
            font=ctk.CTkFont(family="Consolas", size=10),
            text_color=COLOR_TEXT_DIM,
            anchor="w",
        )
        self.rate_limit_label.grid(row=3, column=0, columnspan=4,
                                     sticky="sw", padx=4, pady=(8, 0))

        self.pages["dashboard"] = page

    def _stat_card(self, parent, label, value, row, col):
        """创建统计卡（标签 + 数值）"""
        card = ctk.CTkFrame(
            parent,
            fg_color=COLOR_BG_CARD,
            corner_radius=12,
            border_width=1,
            border_color=COLOR_BORDER,
        )
        card.grid(row=row, column=col, sticky="nsew", padx=4, pady=4)
        card.grid_rowconfigure(1, weight=1)

        lbl = ctk.CTkLabel(
            card,
            text=label,
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=COLOR_TEXT_MUTED,
        )
        lbl.grid(row=0, column=0, sticky="w", padx=14, pady=(12, 4))

        val = ctk.CTkLabel(
            card,
            text=value,
            font=ctk.CTkFont(family="Consolas", size=28, weight="bold"),
            text_color=COLOR_ACCENT,
        )
        val.grid(row=1, column=0, sticky="sw", padx=14, pady=(4, 14))
        return val

    def _info_card(self, parent, label, value, row, col, colspan=1):
        """创建信息卡（标签 + 多行内容）"""
        card = ctk.CTkFrame(
            parent,
            fg_color=COLOR_BG_CARD,
            corner_radius=12,
            border_width=1,
            border_color=COLOR_BORDER,
        )
        card.grid(row=row, column=col, columnspan=colspan, sticky="nsew",
                   padx=4, pady=4)
        card.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            card,
            text=label,
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=COLOR_TEXT_MUTED,
            anchor="w",
        ).grid(row=0, column=0, sticky="w", padx=14, pady=(12, 4))

        val = ctk.CTkLabel(
            card,
            text=value,
            font=ctk.CTkFont(family="Consolas", size=12),
            text_color=COLOR_TEXT,
            anchor="w",
            justify="left",
        )
        val.grid(row=1, column=0, sticky="w", padx=14, pady=(4, 14))
        return val

    # ====================================================================
    # Deploy 页
    # ====================================================================

    def _build_deploy_page(self):
        page = ctk.CTkFrame(self.content_area, fg_color=COLOR_BG, corner_radius=0)
        page.grid_columnconfigure(0, weight=1)
        page.grid_rowconfigure(0, weight=0)
        page.grid_rowconfigure(1, weight=0)
        page.grid_rowconfigure(2, weight=1)

        # 标题
        ctk.CTkLabel(
            page,
            text="推送操作",
            font=ctk.CTkFont(family="Microsoft YaHei", size=20, weight="bold"),
            text_color=COLOR_TEXT,
        ).grid(row=0, column=0, sticky="w", padx=24, pady=(20, 8))

        # 操作区
        ops = ctk.CTkFrame(page, fg_color="transparent")
        ops.grid(row=1, column=0, sticky="ew", padx=24, pady=(0, 12))
        ops.grid_columnconfigure(0, weight=0, minsize=80)
        ops.grid_columnconfigure(1, weight=1)

        # Commit 信息输入
        ctk.CTkLabel(
            ops,
            text="Commit 信息",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=COLOR_TEXT_MUTED,
            anchor="w",
        ).grid(row=0, column=0, sticky="nw", padx=(0, 8), pady=(0, 8))

        self.commit_msg_var = ctk.StringVar(
            value=f"chore: update website ({datetime.now().strftime('%Y-%m-%d')})"
        )
        commit_entry = ctk.CTkEntry(
            ops,
            textvariable=self.commit_msg_var,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            height=36,
            fg_color=COLOR_BG_CARD,
            border_color=COLOR_BORDER,
            text_color=COLOR_TEXT,
        )
        commit_entry.grid(row=0, column=1, sticky="ew", pady=(0, 8))

        # 选项
        options_frame = ctk.CTkFrame(ops, fg_color="transparent")
        options_frame.grid(row=1, column=1, sticky="ew", pady=(0, 8))

        self.skip_build_var = ctk.BooleanVar(value=False)
        ctk.CTkCheckBox(
            options_frame,
            text="构建网站（npm run build）",
            variable=self.skip_build_var,
            onvalue=False,
            offvalue=True,
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=COLOR_TEXT_MUTED,
            fg_color=COLOR_ACCENT_DARK,
        ).grid(row=0, column=0, padx=(0, 16))

        self.skip_tests_var = ctk.BooleanVar(value=True)
        ctk.CTkCheckBox(
            options_frame,
            text="运行测试（npm run test）",
            variable=self.skip_tests_var,
            onvalue=False,
            offvalue=True,
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=COLOR_TEXT_MUTED,
            fg_color=COLOR_ACCENT_DARK,
        ).grid(row=0, column=1)

        # 按钮组
        btn_frame = ctk.CTkFrame(ops, fg_color="transparent")
        btn_frame.grid(row=2, column=1, sticky="ew", pady=(8, 0))
        btn_frame.grid_columnconfigure(0, weight=0)
        btn_frame.grid_columnconfigure(1, weight=0)
        btn_frame.grid_columnconfigure(2, weight=0)
        btn_frame.grid_columnconfigure(3, weight=0)
        btn_frame.grid_columnconfigure(4, weight=1)
        btn_frame.grid_columnconfigure(5, weight=0)

        ctk.CTkButton(
            btn_frame,
            text="↻  同步数据",
            width=110,
            height=36,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            fg_color=COLOR_BG_CARD,
            border_color=COLOR_ACCENT_DARK,
            border_width=1,
            text_color=COLOR_ACCENT,
            hover_color=COLOR_BG_HOVER,
            command=self._on_sync_data,
        ).grid(row=0, column=0, padx=(0, 8))

        ctk.CTkButton(
            btn_frame,
            text="🔍  查看 Git 状态",
            width=140,
            height=36,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            fg_color=COLOR_BG_CARD,
            border_color=COLOR_ACCENT_DARK,
            border_width=1,
            text_color=COLOR_ACCENT,
            hover_color=COLOR_BG_HOVER,
            command=self._on_git_status,
        ).grid(row=0, column=1, padx=(0, 8))

        ctk.CTkButton(
            btn_frame,
            text="🔨  仅构建",
            width=110,
            height=36,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            fg_color=COLOR_BG_CARD,
            border_color=COLOR_ACCENT_DARK,
            border_width=1,
            text_color=COLOR_ACCENT,
            hover_color=COLOR_BG_HOVER,
            command=self._on_build_only,
        ).grid(row=0, column=2, padx=(0, 8))

        ctk.CTkButton(
            btn_frame,
            text="📜  最近 commit",
            width=140,
            height=36,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            fg_color=COLOR_BG_CARD,
            border_color=COLOR_ACCENT_DARK,
            border_width=1,
            text_color=COLOR_ACCENT,
            hover_color=COLOR_BG_HOVER,
            command=self._on_git_log,
        ).grid(row=0, column=3, padx=(0, 8))

        ctk.CTkButton(
            btn_frame,
            text="🚀  一键推送",
            width=160,
            height=40,
            font=ctk.CTkFont(family="Microsoft YaHei", size=13, weight="bold"),
            fg_color=COLOR_ACCENT_DARK,
            hover_color=COLOR_ACCENT,
            text_color=COLOR_TEXT,
            command=self._on_full_deploy,
        ).grid(row=0, column=5)

        # 日志区
        log_frame = ctk.CTkFrame(
            page,
            fg_color=COLOR_BG_CARD,
            corner_radius=12,
            border_width=1,
            border_color=COLOR_BORDER,
        )
        log_frame.grid(row=2, column=0, sticky="nsew", padx=24, pady=(0, 24))
        log_frame.grid_rowconfigure(1, weight=1)
        log_frame.grid_columnconfigure(0, weight=1)

        log_header = ctk.CTkFrame(log_frame, fg_color="transparent")
        log_header.grid(row=0, column=0, sticky="ew", padx=12, pady=(12, 4))
        log_header.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            log_header,
            text="操作日志",
            font=ctk.CTkFont(family="Microsoft YaHei", size=12, weight="bold"),
            text_color=COLOR_TEXT,
        ).grid(row=0, column=0, sticky="w")

        ctk.CTkButton(
            log_header,
            text="✕  清空",
            width=70,
            height=24,
            font=ctk.CTkFont(family="Microsoft YaHei", size=10),
            fg_color="transparent",
            hover_color=COLOR_BG_HOVER,
            text_color=COLOR_TEXT_DIM,
            command=lambda: self.log_textbox.delete("1.0", "end"),
        ).grid(row=0, column=1)

        self.log_textbox = ctk.CTkTextbox(
            log_frame,
            font=ctk.CTkFont(family="Consolas", size=11),
            fg_color="transparent",
            text_color=COLOR_TEXT_MUTED,
            wrap="word",
            activate_scrollbars=True,
        )
        self.log_textbox.grid(row=1, column=0, sticky="nsew", padx=12, pady=(0, 12))

        self.pages["deploy"] = page

    # ====================================================================
    # Announcements 页
    # ====================================================================

    def _build_announcements_page(self):
        page = ctk.CTkFrame(self.content_area, fg_color=COLOR_BG, corner_radius=0)
        page.grid_columnconfigure(0, weight=1)
        page.grid_rowconfigure(0, weight=0)
        page.grid_rowconfigure(1, weight=1)

        # 标题
        ctk.CTkLabel(
            page,
            text="公告管理",
            font=ctk.CTkFont(family="Microsoft YaHei", size=20, weight="bold"),
            text_color=COLOR_TEXT,
        ).grid(row=0, column=0, sticky="w", padx=24, pady=(20, 8))

        # 主体：左右两栏
        body = ctk.CTkFrame(page, fg_color="transparent")
        body.grid(row=1, column=0, sticky="nsew", padx=24, pady=(0, 24))
        body.grid_columnconfigure(0, weight=1, uniform="a")
        body.grid_columnconfigure(1, weight=1, uniform="a")
        body.grid_rowconfigure(0, weight=1)

        # 左：现有公告列表
        list_frame = ctk.CTkFrame(
            body,
            fg_color=COLOR_BG_CARD,
            corner_radius=12,
            border_width=1,
            border_color=COLOR_BORDER,
        )
        list_frame.grid(row=0, column=0, sticky="nsew", padx=(0, 8))
        list_frame.grid_rowconfigure(1, weight=1)
        list_frame.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            list_frame,
            text="现有公告",
            font=ctk.CTkFont(family="Microsoft YaHei", size=13, weight="bold"),
            text_color=COLOR_TEXT,
        ).grid(row=0, column=0, sticky="w", padx=16, pady=(12, 4))

        list_inner = ctk.CTkFrame(list_frame, fg_color="transparent")
        list_inner.grid(row=1, column=0, sticky="nsew", padx=8, pady=(0, 8))
        list_inner.grid_rowconfigure(1, weight=1)
        list_inner.grid_columnconfigure(0, weight=1)

        # 分类筛选
        cat_frame = ctk.CTkFrame(list_inner, fg_color="transparent")
        cat_frame.grid(row=0, column=0, sticky="ew", padx=4, pady=(0, 4))
        cat_frame.grid_columnconfigure(1, weight=1)

        ctk.CTkLabel(
            cat_frame,
            text="分类：",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=COLOR_TEXT_MUTED,
        ).grid(row=0, column=0, padx=(4, 4))

        self.ann_category_var = ctk.StringVar(value="important")
        cat_menu = ctk.CTkOptionMenu(
            cat_frame,
            values=["important (重要公告)", "latest (最新公告)"],
            variable=self.ann_category_var,
            command=self._on_ann_category_change,
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            dropdown_font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            fg_color=COLOR_BG_CARD,
            button_color=COLOR_ACCENT_DARK,
            button_hover_color=COLOR_ACCENT,
            text_color=COLOR_TEXT,
            height=28,
        )
        # 修正值（避免显示文字与值不一致）
        cat_menu.set("important (重要公告)")
        cat_menu.grid(row=0, column=1, sticky="ew")

        # 公告列表（用 ScrollableFrame）
        self.ann_list_scroll = ctk.CTkScrollableFrame(
            list_inner,
            fg_color="transparent",
            label_text="",
        )
        self.ann_list_scroll.grid(row=1, column=0, sticky="nsew")
        self.ann_list_scroll.grid_columnconfigure(0, weight=1)
        self.ann_items: list[AnnouncementItem] = []

        # 刷新按钮
        ctk.CTkButton(
            list_inner,
            text="↻  刷新列表",
            width=100,
            height=28,
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            fg_color=COLOR_BG_PANEL,
            border_color=COLOR_BORDER,
            border_width=1,
            text_color=COLOR_TEXT_MUTED,
            hover_color=COLOR_BG_HOVER,
            command=self._refresh_announcements_list,
        ).grid(row=2, column=0, sticky="w", padx=4, pady=(8, 0))

        # 右：新增/编辑表单
        form_frame = ctk.CTkFrame(
            body,
            fg_color=COLOR_BG_CARD,
            corner_radius=12,
            border_width=1,
            border_color=COLOR_BORDER,
        )
        form_frame.grid(row=0, column=1, sticky="nsew", padx=(8, 0))
        form_frame.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            form_frame,
            text="新增公告",
            font=ctk.CTkFont(family="Microsoft YaHei", size=13, weight="bold"),
            text_color=COLOR_TEXT,
        ).grid(row=0, column=0, sticky="w", padx=16, pady=(12, 8))

        # 标题输入（label 单独一行，input 全宽 —— 与 user_profile 一致）
        ctk.CTkLabel(
            form_frame,
            text="标题",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=COLOR_TEXT_MUTED,
            anchor="w",
        ).grid(row=1, column=0, sticky="w", padx=16, pady=(0, 2))
        self.ann_title_var = ctk.StringVar()
        ctk.CTkEntry(
            form_frame,
            textvariable=self.ann_title_var,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            height=32,
            fg_color=COLOR_BG_PANEL,
            border_color=COLOR_BORDER,
            text_color=COLOR_TEXT,
        ).grid(row=2, column=0, sticky="ew", padx=16, pady=(0, 8))

        # 日期 + 标签
        date_tag_frame = ctk.CTkFrame(form_frame, fg_color="transparent")
        date_tag_frame.grid(row=3, column=0, sticky="ew", padx=16, pady=(0, 8))
        date_tag_frame.grid_columnconfigure(1, weight=1)
        date_tag_frame.grid_columnconfigure(3, weight=1)

        ctk.CTkLabel(
            date_tag_frame,
            text="日期",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=COLOR_TEXT_MUTED,
        ).grid(row=0, column=0, padx=(0, 4))
        self.ann_date_var = ctk.StringVar(value=datetime.now().strftime("%Y-%m-%d"))
        ctk.CTkEntry(
            date_tag_frame,
            textvariable=self.ann_date_var,
            font=ctk.CTkFont(family="Consolas", size=11),
            height=28,
            width=120,
            fg_color=COLOR_BG_PANEL,
            border_color=COLOR_BORDER,
            text_color=COLOR_TEXT,
        ).grid(row=0, column=1, sticky="w")

        ctk.CTkLabel(
            date_tag_frame,
            text="标签",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=COLOR_TEXT_MUTED,
        ).grid(row=0, column=2, padx=(8, 4))
        self.ann_tag_var = ctk.StringVar(value="重要")
        ctk.CTkEntry(
            date_tag_frame,
            textvariable=self.ann_tag_var,
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            height=28,
            width=100,
            fg_color=COLOR_BG_PANEL,
            border_color=COLOR_BORDER,
            text_color=COLOR_TEXT,
        ).grid(row=0, column=3, sticky="w")

        # 内容输入
        ctk.CTkLabel(
            form_frame,
            text="内容（支持多行）",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=COLOR_TEXT_MUTED,
            anchor="w",
        ).grid(row=4, column=0, sticky="w", padx=16, pady=(0, 2))
        self.ann_content_textbox = ctk.CTkTextbox(
            form_frame,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            fg_color=COLOR_BG_PANEL,
            border_color=COLOR_BORDER,
            border_width=1,
            text_color=COLOR_TEXT,
            height=180,
            wrap="word",
        )
        self.ann_content_textbox.grid(row=5, column=0, sticky="nsew",
                                       padx=16, pady=(0, 8))
        form_frame.grid_rowconfigure(5, weight=1)

        # 操作按钮
        btn_frame = ctk.CTkFrame(form_frame, fg_color="transparent")
        btn_frame.grid(row=6, column=0, sticky="ew", padx=16, pady=(0, 16))
        btn_frame.grid_columnconfigure(0, weight=1)

        ctk.CTkButton(
            btn_frame,
            text="💾  保存到 announcements.json",
            height=36,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12, weight="bold"),
            fg_color=COLOR_ACCENT_DARK,
            hover_color=COLOR_ACCENT,
            text_color=COLOR_TEXT,
            command=self._on_save_announcement,
        ).grid(row=0, column=0, sticky="ew")

        # 文件路径显示
        ctk.CTkLabel(
            form_frame,
            text=f"文件：{ANNOUNCEMENTS_FILE}",
            font=ctk.CTkFont(family="Consolas", size=9),
            text_color=COLOR_TEXT_DIM,
            anchor="w",
        ).grid(row=7, column=0, sticky="w", padx=16, pady=(0, 12))

        self.pages["announcements"] = page

        # 初次加载公告列表
        self._refresh_announcements_list()

    # ====================================================================
    # Logs 页
    # ====================================================================

    def _build_logs_page(self):
        page = ctk.CTkFrame(self.content_area, fg_color=COLOR_BG, corner_radius=0)
        page.grid_columnconfigure(0, weight=1)
        page.grid_rowconfigure(0, weight=0)
        page.grid_rowconfigure(1, weight=1)

        header = ctk.CTkFrame(page, fg_color="transparent")
        header.grid(row=0, column=0, sticky="ew", padx=24, pady=(20, 8))
        header.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            header,
            text="操作日志（持久）",
            font=ctk.CTkFont(family="Microsoft YaHei", size=20, weight="bold"),
            text_color=COLOR_TEXT,
        ).grid(row=0, column=0, sticky="w")

        ctk.CTkButton(
            header,
            text="✕  清空",
            width=100,
            height=32,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            fg_color="transparent",
            hover_color=COLOR_BG_HOVER,
            text_color=COLOR_TEXT_DIM,
            command=lambda: self.persistent_log_textbox.delete("1.0", "end"),
        ).grid(row=0, column=1)

        # 持久日志区（与 Deploy 页的临时日志区不同，这个不会被清空）
        log_frame = ctk.CTkFrame(
            page,
            fg_color=COLOR_BG_CARD,
            corner_radius=12,
            border_width=1,
            border_color=COLOR_BORDER,
        )
        log_frame.grid(row=1, column=0, sticky="nsew", padx=24, pady=(0, 24))
        log_frame.grid_rowconfigure(0, weight=1)
        log_frame.grid_columnconfigure(0, weight=1)

        self.persistent_log_textbox = ctk.CTkTextbox(
            log_frame,
            font=ctk.CTkFont(family="Consolas", size=11),
            fg_color="transparent",
            text_color=COLOR_TEXT_MUTED,
            wrap="word",
            activate_scrollbars=True,
        )
        self.persistent_log_textbox.grid(row=0, column=0, sticky="nsew",
                                          padx=12, pady=12)

        self.pages["logs"] = page

    # ====================================================================
    # 日志：跨线程通信
    # ====================================================================

    def _log(self, msg: str):
        """向日志区写入（线程安全：通过 queue 转发到主线程）"""
        self.log_queue.put(msg)

    def _poll_log_queue(self):
        """主线程轮询日志队列，写入两个 textbox"""
        try:
            while True:
                msg = self.log_queue.get_nowait()
                timestamped = self._format_log_line(msg)
                # 写入 Deploy 页日志区
                self.log_textbox.insert("end", timestamped)
                self.log_textbox.see("end")
                # 写入 Logs 页（持久）
                self.persistent_log_textbox.insert("end", timestamped)
                self.persistent_log_textbox.see("end")
        except queue.Empty:
            pass
        # 每 100ms 轮询一次
        self.after(100, self._poll_log_queue)

    @staticmethod
    def _format_log_line(msg: str) -> str:
        """为日志行加时间戳"""
        ts = datetime.now().strftime("%H:%M:%S")
        # 已经是格式化行（如 "[12:34:56] xxx"）就不再嵌套
        if msg.startswith("[") and "]" in msg[:12]:
            return msg + "\n"
        return f"[{ts}] {msg}\n"

    # ====================================================================
    # 状态管理
    # ====================================================================

    def _set_busy(self, busy: bool, status: str | None = None):
        """设置忙碌状态（禁用按钮 + 更新状态标签）"""
        self.is_busy = busy
        if busy:
            self.status_label.configure(text="● Working...", text_color=COLOR_WARNING)
        else:
            self.status_label.configure(text="● Idle", text_color=COLOR_TEXT_MUTED)
        if status:
            self.status_label.configure(text=f"● {status}")

    # ====================================================================
    # GitHub 数据刷新
    # ====================================================================

    def _refresh_github_threaded(self):
        """在后台线程刷新 GitHub 数据"""
        if self.is_busy:
            self._log("[SKIP] 已有任务在执行，刷新请求已忽略")
            return

        self._set_busy(True, "Fetching GitHub...")
        self._log("开始刷新 GitHub 数据...")

        def worker():
            try:
                stats = self.github_client.fetch_full_stats()
                self.github_stats = stats
                self.after(0, lambda: self._update_dashboard(stats))
                self._log("[OK] GitHub 数据刷新成功")
                self._log(f"  Stars: {stats.repo.stars}")
                self._log(f"  Forks: {stats.repo.forks}")
                self._log(f"  总下载量: {stats.total_downloads}")
                self._log(f"  最新版本: {stats.latest_version or '无'}")
                self._log(f"  API 配额: {stats.rate_limit_remaining}/{stats.rate_limit_limit}")
            except RateLimitExceededError as e:
                self._log(f"[ERROR] {e}")
                self.after(0, lambda: messagebox.showwarning("速率限制", str(e)))
            except GitHubAPIError as e:
                self._log(f"[ERROR] GitHub API 错误：{e}")
                self.after(0, lambda: messagebox.showerror("GitHub 错误", str(e)))
            except Exception as e:
                self._log(f"[ERROR] 未知错误：{e}")
                self.after(0, lambda: messagebox.showerror("错误", str(e)))
            finally:
                self.after(0, lambda: self._set_busy(False))

        threading.Thread(target=worker, daemon=True).start()

    def _update_dashboard(self, stats: GitHubFullStats):
        """更新 Dashboard 显示"""
        self.stars_label.configure(text=format_count(stats.repo.stars))
        self.forks_label.configure(text=format_count(stats.repo.forks))
        self.issues_label.configure(text=str(stats.repo.open_issues))
        self.downloads_label.configure(text=format_count(stats.total_downloads))

        # Latest Release 卡
        if stats.latest:
            r = stats.latest
            assets_count = len(r.assets)
            asset_text = (
                f"版本：{r.tag_name}\n"
                f"发布：{r.published_at_display}\n"
                f"资产数：{assets_count}\n"
                f"该版本下载：{format_count(r.download_count)}"
            )
        else:
            asset_text = "尚无 Release"
        self.latest_release_card.configure(text=asset_text)

        # Last Push 卡
        push_text = (
            f"分支：{stats.repo.default_branch}\n"
            f"推送：{format_relative_time(stats.repo.pushed_at)}\n"
            f"仓库：{stats.repo.full_name}"
        )
        if stats.repo.homepage:
            push_text += f"\n主页：{stats.repo.homepage}"
        self.last_push_card.configure(text=push_text)

        # 资产清单
        self.assets_list.configure(state="normal")
        self.assets_list.delete("1.0", "end")
        if stats.latest and stats.latest.assets:
            for a in stats.latest.assets:
                size = format_file_size(a.size)
                self.assets_list.insert(
                    "end",
                    f"  • {a.name}\n"
                    f"    下载：{a.download_count}  |  大小：{size}\n"
                    f"    URL：{a.url}\n\n",
                )
        else:
            self.assets_list.insert("end", "暂无资产（请先在 GitHub 创建 Release 并上传安装包）")

        self.assets_list.configure(state="disabled")

        # 速率限制
        self.rate_limit_label.configure(
            text=f"API 速率限制：{stats.rate_limit_remaining} / {stats.rate_limit_limit}"
        )

        # 同步时间
        self.sync_time_label.configure(
            text=f"Last sync: {stats.fetched_at_display}"
        )

    def _start_auto_refresh(self):
        """启动自动刷新（每 5 分钟）"""
        def tick():
            if self._auto_refresh_enabled and not self.is_busy:
                self._refresh_github_threaded()
            self.after(AUTO_REFRESH_INTERVAL * 1000, tick)

        self.after(AUTO_REFRESH_INTERVAL * 1000, tick)

    # ====================================================================
    # 操作回调
    # ====================================================================

    def _on_configure_token(self):
        """配置 GitHub Token"""
        dialog = ctk.CTkInputDialog(
            text=(
                "请输入 GitHub Personal Access Token（可选）\n\n"
                "未认证：60 次/小时/IP\n"
                "已认证：5000 次/小时\n\n"
                "Token 仅保存在内存中，关闭程序后失效。"
            ),
            title="GitHub Token",
        )
        token = dialog.get_input()
        if token:
            self.github_client.token = token.strip()
            os.environ["GITHUB_TOKEN"] = token.strip()
            self._log("[OK] GitHub Token 已设置（仅本会话有效）")
            self._refresh_github_threaded()

    def _on_sync_data(self):
        """仅同步数据（npm run sync:downloads + sync:version）"""
        if self.is_busy:
            self._log("[SKIP] 已有任务在执行")
            return

        self._set_busy(True, "Syncing...")
        self._log("=" * 50)
        self._log("开始同步数据...")

        def worker():
            r1 = sync_downloads(log=self._log)
            if not r1.success:
                self._log("[FAILED] sync:downloads 失败")
                self.after(0, lambda: self._set_busy(False))
                return
            r2 = sync_version(log=self._log)
            if not r2.success:
                self._log("[FAILED] sync:version 失败")
                self.after(0, lambda: self._set_busy(False))
                return
            self._log("[OK] 数据同步完成")
            # 同步后刷新 GitHub 统计（downloads.json 已更新）
            self.after(0, lambda: self._refresh_github_threaded())
            self.after(0, lambda: self._set_busy(False))

        threading.Thread(target=worker, daemon=True).start()

    def _on_build_only(self):
        """仅构建网站"""
        if self.is_busy:
            self._log("[SKIP] 已有任务在执行")
            return
        self._set_busy(True, "Building...")
        self._log("=" * 50)

        def worker():
            r = build_website(log=self._log)
            if r.success:
                self._log("[OK] 构建成功")
            else:
                self._log(f"[FAILED] 构建失败（returncode={r.returncode}）")
            self.after(0, lambda: self._set_busy(False))

        threading.Thread(target=worker, daemon=True).start()

    def _on_git_status(self):
        """查看 git status"""
        if self.is_busy:
            return
        self._set_busy(True, "Git Status...")

        def worker():
            git_status(log=self._log)
            self.after(0, lambda: self._set_busy(False))

        threading.Thread(target=worker, daemon=True).start()

    def _on_git_log(self):
        """查看 git log"""
        if self.is_busy:
            return
        self._set_busy(True, "Git Log...")

        def worker():
            git_log_recent(n=10, log=self._log)
            self.after(0, lambda: self._set_busy(False))

        threading.Thread(target=worker, daemon=True).start()

    def _on_full_deploy(self):
        """一键推送"""
        if self.is_busy:
            self._log("[SKIP] 已有任务在执行")
            return

        msg = self.commit_msg_var.get().strip()
        if not msg:
            messagebox.showwarning("Commit 信息不能为空", "请输入 commit 信息")
            return

        # 二次确认
        skip_build = self.skip_build_var.get()
        skip_tests = self.skip_tests_var.get()
        confirm_text = (
            f"将执行以下操作：\n\n"
            f"  1. npm run sync:downloads\n"
            f"  2. npm run sync:version\n"
            + ("  3. npm run test\n" if not skip_tests else "")
            + ("  4. npm run build\n" if not skip_build else "")
            + f"  5. git add .\n"
            + f"  6. git commit -m {msg!r}\n"
            + f"  7. git push\n\n"
            + f"是否继续？"
        )
        if not messagebox.askyesno("确认推送", confirm_text):
            self._log("[CANCEL] 用户取消推送")
            return

        self._set_busy(True, "Deploying...")
        self._log("=" * 60)
        self._log("🚀 开始一键推送")
        self._log("=" * 60)

        def worker():
            success = full_deploy(
                commit_message=msg,
                log=self._log,
                skip_build=skip_build,
                skip_tests=skip_tests,
            )
            if success:
                self._log("[SUCCESS] 推送完成！")
                self.after(0, lambda: messagebox.showinfo(
                    "推送成功",
                    "所有步骤已成功完成！\n\n"
                    "GitHub Pages 将在 1-2 分钟后自动部署。",
                ))
                # 刷新 GitHub 数据（commit 已推送）
                self.after(100, self._refresh_github_threaded)
            else:
                self._log("[FAILED] 推送过程中断，请查看上方日志")
                self.after(0, lambda: messagebox.showerror(
                    "推送失败",
                    "推送过程中断，请查看日志了解详情。",
                ))
            self.after(0, lambda: self._set_busy(False))

        threading.Thread(target=worker, daemon=True).start()

    # ====================================================================
    # 公告管理回调
    # ====================================================================

    def _on_ann_category_change(self, choice: str):
        """分类切换"""
        # choice 形如 "important (重要公告)"
        category = choice.split(" ")[0]
        self.ann_category_var.set(choice)
        self._refresh_announcements_list()

    def _refresh_announcements_list(self):
        """刷新公告列表显示"""
        # 清空现有列表
        for child in self.ann_list_scroll.winfo_children():
            child.destroy()

        try:
            data = load_announcements()
        except Exception as e:
            messagebox.showerror("加载失败", str(e))
            return

        # 取出当前分类的公告
        choice = self.ann_category_var.get()
        category = choice.split(" ")[0]
        items = data.get(category, [])

        if not items:
            empty = ctk.CTkLabel(
                self.ann_list_scroll,
                text="（暂无公告）",
                font=ctk.CTkFont(family="Microsoft YaHei", size=11),
                text_color=COLOR_TEXT_DIM,
            )
            empty.grid(row=0, column=0, sticky="w", padx=8, pady=8)
            return

        # 按日期倒序
        items_sorted = sorted(items, key=lambda x: x.date, reverse=True)
        for i, item in enumerate(items_sorted):
            self._render_announcement_item(item, i, category)

    def _render_announcement_item(self, item: AnnouncementItem, idx: int, category: str):
        """渲染单个公告条目"""
        card = ctk.CTkFrame(
            self.ann_list_scroll,
            fg_color=COLOR_BG_PANEL,
            corner_radius=8,
            border_width=1,
            border_color=COLOR_BORDER,
        )
        card.grid(row=idx, column=0, sticky="ew", padx=4, pady=4)
        card.grid_columnconfigure(0, weight=1)

        # 标题行
        title_text = item.title
        if item.tag:
            title_text = f"[{item.tag}] {item.title}"
        ctk.CTkLabel(
            card,
            text=title_text,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12, weight="bold"),
            text_color=COLOR_TEXT,
            anchor="w",
            justify="left",
        ).grid(row=0, column=0, sticky="ew", padx=12, pady=(8, 2))

        # 日期 + ID
        meta = f"#{item.id}  •  {item.date}"
        ctk.CTkLabel(
            card,
            text=meta,
            font=ctk.CTkFont(family="Consolas", size=10),
            text_color=COLOR_TEXT_DIM,
            anchor="w",
        ).grid(row=1, column=0, sticky="w", padx=12, pady=(0, 4))

        # 内容预览（最多 3 行）
        preview = item.content[:120] + ("..." if len(item.content) > 120 else "")
        ctk.CTkLabel(
            card,
            text=preview,
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=COLOR_TEXT_MUTED,
            anchor="w",
            justify="left",
            wraplength=400,
        ).grid(row=2, column=0, sticky="ew", padx=12, pady=(0, 4))

        # 删除按钮
        ctk.CTkButton(
            card,
            text="✕  删除",
            width=70,
            height=24,
            font=ctk.CTkFont(family="Microsoft YaHei", size=10),
            fg_color="transparent",
            hover_color=COLOR_ERROR,
            text_color=COLOR_ERROR,
            command=lambda i=item, c=category: self._on_delete_announcement(i.id, c),
        ).grid(row=3, column=0, sticky="e", padx=8, pady=(0, 8))

    def _on_save_announcement(self):
        """保存新公告"""
        choice = self.ann_category_var.get()
        category = choice.split(" ")[0]
        title = self.ann_title_var.get().strip()
        content = self.ann_content_textbox.get("1.0", "end-1c").strip()
        date = self.ann_date_var.get().strip()
        tag = self.ann_tag_var.get().strip()

        if not title:
            messagebox.showwarning("标题不能为空", "请输入公告标题")
            return
        if not content:
            messagebox.showwarning("内容不能为空", "请输入公告内容")
            return
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")

        try:
            item = add_announcement(
                category=category,
                title=title,
                content=content,
                tag=tag,
                date=date,
            )
            self._log(
                f"[OK] 已添加公告：[{category}] #{item.id} {item.title}"
            )
            messagebox.showinfo(
                "保存成功",
                f"公告已保存到 announcements.json\n\n"
                f"分类：{category}\n"
                f"ID：{item.id}\n"
                f"标题：{item.title}\n\n"
                f"提示：在 Deploy 页执行「一键推送」可同步到线上。",
            )
            # 清空表单
            self.ann_title_var.set("")
            self.ann_content_textbox.delete("1.0", "end")
            # 刷新列表
            self._refresh_announcements_list()
        except Exception as e:
            messagebox.showerror("保存失败", str(e))

    def _on_delete_announcement(self, ann_id: int, category: str):
        """删除公告"""
        if not messagebox.askyesno(
            "确认删除",
            f"确定要删除公告 #{ann_id} 吗？\n\n此操作不可撤销。",
        ):
            return
        try:
            ok = delete_announcement(category, ann_id)
            if ok:
                self._log(f"[OK] 已删除公告：[{category}] #{ann_id}")
                self._refresh_announcements_list()
            else:
                messagebox.showwarning("未找到", f"未找到公告 #{ann_id}")
        except Exception as e:
            messagebox.showerror("删除失败", str(e))


# ====================================================================
# 入口
# ====================================================================

def main():
    # 项目根目录 sanity check
    if not (PROJECT_ROOT / "package.json").is_file():
        print(f"[ERROR] 未找到项目根目录：{PROJECT_ROOT}")
        print("请设置环境变量 QUIDDITY_WEBSITE_ROOT 指向 quiddity-website 目录")
        sys.exit(1)

    if not ANNOUNCEMENTS_FILE.exists():
        print(f"[WARN] announcements.json 不存在：{ANNOUNCEMENTS_FILE}")
        print("程序会在第一次保存公告时自动创建。")

    app = QuiddityDeployApp()
    app.mainloop()


if __name__ == "__main__":
    main()
