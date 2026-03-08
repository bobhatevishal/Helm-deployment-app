/* ═══════════════════════════════════════════════
   SnapLink — Frontend Logic
   ═══════════════════════════════════════════════ */

// ─── Particle Background ────────────────────
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 50;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() > 0.5 ? 260 : 175; // violet or cyan
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 92, 231, ${0.08 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(animate);
    }
    animate();
})();


// ─── Tab Navigation ─────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Deactivate all tabs
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        // Activate clicked tab
        btn.classList.add('active');
        const tabId = 'tab-' + btn.dataset.tab;
        document.getElementById(tabId).classList.add('active');

        // Load data for the tab
        if (btn.dataset.tab === 'dashboard') loadStats();
        if (btn.dataset.tab === 'analytics') loadAnalytics();
    });
});


// ─── Toast Notifications ────────────────────
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
}


// ─── Shorten a URL ──────────────────────────
async function shortenUrl() {
    const input = document.getElementById('url-input');
    const resultDiv = document.getElementById('result');
    const btn = document.getElementById('shorten-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');

    const url = input.value.trim();
    if (!url) {
        showToast('Please enter a URL', 'error');
        input.focus();
        return;
    }

    // Loading state
    btnText.hidden = true;
    btnLoader.hidden = false;
    btn.disabled = true;
    resultDiv.hidden = true;

    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.error || 'Something went wrong', 'error');
            return;
        }

        // Show result
        // Show result
        const shortUrl = window.location.origin + '/api/' + data.short_code;
        const link = document.getElementById('result-link');
        link.href = shortUrl;
        link.textContent = shortUrl;
        resultDiv.hidden = false;

        // Clear input
        input.value = '';

        showToast('Short URL created successfully! ⚡');

        // Refresh the table
        loadUrls();

    } catch (err) {
        showToast('Could not connect to the API. Is the server running?', 'error');
    } finally {
        btnText.hidden = false;
        btnLoader.hidden = true;
        btn.disabled = false;
    }
}


// ─── Copy short URL to clipboard ────────────
async function copyUrl() {
    const link = document.getElementById('result-link');
    const copyBtn = document.getElementById('copy-btn');

    try {
        await navigator.clipboard.writeText(link.href);
        copyBtn.innerHTML = '<span>✅ Copied!</span>';
        showToast('Copied to clipboard!');
        setTimeout(() => { copyBtn.innerHTML = '<span>📋 Copy</span>'; }, 2000);
    } catch {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = link.href;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyBtn.innerHTML = '<span>✅ Copied!</span>';
        setTimeout(() => { copyBtn.innerHTML = '<span>📋 Copy</span>'; }, 2000);
    }
}


// ─── Load all URLs into the table ───────────
let allUrls = [];

async function loadUrls() {
    const tbody = document.getElementById('urls-body');
    const refreshBtn = document.getElementById('refresh-btn');
    refreshBtn?.classList.add('spinning');

    try {
        const response = await fetch('/api/urls');
        const urls = await response.json();
        allUrls = urls;
        renderUrls(urls);
    } catch {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">⚠️ Could not load URLs</td></tr>';
    } finally {
        setTimeout(() => refreshBtn?.classList.remove('spinning'), 600);
    }
}

