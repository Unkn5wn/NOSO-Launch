// Game State
const game = {
    money: 500,
    level: 1,
    satisfiedCustomers: 0,
    isRunning: false,
    isPaused: false,
    customers: [],
    stations: [
        { id: 1, name: '35 Minutes', icon: '⏲️', slots: [null], maxSlots: 1 },
        { id: 2, name: 'AI Poll', icon: '🗳️', slots: [null], maxSlots: 1 },
        { id: 3, name: 'NOSO Sequencer', icon: '📅', slots: [null], maxSlots: 1 },
        { id: 4, name: 'Automatic', icon: '💸', slots: [null], maxSlots: 1 }
    ],
    customerIdCounter: 0,
    upgrades: {
        refuel: { level: 0, maxLevel: 3 },
        connection: { level: 0, maxLevel: 3 },
        launch: { level: 0, maxLevel: 3 },
        result: { level: 0, maxLevel: 3 }
    },
    passiveIncome: 0,
    lastPassiveIncomeTime: Date.now(),
    currentCustomerForAssignment: null,
    dragData: {
        isDragging: false,
        element: null,
        offsetX: 0,
        offsetY: 0
    },
    environmentUpdateInterval: null,
    comingFromStartGame: false
};

// Service definitions
const services = [
    { name: '35 minutes', icon: '⏲️', duration: 5000, price: 50, station: 1 },
    { name: 'AI Poll', icon: '🗳️', duration: 6000, price: 60, station: 2 },
    { name: 'NOSO Sequencer', icon: '📅', duration: 7000, price: 80, station: 3 },
    { name: 'Automatic', icon: '💸', duration: 8000, price: 100, station: 4 }
];

// Upgrade definitions
const upgradeDefinitions = {
    refuel: {
        name: 'Limited Refuel',
        icon: '🛢️',
        description: 'Refuel testing customers',
        baseCost: 200,
        costMultiplier: 1.5,
        incomePerLevel: 5,
        patienceBonus: 10,
        maxLevel: 3
    },
    connection: {
        name: 'International Connection',
        icon: '🛜',
        description: 'Reliable connection from overseas keep customers happy and generate income on test results',
        baseCost: 300,
        costMultiplier: 1.6,
        incomePerLevel: 8,
        patienceBonus: 15,
        maxLevel: 3
    },
    launch: {
        name: 'Launch Opportunity',
        icon: '🚀',
        description: 'Customer picks launch site',
        baseCost: 250,
        costMultiplier: 1.5,
        incomePerLevel: 6,
        patienceBonus: 12,
        maxLevel: 3
    },
    result: {
        name: 'Test results',
        icon: '👨‍🔬',
        description: 'Customers can enjoy benefits of reviewing test results, increasing rocket capability!',
        baseCost: 500,
        costMultiplier: 2,
        incomePerLevel: 15,
        tipBonus: 25,
        maxLevel: 3
    }
};

// Customer names
const customerNames = [
    'Noah', 'Liam', 'Oliver', 'Elijah', 'Asmaldeo'

];

const customerIcons = ['🧔🏽‍♂️', '👨🏼‍🦰', '🧑🏼‍🦲', '🧓🏾', '👴'];

// Initialize game
function init() {
    console.log('🎮 Initializing game...');
    
    // Check if leaderboard functions exist before calling
    if (typeof initLeaderboard === 'function') {
        console.log('Initializing leaderboard...');
        initLeaderboard();
    } else {
        console.warn('⚠️ initLeaderboard function not found');
    }
    
    setupMainMenu();
    setupGameControls();
    
    updateUI();
    updateStations();
    console.log('✅ Game initialized!');
}

function setupGameControls() {
    // Start button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
    
    // Pause button
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', togglePause);
    }
    
    // Shop button
    const shopBtn = document.getElementById('shop-btn');
    if (shopBtn) {
        shopBtn.addEventListener('click', openShop);
    }
    
    // Close shop
    const closeShopBtn = document.getElementById('close-shop');
    if (closeShopBtn) {
        closeShopBtn.addEventListener('click', closeShop);
    }
    
    // Close shop modal when clicking outside
    const shopModal = document.getElementById('shop-modal');
    if (shopModal) {
        shopModal.addEventListener('click', (e) => {
            if (e.target === shopModal) {
                closeShop();
            }
        });
    }
}

