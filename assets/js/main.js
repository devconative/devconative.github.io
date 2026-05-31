(() => {
    const html = document.documentElement;
    const nav = document.getElementById('site-navigation');
    const navToggle = document.getElementById('nav-toggle');
    const navBackdrop = document.getElementById('nav-backdrop');
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = themeToggle?.querySelector('.theme-toggle-label');
    const year = document.getElementById('current-year');
    const navLinks = [...document.querySelectorAll('.nav-link')];
    const sections = [...document.querySelectorAll('.reveal-section')];
    const data = window.SITE_DATA;

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const childrenOf = (idx) => data?.groups?.filter((group) => group.reference === idx) ?? [];

    const descendantIds = (idx) => {
        const ids = [idx];
        childrenOf(idx).forEach((child) => ids.push(...descendantIds(child.idx)));
        return ids;
    };

    const countPosts = (idx) => {
        const ids = new Set(descendantIds(idx));
        return data?.posts?.filter((post) => ids.has(post.groupIdx)).length ?? 0;
    };

    const blogHrefForGroup = (idx) => {
        const prefix = location.pathname.includes('/blog/') ? './' : 'blog/';
        return `${prefix}?group=${idx}`;
    };

    const renderNavGroup = (group, depth = 0) => {
        const children = childrenOf(group.idx);
        const hasChildren = children.length > 0;
        return `
            <div class="nav-group-wrapper" style="padding-left: ${depth * 0.875}rem">
                <div class="nav-group expand" data-nav-group="${group.idx}">
                    ${hasChildren
                        ? `<button class="expand-navigator" type="button" aria-label="하위 그룹 접기" aria-expanded="true"></button>`
                        : '<span class="expand-spacer" aria-hidden="true"></span>'}
                    <a href="${blogHrefForGroup(group.idx)}">
                        <span>${escapeHtml(group.name)}</span>
                        <small>${countPosts(group.idx)}</small>
                    </a>
                </div>
                ${hasChildren ? `<div class="nav-item">${children.map((child) => renderNavGroup(child, depth + 1)).join('')}</div>` : ''}
            </div>
        `;
    };

    const renderGroupNavigation = () => {
        if (!data?.groups?.length) return;
        const navBody = document.querySelector('.nav-body');
        if (!navBody) return;
        navBody.innerHTML = `
            <div class="nav-group-wrapper">
                <div class="nav-group ${location.pathname.includes('/blog/') ? 'active' : ''}">
                    <span class="expand-spacer" aria-hidden="true"></span>
                    <a href="${location.pathname.includes('/blog/') ? './' : 'blog/'}">
                        <span>전체 글</span>
                        <small>${data.posts.length}</small>
                    </a>
                </div>
            </div>
            ${childrenOf(0).map((group) => renderNavGroup(group)).join('')}
        `;

        navBody.addEventListener('click', (event) => {
            const toggle = event.target.closest('.expand-navigator');
            if (!toggle) return;
            event.preventDefault();
            event.stopPropagation();
            const group = toggle.closest('.nav-group');
            group?.classList.toggle('expand');
            toggle.setAttribute('aria-expanded', group?.classList.contains('expand') ? 'true' : 'false');
        });
    };

    const syncNavForViewport = () => {
        if (!nav) return;
        if (window.matchMedia('(max-width: 768px)').matches) {
            nav.classList.remove('open');
        } else {
            nav.classList.add('open');
        }
    };

    const setBackdrop = () => {
        if (!navBackdrop || !nav) return;
        navBackdrop.hidden = !(nav.classList.contains('open') && window.matchMedia('(max-width: 768px)').matches);
    };

    const setTheme = (theme) => {
        html.dataset.theme = theme;
        localStorage.setItem('theme', theme);
        if (themeLabel) {
            themeLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    };

    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme === 'light' ? 'light' : 'dark');

    if (year) {
        year.textContent = String(new Date().getFullYear());
    }

    renderGroupNavigation();
    syncNavForViewport();
    setBackdrop();

    navToggle?.addEventListener('click', () => {
        nav?.classList.toggle('open');
        setBackdrop();
    });

    navBackdrop?.addEventListener('click', () => {
        nav?.classList.remove('open');
        setBackdrop();
    });

    themeToggle?.addEventListener('click', () => {
        setTheme(html.dataset.theme === 'dark' ? 'light' : 'dark');
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.matchMedia('(max-width: 768px)').matches) {
                nav?.classList.remove('open');
                setBackdrop();
            }
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    sections.forEach((section) => revealObserver.observe(section));

    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const hashLinks = navLinks.filter((link) => (link.getAttribute('href') || '').startsWith('#'));
            if (!hashLinks.length) return;
            hashLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

    sections.forEach((section) => activeObserver.observe(section));
    window.addEventListener('resize', () => {
        syncNavForViewport();
        setBackdrop();
    });
})();
