@echo off
REM Quiddity Deploy Dashboard 启动脚本
REM 双击此文件即可启动 GUI

chcp 65001 >nul
cd /d "%~dp0"

REM 检查 Python 是否可用
where python >nul 2>nul
if errorlevel 1 (
    echo [ERROR] 未找到 Python，请安装 Python 3.10+ 并加入 PATH
    pause
    exit /b 1
)

REM 检查依赖
python -c "import customtkinter" 2>nul
if errorlevel 1 (
    echo [*] 首次运行，安装依赖中...
    python -m pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] 依赖安装失败，请手动运行：pip install -r requirements.txt
        pause
        exit /b 1
    )
)

REM 启动
python main.py
if errorlevel 1 (
    echo.
    echo [ERROR] 程序异常退出
    pause
)
