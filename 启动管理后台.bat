﻿@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo [INFO] 当前目录：%~dp0
echo [INFO] 正在进入管理后台目录...

cd /d "%~dp0\管理后台"
if errorlevel 1 (
    echo [ERROR] 无法进入管理后台目录
    pause
    exit /b 1
)

echo [INFO] 检查 Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] 未检测到 Python，请先安装 Python 3.x
    echo [INFO] 下载地址：https://www.python.org/downloads/
    pause
    exit /b 1
)

python --version
echo [INFO] 启动管理后台...
python main.py
if errorlevel 1 (
    echo [ERROR] 管理后台启动失败，错误码：%errorlevel%
)
pause