function setupMainMenu() {
    console.log('Setting up main menu...');
    
    const mainMenu = document.getElementById('main-menu');
    const gameContainer = document.getElementById('game-container');
    const menuStartBtn = document.getElementById('menu-start-btn');
    const instructionsBtn = document.getElementById('menu-instructions-btn');
    const menuLeaderboardBtn = document.getElementById('menu-leaderboard-btn');
    const instructionsModal = document.getElementById('instructions-modal');
    const closeInstructions = document.getElementById('close-instructions');
    const mainMenuBtn = document.getElementById('main-menu-btn');
    
    // Start game from menu
    if (menuStartBtn) {
        menuStartBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Start Game button clicked!');
            startGameFromMenu();
        };
    }
    
    // Show instructions from button
    if (instructionsBtn) {
        instructionsBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('How to Play button clicked!');
            if (instructionsModal) {
                instructionsModal.classList.add('show');
            }
        };
    }
    
    // Show leaderboard from button
    if (menuLeaderboardBtn) {
        menuLeaderboardBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🏆 Leaderboard button clicked!');
            if (typeof showLeaderboard === 'function') {
                showLeaderboard();
            } else {
                console.error('showLeaderboard function not found!');
            }
        };
        console.log('✅ Menu leaderboard button connected');
    }
    
    // Close instructions with X button
    if (closeInstructions) {
        closeInstructions.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close instructions clicked');
            if (instructionsModal) {
                instructionsModal.classList.remove('show');
            }
        };
    }
    
    // Close instructions when clicking outside
    if (instructionsModal) {
        instructionsModal.onclick = function(e) {
            if (e.target === instructionsModal) {
                console.log('Clicked outside instructions modal');
                instructionsModal.classList.remove('show');
            }
        };
        
        // Prevent clicks inside modal content from closing it
        const modalContent = instructionsModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.onclick = function(e) {
                e.stopPropagation();
            };
        }
    }
    
    // Return to main menu from game
    if (mainMenuBtn) {
        mainMenuBtn.onclick = function() {
            console.log('Main Menu button clicked');
            
            if (game.isRunning) {
                // Game is running - show save score modal
                game.isPaused = true;
                
                // Check if showSaveScoreModal function exists
                if (typeof showSaveScoreModal === 'function') {
                    showSaveScoreModal('mainmenu');
                    
                    // Setup handlers for save score modal in main menu context
                    setupMainMenuSaveHandlers();
                    
                } else {
                    // Fallback if leaderboard not loaded
                    const userConfirmed = confirm('Are you sure you want to return to the main menu? Your current progress will be lost.');
                    if (!userConfirmed) return;
                    
                    returnToMainMenu();
                }
            } else {
                // Game not running - just return to menu
                if (gameContainer) gameContainer.style.display = 'none';
                if (mainMenu) {
                    mainMenu.style.display = 'flex';
                    mainMenu.classList.remove('hide');
                }
            }
        };
    }
    
    function setupMainMenuSaveHandlers() {
        setTimeout(() => {
            const skipBtn = document.getElementById('skip-save-btn');
            const submitBtn = document.getElementById('submit-score-btn');
            const saveScoreModal = document.getElementById('save-score-modal');
            
            if (skipBtn) {
                // Clone to remove all previous event listeners
                const newSkipBtn = skipBtn.cloneNode(true);
                skipBtn.parentNode.replaceChild(newSkipBtn, skipBtn);
                
                newSkipBtn.onclick = function() {
                    if (saveScoreModal) saveScoreModal.classList.remove('show');
                    returnToMainMenu();
                };
            }
            
            if (submitBtn) {
                // Clone to remove previous listeners
                const newSubmitBtn = submitBtn.cloneNode(true);
                submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
                
                newSubmitBtn.onclick = function() {
                    // Call the original submit score function
                    if (typeof submitScore === 'function') {
                        submitScore();
                    }
                    
                    // After score is saved, return to main menu
                    setTimeout(() => {
                        if (saveScoreModal && !saveScoreModal.classList.contains('show')) {
                            returnToMainMenu();
                        }
                    }, 2500);
                };
            }
        }, 100);
    }
    
    function returnToMainMenu() {
        console.log('Returning to main menu...');
        resetGame();
        if (gameContainer) gameContainer.style.display = 'none';
        if (mainMenu) {
            mainMenu.style.display = 'flex';
            mainMenu.classList.remove('hide');
        }
    }
    
    // Function to start game from main menu
    function startGameFromMenu() {
        console.log('Starting game from menu...');
        
        if (!mainMenu || !gameContainer) {
            console.error('Menu or game container not found!');
            return;
        }
        
        // Hide menu, show game
        mainMenu.classList.add('hide');
        setTimeout(() => {
            mainMenu.style.display = 'none';
            gameContainer.style.display = 'block';
            console.log('Game screen visible!');
            
            // Start the game directly
            startGame();
            console.log('Game started!');
        }, 500);
    }
    
    console.log('Main menu setup complete!');
}

