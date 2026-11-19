/* Import in a browser module, then insert the returned element with replaceChildren. */
export function renderUnit(symbol, doc = document) {
  const result = doc.createElement('span');
  result.className = 'unit-symbol';
  for (const glyph of String(symbol)) {
    if ('⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺'.includes(glyph)) {
      const exponent = doc.createElement('sup');
      exponent.textContent = '0123456789−+'['⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺'.indexOf(glyph)];
      result.append(exponent);
    } else if (/\p{Ll}/u.test(glyph)) {
      const lower = doc.createElement('span');
      lower.className = 'unit-lower';
      lower.textContent = glyph;
      result.append(lower);
    } else {
      result.append(doc.createTextNode(glyph));
    }
  }
  return result;
}
