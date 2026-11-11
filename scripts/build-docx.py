"""Converts the exported career page (out/career.html) into a .docx. Standard library only.

usage: python scripts/build-docx.py OUT.docx [--phone]   (run `npm run build` first)
  --phone  fill [data-phone] from public/private.js (private copy only)

Handles the small HTML subset the career page uses: h1-h5, p, ul/li, dl/dt/dd, a, b,
and the .company-head/.proj-head rows. Elements with .no-print are skipped.
"""
import re, sys, zipfile
from html import escape
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://epww1502.github.io"
VOID = {"meta", "link", "br", "img", "input", "hr", "path", "rect", "circle"}
SKIP = {"head", "script", "style", "svg", "title"}

FG, MUTED, ACCENT, LINE = "16181D", "5D6470", "2F5BEA", "E6E8EC"
FONT = "Malgun Gothic"


class Node:
    def __init__(self, tag, attrs, parent=None):
        self.tag, self.attrs, self.parent, self.kids = tag, dict(attrs), parent, []

    @property
    def cls(self):
        return set((self.attrs.get("class") or "").split())


class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = self.cur = Node("root", {})

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.kids.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.kids.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.kids.append(data)


class Doc:
    def __init__(self, phone):
        self.body, self.links, self.phone = [], [], phone

    # ---- inline runs ----
    def runs(self, node, fmt=None):
        fmt = dict(fmt or {})
        out = []
        for k in node.kids:
            if isinstance(k, str):
                out.append((re.sub(r"\s+", " ", k), fmt))
                continue
            if k.tag in SKIP or "no-print" in k.cls:
                continue
            f = dict(fmt)
            if k.tag in ("b", "strong"):
                f["b"] = True
            href = k.attrs.get("href", "")
            if k.tag == "a" and href.startswith("http"):
                f["link"] = href
            elif k.tag == "a" and href.startswith("/"):
                f["link"] = SITE + href  # links to other pages of the site
            if "data-phone" in k.attrs:
                if self.phone:
                    out.append((self.phone, f))
                continue
            if "result" in k.cls:
                f.update(b=True, color=ACCENT)
            out.extend(self.runs(k, f))
        return out

    def run_xml(self, text, f, base):
        f = {**base, **f}
        rpr = ""
        if f.get("b"):
            rpr += "<w:b/>"
        color = f.get("color")
        if f.get("link"):
            color = ACCENT
        if color:
            rpr += f'<w:color w:val="{color}"/>'
        if f.get("sz"):
            rpr += f'<w:sz w:val="{f["sz"]}"/>'
        r = f'<w:r><w:rPr>{rpr}</w:rPr><w:t xml:space="preserve">{escape(text, quote=False)}</w:t></w:r>'
        if f.get("link"):
            self.links.append(f["link"])
            r = f'<w:hyperlink r:id="rLink{len(self.links)}">{r}</w:hyperlink>'
        return r

    def para(self, runs, style=None, base=None, ppr="", sep=None):
        base = base or {}
        # trim leading/trailing whitespace across the paragraph
        runs = [(t, f) for t, f in runs if t]
        if runs:
            runs[0] = (runs[0][0].lstrip(), runs[0][1])
            runs[-1] = (runs[-1][0].rstrip(), runs[-1][1])
        xml = "".join(self.run_xml(t, f, base) for t, f in runs if t)
        if not xml:
            return
        st = f'<w:pStyle w:val="{style}"/>' if style else ""
        self.body.append(f"<w:p><w:pPr>{st}{ppr}</w:pPr>{xml}</w:p>")

    # ---- blocks ----
    def block(self, n):
        if isinstance(n, str) or n.tag in SKIP or "no-print" in n.cls:
            return
        t, c = n.tag, n.cls
        if t == "h1":
            self.para(self.runs(n), "Title")
        elif t == "h2":
            self.para(self.runs(n), "Heading1")
        elif t in ("h3", "h4", "h5"):
            self.para(self.runs(n), {"h3": "Heading2", "h4": "Heading3", "h5": "Heading4"}[t])
        elif "company-head" in c or "proj-head" in c:
            head = next(k for k in n.kids if not isinstance(k, str) and k.tag in ("h3", "h4"))
            side = next((k for k in n.kids if not isinstance(k, str) and k.tag == "span"), None)
            runs = self.runs(head)
            if side is not None:
                runs += [("   ", {})] + [(tx, {**f, "color": MUTED, "b": False}) for tx, f in self.runs(side)]
            self.para(runs, "Heading2" if head.tag == "h3" else "Heading3")
        elif "contact" in c:
            runs = []
            for k in n.kids:
                if isinstance(k, str) or "no-print" in k.cls:
                    continue
                part = self.runs(_wrap(k))
                if "".join(tx for tx, _ in part).strip():
                    if runs:
                        runs.append(("  ·  ", {"color": MUTED}))
                    runs += part
            self.para(runs, "Contact")
        elif t == "p":
            style = "Label" if "label" in c else "Lead" if "lead" in c else "Muted" if "ctx" in c else None
            self.para(self.runs(n), style)
        elif t == "ul":
            for li in n.kids:
                if not isinstance(li, str) and li.tag == "li":
                    self.para(self.runs(li), "ListBullet")
        elif t == "dl":
            self.table(n)
        else:
            for k in n.kids:
                self.block(k)

    def table(self, dl):
        rows, dt = [], None
        for k in dl.kids:
            if isinstance(k, str):
                continue
            if k.tag == "dt":
                dt = k
            elif k.tag == "dd":
                rows.append((dt, k))
        wide = "skills" in dl.cls
        w1 = 1900 if wide else 1050
        w2 = 9026 - w1

        def cell(w, node, bold):
            self_body, self.body = self.body, []
            self.para(self.runs(node), "Cell", {"b": True, "color": MUTED} if bold else {})
            inner = "".join(self.body) or "<w:p/>"
            self.body = self_body
            return f'<w:tc><w:tcPr><w:tcW w:w="{w}" w:type="dxa"/></w:tcPr>{inner}</w:tc>'

        trs = "".join(f"<w:tr>{cell(w1, a, True)}{cell(w2, b, False)}</w:tr>" for a, b in rows)
        self.body.append(
            '<w:tbl><w:tblPr><w:tblW w:w="9026" w:type="dxa"/><w:tblLayout w:type="fixed"/>'
            '<w:tblCellMar><w:left w:w="0" w:type="dxa"/><w:right w:w="113" w:type="dxa"/></w:tblCellMar>'
            f'</w:tblPr><w:tblGrid><w:gridCol w:w="{w1}"/><w:gridCol w:w="{w2}"/></w:tblGrid>{trs}</w:tbl>'
            '<w:p><w:pPr><w:pStyle w:val="Gap"/></w:pPr></w:p>'
        )