function resetGame() {
    game.isRunning = false;
    game.isPaused = false;
    
    if (game.environmentUpdateInterval) {
        clearInterval(game.environmentUpdateInterval);
        game.environmentUpdateInterval = null;
    }
    
    game.money = 500;
    game.level = 1;
    game.satisfiedCustomers = 0;
    game.customers = [];
    game.customerIdCounter = 0;
    game.currentCustomerForAssignment = null;
    
    game.stations = [
        { id: 1, name: '35 Minutes', icon: '⏲️', slots: [null], maxSlots: 1 },
        { id: 2, name: 'AI Poll', icon: '🗳️', slots: [null], maxSlots: 1 },
        { id: 3, name: 'NOSO Sequencer', icon: '📅', slots: [null], maxSlots: 1 },
        { id: 4, name: 'Automatic', icon: '💸', slots: [null], maxSlots: 1 }
    ];
    
    game.upgrades = {
        refuel: { level: 0, maxLevel: 3 },
        connection: { level: 0, maxLevel: 3 },
        launch: { level: 0, maxLevel: 3 },
        result: { level: 0, maxLevel: 3 }
    };
    
    game.passiveIncome = 0;
    game.lastPassiveIncomeTime = Date.now();
    
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) {
        pauseBtn.disabled = true;
        pauseBtn.textContent = '⏸️ Pause';
    }
    
    const customerQueue = document.getElementById('customer-queue');
    if (customerQueue) customerQueue.innerHTML = '';
    
    const spaEnvironment = document.getElementById('spa-environment');
    const spa2dView = document.getElementById('spa-2d-view');
    const shopModal = document.getElementById('shop-modal');
    
    if (spaEnvironment) spaEnvironment.classList.remove('show');
    if (spa2dView) spa2dView.classList.remove('show');
    if (shopModal) shopModal.classList.remove('show');
    
    updateUI();
    updateStations();
}

function openEnvironment(customer) {
    game.currentCustomerForAssignment = customer;
    const envModal = document.getElementById('spa-environment');
    const envCustomer = document.getElementById('env-customer');
    
    if (!envModal || !envCustomer) return;
    
    envCustomer.innerHTML = `
        <div class="env-customer-icon">${customer.icon}</div>
        <div class="env-customer-name">${customer.name}</div>
        <div class="env-customer-service">${customer.service.icon} ${customer.service.name}</div>
    `;
    
    updateEnvironmentStations();
    envModal.classList.add('show');
    
    if (game.environmentUpdateInterval) {
        clearInterval(game.environmentUpdateInterval);
    }
    
    game.environmentUpdateInterval = setInterval(() => {
        if (envModal.classList.contains('show')) {
            updateEnvironmentStations();
        } else {
            clearInterval(game.environmentUpdateInterval);
            game.environmentUpdateInterval = null;
        }
    }, 500);
}

function updateEnvironmentStations() {
    const envStations = document.querySelectorAll('.env-station');
    
    envStations.forEach(stationEl => {
        const stationId = parseInt(stationEl.dataset.stationId);
        const station = game.stations.find(s => s.id === stationId);
        const slotsEl = stationEl.querySelector('.env-station-slots');
        
        if (!station || !slotsEl) return;
        
        const emptySlots = station.slots.filter(s => s === null).length;
        const occupiedSlots = station.maxSlots - emptySlots;
        
        const wasFull = stationEl.classList.contains('full');
        const isNowFull = emptySlots === 0;
        
        slotsEl.textContent = `Slots: ${occupiedSlots}/${station.maxSlots}`;
        
        const newStationEl = stationEl.cloneNode(true);
        stationEl.parentNode.replaceChild(newStationEl, stationEl);
        
        if (isNowFull) {
            newStationEl.classList.add('full');
            newStationEl.style.pointerEvents = 'none';
            newStationEl.style.cursor = 'not-allowed';
            
            const newSlotsEl = newStationEl.querySelector('.env-station-slots');
            if (newSlotsEl) {
                newSlotsEl.innerHTML = `<span style="color: #ff4e4e; font-weight: bold;">FULL - Waiting...</span>`;
            }
        } else {
            newStationEl.classList.remove('full');
            newStationEl.style.pointerEvents = 'auto';
            newStationEl.style.cursor = 'pointer';
            
            newStationEl.addEventListener('click', () => handleStationSelection(stationId));
            
            const newSlotsEl = newStationEl.querySelector('.env-station-slots');
            if (newSlotsEl) {
                newSlotsEl.innerHTML = `<span style="color: #4eff9f; font-weight: bold;">Available: ${emptySlots}/${station.maxSlots}</span>`;
            }
            
            if (wasFull && !isNowFull && game.currentCustomerForAssignment && 
                game.currentCustomerForAssignment.service.station === stationId) {
                newStationEl.classList.add('highlight');
                showNotification(`${station.name} Station is now available! ✨`, 'success');
            }
        }
    });
}

