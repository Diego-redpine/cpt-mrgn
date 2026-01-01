/* ========================================
   TROPIX BEATS - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initWaveAnimation();
    initPageTransitions();
    initBeatCards();
    initAudioPlayer();
    initWaveformBars();
    initSearch();
    initScrollAnimations();
});

/* ========================================
   HIT MARKER SOUND
   ======================================== */
function playHitMarker() {
    const hitmarker = document.getElementById('hitmarker');
    if (hitmarker) {
        hitmarker.currentTime = 0;
        hitmarker.volume = 0.3;
        hitmarker.play().catch(() => {
            // Audio play failed, likely due to autoplay policy
        });
    }
}

/* ========================================
   WAVE ANIMATION
   ======================================== */
function initWaveAnimation() {
    const waves = document.querySelectorAll('.wave');
    
    // Add subtle parallax effect on scroll
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                waves.forEach((wave, index) => {
                    const speed = (index + 1) * 0.1;
                    wave.style.transform = `translateY(${scrolled * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ========================================
   PAGE TRANSITIONS
   ======================================== */
function initPageTransitions() {
    const transition = document.getElementById('pageTransition');
    const transitionLinks = document.querySelectorAll('a[href$=".html"]:not([target="_blank"])');
    const ctaButtons = document.querySelectorAll('.cta-button, .vault-cta, .latest-cta');
    
    // Handle all internal navigation links
    transitionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's a hash link on the same page
            if (href.startsWith('#')) return;
            
            e.preventDefault();
            playHitMarker();
            triggerPageTransition(href);
        });
    });
    
    // Handle CTA buttons specifically
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.getAttribute('href')) {
                e.preventDefault();
                playHitMarker();
                triggerPageTransition(btn.getAttribute('href'));
            }
        });
    });
    
    // Exit transition on page load
    if (transition) {
        transition.classList.add('exit');
        setTimeout(() => {
            transition.classList.remove('active', 'exit');
        }, 800);
    }
}

function triggerPageTransition(href) {
    const transition = document.getElementById('pageTransition');
    
    if (transition) {
        transition.classList.add('active');
        
        // Wave crash animation - increase amplitude
        const waves = transition.querySelectorAll('.trans-wave');
        waves.forEach(wave => {
            wave.style.animation = 'waveCrash 0.5s ease-out forwards';
        });
        
        setTimeout(() => {
            window.location.href = href;
        }, 600);
    } else {
        window.location.href = href;
    }
}

/* ========================================
   BEAT CARDS
   ======================================== */
function initBeatCards() {
    const beatCards = document.querySelectorAll('.beat-card');
    
    beatCards.forEach(card => {
        const playBtn = card.querySelector('.play-btn');
        const addCartBtn = card.querySelector('.add-cart-btn');
        const beatId = card.dataset.beatId;
        
        // Click on card to go to detail page
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking play or add to cart buttons
            if (e.target.closest('.play-btn') || e.target.closest('.add-cart-btn')) {
                return;
            }
            
            playHitMarker();
            triggerPageTransition(`beat-detail.html?id=${beatId}`);
        });
        
        // Play button
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                playHitMarker();
                togglePreview(card, playBtn);
            });
        }
        
        // Add to cart button
        if (addCartBtn) {
            addCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                playHitMarker();
                addToCart(beatId, addCartBtn);
            });
        }
    });
    
    // License buttons
    const licenseBtns = document.querySelectorAll('.license-btn');
    licenseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playHitMarker();
            // Stripe checkout would go here
            showToast('Redirecting to checkout...');
        });
    });
}

function togglePreview(card, btn) {
    const allCards = document.querySelectorAll('.beat-card');
    
    // Stop other previews
    allCards.forEach(c => {
        if (c !== card) {
            c.classList.remove('playing');
            const otherBtn = c.querySelector('.play-btn');
            if (otherBtn) {
                otherBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
            }
        }
    });
    
    // Toggle current
    card.classList.toggle('playing');
    
    if (card.classList.contains('playing')) {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        showToast('Playing preview...');
    } else {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    }
}

function addToCart(beatId, btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.style.background = '#40E0D0';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
    
    showToast('Beat added to cart!');
}

/* ========================================
   AUDIO PLAYER (Detail Page)
   ======================================== */
function initAudioPlayer() {
    const player = document.getElementById('audioPlayer');
    if (!player) return;
    
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const progressHandle = document.getElementById('progressHandle');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    
    // Simulated audio state (replace with actual audio in production)
    let isPlaying = false;
    let currentTime = 0;
    let duration = 30; // 30 second preview
    let volume = 80;
    let isMuted = false;
    let playInterval = null;
    
    // Format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Update progress display
    function updateProgress() {
        const percent = (currentTime / duration) * 100;
        progressFill.style.width = `${percent}%`;
        progressHandle.style.left = `${percent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
    }
    
    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        playHitMarker();
        isPlaying = !isPlaying;
        playPauseBtn.classList.toggle('playing', isPlaying);
        
        if (isPlaying) {
            playInterval = setInterval(() => {
                currentTime += 0.1;
                if (currentTime >= duration) {
                    currentTime = 0;
                    isPlaying = false;
                    playPauseBtn.classList.remove('playing');
                    clearInterval(playInterval);
                }
                updateProgress();
                updateWaveformBars(currentTime / duration);
            }, 100);
        } else {
            clearInterval(playInterval);
        }
    });
    
    // Progress bar click
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        currentTime = percent * duration;
        updateProgress();
        updateWaveformBars(percent);
    });
    
    // Volume button
    volumeBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        volumeBtn.classList.toggle('muted', isMuted);
        volumeSlider.value = isMuted ? 0 : volume;
    });
    
    // Volume slider
    volumeSlider.addEventListener('input', (e) => {
        volume = e.target.value;
        isMuted = volume === 0;
        volumeBtn.classList.toggle('muted', isMuted);
    });
    
    // Initialize display
    durationEl.textContent = formatTime(duration);
    updateProgress();
}

