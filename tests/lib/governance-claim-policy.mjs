import fs from 'node:fs';

export function decodeHtmlEntities(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_,hex) =>
      String.fromCodePoint(parseInt(hex,16)))
    .replace(/&#([0-9]+);/g, (_,dec) =>
      String.fromCodePoint(parseInt(dec,10)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'");
}

export function normalizeClaimText(value) {
  let text = decodeHtmlEntities(String(value)).normalize('NFKC');

  text = text
    .replace(/[\p{Cf}\p{Default_Ignorable_Code_Point}\u00AD]/gu, '')
    .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/gu, '-')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .replace(/\s+/gu, ' ')
    .trim()
    .toLowerCase();

  return text;
}

export function visibleHtmlLine(value) {
  return normalizeClaimText(
    decodeHtmlEntities(String(value))
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]*>/g, '')
  );
}

export function markdownUnits(text) {
  const out = [];
  let section = 'root';

  for (const rawLine of String(text).split(/\r?\n/)) {
    const heading = rawLine.match(/^\s*#{1,6}\s+(.+?)\s*$/);

    if (heading) {
      section = normalizeClaimText(heading[1]) || 'root';
      continue;
    }

    const unit = normalizeClaimText(rawLine.replace(/^\s*[-*+]\s+/, ''));

    if (unit) out.push({section,unit});
  }

  return out;
}

export function plainUnits(text) {
  return String(text)
    .split(/\r?\n/)
    .map(line => normalizeClaimText(line))
    .filter(Boolean)
    .map(unit => ({section:'root',unit}));
}

export function htmlUnits(text) {
  const out = [];
  let section = 'root';

  for (const rawLine of String(text).split(/\r?\n/)) {
    const heading = rawLine.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i);

    if (heading) {
      section = visibleHtmlLine(heading[1]) || 'root';
      continue;
    }

    const unit = visibleHtmlLine(rawLine);

    if (unit) out.push({section,unit});
  }

  return out;
}

export function unitsForSurface(name,text) {
  if (name === 'index.html') return htmlUnits(text);
  if (name === 'VERSION.txt') return plainUnits(text);
  return markdownUnits(text);
}

const guardedConcept =
  /\b(?:tamper\w*|alter\w*|modif\w*|immutab\w*|forg\w*|authentic\w*|sign(?:ed|ature|ing)?|integrity|guarantee\w*|version\s*1(?:\.0)?|v1(?:\.0)?|independent\w*|closure|closed|certif\w*|approv\w*|promot\w*)\b/i;

export function isGuardedUnit(unit) {
  return guardedConcept.test(unit);
}

export function keyOf(entry) {
  return `${entry.section} :: ${entry.unit}`;
}

export function guardedUnitsForSurface(name,text) {
  return unitsForSurface(name,text).filter(entry => isGuardedUnit(entry.unit));
}

export function loadAllowlist(path) {
  return JSON.parse(fs.readFileSync(path,'utf8'));
}
