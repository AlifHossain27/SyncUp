import re
from bs4 import BeautifulSoup
from premailer import transform


BN_COLOR_MAP = {
    "pink": "#ad1a72",
    "purple": "#6940a5",
    "blue": "#0b6e99",
    "green": "#4d6461",
    "brown": "#64473a",
    "red": "#e03e3e",
    "orange": "#d9730d",
    "yellow": "#dfab01",
    "gray": "#9b9a97",
    "default": "#3f3f3f"
}


def _strip_external_links(soup: BeautifulSoup) -> None:
    for link in soup.find_all("link", rel="stylesheet"):
        link.decompose()


def _normalize_element_styles(elem) -> None:
    if elem.has_attr("style"):
        style = elem["style"]
        for prop in ("transform", "position", "float", "left", "right"):
            style = re.sub(rf"{prop}\s*:[^;]+;?", "", style, flags=re.I)

        style = re.sub(r"width\s*:\s*\d+px\s*;?", "max-width:100% !important; width:100% !important;", style, flags=re.I)
        style = re.sub(r"max-width\s*:\s*\d+px\s*;?", "max-width:100% !important;", style, flags=re.I)

        elem["style"] = style

    if elem.has_attr("width"):
        del elem["width"]
        elem["style"] = (elem.get("style", "") + " width:100% !important; max-width:100% !important;").strip()


def _apply_alignment_and_color(soup: BeautifulSoup) -> None:
    for el in soup.select("[data-text-alignment]"):
        val = el.attrs.get("data-text-alignment")
        el["style"] = (el.get("style", "") + f" text-align:{val};").strip()

    for el in soup.select("[data-text-color]"):
        token = el.attrs.get("data-text-color")
        color = BN_COLOR_MAP.get(token, BN_COLOR_MAP["default"])
        el["style"] = (el.get("style", "") + f" color:{color} !important;").strip()


def _convert_columns_to_table(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")

    _strip_external_links(soup)
    _apply_alignment_and_color(soup)

    for el in soup.find_all(True):
        _normalize_element_styles(el)

    for grid in soup.select(".xl-multi-column, .bn-block-column-list"):
        cols = [c for c in grid.find_all(class_="bn-block-column", recursive=False)]
        if not cols:
            continue

        table = soup.new_tag("table", attrs={
            "width": "100%",
            "cellpadding": "0",
            "cellspacing": "0",
            "role": "presentation",
            "style": "border-collapse:collapse; width:100%;"
        })
        tr = soup.new_tag("tr", attrs={"class": f"cols-{len(cols)}"})

        for col in cols:
            td = soup.new_tag("td", attrs={
                "align": "left",
                "valign": "top",
                "class": "stack-column",
                "width": f"{100 // len(cols)}%"
            })

            inner_table = soup.new_tag("table", attrs={
                "width": "100%",
                "role": "presentation",
                "cellpadding": "0",
                "cellspacing": "0",
                "style": "border-collapse:collapse; width:100%;"
            })
            inner_tr = soup.new_tag("tr")
            inner_td = soup.new_tag("td", attrs={
                "style": "padding:0 10px;"
            })

            for child in list(col.contents):
                inner_td.append(child)

            inner_tr.append(inner_td)
            inner_table.append(inner_tr)
            td.append(inner_table)
            tr.append(td)

        table.append(tr)
        grid.replace_with(table)

    for img in soup.find_all("img"):
        for attr in ["width", "height"]:
            if img.has_attr(attr):
                del img[attr]
        img["style"] = (img.get("style", "") +
                        " max-width:100% !important; height:auto !important; display:block;").strip()
        if not img.get("alt"):
            img["alt"] = ""

    return str(soup)


def _build_email_template_table_wrapper(body_html: str) -> str:
    style = """
    body { margin:0; padding:0; font-family: Helvetica, Arial, sans-serif; color:#333; background-color:#ffefef; }
    table { border-collapse: collapse; }
    .container { width:100% !important; max-width:600px !important; }
    .inner { padding:20px; background:#fff; border-radius:8px; text-align:left; }
    img { max-width:100%; height:auto; display:block; }

    /* Mobile: stack all columns */
    @media only screen and (max-width:600px) {
      .stack-column {
        display:block !important;
        width:100% !important;
        max-width:100% !important;
      }
    }

    /* Desktop: side by side with width rules */
    @media only screen and (min-width:601px) {
      .stack-column {
        display:inline-block !important;
        vertical-align:top !important;
      }
      .cols-1 .stack-column { width:100% !important; }
      .cols-2 .stack-column { width:50% !important; }
      .cols-3 .stack-column { width:33.333% !important; }
      .cols-4 .stack-column { width:25% !important; }
    }
    """

    return f"""<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>{style}</style>
  </head>
  <body>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#ffefef; width:100%;">
      <tr>
        <td align="center" style="padding:16px 12px;">
          <table class="container" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; width:100%;">
            <tr>
              <td class="inner" style="padding:20px; background:#ffffff; border-radius:8px; box-sizing:border-box;">
                {body_html}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>"""


def make_email_safe_html(original_html: str) -> str:
    converted = _convert_columns_to_table(original_html)
    wrapped = _build_email_template_table_wrapper(converted)
    return transform(wrapped, keep_style_tags=True)