function handleStationSelection(selectedStationId) {
    const customer = game.currentCustomerForAssignment;
    if (!customer) return;
    
    const station = game.stations.find(s => s.id === selectedStationId);
    const emptySlots = station.slots.filter(s => s === null).length;
    
    if (emptySlots === 0) {
        showNotification('This station is full! Please wait... ⏳', 'warning');
        return;
    }
    
    const correctStationId = customer.service.station;
    const selectedStationEl = document.querySelector(`.env-station[data-station-id="${selectedStationId}"]`);
    
    if (selectedStationId === correctStationId) {
        selectedStationEl.classList.add('correct');
        showNotification(`Perfect! Now take ${customer.name} to the station! 😊`, 'success');
        
        setTimeout(() => {
            closeEnvironment();
            open2DSpaView(customer);
        }, 800);
    } else {
        selectedStationEl.classList.add('wrong');
        showNotification(`Wrong station! ${customer.name} needs ${customer.service.name}! ❌`, 'error');
        
        setTimeout(() => {
            selectedStationEl.classList.remove('wrong');
        }, 500);
    }
}

function closeEnvironment() {
    const envModal = document.getElementById('spa-environment');
    if (envModal) envModal.classList.remove('show');
    
    if (game.environmentUpdateInterval) {
        clearInterval(game.environmentUpdateInterval);
        game.environmentUpdateInterval = null;
    }
    
    document.querySelectorAll('.env-station').forEach(el => {
        el.classList.remove('correct', 'wrong', 'highlight');
    });
}

function open2DSpaView(customer) {
    const spaView = document.getElementById('spa-2d-view');
    if (!spaView) return;
    
    const dragCustomerName = document.getElementById('drag-customer-name');
    const dragCustomerService = document.getElementById('drag-customer-service');
    
    if (dragCustomerName) dragCustomerName.textContent = customer.name;
    if (dragCustomerService) dragCustomerService.textContent = customer.service.name;
    
    const draggableCustomer = document.getElementById('draggable-customer');
    if (draggableCustomer) {
        const icon = draggableCustomer.querySelector('.drag-customer-icon');
        const name = draggableCustomer.querySelector('.drag-customer-name');
        
        if (icon) icon.textContent = customer.icon;
        if (name) name.textContent = customer.name;
        
        draggableCustomer.style.left = '50%';
        draggableCustomer.style.top = '220px';
        draggableCustomer.style.transform = 'translateX(-50%)';
    }
    
    document.querySelectorAll('.spa-station-area').forEach(area => {
        area.classList.remove('highlight', 'correct', 'wrong');
        if (parseInt(area.dataset.stationId) === customer.service.station) {
            area.classList.add('highlight');
        }
    });
    
    setupDragAndDrop();
    spaView.classList.add('show');
}

function setupDragAndDrop() {
    const draggableCustomer = document.getElementById('draggable-customer');
    if (!draggableCustomer) return;
    
    draggableCustomer.onmousedown = null;
    draggableCustomer.ontouchstart = null;
    
    draggableCustomer.onmousedown = function(e) {
        startDrag(e);
    };
    
    draggableCustomer.ontouchstart = function(e) {
        startDrag(e.touches[0]);
    };
    
    document.onmousemove = function(e) {
        if (game.dragData.isDragging) {
            doDrag(e);
        }
    };
    
    document.ontouchmove = function(e) {
        if (game.dragData.isDragging) {
            e.preventDefault();
            doDrag(e.touches[0]);
        }
    };
    
    document.onmouseup = function(e) {
        if (game.dragData.isDragging) {
            endDrag(e);
        }
    };
    
    document.ontouchend = function(e) {
        if (game.dragData.isDragging) {
            endDrag(e.changedTouches[0]);
        }
    };
}

function startDrag(e) {
    const draggableCustomer = document.getElementById('draggable-customer');
    if (!draggableCustomer) return;
    
    game.dragData.isDragging = true;
    game.dragData.element = draggableCustomer;
    
    const rect = draggableCustomer.getBoundingClientRect();
    game.dragData.offsetX = e.clientX - rect.left - rect.width / 2;
    game.dragData.offsetY = e.clientY - rect.top - rect.height / 2;
    
    draggableCustomer.classList.add('dragging');
}