def _wrap(node):
    w = Node("x", {})
    w.kids = [node]
    return w


def rpr(sz, color=FG, b=False):
    return f'<w:rPr>{"<w:b/>" if b else ""}<w:color w:val="{color}"/><w:sz w:val="{sz}"/></w:rPr>'


def styles():
    def ps(sid, name, ppr, rp, based="Normal"):
        return (f'<w:style w:type="paragraph" w:styleId="{sid}"><w:name w:val="{name}"/>'
                f'<w:basedOn w:val="{based}"/><w:qFormat/><w:pPr>{ppr}</w:pPr>{rp}</w:style>')
    border = f'<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="3" w:color="{LINE}"/></w:pBdr>'
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        f'<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="{FONT}" w:hAnsi="{FONT}" w:eastAsia="{FONT}" w:cs="{FONT}"/>'
        f'<w:color w:val="{FG}"/><w:sz w:val="19"/><w:lang w:val="ko-KR" w:eastAsia="ko-KR"/></w:rPr></w:rPrDefault>'
        '<w:pPrDefault><w:pPr><w:spacing w:after="40" w:line="288" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>'
        '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>'
        + ps("Title", "Title", '<w:spacing w:after="60"/>', rpr(44, b=True))
        + ps("Lead", "Lead", '<w:spacing w:after="80"/>', rpr(23, b=True))
        + ps("Contact", "Contact", '<w:spacing w:after="120"/>', rpr(18, MUTED))
        + ps("Heading1", "heading 1", f'<w:keepNext/><w:spacing w:before="320" w:after="140"/>{border}<w:outlineLvl w:val="0"/>', rpr(20, ACCENT, True))
        + ps("Heading2", "heading 2", '<w:keepNext/><w:spacing w:before="240" w:after="60"/><w:outlineLvl w:val="1"/>', rpr(27, b=True))
        + ps("Heading3", "heading 3", '<w:keepNext/><w:spacing w:before="220" w:after="60"/><w:outlineLvl w:val="2"/>', rpr(23, b=True))
        + ps("Heading4", "heading 4", '<w:keepNext/><w:spacing w:before="100" w:after="40"/><w:outlineLvl w:val="3"/>', rpr(19, b=True))
        + ps("Label", "Label", '<w:keepNext/><w:spacing w:before="140" w:after="40"/>', rpr(18, ACCENT, True))
        + ps("Muted", "Muted", '<w:spacing w:after="80"/>', rpr(18, MUTED))
        + ps("Cell", "Table Text", '<w:spacing w:after="20"/>', rpr(18))
        + ps("Gap", "Gap", '<w:spacing w:after="0" w:line="120" w:lineRule="exact"/>', rpr(8))
        + ps("ListBullet", "List Bullet", '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:spacing w:after="30"/><w:ind w:left="300" w:hanging="200"/>', rpr(19))
        + '</w:styles>'
    )


