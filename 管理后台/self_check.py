"""管理后台模块自检脚本（无 GUI）"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from config_store import load_config
from github_client import GitHubClient
from announcements import AnnouncementStore
from deployer import load_settings_json
from main import QuiddityAdminApp


def main():
    print("[OK] config_store imported")
    cfg = load_config()
    print(f"  project_root: {cfg.project_root}")

    print("[OK] github_client imported")
    client = GitHubClient(repo="jiuan-9/quiddity-website")
    print(f"  repo: {client.repo}")

    print("[OK] announcements imported")
    store = AnnouncementStore(Path("D:/quiddity-website/public/announcements.json"))
    data = store.load()
    print(f"  important: {len(data['important'])}, latest: {len(data['latest'])}")

    print("[OK] deployer imported")
    version = load_settings_json(Path("D:/quiddity-website/public/version.json"))
    print(f"  version.json keys: {list(version.keys())}")

    print("[OK] main imported")
    print(f"  app class: {QuiddityAdminApp.__name__}")

    print("\n全部模块自检通过")


if __name__ == "__main__":
    main()