function doDrag(e) {
    if (!game.dragData.isDragging) return;
    
    const draggableCustomer = game.dragData.element;
    const floor = document.querySelector('.spa-2d-floor');
    
    if (!draggableCustomer || !floor) return;
    
    const floorRect = floor.getBoundingClientRect();
    
    let newX = e.clientX - floorRect.left - game.dragData.offsetX;
    let newY = e.clientY - floorRect.top - game.dragData.offsetY;
    
    const maxX = floorRect.width - 80;
    const maxY = floorRect.height - 80;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    draggableCustomer.style.left = newX + 'px';
    draggableCustomer.style.top = newY + 'px';
    draggableCustomer.style.transform = 'none';
}

function endDrag(e) {
    if (!game.dragData.isDragging) return;
    
    const draggableCustomer = game.dragData.element;
    if (draggableCustomer) draggableCustomer.classList.remove('dragging');
    
    const customerRect = draggableCustomer.getBoundingClientRect();
    const customerCenterX = customerRect.left + customerRect.width / 2;
    const customerCenterY = customerRect.top + customerRect.height / 2;
    
    let droppedOnStation = null;
    
    document.querySelectorAll('.spa-station-area').forEach(stationArea => {
        const stationRect = stationArea.getBoundingClientRect();
        
        if (customerCenterX >= stationRect.left &&
            customerCenterX <= stationRect.right &&
            customerCenterY >= stationRect.top &&
            customerCenterY <= stationRect.bottom) {
            droppedOnStation = stationArea;
        }
    });
    
    if (droppedOnStation) {
        handleStationDrop(parseInt(droppedOnStation.dataset.stationId));
    }
    
    game.dragData.isDragging = false;
    game.dragData.element = null;
}

function handleStationDrop(droppedStationId) {
    const customer = game.currentCustomerForAssignment;
    if (!customer) return;
    
    const correctStationId = customer.service.station;
    const stationArea = document.querySelector(`.spa-station-area[data-station-id="${droppedStationId}"]`);
    
    if (droppedStationId === correctStationId) {
        stationArea.classList.remove('highlight');
        stationArea.classList.add('correct');
        showNotification(`Perfect! ${customer.name} is at the right station! 🎉`, 'success');
        
        setTimeout(() => {
            assignCustomerToStation(customer, droppedStationId);
            close2DSpaView();
        }, 1000);
    } else {
        stationArea.classList.add('wrong');
        showNotification(`Wrong station! Try again! ❌`, 'error');
        
        setTimeout(() => {
            stationArea.classList.remove('wrong');
            const draggableCustomer = document.getElementById('draggable-customer');
            if (draggableCustomer) {
                draggableCustomer.style.left = '50%';
                draggableCustomer.style.top = '220px';
                draggableCustomer.style.transform = 'translateX(-50%)';
            }
        }, 500);
    }
}

function close2DSpaView() {
    const spaView = document.getElementById('spa-2d-view');
    if (spaView) spaView.classList.remove('show');
    
    game.currentCustomerForAssignment = null;
    
    document.querySelectorAll('.spa-station-area').forEach(area => {
        area.classList.remove('highlight', 'correct', 'wrong');
    });
}

function assignCustomerToStation(customer, stationId) {
    const station = game.stations.find(s => s.id === stationId);
    
    const emptySlotIndex = station.slots.findIndex(slot => slot === null);
    
    if (emptySlotIndex === -1) {
        showNotification('Station is full! 🚫', 'warning');
        return;
    }
    
    game.customers = game.customers.filter(c => c.id !== customer.id);
    
    const slotData = {
        customer: customer,
        progress: 0,
        startTime: Date.now(),
        duration: customer.service.duration
    };
    
    station.slots[emptySlotIndex] = slotData;
    
    renderCustomers();
    updateStations();
    showNotification(`${customer.name} is getting ${customer.service.name}! 💖`, 'success');
}

function startGame() {
    console.log('startGame() called');
    
    game.isRunning = true;
    game.isPaused = false;
    
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    
    if (startBtn) startBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = false;
    
    showNotification('Game Started! 🎮', 'success');
    
    spawnCustomer();
    setInterval(() => {
        if (game.isRunning && !game.isPaused) {
            spawnCustomer();
        }
    }, 10000);
    
    setInterval(() => {
        if (game.isRunning && !game.isPaused) {
            updateGame();
        }
    }, 100);
    
    setInterval(() => {
        if (game.isRunning && !game.isPaused) {
            generatePassiveIncome();
        }
    }, 1000);
}

