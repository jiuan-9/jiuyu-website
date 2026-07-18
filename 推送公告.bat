@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title Quiddity 官网公告推送工具

echo.
echo ============================================================
echo    Quiddity 官网公告推送工具
echo ============================================================
echo.

cd /d "%~dp0"

rem 检查 Python 是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo   [错误] 未检测到 Python，请先安装 Python 3.x
    echo.
    echo   下载地址：https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

rem 运行推送脚本
python push_announcements.py

if errorlevel 1 (
    echo.
    echo   [失败] 公告推送失败，请查看上方错误信息
    echo.
) else (
    echo.
    echo   [成功] 公告推送完成！
    echo.
)

pause
