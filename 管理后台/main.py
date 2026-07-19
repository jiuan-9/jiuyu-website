"""
Quiddity 网站管理后台

功能：公告管理 + 一键推送上线
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

        self.title("Quiddity 管理后台")
        self.geometry("1000x700")
        self.minsize(900, 600)
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
        nav_items = [("announcements", "公告管理"), ("deploy", "推送上线")]

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

        ctk.CTkLabel(
            page, text="公告管理",
            font=ctk.CTkFont(family="Microsoft YaHei", size=22, weight="bold"),
            text_color=TEXT,
        ).grid(row=0, column=0, sticky="w", padx=28, pady=(24, 12))

        body = ctk.CTkFrame(page, fg_color="transparent")
        body.grid(row=1, column=0, sticky="nsew", padx=28, pady=(0, 24))
        body.grid_columnconfigure(0, weight=1, uniform="a")
        body.grid_columnconfigure(1, weight=1, uniform="a")
        body.grid_rowconfigure(0, weight=1)

        # --- 左：公告列表 ---
        left = ctk.CTkFrame(body, fg_color=BG_CARD, corner_radius=12,
                            border_width=1, border_color=BORDER)
        left.grid(row=0, column=0, sticky="nsew", padx=(0, 8))
        left.grid_rowconfigure(1, weight=1)
        left.grid_columnconfigure(0, weight=1)

        top = ctk.CTkFrame(left, fg_color="transparent")
        top.grid(row=0, column=0, sticky="ew", padx=14, pady=(12, 6))

        ctk.CTkLabel(
            top, text="现有公告",
            font=ctk.CTkFont(family="Microsoft YaHei", size=14, weight="bold"),
            text_color=TEXT,
        ).grid(row=0, column=0, sticky="w")

        self.cat_var = ctk.StringVar(value="important (重要公告)")
        ctk.CTkOptionMenu(
            top,
            values=["important (重要公告)", "latest (最新公告)"],
            variable=self.cat_var,
            command=self._refresh_list,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            dropdown_font=ctk.CTkFont(family="Microsoft YaHei", size=12),
            fg_color=BG_CARD, button_color=ACCENT_DARK,
            button_hover_color=ACCENT, text_color=TEXT,
            height=30, width=180,
        ).grid(row=0, column=1, sticky="e")

        self.list_scroll = ctk.CTkScrollableFrame(
            left, fg_color="transparent", label_text="")
        self.list_scroll.grid(row=1, column=0, sticky="nsew", padx=8, pady=(0, 8))
        self.list_scroll.grid_columnconfigure(0, weight=1)

        ctk.CTkButton(
            left, text="刷新列表", width=90, height=30,
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            fg_color=BG_PANEL, border_color=BORDER, border_width=1,
            text_color=TEXT_MUTED, hover_color=BG_HOVER,
            command=self._refresh_list,
        ).grid(row=2, column=0, sticky="w", padx=12, pady=(0, 12))

        # --- 右：新增公告表单 ---
        right = ctk.CTkFrame(body, fg_color=BG_CARD, corner_radius=12,
                             border_width=1, border_color=BORDER)
        right.grid(row=0, column=1, sticky="nsew", padx=(8, 0))
        right.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            right, text="新增公告",
            font=ctk.CTkFont(family="Microsoft YaHei", size=14, weight="bold"),
            text_color=TEXT,
        ).grid(row=0, column=0, sticky="w", padx=16, pady=(12, 8))

        ctk.CTkLabel(
            right, text="标题",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED, anchor="w",
        ).grid(row=1, column=0, sticky="w", padx=16, pady=(4, 2))

        self.ann_title_var = ctk.StringVar()
        ctk.CTkEntry(
            right, textvariable=self.ann_title_var,
            font=ctk.CTkFont(family="Microsoft YaHei", size=13),
            height=34, fg_color=BG_PANEL, border_color=BORDER,
            text_color=TEXT,
        ).grid(row=2, column=0, sticky="ew", padx=16, pady=(0, 8))

        ctk.CTkLabel(
            right, text="内容",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED, anchor="w",
        ).grid(row=3, column=0, sticky="w", padx=16, pady=(4, 2))

        self.ann_content_tb = ctk.CTkTextbox(
            right, font=ctk.CTkFont(family="Microsoft YaHei", size=13),
            fg_color=BG_PANEL, border_color=BORDER, border_width=1,
            text_color=TEXT, height=200, wrap="word",
        )
        self.ann_content_tb.grid(row=4, column=0, sticky="nsew", padx=16, pady=(0, 8))
        right.grid_rowconfigure(4, weight=1)

        row = ctk.CTkFrame(right, fg_color="transparent")
        row.grid(row=5, column=0, sticky="ew", padx=16, pady=(0, 8))

        ctk.CTkLabel(
            row, text="日期",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED,
        ).grid(row=0, column=0, padx=(0, 4))

        self.ann_date = ctk.StringVar(value=datetime.now().strftime("%Y-%m-%d"))
        ctk.CTkEntry(
            row, textvariable=self.ann_date,
            font=ctk.CTkFont(family="Consolas", size=11),
            height=28, width=120, fg_color=BG_PANEL,
            border_color=BORDER, text_color=TEXT,
        ).grid(row=0, column=1, sticky="w")

        ctk.CTkLabel(
            row, text="标签",
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            text_color=TEXT_MUTED,
        ).grid(row=0, column=2, padx=(12, 4))

        self.ann_tag = ctk.StringVar(value="重要")
        ctk.CTkEntry(
            row, textvariable=self.ann_tag,
            font=ctk.CTkFont(family="Microsoft YaHei", size=11),
            height=28, width=100, fg_color=BG_PANEL,
            border_color=BORDER, text_color=TEXT,
        ).grid(row=0, column=3, sticky="w")

        ctk.CTkButton(
            right, text="保存公告", height=40,
            font=ctk.CTkFont(family="Microsoft YaHei", size=13, weight="bold"),
            fg_color=ACCENT_DARK, hover_color=ACCENT, text_color=TEXT,
            command=self._save_announcement,
        ).grid(row=6, column=0, sticky="ew", padx=16, pady=(4, 16))

        self.pages["announcements"] = page
        self._refresh_list()

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
        for child in self.list_scroll.winfo_children():
            child.destroy()

        try:
            data = self.ann_store.load()
        except Exception as e:
            messagebox.showerror("加载失败", str(e))
            return

        choice = self.cat_var.get()
        category = choice.split(" ")[0]
        items = data.get(category, [])

        if not items:
            ctk.CTkLabel(
                self.list_scroll, text="（暂无公告）",
                font=ctk.CTkFont(family="Microsoft YaHei", size=11),
                text_color=TEXT_DIM,
            ).grid(row=0, column=0, sticky="w", padx=8, pady=8)
            return

        items_sorted = sorted(items, key=lambda x: x.date, reverse=True)
        for i, item in enumerate(items_sorted):
            self._render_item(item, i, category)

    def _render_item(self, item, idx, category):
        card = ctk.CTkFrame(
            self.list_scroll, fg_color=BG_PANEL, corner_radius=8,
            border_width=1, border_color=BORDER)
        card.grid(row=idx, column=0, sticky="ew", padx=4, pady=4)
        card.grid_columnconfigure(0, weight=1)

        title = f"[{item.tag}] {item.title}" if item.tag else item.title
        ctk.CTkLabel(
            card, text=title,
            font=ctk.CTkFont(family="Microsoft YaHei", size=12, weight="bold"),
            text_color=TEXT, anchor="w", justify="left",
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
            wraplength=380,
        ).grid(row=2, column=0, sticky="ew", padx=12, pady=(0, 4))

        ctk.CTkButton(
            card, text="删除", width=60, height=24,
            font=ctk.CTkFont(family="Microsoft YaHei", size=10),
            fg_color="transparent", hover_color=RED,
            text_color=RED,
            command=lambda i=item, c=category: self._delete_announcement(i.id, c),
        ).grid(row=3, column=0, sticky="e", padx=8, pady=(0, 8))

    def _save_announcement(self):
        choice = self.cat_var.get()
        category = choice.split(" ")[0]
        title = self.ann_title_var.get().strip()
        content = self.ann_content_tb.get("1.0", "end-1c").strip()
        date = self.ann_date.get().strip()
        tag = self.ann_tag.get().strip()

        if not title:
            messagebox.showwarning("标题不能为空", "请输入公告标题")
            return
        if not content:
            messagebox.showwarning("内容不能为空", "请输入公告内容")
            return

        try:
            item = self.ann_store.add(
                category=category, title=title, content=content,
                tag=tag, date=date or datetime.now().strftime("%Y-%m-%d"),
            )
            messagebox.showinfo(
                "保存成功",
                f"公告已保存\n\n标题：{item.title}\n\n"
                "请在「推送上线」页面点击「一键推送」同步到线上。")
            self.ann_title_var.set("")
            self.ann_content_tb.delete("1.0", "end")
            self._refresh_list()
        except Exception as e:
            messagebox.showerror("保存失败", str(e))

    def _delete_announcement(self, ann_id, category):
        if not messagebox.askyesno(
            "确认删除", f"确定要删除公告 #{ann_id} 吗？此操作不可撤销"):
            return
        try:
            if self.ann_store.delete(category, ann_id):
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