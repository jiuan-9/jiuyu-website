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
        return True

    def update(
        self,
        category: str,
        announcement_id: int,
        title: str | None = None,
        content: str | None = None,
        tag: str | None = None,
        date: str | None = None,
    ) -> AnnouncementItem | None:
        """更新已有公告字段。返回更新后的 item，找不到返回 None。"""
        if not title or not title.strip():
            raise ValueError("标题不能为空")
        if not content or not content.strip():
            raise ValueError("内容不能为空")

        data = self.load()
        existing = data[category]
        for item in existing:
            if item.id == announcement_id:
                item.title = title.strip()
                item.content = content.strip()
                if tag is not None:
                    item.tag = tag.strip()
                if date is not None and date.strip():
                    item.date = date.strip()
                self.save(data["important"], data["latest"])
                return item
        return None

    def move(self, announcement_id: int, from_category: str, to_category: str) -> bool:
        """把公告从一个分类移到另一个分类（保留 id）。"""
        if from_category == to_category:
            return True
        if from_category not in ("important", "latest") or to_category not in ("important", "latest"):
            raise ValueError(f"无效的分类：{from_category} → {to_category}")
        data = self.load()
        src = data[from_category]
        dst = data[to_category]
        target = next((x for x in src if x.id == announcement_id), None)
        if target is None:
            return False
        data[from_category] = [x for x in src if x.id != announcement_id]
        # 如目标分类已有同 id，重新分配
        if any(x.id == target.id for x in dst):
            target.id = max((x.id for x in dst), default=0) + 1
        data[to_category].append(target)
        self.save(data["important"], data["latest"])
        return True