@echo off
chcp 65001 >nul
cd /d "%~dp0\管理后台"
python main.py
pause