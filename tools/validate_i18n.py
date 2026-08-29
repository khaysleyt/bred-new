from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    "index.html", "a-propos/index.html", "equipe/index.html", "projets/index.html", "projets/smart-tourism/index.html", "contact/index.html",
    "en/index.html", "en/about/index.html", "en/team/index.html", "en/projects/index.html", "en/projects/smart-tourism/index.html", "en/contact/index.html",
    "nl/index.html", "nl/over-ons/index.html", "nl/team/index.html", "nl/projecten/index.html", "nl/projecten/smart-tourism/index.html", "nl/contact/index.html",
]

class Audit(HTMLParser):
    def __init__(self):
        super().__init__(); self.lang=""; self.canonical=0; self.alternates=set(); self.robots=""; self.links=[]; self.switchers=0
    def handle_starttag(self, tag, attrs):
        values=dict(attrs)
        if tag == "html": self.lang=values.get("lang", "")
        if tag == "link" and values.get("rel") == "canonical": self.canonical += 1
        if tag == "link" and values.get("rel") == "alternate": self.alternates.add(values.get("hreflang", ""))
        if tag == "meta" and values.get("name") == "robots": self.robots=values.get("content", "")
        if tag == "nav" and "language-switcher" in values.get("class", ""): self.switchers += 1
        for name in ("href", "src", "action"):
            value=values.get(name, "")
            if value.startswith("/bred-test/"): self.links.append(value.split("#",1)[0].split("?",1)[0])

errors=[]
for relative in PAGES:
    path=ROOT/relative
    if not path.is_file(): errors.append(f"missing page: {relative}"); continue
    audit=Audit(); audit.feed(path.read_text(encoding="utf-8"))
    expected="en" if relative.startswith("en/") else "nl" if relative.startswith("nl/") else "fr"
    if audit.lang != expected: errors.append(f"{relative}: lang={audit.lang}, expected {expected}")
    if audit.canonical != 1: errors.append(f"{relative}: {audit.canonical} canonical links")
    if audit.alternates != {"fr","en","nl","x-default"}: errors.append(f"{relative}: incomplete hreflang {audit.alternates}")
    if audit.robots.lower() != "noindex, nofollow": errors.append(f"{relative}: staging robots missing")
    if audit.switchers != 1: errors.append(f"{relative}: {audit.switchers} language switchers")
    for value in audit.links:
        local=value.removeprefix("/bred-test/")
        candidate=ROOT/local
        if value.endswith("/"): candidate=candidate/"index.html"
        if not candidate.exists(): errors.append(f"{relative}: broken local target {value}")

if errors:
    print("\n".join(errors)); raise SystemExit(1)
print(f"Validated {len(PAGES)} localized HTML pages.")