/* ========================================
   WAVEFORM VISUALIZATION
   ======================================== */
function initWaveformBars() {
    const waveformContainer = document.querySelector('.waveform-bars');
    if (!waveformContainer) return;
    
    // Generate random bars for visualization
    const barCount = 60;
    
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'waveform-bar';
        // Random height between 20% and 100%
        const height = 20 + Math.random() * 80;
        bar.style.height = `${height}%`;
        waveformContainer.appendChild(bar);
    }
}

function updateWaveformBars(progress) {
    const bars = document.querySelectorAll('.waveform-bar');
    const activeIndex = Math.floor(progress * bars.length);
    
    bars.forEach((bar, index) => {
        bar.classList.toggle('active', index <= activeIndex);
    });
}

/* ========================================
   SEARCH FUNCTIONALITY
   ======================================== */
function initSearch() {
    const searchInput = document.getElementById('beatSearch');
    const storeGrid = document.getElementById('storeGrid');
    
    if (!searchInput || !storeGrid) return;
    
    const beatCards = storeGrid.querySelectorAll('.beat-card');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        beatCards.forEach(card => {
            const title = card.querySelector('.beat-title').textContent.toLowerCase();
            const meta = card.querySelector('.beat-meta').textContent.toLowerCase();
            
            if (title.includes(query) || meta.includes(query) || query === '') {
                card.style.display = '';
                card.style.animation = 'fadeInUp 0.3s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
    
    // Filter selects
    const genreFilter = document.getElementById('genreFilter');
    const bpmFilter = document.getElementById('bpmFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    [genreFilter, bpmFilter, sortFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', () => {
                // In production, this would filter/sort the beats
                showToast('Filters applied!');
            });
        }
    });
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.beat-card, .latest-card, .license-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/* ========================================
   TOAST NOTIFICATIONS
   ======================================== */
function showToast(message, duration = 2500) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        padding: 14px 28px;
        background: linear-gradient(135deg, #40E0D0 0%, #008B8B 100%);
        color: #1A1A2E;
        font-weight: 600;
        border-radius: 30px;
        box-shadow: 0 10px 40px rgba(64, 224, 208, 0.4);
        z-index: 10000;
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Animate out
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

/* ========================================
   LOAD MORE FUNCTIONALITY
   ======================================== */
const loadMoreBtn = document.getElementById('loadMore');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        playHitMarker();
        loadMoreBtn.textContent = 'Loading...';
        
        // Simulate loading
        setTimeout(() => {
            loadMoreBtn.innerHTML = `
                Load More Beats
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
            `;
            showToast('No more beats to load!');
        }, 1000);
    });
}

/* ========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ========================================
   NAVBAR SCROLL EFFECT
   ======================================== */
const nav = document.querySelector('.nav:not(.nav-detail)');
if (nav) {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(26, 26, 46, 0.95)';
            nav.style.backdropFilter = 'blur(10px)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            nav.style.background = 'transparent';
            nav.style.backdropFilter = 'none';
            nav.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

/* ========================================
   KEYBOARD ACCESSIBILITY
   ======================================== */
document.addEventListener('keydown', (e) => {
    // Space to play/pause on detail page
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            e.preventDefault();
            playPauseBtn.click();
        }
    }
    
    // Escape to close any modals (future functionality)
    if (e.code === 'Escape') {
        // Close modal logic here
    }
});

/* ========================================
   PRELOADER (Optional)
   ======================================== */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove any loading states
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 500);
    }
});
