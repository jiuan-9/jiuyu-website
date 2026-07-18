#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quiddity 官网公告一键推送工具
读取公告编辑文档.md → 生成 JSON → 构建网站 → Git提交 → 推送到GitHub → 自动部署
"""

import os
import sys
import json
import re
import shutil
import subprocess
from pathlib import Path
from datetime import datetime

SCRIPT_DIR = Path(__file__).parent.resolve()
EDIT_FILE = SCRIPT_DIR / "公告编辑文档.md"
PUBLIC_JSON = SCRIPT_DIR / "public" / "announcements.json"
BUILD_TIMEOUT = 300
GIT_TIMEOUT = 120


def print_header(text):
    print()
    print("=" * 60)
    print(f"  {text}")
    print("=" * 60)
    print()


def print_success(text):
    print(f"  [OK] {text}")


def print_error(text):
    print(f"  [错误] {text}")


def print_info(text):
    print(f"  [信息] {text}")


def print_warn(text):
    print(f"  [提示] {text}")


def print_step(step_num, total, text):
    print()
    print(f"  --- [{step_num}/{total}] {text} ---")
    print()


def parse_announcements(md_content: str) -> dict:
    """解析公告文档"""

    def parse_section(content: str, has_tag: bool = False) -> list:
        items = []
        pattern = r"###\s*公告\s*\d+\s*\n(.*?)(?=\n###\s*公告|\n---|\Z)"
        matches = re.findall(pattern, content, re.DOTALL)

        for idx, match in enumerate(matches):
            item = {"id": idx + 1}

            title_match = re.search(r"^标题[：:]\s*(.*?)\s*$", match, re.MULTILINE)
            if title_match:
                item["title"] = title_match.group(1).strip()
            else:
                item["title"] = ""

            date_match = re.search(r"^日期[：:]\s*(.*?)\s*$", match, re.MULTILINE)
            if date_match:
                item["date"] = date_match.group(1).strip()
            else:
                item["date"] = ""

            if has_tag:
                tag_match = re.search(r"^标签[：:]\s*(.*?)\s*$", match, re.MULTILINE)
                if tag_match:
                    item["tag"] = tag_match.group(1).strip()

            content_match = re.search(
                r"^内容[：:]\s*\n(.*?)(?=\n---|\n###\s*公告|\Z)",
                match,
                re.DOTALL | re.MULTILINE,
            )
            if content_match:
                content_text = content_match.group(1).strip()
                lines = content_text.split("\n")
                cleaned_lines = [line.rstrip() for line in lines]
                while cleaned_lines and not cleaned_lines[-1].strip():
                    cleaned_lines.pop()
                item["content"] = "\n".join(cleaned_lines).strip()
            else:
                item["content"] = ""

            if item["title"] and item["content"]:
                items.append(item)

        return items

    important_match = re.search(
        r"##\s*重要公告\s*\n(.*?)(?=\n##\s*最新公告|\Z)", md_content, re.DOTALL
    )
    important_section = important_match.group(1) if important_match else ""

    latest_match = re.search(
        r"##\s*最新公告\s*\n(.*?)(?=\n##\s|$)", md_content, re.DOTALL
    )
    latest_section = latest_match.group(1) if latest_match else ""

    important_items = parse_section(important_section, has_tag=True)
    latest_items = parse_section(latest_section, has_tag=False)

    return {"important": important_items, "latest": latest_items}


def run_command(cmd, cwd, timeout=BUILD_TIMEOUT, show_output=True):
    """运行命令并实时输出"""
    if show_output:
        print_info(f"执行: {cmd if isinstance(cmd, str) else ' '.join(cmd)}")
        print()

    try:
        process = subprocess.Popen(
            cmd,
            cwd=str(cwd),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
            shell=True if os.name == "nt" else False,
        )

        output_lines = []
        while True:
            line = process.stdout.readline()
            if not line and process.poll() is not None:
                break
            if line:
                line = line.rstrip()
                output_lines.append(line)
                if show_output:
                    print(f"    {line}")

        process.wait(timeout=timeout)
        return process.returncode, "\n".join(output_lines)

    except subprocess.TimeoutExpired:
        process.kill()
        process.wait()
        return -1, "命令执行超时"
    except Exception as e:
        return -1, str(e)


def check_npm():
    """检查 npm 是否可用"""
    try:
        result = subprocess.run(
            ["npm", "--version"],
            capture_output=True,
            text=True,
            timeout=10,
            shell=True if os.name == "nt" else False,
        )
        if result.returncode == 0:
            return True, result.stdout.strip()
        return False, ""
    except Exception:
        return False, ""


def check_git():
    """检查 git 是否可用"""
    try:
        result = subprocess.run(
            ["git", "--version"],
            capture_output=True,
            text=True,
            timeout=10,
            shell=True if os.name == "nt" else False,
        )
        if result.returncode == 0:
            return True, result.stdout.strip()
        return False, ""
    except Exception:
        return False, ""


def get_git_remote():
    """获取 git 远端仓库地址"""
    try:
        result = subprocess.run(
            ["git", "remote", "get-url", "origin"],
            capture_output=True,
            text=True,
            timeout=10,
            cwd=str(SCRIPT_DIR),
            shell=True if os.name == "nt" else False,
        )
        if result.returncode == 0:
            return result.stdout.strip()
        return ""
    except Exception:
        return ""


def has_git_changes():
    """检查是否有未提交的改动"""
    try:
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True,
            timeout=10,
            cwd=str(SCRIPT_DIR),
            shell=True if os.name == "nt" else False,
        )
        if result.returncode == 0:
            return len(result.stdout.strip()) > 0
        return True
    except Exception:
        return True


def main():
    os.system("title Quiddity 官网公告一键推送" if os.name == "nt" else "")

    print_header("Quiddity 官网公告一键推送工具 v2.0")
    print_info(f"工作目录: {SCRIPT_DIR}")
    print()

    # 步骤 1: 检查环境
    print_step(1, 7, "环境检查")

    if not EDIT_FILE.exists():
        print_error(f"找不到公告编辑文档：{EDIT_FILE}")
        print_warn("请确保 '公告编辑文档.md' 在当前目录下。")
        print()
        input("按回车键退出...")
        sys.exit(1)
    print_success("找到公告编辑文档")

    npm_ok, npm_ver = check_npm()
    if not npm_ok:
        print_error("未找到 Node.js / npm")
        print_warn("请先安装 Node.js：https://nodejs.org/")
        print()
        input("按回车键退出...")
        sys.exit(1)
    print_success(f"Node.js 已就绪（npm {npm_ver}）")

    git_ok, git_ver = check_git()
    if not git_ok:
        print_error("未找到 Git")
        print_warn("请先安装 Git：https://git-scm.com/")
        print()
        input("按回车键退出...")
        sys.exit(1)
    print_success(f"Git 已就绪（{git_ver}）")

    remote = get_git_remote()
    if remote:
        print_info(f"远端仓库: {remote}")
    else:
        print_warn("未检测到 Git 远端仓库，将只进行本地构建")

    # 步骤 2: 解析文档
    print_step(2, 7, "解析公告内容")
    try:
        with open(EDIT_FILE, "r", encoding="utf-8") as f:
            md_content = f.read()

        data = parse_announcements(md_content)
        imp_count = len(data["important"])
        lat_count = len(data["latest"])
        print_success(f"解析成功：重要公告 {imp_count} 条，最新公告 {lat_count} 条")

        if imp_count == 0 and lat_count == 0:
            print_warn("警告：当前没有任何公告内容")
    except Exception as e:
        print_error(f"解析文档失败：{e}")
        print()
        input("按回车键退出...")
        sys.exit(1)

    # 步骤 3: 生成 JSON
    print_step(3, 7, "生成公告数据文件")
    try:
        PUBLIC_JSON.parent.mkdir(parents=True, exist_ok=True)
        with open(PUBLIC_JSON, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print_success("已生成：public/announcements.json")
    except Exception as e:
        print_error(f"生成 JSON 文件失败：{e}")
        print()
        input("按回车键退出...")
        sys.exit(1)

    # 步骤 4: 构建项目
    print_step(4, 7, "构建网站")
    print_info("正在构建，请稍候（通常需要 10-60 秒）...")
    print()

    returncode, output = run_command("npm run build", SCRIPT_DIR)

    print()
    if returncode != 0:
        print_error("构建失败！")
        print()
        print_info("错误输出（最后 20 行）：")
        lines = output.split("\n")[-20:]
        for line in lines:
            if line.strip():
                print(f"    {line}")
        print()
        print_warn("可能的原因：")
        print("    1. 首次运行请先执行 npm install 安装依赖")
        print("    2. 代码有语法错误，请检查")
        print()
        input("按回车键退出...")
        sys.exit(1)

    print_success("网站构建成功！")

    # 步骤 5: 同步到 docs 目录
    print_step(5, 7, "更新部署目录")
    docs_dir = SCRIPT_DIR / "docs"
    dist_dir = SCRIPT_DIR / "dist"

    if docs_dir.exists() and dist_dir.exists():
        try:
            for item in docs_dir.iterdir():
                if item.name.startswith("."):
                    continue
                if item.is_dir():
                    shutil.rmtree(item)
                else:
                    item.unlink()

            for item in dist_dir.iterdir():
                dest = docs_dir / item.name
                if item.is_dir():
                    shutil.copytree(item, dest)
                else:
                    shutil.copy2(item, dest)

            print_success("docs 目录已更新（GitHub Pages 部署目录）")
        except Exception as e:
            print_error(f"更新 docs 目录失败：{e}")
    elif dist_dir.exists():
        print_info("dist 目录已生成")
    else:
        print_error("未找到 dist 目录，构建可能未完成")

    # 步骤 6: Git 提交
    print_step(6, 7, "Git 提交")

    if not has_git_changes():
        print_warn("没有检测到文件变更，跳过提交")
    else:
        print_info("添加文件到暂存区...")
        returncode, output = run_command(
            'git add -A',
            SCRIPT_DIR,
            timeout=30,
            show_output=False,
        )
        if returncode != 0:
            print_error(f"git add 失败：{output}")
            print()
            input("按回车键退出...")
            sys.exit(1)
        print_success("文件已添加到暂存区")

        # 生成提交信息
        now = datetime.now().strftime("%Y-%m-%d %H:%M")
        commit_msg = f"更新公告 [{now}] - 重要{imp_count}条 / 最新{lat_count}条"

        print_info(f"提交变更: {commit_msg}")
        returncode, output = run_command(
            f'git commit -m "{commit_msg}"',
            SCRIPT_DIR,
            timeout=30,
            show_output=False,
        )
        if returncode != 0:
            print_error(f"git commit 失败：{output}")
            print()
            input("按回车键退出...")
            sys.exit(1)
        print_success("提交成功")

    # 步骤 7: 推送到 GitHub
    print_step(7, 7, "推送到 GitHub")

    if not remote:
        print_warn("未配置远端仓库，跳过推送")
    else:
        print_info("正在推送到 GitHub...")
        print_info("（首次推送可能需要输入 GitHub 账号密码或 Token）")
        print()

        returncode, output = run_command(
            "git push origin main",
            SCRIPT_DIR,
            timeout=GIT_TIMEOUT,
            show_output=True,
        )

        print()
        if returncode != 0:
            print_error("推送失败！")
            print()
            print_info("错误信息：")
            lines = output.split("\n")[-15:]
            for line in lines:
                if line.strip():
                    print(f"    {line}")
            print()
            print_warn("可能的原因：")
            print("    1. 网络连接问题")
            print("    2. GitHub 认证失败（需要配置 Token 或 SSH Key）")
            print("    3. 本地分支落后于远端，请先 pull")
            print()
            print_info("本地构建已完成，你可以手动推送")
            print()
            input("按回车键退出...")
            sys.exit(1)

        print_success("已推送到 GitHub！")

    # 完成
    print_header("🎉 推送完成！")
    print_success("公告已成功更新并部署")
    print()
    print_info(f"  重要公告：{len(data['important'])} 条")
    print_info(f"  最新公告：{len(data['latest'])} 条")
    print()

    if remote:
        print_info("部署状态：")
        print("    ✅ GitHub Pages: 推送后自动部署（约 1-3 分钟生效）")
        print("    ✅ Cloudflare Pages: 推送后自动部署（约 1-2 分钟生效）")
        print()
        print_info("网站地址：")
        print("    GitHub Pages: https://jiuan-9.github.io/quiddity-website/")
        print("    Cloudflare:   https://quiddity-3by.pages.dev/")
    else:
        print_info("本地构建已完成，dist/ 目录可部署到任意静态托管服务")

    print()
    print_info("本地预览：运行 npm run dev")
    print()
    input("按回车键退出...")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        print_info("用户取消操作")
        input("按回车键退出...")
    except Exception as e:
        print()
        print_error(f"程序异常：{e}")
        import traceback

        traceback.print_exc()
        print()
        input("按回车键退出...")
