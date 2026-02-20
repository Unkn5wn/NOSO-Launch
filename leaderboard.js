// Leaderboard and Score Management (Using localStorage)

// Track context for save modal
let saveScoreContext = 'mainmenu';

// Calculate player's total score
function calculateScore() {
    const moneyScore = game.money;
    const levelScore = game.level * 1000;
    const customerScore = game.satisfiedCustomers * 100;
    
    return moneyScore + levelScore + customerScore;
}

// Add test data
function addTestData() {
    const testScores = [
        { playerName: 'Alice', score: 15000, money: 5000, level: 10, satisfiedCustomers: 50, timestamp: new Date().toISOString() },
        { playerName: 'Bob', score: 12000, money: 4000, level: 8, satisfiedCustomers: 40, timestamp: new Date().toISOString() },
        { playerName: 'Charlie', score: 9000, money: 3000, level: 6, satisfiedCustomers: 30, timestamp: new Date().toISOString() },
        { playerName: 'DUMBINA', score: 7000, money: 2000, level: 5, satisfiedCustomers: 25, timestamp: new Date().toISOString() },
        { playerName: 'Eve', score: 5000, money: 1500, level: 4, satisfiedCustomers: 20, timestamp: new Date().toISOString() }
    ];
    
    localStorage.setItem('leaderboard', JSON.stringify(testScores));
    localStorage.setItem('playerName', 'Alice');
    console.log('✅ Test data added to localStorage');
}

// Show leaderboard
function showLeaderboard() {
    console.log('🎯 showLeaderboard() called');
    
    const modal = document.getElementById('leaderboard-modal');
    if (!modal) {
        console.error('❌ Modal not found!');
        return;
    }
    
    console.log('✅ Modal found, showing it...');
    modal.classList.add('show');
    
    // Load data
    loadLeaderboardData();
}