function togglePause() {
    if (!game.isPaused) {
        // Pausing the game - show save score option
        game.isPaused = true;
        const btn = document.getElementById('pause-btn');
        if (btn) {
            btn.textContent = '▶️ Resume';
        }
        
        // Show save score modal with pause context
        if (typeof showSaveScoreModal === 'function') {
            showSaveScoreModal('pause');
        } else {
            showNotification('Game Paused', 'warning');
        }
    } else {
        // Resuming the game
        game.isPaused = false;
        const btn = document.getElementById('pause-btn');
        if (btn) {
            btn.textContent = '⏸️ Pause';
        }
        showNotification('Game Resumed', 'success');
    }
}

function spawnCustomer() {
    if (game.customers.length >= 6) return;
    
    const service = services[Math.floor(Math.random() * services.length)];
    const patienceBonus = calculatePatienceBonus();
    
    const customer = {
        id: game.customerIdCounter++,
        name: customerNames[Math.floor(Math.random() * customerNames.length)],
        icon: customerIcons[Math.floor(Math.random() * customerIcons.length)],
        service: service,
        patience: 100 + patienceBonus,
        maxPatience: 100 + patienceBonus,
        patienceDecay: 0.02
    };
    
    game.customers.push(customer);
    renderCustomers();
}

function calculatePatienceBonus() {
    let bonus = 0;
    if (game.upgrades.refuel.level > 0) {
        bonus += upgradeDefinitions.refuel.patienceBonus * game.upgrades.refuel.level;
    }
    if (game.upgrades.connection.level > 0) {
        bonus += upgradeDefinitions.connection.patienceBonus * game.upgrades.connection.level;
    }
    if (game.upgrades.launch.level > 0) {
        bonus += upgradeDefinitions.launch.patienceBonus * game.upgrades.launch.level;
    }
    return bonus;
}

function calculateTipBonus() {
    let bonus = 0;
    if (game.upgrades.result.level > 0) {
        bonus += upgradeDefinitions.result.tipBonus * game.upgrades.result.level;
    }
    return bonus;
}

function calculatePassiveIncome() {
    let income = 0;
    Object.keys(game.upgrades).forEach(key => {
        const level = game.upgrades[key].level;
        if (level > 0) {
            income += upgradeDefinitions[key].incomePerLevel * level;
        }
    });
    return income;
}

function generatePassiveIncome() {
    const now = Date.now();
    const elapsed = (now - game.lastPassiveIncomeTime) / 1000;
    
    if (elapsed >= 1) {
        const incomePerMinute = calculatePassiveIncome();
        const incomePerSecond = incomePerMinute / 60;
        const earnedIncome = Math.floor(incomePerSecond * elapsed);
        
        if (earnedIncome > 0) {
            game.money += earnedIncome;
            updateUI();
        }
        
        game.lastPassiveIncomeTime = now;
    }
}

function renderCustomers() {
    const queue = document.getElementById('customer-queue');
    if (!queue) return;
    
    queue.innerHTML = '';
    
    game.customers.forEach(customer => {
        const customerEl = document.createElement('div');
        customerEl.className = 'customer';
        
        const patiencePercent = Math.round((customer.patience / customer.maxPatience) * 100);
        
        if (patiencePercent < 30) {
            customerEl.classList.add('waiting-too-long');
        }
        
        let emoji = '😊';
        if (patiencePercent < 30) {
            emoji = '😠';
        } else if (patiencePercent < 50) {
            emoji = '😐';
        } else if (patiencePercent < 70) {
            emoji = '🙂';
        }
        
        customerEl.innerHTML = `
            <div class="customer-icon">${customer.icon}</div>
            <div class="customer-name">${customer.name}</div>
            <div class="customer-service">${customer.service.icon} ${customer.service.name}</div>
            <div class="customer-patience">${emoji} ${patiencePercent}%</div>
        `;
        
        customerEl.onmousedown = function(e) {
            this.style.transform = 'scale(0.9)';
            this.style.transition = 'none';
            
            setTimeout(() => {
                this.style.transform = '';
                this.style.transition = '';
                openEnvironment(customer);
            }, 50);
        };
        
        customerEl.ontouchstart = function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.9)';
            this.style.transition = 'none';
            
            setTimeout(() => {
                this.style.transform = '';
                this.style.transition = '';
                openEnvironment(customer);
            }, 50);
        };
        
        queue.appendChild(customerEl);
    });
}

function updateGame() {
    game.customers.forEach(customer => {
        customer.patience = Math.max(0, customer.patience - customer.patienceDecay);
        if (customer.patience === 0) {
            game.customers = game.customers.filter(c => c.id !== customer.id);
            showNotification(`${customer.name} left unhappy! 😢`, 'error');
            renderCustomers();
        }
    });
    
    game.stations.forEach(station => {
        station.slots.forEach((slot, index) => {
            if (slot !== null) {
                const elapsed = Date.now() - slot.startTime;
                slot.progress = Math.min(100, (elapsed / slot.duration) * 100);
                
                if (slot.progress >= 100) {
                    completeService(station, index);
                }
            }
        });
    });
    
    updateStations();
    renderCustomers();
}