function renderUrls(urls) {
    const tbody = document.getElementById('urls-body');

    if (urls.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No URLs yet. Create one above! ☝️</td></tr>';
        return;
    }

    tbody.innerHTML = urls.map(u => {
        const date = new Date(u.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        const truncatedUrl = u.original_url.length > 45
            ? u.original_url.substring(0, 45) + '...'
            : u.original_url;

        return `
            <tr>
                <td class="code-cell">${escapeHtml(u.short_code)}</td>
                <td class="url-cell" title="${escapeHtml(u.original_url)}">${escapeHtml(truncatedUrl)}</td>
                <td class="clicks-cell"><span class="click-badge">${u.clicks}</span></td>
                <td>${date}</td>
                <td>
                    <button class="delete-btn" onclick="deleteUrl(${u.id}, '${escapeHtml(u.short_code)}')" title="Delete">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}


// ─── Search URLs ────────────────────────────
let searchTimeout;
function searchUrls() {
    clearTimeout(searchTimeout);
    const query = document.getElementById('search-input').value.trim();

    if (!query) {
        renderUrls(allUrls);
        return;
    }

    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`/api/urls/search?q=${encodeURIComponent(query)}`);
            const urls = await response.json();
            renderUrls(urls);
        } catch {
            renderUrls([]);
        }
    }, 300);
}


// ─── Delete URL ─────────────────────────────
async function deleteUrl(id, code) {
    if (!confirm(`Delete short URL "${code}"? This action cannot be undone.`)) return;

    try {
        const response = await fetch(`/api/urls/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showToast(`URL "${code}" deleted`);
            loadUrls();
        } else {
            showToast('Failed to delete URL', 'error');
        }
    } catch {
        showToast('Could not connect to API', 'error');
    }
}


// ─── Load Dashboard Stats ───────────────────
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        document.getElementById('stat-urls-value').textContent = data.total_urls;
        document.getElementById('stat-clicks-value').textContent = data.total_clicks.toLocaleString();
        document.getElementById('stat-cache-value').textContent = data.cache_hit_rate + '%';
        document.getElementById('stat-uptime-value').textContent = data.uptime;

        // Top URLs
        const container = document.getElementById('top-urls-container');
        if (data.top_urls.length === 0) {
            container.innerHTML = '<div class="empty-state">No URLs yet. Create one to see stats!</div>';
            return;
        }

        container.innerHTML = data.top_urls.map((u, i) => {
            const truncatedUrl = u.original_url.length > 50
                ? u.original_url.substring(0, 50) + '...'
                : u.original_url;
            return `
                <div class="top-url-item">
                    <div class="top-url-rank">${i + 1}</div>
                    <div class="top-url-info">
                        <div class="top-url-code">${escapeHtml(u.short_code)}</div>
                        <div class="top-url-original" title="${escapeHtml(u.original_url)}">${escapeHtml(truncatedUrl)}</div>
                    </div>
                    <div class="top-url-clicks">${u.clicks} clicks</div>
                </div>
            `;
        }).join('');

    } catch {
        document.getElementById('stat-urls-value').textContent = '—';
        document.getElementById('stat-clicks-value').textContent = '—';
        document.getElementById('stat-cache-value').textContent = '—';
        document.getElementById('stat-uptime-value').textContent = '—';
    }
}


// ─── Load Analytics ─────────────────────────
async function loadAnalytics() {
    const container = document.getElementById('analytics-container');
    const refreshBtn = document.getElementById('refresh-analytics-btn');
    refreshBtn?.classList.add('spinning');

    try {
        const response = await fetch('/api/analytics');
        const data = await response.json();

        if (data.length === 0) {
            container.innerHTML = '<div class="empty-state">No click activity yet. Share some short URLs!</div>';
            return;
        }

        container.innerHTML = data.map(a => {
            const time = new Date(a.clicked_at).toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            const truncatedUrl = a.original_url.length > 50
                ? a.original_url.substring(0, 50) + '...'
                : a.original_url;
            const truncatedAgent = a.user_agent.length > 80
                ? a.user_agent.substring(0, 80) + '...'
                : a.user_agent;

            return `
                <div class="activity-item">
                    <div class="activity-dot"></div>
                    <div class="activity-info">
                        <div class="activity-code">${escapeHtml(a.short_code)}</div>
                        <div class="activity-url" title="${escapeHtml(a.original_url)}">${escapeHtml(truncatedUrl)}</div>
                        <div class="activity-meta">IP: ${escapeHtml(a.ip_address)} · ${escapeHtml(truncatedAgent)}</div>
                    </div>
                    <div class="activity-time">${time}</div>
                </div>
            `;
        }).join('');

    } catch {
        container.innerHTML = '<div class="empty-state">⚠️ Could not load analytics</div>';
    } finally {
        setTimeout(() => refreshBtn?.classList.remove('spinning'), 600);
    }
}


// ─── Health Check ───────────────────────────
async function checkHealth() {
    const dot = document.querySelector('.health-dot');
    const text = document.querySelector('.health-text');

    try {
        const response = await fetch('/api/health');

        if (response.ok) {
            const data = await response.json();
            dot.className = 'health-dot ok';
            text.textContent = 'All services healthy';
        } else {
            dot.className = 'health-dot error';
            let data;
            try {
                data = await response.json();
            } catch (e) {
                data = { api: "error (bad response)" };
            }

            const issues = Object.entries(data)
                .filter(([, v]) => v !== 'ok')
                .map(([k]) => k);
            text.textContent = 'Issues: ' + (issues.join(', ') || 'server error');
        }
    } catch {
        dot.className = 'health-dot error';
        text.textContent = 'API unreachable';
    }
}


// ─── Enter key submits ──────────────────────
document.getElementById('url-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') shortenUrl();
});


// ─── Init ───────────────────────────────────
loadUrls();
checkHealth();

// Auto-refresh health every 30 seconds
setInterval(checkHealth, 30000);

// Auto-refresh stats every 15 seconds (if on that tab)
setInterval(() => {
    if (document.querySelector('[data-tab="dashboard"]').classList.contains('active')) {
        loadStats();
    }
}, 15000);