NUMBERING = (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    '<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
    '<w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/>'
    '<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/>'
    '<w:pPr><w:ind w:left="300" w:hanging="200"/></w:pPr></w:lvl></w:abstractNum>'
    '<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>'
)


def main():
    out = Path(sys.argv[1])
    phone = None
    if "--phone" in sys.argv and (ROOT / "public" / "private.js").exists():
        m = re.search(r"'([0-9][0-9-]+)'", (ROOT / "public" / "private.js").read_text(encoding="utf-8"))
        phone = m.group(1) if m else None

    tree = Tree()
    tree.feed((ROOT / "out" / "career.html").read_text(encoding="utf-8"))
    main_el = next(n for n in _walk(tree.root) if n.tag == "main")
    doc = Doc(phone)
    for k in main_el.kids:
        doc.block(k)

    W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
    sect = ('<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>'
            '<w:pgMar w:top="1000" w:right="1440" w:bottom="1000" w:left="1440" w:header="500" w:footer="500" w:gutter="0"/></w:sectPr>')
    document = f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document {W}><w:body>{"".join(doc.body)}{sect}</w:body></w:document>'

    REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    rels = ''.join(f'<Relationship Id="rLink{i}" Type="{REL}/hyperlink" Target="{escape(u)}" TargetMode="External"/>'
                   for i, u in enumerate(doc.links, 1))
    doc_rels = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
                f'<Relationship Id="rStyles" Type="{REL}/styles" Target="styles.xml"/>'
                f'<Relationship Id="rNum" Type="{REL}/numbering" Target="numbering.xml"/>{rels}</Relationships>')
    content_types = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
        '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
        '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>'
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
        '</Types>')
    root_rels = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                 '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
                 f'<Relationship Id="rDoc" Type="{REL}/officeDocument" Target="word/document.xml"/>'
                 '<Relationship Id="rCore" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
                 '</Relationships>')
    core = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
            'xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>이영주 경력기술서</dc:title><dc:creator>이영주</dc:creator></cp:coreProperties>')

    out.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", root_rels)
        z.writestr("word/document.xml", document)
        z.writestr("word/_rels/document.xml.rels", doc_rels)
        z.writestr("word/styles.xml", styles())
        z.writestr("word/numbering.xml", NUMBERING)
        z.writestr("docProps/core.xml", core)
    print(f"{out}: {len(doc.body)} blocks, phone={'yes' if phone else 'no'}")


def _walk(n):
    yield n
    for k in n.kids:
        if not isinstance(k, str):
            yield from _walk(k)


if __name__ == "__main__":
    main()