function completeService(station, slotIndex) {
    const slot = station.slots[slotIndex];
    const customer = slot.customer;
    const service = customer.service;
    
    const patiencePercent = (customer.patience / customer.maxPatience) * 100;
    const speedBonus = patiencePercent > 70 ? 20 : patiencePercent > 40 ? 10 : 0;
    const tipBonus = calculateTipBonus();
    const totalBonus = speedBonus + tipBonus;
    const earnings = service.price + totalBonus;
    
    game.money += earnings;
    game.satisfiedCustomers++;
    
    if (game.satisfiedCustomers % 10 === 0) {
        game.level++;
        unlockStationSlot();
        showNotification(`Level Up! 🎉 Now Level ${game.level}`, 'success');
    }
    
    let bonusText = totalBonus > 0 ? ` (+ $${totalBonus} bonus!)` : '';
    showNotification(`${customer.name} paid $${earnings}!${bonusText} 💰`, 'success');
    
    station.slots[slotIndex] = null;
    
    updateUI();
    updateStations();
    
    const envModal = document.getElementById('spa-environment');
    if (envModal && envModal.classList.contains('show')) {
        updateEnvironmentStations();
    }
}

function unlockStationSlot() {
    const randomStation = game.stations[Math.floor(Math.random() * game.stations.length)];
    
    if (randomStation.maxSlots < 5) {
        randomStation.maxSlots++;
        randomStation.slots.push(null);
        showNotification(`${randomStation.icon} ${randomStation.name} Station upgraded! Now has ${randomStation.maxSlots} slots! ✨`, 'success');
    } else {
        const nonMaxedStation = game.stations.find(s => s.maxSlots < 5);
        if (nonMaxedStation) {
            nonMaxedStation.maxSlots++;
            nonMaxedStation.slots.push(null);
            showNotification(`${nonMaxedStation.icon} ${nonMaxedStation.name} Station upgraded! Now has ${nonMaxedStation.maxSlots} slots! ✨`, 'success');
        }
    }
    
    updateStations();
}

function updateStations() {
    game.stations.forEach(station => {
        const stationEl = document.getElementById(`station-${station.id}`);
        if (!stationEl) return;
        
        const statusEl = stationEl.querySelector('.station-status');
        const progressContainer = stationEl.querySelector('.progress-container');
        
        if (!statusEl || !progressContainer) return;
        
        statusEl.innerHTML = '';
        progressContainer.innerHTML = '';
        
        const emptySlots = station.slots.filter(s => s === null).length;
        const occupiedSlots = station.maxSlots - emptySlots;
        
        statusEl.innerHTML = `<div style="font-size: 0.9em; color: #999; margin-bottom: 5px;">Slots: ${occupiedSlots}/${station.maxSlots}</div>`;
        
        station.slots.forEach((slot, index) => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'station-slot';
            
            if (slot !== null) {
                const isCompleted = slot.progress >= 100;
                slotDiv.classList.add('occupied');
                if (isCompleted) slotDiv.classList.add('completed');
                
                slotDiv.innerHTML = `
                    <div class="slot-customer">${slot.customer.name}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${slot.progress}%"></div>
                    </div>
                `;
            } else {
                slotDiv.innerHTML = `<div class="slot-empty">Empty</div>`;
            }
            
            progressContainer.appendChild(slotDiv);
        });
        
        const hasOccupied = station.slots.some(s => s !== null);
        const allCompleted = station.slots.every(s => s === null || s.progress >= 100);
        
        if (hasOccupied) {
            stationEl.classList.add('occupied');
        } else {
            stationEl.classList.remove('occupied');
        }
        
        if (hasOccupied && allCompleted) {
            stationEl.classList.add('completed');
        } else {
            stationEl.classList.remove('completed');
        }
    });
}

function updateUI() {
    const moneyEl = document.getElementById('money');
    const levelEl = document.getElementById('level');
    const satisfiedEl = document.getElementById('satisfied');
    const passiveIncomeEl = document.getElementById('passive-income');
    
    if (moneyEl) moneyEl.textContent = '$' + game.money;
    if (levelEl) levelEl.textContent = game.level;
    if (satisfiedEl) satisfiedEl.textContent = game.satisfiedCustomers;
    
    const passiveIncome = calculatePassiveIncome();
    if (passiveIncomeEl) passiveIncomeEl.textContent = '$' + passiveIncome + '/min';
    game.passiveIncome = passiveIncome;
}

