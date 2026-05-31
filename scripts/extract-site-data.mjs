import fs from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const projectRoot = new URL('../Project-CB/', root);
const sql = await fs.readFile(new URL('myBlog-backup.sql', projectRoot), 'utf8');
const careerSrc = await fs.readFile(new URL('src/front/src/Components/main/CareerSection.tsx', projectRoot), 'utf8');

function getInsertBlock(table) {
    const marker = `INSERT INTO \`${table}\``;
    const start = sql.indexOf(marker);
    if (start < 0) throw new Error(`Missing ${table}`);
    const end = sql.indexOf('\n\n--', start);
    return sql.slice(start, end > start ? end : sql.indexOf(';', start) + 1);
}

function splitTuples(valuesPart) {
    const tuples = [];
    let inString = false;
    let escaped = false;
    let depth = 0;
    let start = -1;

    for (let i = 0; i < valuesPart.length; i += 1) {
        const ch = valuesPart[i];

        if (inString) {
            if (escaped) escaped = false;
            else if (ch === '\\') escaped = true;
            else if (ch === "'") inString = false;
            continue;
        }

        if (ch === "'") {
            inString = true;
            continue;
        }

        if (ch === '(') {
            if (depth === 0) start = i;
            depth += 1;
            continue;
        }

        if (ch === ')') {
            depth -= 1;
            if (depth === 0 && start >= 0) tuples.push(valuesPart.slice(start + 1, i));
        }
    }

    return tuples;
}

function splitFields(tuple) {
    const fields = [];
    let current = '';
    let inString = false;
    let escaped = false;

    for (let i = 0; i < tuple.length; i += 1) {
        const ch = tuple[i];

        if (inString) {
            current += ch;
            if (escaped) escaped = false;
            else if (ch === '\\') escaped = true;
            else if (ch === "'") inString = false;
            continue;
        }

        if (ch === "'") {
            inString = true;
            current += ch;
            continue;
        }

        if (ch === ',') {
            fields.push(current.trim());
            current = '';
            continue;
        }

        current += ch;
    }

    fields.push(current.trim());
    return fields;
}

function parseValue(raw) {
    if (raw === 'NULL') return null;
    if (raw.startsWith("'") && raw.endsWith("'")) {
        return raw.slice(1, -1)
            .replace(/\\0/g, '\0')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, '\\');
    }

    const n = Number(raw);
    return Number.isNaN(n) ? raw : n;
}

function parseInsert(table) {
    const block = getInsertBlock(table);
    const values = block
        .slice(block.indexOf('VALUES') + 'VALUES'.length)
        .trim()
        .replace(/;$/, '');
    return splitTuples(values).map((tuple) => splitFields(tuple).map(parseValue));
}

function stripMarkdown(text) {
    return String(text || '')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
        .replace(/^#+\s+/gm, '')
        .replace(/[>*_#|\-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function excerpt(text, len = 150) {
    const clean = stripMarkdown(text);
    return clean.length > len ? `${clean.slice(0, len).trim()}...` : clean;
}

function extractCareerData() {
    const careerStart = careerSrc.indexOf('const CAREER_DATA: CareerPhase[] =');
    if (careerStart < 0) throw new Error('CAREER_DATA not found');

    const assignment = careerSrc.indexOf('=', careerStart);
    const arrayStart = careerSrc.indexOf('[', assignment);
    let depth = 0;
    let inString = false;
    let quote = '';
    let escaped = false;
    let arrayEnd = -1;

    for (let i = arrayStart; i < careerSrc.length; i += 1) {
        const ch = careerSrc[i];

        if (inString) {
            if (escaped) escaped = false;
            else if (ch === '\\') escaped = true;
            else if (ch === quote) inString = false;
            continue;
        }

        if (ch === "'" || ch === '"' || ch === '`') {
            inString = true;
            quote = ch;
            continue;
        }

        if (ch === '[') depth += 1;
        if (ch === ']') {
            depth -= 1;
            if (depth === 0) {
                arrayEnd = i;
                break;
            }
        }
    }

    if (arrayEnd < 0) throw new Error('CAREER_DATA end not found');
    return vm.runInNewContext(`(${careerSrc.slice(arrayStart, arrayEnd + 1)})`);
}

const groups = parseInsert('M_Group')
    .map(([idx, reference, name, memo, flag]) => ({ idx, reference, name, memo: memo || '', flag }))
    .filter((group) => group.flag === 0)
    .map(({ flag, ...group }) => group)
    .sort((a, b) => a.reference - b.reference || a.idx - b.idx);

const activeGroupIds = new Set(groups.map((group) => group.idx));

const posts = parseInsert('M_Board')
    .map(([idx, content, createTime, updateTime, groupIdx, title, flag]) => ({
        idx,
        title: title || '(제목 없음)',
        content: content || '',
        createTime,
        updateTime,
        groupIdx,
        flag,
        excerpt: excerpt(content),
        contentLength: String(content || '').length,
    }))
    .filter((post) => post.flag === 0 && activeGroupIds.has(post.groupIdx))
    .map(({ flag, ...post }) => post)
    .sort((a, b) => String(b.createTime).localeCompare(String(a.createTime)) || b.idx - a.idx);

const career = extractCareerData();
const data = {
    generatedAt: new Date().toISOString(),
    source: {
        groupsAndPosts: 'Project-CB/myBlog-backup.sql',
        career: 'Project-CB/src/front/src/Components/main/CareerSection.tsx',
        filter: 'Project-CB API behavior: flag = 0 only',
    },
    groups,
    posts,
    career,
};

await fs.mkdir(new URL('assets/js/', root), { recursive: true });
await fs.writeFile(new URL('assets/js/site-data.js', root), `window.SITE_DATA = ${JSON.stringify(data, null, 2)};\n`);

console.log(JSON.stringify({
    groups: groups.length,
    posts: posts.length,
    careerPhases: career.length,
    careerItems: career.reduce((count, phase) => count + phase.items.length, 0),
}, null, 2));
