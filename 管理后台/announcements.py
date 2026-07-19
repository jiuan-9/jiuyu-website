"""
announcements — 公告数据管理

提供 announcements.json 的增删查改。
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


@dataclass
class AnnouncementItem:
    id: int
    title: str
    content: str
    date: str
    tag: str = ""

    def to_dict(self) -> dict:
        d = {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "date": self.date,
        }
        if self.tag:
            d["tag"] = self.tag
        return d

    @classmethod
    def from_dict(cls, d: dict) -> "AnnouncementItem":
        return cls(
            id=int(d.get("id", 0)),
            title=d.get("title", ""),
            content=d.get("content", ""),
            date=d.get("date", ""),
            tag=d.get("tag", ""),
        )


class AnnouncementStore:
    def __init__(self, file_path: Path):
        self.file_path = file_path

    def load(self) -> dict[str, list[AnnouncementItem]]:
        if not self.file_path.exists():
            return {"important": [], "latest": []}
        try:
            raw = self.file_path.read_text(encoding="utf-8")
            if raw and raw[0] == "\ufeff":
                raw = raw[1:]
            data = json.loads(raw)
        except json.JSONDecodeError as e:
            raise ValueError(f"announcements.json 解析失败：{e}")

        return {
            "important": [AnnouncementItem.from_dict(x) for x in data.get("important", [])],
            "latest": [AnnouncementItem.from_dict(x) for x in data.get("latest", [])],
        }

    def save(
        self,
        important: list[AnnouncementItem],
        latest: list[AnnouncementItem],
    ) -> None:
        data = {
            "important": [item.to_dict() for item in important],
            "latest": [item.to_dict() for item in latest],
        }
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        self.file_path.write_text(
            json.dumps(data, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    def add(
        self,
        category: str,
        title: str,
        content: str,
        tag: str = "",
        date: str | None = None,
    ) -> AnnouncementItem:
        if category not in ("important", "latest"):
            raise ValueError(f"无效的分类：{category}")
        if not title.strip():
            raise ValueError("标题不能为空")
        if not content.strip():
            raise ValueError("内容不能为空")

        data = self.load()
        existing = data[category]
        next_id = max((item.id for item in existing), default=0) + 1

        item = AnnouncementItem(
            id=next_id,
            title=title.strip(),
            content=content.strip(),
            date=date or datetime.now().strftime("%Y-%m-%d"),
            tag=tag.strip(),
        )
        existing.append(item)
        self.save(data["important"], data["latest"])
        return item

    def delete(self, category: str, announcement_id: int) -> bool:
        data = self.load()
        existing = data[category]
        before = len(existing)
        data[category] = [x for x in existing if x.id != announcement_id]
        if len(data[category]) == before:
            return False
        self.save(data["important"], data["latest"])