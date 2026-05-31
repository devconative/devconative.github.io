(() => {
    const data = window.SITE_DATA;
    if (!data) return;

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const typeLabel = {
        job: '재직',
        team: '팀 프로젝트',
        solo: '개인 프로젝트',
        lab: '연구실',
        internship: '현장실습',
    };

    const careerList = document.getElementById('career-list');
    if (careerList) {
        careerList.innerHTML = data.career.map((phase) => `
            <section class="career-phase">
                <header class="career-phase-header">
                    <div>
                        <h3>${escapeHtml(phase.label)}</h3>
                        <p>${escapeHtml(phase.sublabel)}</p>
                    </div>
                    ${phase.isWork ? '<span class="career-phase-badge">Work</span>' : ''}
                </header>
                <div class="career-phase-items">
                    ${phase.items.map((item) => `
                        <article class="career-card">
                            <div class="career-card-meta">
                                <span>${escapeHtml(item.period)}</span>
                                <span>${escapeHtml(typeLabel[item.type] || item.type)}</span>
                            </div>
                            <h4>${escapeHtml(item.title)}</h4>
                            ${item.award ? `<p class="career-award">${escapeHtml(item.award)}</p>` : ''}
                            <p>${escapeHtml(item.description || '작성 중')}</p>
                            <div class="career-tags">
                                ${(item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}
                            </div>
                            ${item.link ? `<a class="career-link" href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">Link</a>` : ''}
                        </article>
                    `).join('')}
                </div>
            </section>
        `).join('');
    }

    const recentPosts = document.getElementById('recent-posts');
    if (recentPosts) {
        recentPosts.innerHTML = data.posts.slice(0, 6).map((post) => {
            const group = data.groups.find((item) => item.idx === post.groupIdx);
            return `
                <article class="post-card">
                    <p class="post-meta">${escapeHtml(group?.name || 'Blog')} · ${escapeHtml(post.createTime.slice(0, 10))}</p>
                    <h3>${escapeHtml(post.title)}</h3>
                    <p>${escapeHtml(post.excerpt)}</p>
                    <a href="blog/#post-${post.idx}">목록에서 보기</a>
                </article>
            `;
        }).join('');
    }
})();
