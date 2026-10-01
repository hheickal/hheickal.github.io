"""First-publish stamping for blog posts.

A post that is `published: true` but has no `permalink` has never been
published before. For those, set `date` to today (Amherst time) and lock
the URL by writing `permalink: /posts/YYYY/MM/<url_slug>/`. Later
unpublish/republish toggles leave both alone because the permalink exists.

Prints the changed files; exits 0 either way.
"""
import pathlib
import re
import sys
from datetime import datetime
from zoneinfo import ZoneInfo

FRONT_MATTER = re.compile(r"\A---\n(.*?)\n---\n", re.S)


def field(fm, name):
    m = re.search(rf"^{name}:[ \t]*(.*)$", fm, re.M)
    return m.group(1).strip().strip("'\"") if m else None


def set_field(fm, name, value, after=None):
    line = f"{name}: {value}"
    if re.search(rf"^{name}:.*$", fm, re.M):
        return re.sub(rf"^{name}:.*$", line, fm, count=1, flags=re.M)
    if after and re.search(rf"^{after}:.*$", fm, re.M):
        return re.sub(rf"^({after}:.*)$", rf"\1\n{line}", fm, count=1, flags=re.M)
    return fm + "\n" + line


def main(root="."):
    today = datetime.now(ZoneInfo("America/New_York")).date()
    changed = []
    for path in sorted(pathlib.Path(root, "_posts").glob("*.md")):
        text = path.read_text(encoding="utf-8")
        m = FRONT_MATTER.match(text)
        if not m:
            continue
        fm = m.group(1)
        if field(fm, "published") != "true" or field(fm, "permalink"):
            continue
        slug = field(fm, "url_slug") or re.sub(r"^\d{4}-\d{2}-\d{2}-", "", path.stem)
        fm = set_field(fm, "date", today.isoformat(), after="published")
        fm = set_field(fm, "permalink", f"/posts/{today:%Y/%m}/{slug}/", after="date")
        path.write_text("---\n" + fm + "\n---\n" + text[m.end():], encoding="utf-8")
        changed.append(str(path))
    print("\n".join(changed))


if __name__ == "__main__":
    main(*sys.argv[1:])