// Hide leaderboard
function hideLeaderboard() {
    console.log('Hiding leaderboard');
    const modal = document.getElementById('leaderboard-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Load leaderboard data
function loadLeaderboardData(filter = 'all-time', containerId = 'leaderboard-list') {
    console.log('📊 Loading leaderboard data...');
    
    const listContainer = document.getElementById(containerId);
    if (!listContainer) {
        console.error('❌ List container not found!');
        return;
    }
    
    // Get data from localStorage
    let leaderboard = [];
    try {
        const data = localStorage.getItem('leaderboard');
        if (data) {
            leaderboard = JSON.parse(data);
        }
    } catch (e) {
        console.error('Error parsing leaderboard data:', e);
    }
    
    // Apply time filter
    if (filter === 'today') {
        const today = new Date().toDateString();
        leaderboard = leaderboard.filter(entry => {
            return new Date(entry.timestamp).toDateString() === today;
        });
    } else if (filter === 'this-week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        leaderboard = leaderboard.filter(entry => {
            return new Date(entry.timestamp) >= weekAgo;
        });
    }
    
    console.log('Leaderboard data:', leaderboard);
    
    // If no data, show empty state
    if (leaderboard.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999;">
                <div style="font-size: 5em; margin-bottom: 15px;">🏆</div>
                <p style="font-size: 1.2em;">No scores yet. Be the first!</p>
                <button onclick="addTestData(); loadLeaderboardData();" style="margin-top: 20px; padding: 10px 20px; background: #ff6ec7; color: white; border: none; border-radius: 10px; cursor: pointer;">
                    Add Test Data
                </button>
            </div>
        `;
        return;
    }
    
    // Sort by score
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Build HTML
    let html = '';
    const savedName = localStorage.getItem('playerName') || '';
    
    leaderboard.forEach((entry, index) => {
        const rank = index + 1;
        const isCurrentUser = entry.playerName === savedName;
        
        let trophy = '';
        let rankColor = '#ff6ec7';
        if (rank === 1) {
            trophy = '🥇';
            rankColor = '#ffd700';
        } else if (rank === 2) {
            trophy = '🥈';
            rankColor = '#c0c0c0';
        } else if (rank === 3) {
            trophy = '🥉';
            rankColor = '#cd7f32';
        }
        
        const bgColor = isCurrentUser ? 'linear-gradient(135deg, #d4ffef 0%, #e8fff8 100%)' : 'white';
        const borderColor = isCurrentUser ? '#4eff9f' : '#ff6ec7';
        
        html += `
            <div style="background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 15px; padding: 15px; margin-bottom: 10px; display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 2em; font-weight: bold; color: ${rankColor}; min-width: 50px; text-align: center;">
                    ${trophy || '#' + rank}
                </div>
                <div style="flex: 1;">
                    <div style="font-size: 1.2em; font-weight: bold; color: #333; margin-bottom: 5px;">
                        ${entry.playerName}${isCurrentUser ? ' (You)' : ''}
                    </div>
                    <div style="display: flex; gap: 15px; font-size: 0.9em; color: #666;">
                        <span>💰 $${entry.money}</span>
                        <span>⭐ Level ${entry.level}</span>
                        <span>😊 ${entry.satisfiedCustomers} customers</span>
                    </div>
                </div>
                <div style="font-size: 1.5em; font-weight: bold; color: #4eff9f;">
                    ${entry.score.toLocaleString()}
                </div>
            </div>
        `;
    });
    
    listContainer.innerHTML = html;
    
    // Update user rank
    const userEntry = leaderboard.find(entry => entry.playerName === savedName);
    if (userEntry) {
        const rank = leaderboard.indexOf(userEntry) + 1;
        const rankEl = document.getElementById('your-rank');
        const scoreEl = document.getElementById('your-score');
        if (rankEl) rankEl.textContent = '#' + rank;
        if (scoreEl) scoreEl.textContent = userEntry.score.toLocaleString();
    }
    
    console.log('✅ Leaderboard loaded successfully!');
}

// Show save score modal
function showSaveScoreModal(context = 'mainmenu') {
    saveScoreContext = context;
    
    const modal = document.getElementById('save-score-modal');
    if (!modal) {
        console.error('Save score modal not found!');
        return;
    }
    
    const titleEl = document.getElementById('save-score-title');
    if (titleEl) {
        if (context === 'pause') {
            titleEl.textContent = '⏸️ Save Your Progress! ⏸️';
        } else {
            titleEl.textContent = '🎉 Save Your Score! 🎉';
        }
    }
    
    const finalScore = calculateScore();
    
    const finalScoreEl = document.getElementById('final-score-value');
    const moneyEl = document.getElementById('breakdown-money');
    const levelEl = document.getElementById('breakdown-level');
    const customersEl = document.getElementById('breakdown-customers');
    
    if (finalScoreEl) finalScoreEl.textContent = finalScore.toLocaleString();
    if (moneyEl) moneyEl.textContent = '$' + game.money;
    if (levelEl) levelEl.textContent = game.level;
    if (customersEl) customersEl.textContent = game.satisfiedCustomers;
    
    const savedName = localStorage.getItem('playerName') || '';
    const nameInput = document.getElementById('save-score-name');
    if (nameInput) nameInput.value = savedName;
    
    const skipBtn = document.getElementById('skip-save-btn');
    if (skipBtn) {
        if (context === 'pause') {
            skipBtn.textContent = '⏸️ Continue Without Saving';
        } else {
            skipBtn.textContent = 'Skip';
        }
    }
    
    modal.classList.add('show');
}

// Submit score
function submitScore() {
    const nameInput = document.getElementById('save-score-name');
    const playerName = nameInput ? nameInput.value.trim() : '';
    
    if (!playerName) {
        if (typeof showNotification === 'function') {
            showNotification('Please enter your name! 📝', 'warning');
        } else {
            alert('Please enter your name!');
        }
        return;
    }
    
    const submitBtn = document.getElementById('submit-score-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '💾 Saving...';
    }
    
    try {
        const score = calculateScore();
        
        localStorage.setItem('playerName', playerName);
        
        let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        
        leaderboard.push({
            playerName: playerName,
            score: score,
            money: game.money,
            level: game.level,
            satisfiedCustomers: game.satisfiedCustomers,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        });
        
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 100);
        
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        
        const saveForm = document.querySelector('.save-score-form');
        const saveSuccess = document.getElementById('save-success');
        
        if (saveForm) saveForm.style.display = 'none';
        if (saveSuccess) saveSuccess.style.display = 'block';
        
        if (typeof showNotification === 'function') {
            showNotification('Score saved successfully! 🎉', 'success');
        }
        
        setTimeout(() => {
            closeSaveScoreModal();
            
            if (saveScoreContext === 'pause') {
                game.isPaused = false;
                const pauseBtn = document.getElementById('pause-btn');
                if (pauseBtn) pauseBtn.textContent = '⏸️ Pause';
                
                if (typeof showNotification === 'function') {
                    showNotification('Progress saved! Game resumed 🎮', 'success');
                }
            }
        }, 2000);
        
    } catch (error) {
        console.error('Error saving score:', error);
        if (typeof showNotification === 'function') {
            showNotification('Failed to save score. Please try again! ❌', 'error');
        } else {
            alert('Failed to save score. Please try again!');
        }
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '💾 Save Score';
        }
    }
}

// Close save score modal
function closeSaveScoreModal() {
    const modal = document.getElementById('save-score-modal');
    if (modal) modal.classList.remove('show');
    
    const saveForm = document.querySelector('.save-score-form');
    const saveSuccess = document.getElementById('save-success');
    const submitBtn = document.getElementById('submit-score-btn');
    const skipBtn = document.getElementById('skip-save-btn');
    
    if (saveForm) saveForm.style.display = 'block';
    if (saveSuccess) saveSuccess.style.display = 'none';
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '💾 Save Score';
    }
    if (skipBtn) {
        skipBtn.textContent = 'Skip';
    }
}

// Initialize leaderboard
function initLeaderboard() {
    console.log('🚀 Initializing leaderboard...');
    
    // Setup close button
    const closeBtn = document.getElementById('close-leaderboard');
    if (closeBtn) {
        closeBtn.onclick = hideLeaderboard;
        console.log('✅ Close button connected');
    }
    
    // Close when clicking outside
    const modal = document.getElementById('leaderboard-modal');
    if (modal) {
        modal.onclick = function(e) {
            if (e.target === modal) {
                hideLeaderboard();
            }
        };
    }
    
    // Setup save score buttons
    const submitBtn = document.getElementById('submit-score-btn');
    if (submitBtn) {
        submitBtn.onclick = submitScore;
    }
    
    const skipBtn = document.getElementById('skip-save-btn');
    if (skipBtn) {
        skipBtn.onclick = function() {
            closeSaveScoreModal();
            if (saveScoreContext === 'pause') {
                if (typeof showNotification === 'function') {
                    showNotification('Game still paused - Click Resume to continue', 'warning');
                }
            }
        };
    }
    
    // In-game leaderboard button
    const gameLeaderboardBtn = document.getElementById('game-leaderboard-btn');
    if (gameLeaderboardBtn) {
        gameLeaderboardBtn.onclick = function() {
            const modal = document.getElementById('game-leaderboard-modal');
            if (modal) {
                modal.classList.add('show');
                loadLeaderboardData('all-time', 'game-leaderboard-list');
            }
        };
    }
    
    // Close in-game leaderboard
    const closeGameLeaderboard = document.getElementById('close-game-leaderboard');
    if (closeGameLeaderboard) {
        closeGameLeaderboard.onclick = function() {
            const modal = document.getElementById('game-leaderboard-modal');
            if (modal) modal.classList.remove('show');
        };
    }
    
    // Refresh leaderboard button
    const refreshBtn = document.getElementById('refresh-leaderboard-btn');
    if (refreshBtn) {
        refreshBtn.onclick = function() {
            const activeTab = document.querySelector('.leaderboard-tab.active');
            const filter = activeTab ? activeTab.dataset.tab : 'all-time';
            loadLeaderboardData(filter, 'game-leaderboard-list');
        };
    }
    
    // Leaderboard tabs
    document.querySelectorAll('.leaderboard-tab').forEach(tab => {
        tab.onclick = function() {
            document.querySelectorAll('.leaderboard-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            loadLeaderboardData(this.dataset.tab, 'game-leaderboard-list');
        };
    });
    
    // Close modals when clicking outside
    const gameLeaderboardModal = document.getElementById('game-leaderboard-modal');
    if (gameLeaderboardModal) {
        gameLeaderboardModal.onclick = function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        };
    }
    
    console.log('✅ Leaderboard initialized!');
}

// Make functions globally available
window.showLeaderboard = showLeaderboard;
window.hideLeaderboard = hideLeaderboard;
window.addTestData = addTestData;
window.loadLeaderboardData = loadLeaderboardData;

console.log('✅ Leaderboard script fully loaded!');
