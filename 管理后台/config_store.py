"""
config_store — 管理后台配置持久化

提供：
  - 项目根目录配置（QUIDDITY_WEBSITE_ROOT）
  - GitHub 仓库名 / Token
  - 配置文件的读取与保存
"""

from __future__ import annotations

import json
import os
from dataclasses import asdict, dataclass, field
from pathlib import Path


CONFIG_DIR = Path(os.environ.get("LOCALAPPDATA", Path.home() / ".local")) / "QuiddityAdmin"
CONFIG_FILE = CONFIG_DIR / "config.json"


@dataclass
class AdminConfig:
    """管理后台配置项"""
    project_root: str = "D:/quiddity-website"
    github_repo: str = "jiuan-9/quiddity-website"
    github_token: str = field(default="", repr=False)
    window_width: int = 1280
    window_height: int = 800


def _ensure_config_dir() -> None:
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)


def load_config() -> AdminConfig:
    """从配置文件加载配置"""
    _ensure_config_dir()
    if not CONFIG_FILE.exists():
        return AdminConfig()
    try:
        raw = CONFIG_FILE.read_text(encoding="utf-8")
        data = json.loads(raw)
        return AdminConfig(**data)
    except (json.JSONDecodeError, TypeError):
        return AdminConfig()


def save_config(config: AdminConfig) -> None:
    """保存配置到文件"""
    _ensure_config_dir()
    CONFIG_FILE.write_text(
        json.dumps(asdict(config), indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
