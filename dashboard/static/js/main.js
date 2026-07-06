async function toggleLoop() {
    try {
        const res = await fetch('/api/loop', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            const btn = document.getElementById('btn-loop');
            const text = document.getElementById('loop-text');
            if (data.loop) {
                btn.classList.add('active');
                text.innerText = 'Loop On';
            } else {
                btn.classList.remove('active');
                text.innerText = 'Loop Off';
            }
        }
    } catch (e) {
        alert('Failed to toggle loop.');
    }
}

function filterVideos() {
    const query = document.getElementById('video-search').value.toLowerCase();
    const cards = document.querySelectorAll('.video-card');
    cards.forEach(card => {
        const title = card.querySelector('h4').innerText.toLowerCase();
        if (title.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

async function playUrl() {
    const urlInput = document.getElementById('url-input');
    const url = urlInput.value.trim();
    if (!url) return;

    try {
        const res = await fetch('/api/play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });
        const data = await res.json();
        if (data.success) {
            urlInput.value = '';
            setTimeout(() => window.location.reload(), 1000);
        } else {
            alert('Error: ' + (data.error || 'Unknown error'));
        }
    } catch (e) {
        alert('Failed to play URL.');
    }
}

async function playLocal(filename) {
    try {
        const res = await fetch('/api/play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: filename })
        });
        const data = await res.json();
        if (data.success) {
            setTimeout(() => window.location.reload(), 1000);
        } else {
            alert('Error: ' + (data.error || 'Unknown error'));
        }
    } catch (e) {
        alert('Failed to play video.');
    }
}

async function skipVideo() {
    try {
        const res = await fetch('/api/skip', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            setTimeout(() => window.location.reload(), 1000);
        }
    } catch (e) {
        alert('Failed to skip.');
    }
}

async function stopVideo() {
    try {
        const res = await fetch('/api/stop', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            setTimeout(() => window.location.reload(), 1000);
        }
    } catch (e) {
        alert('Failed to stop.');
    }
}

async function deleteVideo(filename) {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;
    
    try {
        const res = await fetch(`/api/delete/${encodeURIComponent(filename)}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            window.location.reload();
        } else {
            alert('Error deleting file: ' + data.error);
        }
    } catch (e) {
        alert('Failed to delete file.');
    }
}

function uploadFile(input) {
    const file = input.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const modal = document.getElementById('upload-modal');
    const progressBar = document.getElementById('upload-progress');
    const statusText = document.getElementById('upload-status');
    
    modal.style.display = 'flex';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload', true);

    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            progressBar.style.width = percentComplete + '%';
            statusText.innerText = percentComplete + '%';
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            statusText.innerText = 'Upload Complete!';
            setTimeout(() => {
                modal.style.display = 'none';
                window.location.reload();
            }, 1000);
        } else {
            statusText.innerText = 'Upload Failed!';
            setTimeout(() => modal.style.display = 'none', 2000);
        }
    };

    xhr.onerror = function() {
        statusText.innerText = 'Upload Error!';
        setTimeout(() => modal.style.display = 'none', 2000);
    };

    xhr.send(formData);
}

async function fetchLogs() {
    try {
        const res = await fetch('/api/logs');
        const data = await res.json();
        if (data.logs) {
            const terminal = document.getElementById('log-content');
            terminal.innerText = data.logs;
            // Scroll to bottom
            const body = document.getElementById('log-terminal');
            body.scrollTop = body.scrollHeight;
        }
    } catch (e) {}
}

async function fetchStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.cpu !== undefined) {
            document.getElementById('cpu-usage').innerText = data.cpu;
            document.getElementById('ram-usage').innerText = data.ram;
        }
    } catch (e) {}
}

// Auto refresh status and stats every 5 seconds
setInterval(async () => {
    fetchStats();
    try {
        const res = await fetch('/api/status', { method: 'GET' });
        if(res.ok) {
            // ...
        }
    } catch (e) {}
}, 5000);

// Auto refresh logs every 3 seconds
setInterval(fetchLogs, 3000);

// Initial fetch
fetchLogs();
fetchStats();