function openShop() {
    const modal = document.getElementById('shop-modal');
    if (modal) {
        modal.classList.add('show');
        renderShop();
    }
}

function closeShop() {
    const modal = document.getElementById('shop-modal');
    if (modal) modal.classList.remove('show');
}

function renderShop() {
    const shopItems = document.getElementById('shop-items');
    if (!shopItems) return;
    
    shopItems.innerHTML = '';
    
    Object.keys(upgradeDefinitions).forEach(key => {
        const def = upgradeDefinitions[key];
        const currentLevel = game.upgrades[key].level;
        const maxLevel = def.maxLevel;
        
        const item = document.createElement('div');
        item.className = 'shop-item';
        
        if (currentLevel >= maxLevel) {
            item.classList.add('max-level');
        }
        
        const cost = Math.floor(def.baseCost * Math.pow(def.costMultiplier, currentLevel));
        const canAfford = game.money >= cost;
        const isMaxLevel = currentLevel >= maxLevel;
        
        let benefitsHTML = '';
        if (def.incomePerLevel) {
            const totalIncome = def.incomePerLevel * (currentLevel + 1);
            benefitsHTML += `<div class="benefit">💰 $${totalIncome}/min passive income</div>`;
        }
        if (def.patienceBonus) {
            const totalPatience = def.patienceBonus * (currentLevel + 1);
            benefitsHTML += `<div class="benefit">😊 +${totalPatience}% customer patience</div>`;
        }
        if (def.tipBonus) {
            const totalTips = def.tipBonus * (currentLevel + 1);
            benefitsHTML += `<div class="benefit">💵 +$${totalTips} bonus tips</div>`;
        }
        
        item.innerHTML = `
            <div class="shop-icon">${def.icon}</div>
            <div class="shop-item-name">${def.name}</div>
            <div class="shop-item-level">Level ${currentLevel}/${maxLevel}</div>
            <div class="shop-item-description">${def.description}</div>
            <div class="shop-item-benefits">
                <strong>Next Level Benefits:</strong>
                ${benefitsHTML}
            </div>
            <div class="shop-item-price">${isMaxLevel ? 'MAX LEVEL! 🌟' : '💰 $' + cost}</div>
            <button class="buy-btn" ${(!canAfford || isMaxLevel) ? 'disabled' : ''} data-upgrade="${key}">
                ${isMaxLevel ? '✨ Maxed Out' : (canAfford ? '🛒 Purchase' : '🔒 Not enough money')}
            </button>
        `;
        
        const buyBtn = item.querySelector('.buy-btn');
        buyBtn.addEventListener('click', () => purchaseUpgrade(key, cost));
        
        shopItems.appendChild(item);
    });
}

function purchaseUpgrade(upgradeKey, cost) {
    const upgrade = game.upgrades[upgradeKey];
    const def = upgradeDefinitions[upgradeKey];
    
    if (game.money < cost) {
        showNotification('Not enough money! 💸', 'error');
        return;
    }
    
    if (upgrade.level >= def.maxLevel) {
        showNotification('Already at max level! 🌟', 'warning');
        return;
    }
    
    const previousLevel = upgrade.level;
    game.money -= cost;
    upgrade.level++;
    
    if (previousLevel === 0) {
        showNotification(`${def.icon} ${def.name} unlocked! 🎉`, 'success');
        
        setTimeout(() => {
            let benefitText = '';
            if (def.incomePerLevel) {
                benefitText = `Earning $${def.incomePerLevel}/min passive income! 💰`;
            }
            if (def.patienceBonus) {
                benefitText = `Customers now have +${def.patienceBonus}% more patience! 😊`;
            }
            if (def.tipBonus) {
                benefitText = `Customers now tip $${def.tipBonus} more! 💵`;
            }
            showNotification(benefitText, 'success');
        }, 1500);
    } else {
        showNotification(`${def.icon} ${def.name} upgraded to Level ${upgrade.level}! 📈`, 'success');
        
        setTimeout(() => {
            if (def.incomePerLevel) {
                const totalIncome = def.incomePerLevel * upgrade.level;
                showNotification(`Now earning $${totalIncome}/min! 💰`, 'success');
            }
            if (def.patienceBonus) {
                const totalPatience = def.patienceBonus * upgrade.level;
                showNotification(`Customers now have +${totalPatience}% patience! 😊`, 'success');
            }
            if (def.tipBonus) {
                const totalTips = def.tipBonus * upgrade.level;
                showNotification(`Customers now tip +$${totalTips} more! 💵`, 'success');
            }
        }, 1500);
    }
    
    updateUI();
    renderShop();
}

function showNotification(message, type = 'success') {
    const container = document.getElementById('notifications');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Start the game
init();
