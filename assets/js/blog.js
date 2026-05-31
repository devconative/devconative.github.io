(() => {
    const data = window.SITE_DATA;
    if (!data) return;

    const state = {
        groupIdx: new URLSearchParams(location.search).get('group')
            ? Number(new URLSearchParams(location.search).get('group'))
            : null,
        postIdx: new URLSearchParams(location.search).get('post')
            ? Number(new URLSearchParams(location.search).get('post'))
            : null,
        query: '',
    };

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const formatDate = (value) => {
        if (!value) return '';
        const [date] = String(value).split(' ');
        return date.replaceAll('-', '.');
    };

    const childrenOf = (idx) => data.groups.filter((group) => group.reference === idx);

    const descendantIds = (idx) => {
        const ids = [idx];
        childrenOf(idx).forEach((child) => {
            ids.push(...descendantIds(child.idx));
        });
        return ids;
    };

    const countPosts = (idx) => {
        const ids = new Set(descendantIds(idx));
        return data.posts.filter((post) => ids.has(post.groupIdx)).length;
    };

    const groupPath = (idx) => {
        const group = data.groups.find((item) => item.idx === idx);
        if (!group) return '';
        if (!group.reference) return group.name;
        return `${groupPath(group.reference)} / ${group.name}`;
    };

    const slugify = (value, index) => `section-${index}-${String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/g, '-')
        .replace(/^-|-$/g, '')}`;

    const inlineMarkdown = (value) => escapeHtml(value)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

    const markdownToHtml = (markdown) => {
        const toc = [];
        const html = [];
        const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
        let paragraph = [];
        let list = [];
        let inCode = false;
        let codeLines = [];
        let codeLang = '';

        const flushParagraph = () => {
            if (!paragraph.length) return;
            html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
            paragraph = [];
        };
        const flushList = () => {
            if (!list.length) return;
            html.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`);
            list = [];
        };
        const flushCode = () => {
            html.push(`<pre><code class="language-${escapeHtml(codeLang)}">${escapeHtml(codeLines.join('\n'))}</code></pre>`);
            codeLines = [];
            codeLang = '';
        };

        lines.forEach((line) => {
            const codeStart = line.match(/^```(\S*)/);
            if (codeStart) {
                if (inCode) {
                    flushCode();
                    inCode = false;
                } else {
                    flushParagraph();
                    flushList();
                    inCode = true;
                    codeLang = codeStart[1] || '';
                }
                return;
            }

            if (inCode) {
                codeLines.push(line);
                return;
            }

            const heading = line.match(/^(#{1,6})\s+(.+)$/);
            if (heading) {
                flushParagraph();
                flushList();
                const level = Math.min(6, heading[1].length);
                const text = heading[2].trim();
                const id = slugify(text, toc.length);
                toc.push({ id, text, level });
                html.push(`<h${level} id="${id}">${inlineMarkdown(text)}</h${level}>`);
                return;
            }

            const bullet = line.match(/^\s*[-*]\s+(.+)$/);
            if (bullet) {
                flushParagraph();
                list.push(bullet[1]);
                return;
            }

            if (!line.trim()) {
                flushParagraph();
                flushList();
                return;
            }

            paragraph.push(line.trim());
        });

        if (inCode) flushCode();
        flushParagraph();
        flushList();
        return { html: html.join(''), toc };
    };

    const renderGroupNode = (group) => {
        const children = childrenOf(group.idx);
        return `
            <li>
                <button class="blog-group-btn ${state.groupIdx === group.idx ? 'is-active' : ''}" type="button" data-group="${group.idx}">
                    <span>${escapeHtml(group.name)}</span>
                    <span>${countPosts(group.idx)}</span>
                </button>
                ${children.length ? `<ul>${children.map(renderGroupNode).join('')}</ul>` : ''}
            </li>
        `;
    };

    const filterPosts = () => {
        const q = state.query.trim().toLowerCase();
        const groupIds = state.groupIdx ? new Set(descendantIds(state.groupIdx)) : null;

        return data.posts.filter((post) => {
            if (groupIds && !groupIds.has(post.groupIdx)) return false;
            if (!q) return true;
            return `${post.title} ${post.excerpt} ${groupPath(post.groupIdx)}`.toLowerCase().includes(q);
        });
    };

    const renderPosts = () => {
        const list = document.getElementById('blog-post-list');
        const summary = document.getElementById('blog-summary');
        if (!list || !summary) return;

        const posts = filterPosts();
        summary.textContent = `${posts.length}개의 글`;

        if (!posts.length) {
            list.innerHTML = '<div class="post-card-empty">조건에 맞는 글이 없습니다.</div>';
            return;
        }

        list.innerHTML = posts.map((post) => `
            <a class="blog-post-row" id="post-${post.idx}" href="?post=${post.idx}">
                <div>
                    <p class="post-meta">${escapeHtml(groupPath(post.groupIdx))} · ${escapeHtml(formatDate(post.createTime))}</p>
                    <h3>${escapeHtml(post.title)}</h3>
                    <p>${escapeHtml(post.excerpt)}</p>
                </div>
                <span class="blog-post-index">#${post.idx}</span>
            </a>
        `).join('');
    };

    const renderDetail = () => {
        const post = data.posts.find((item) => item.idx === state.postIdx);
        const list = document.getElementById('blog-post-list');
        const summary = document.getElementById('blog-summary');
        if (!list || !summary || !post) return false;

        const parsed = markdownToHtml(post.content || '');
        summary.textContent = groupPath(post.groupIdx);
        list.innerHTML = `
            <article class="post-document-shell">
                <div class="post-document-main">
                    <a class="post-back-btn" href="./${state.groupIdx ? `?group=${state.groupIdx}` : ''}">← 목록으로</a>
                    <p class="post-meta">${escapeHtml(groupPath(post.groupIdx))} · ${escapeHtml(formatDate(post.createTime))}</p>
                    <h1>${escapeHtml(post.title)}</h1>
                    <div class="post-document">
                        ${parsed.html || '<p>아직 작성된 본문이 없습니다.</p>'}
                    </div>
                </div>
                <aside class="post-toc" aria-label="글 목차">
                    ${parsed.toc.length ? `
                        <ol>
                            ${parsed.toc.map((item) => `
                                <li class="toc-level-${item.level}">
                                    <a href="#${item.id}">${escapeHtml(item.text)}</a>
                                </li>
                            `).join('')}
                        </ol>
                    ` : '<p>목차가 없습니다.</p>'}
                </aside>
            </article>
        `;
        return true;
    };

    const renderGroups = () => {
        const tree = document.getElementById('blog-group-tree');
        if (!tree) return;
        const roots = childrenOf(0);
        tree.innerHTML = `
            <li>
                <button class="blog-group-btn ${state.groupIdx ? '' : 'is-active'}" type="button" data-group="">
                    <span>전체 글</span>
                    <span>${data.posts.length}</span>
                </button>
            </li>
            ${roots.map(renderGroupNode).join('')}
        `;
    };

    const bind = () => {
        document.getElementById('blog-search')?.addEventListener('input', (event) => {
            state.query = event.target.value;
            renderPosts();
        });

        document.getElementById('blog-group-tree')?.addEventListener('click', (event) => {
            const button = event.target.closest('[data-group]');
            if (!button) return;
            state.groupIdx = button.dataset.group ? Number(button.dataset.group) : null;
            document.querySelectorAll('.blog-group-btn').forEach((item) => {
                item.classList.toggle('is-active', item === button);
            });
            renderPosts();
        });
    };

    const hydrate = () => {
        document.getElementById('blog-group-count').textContent = `${data.groups.length}개 그룹`;
        document.getElementById('blog-post-count').textContent = `${data.posts.length}개 글`;
        renderGroups();
        if (!state.postIdx || !renderDetail()) renderPosts();
        bind();

        const hashId = location.hash.replace('#post-', '');
        if (hashId) {
            requestAnimationFrame(() => document.getElementById(`post-${hashId}`)?.scrollIntoView({ block: 'center' }));
        }
    };

    hydrate();
})();
