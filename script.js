// Global variables
let discordMode = false;
let discordWebhookUrl = 'https://discord.com/api/webhooks/1422213401794445363/0bHbH5R5iMk3ZiU-Gu8jx_GQ8UjKTHhWEht8wXRH_LU3JETqCTZVtCn6eBqxGwk6EwP2';
let rollHistory = [];

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set up event listeners for stat inputs
    const statInputs = document.querySelectorAll('.stat-input');
    statInputs.forEach(input => {
        input.addEventListener('input', updateModifier);
        input.addEventListener('change', updateModifier);
        // Initialize modifiers
        updateModifier.call(input);
    });

    // Load saved character data if available
    loadCharacterData();
    
    // Auto-save character data when inputs change
    const characterName = document.getElementById('characterName');
    characterName.addEventListener('input', saveCharacterData);
    statInputs.forEach(input => {
        input.addEventListener('change', saveCharacterData);
    });
}

// Calculate ability modifier from ability score
function calculateModifier(score) {
    return Math.floor((score - 10) / 2);
}

// Update modifier display when stat changes
function updateModifier() {
    const statValue = parseInt(this.value) || 10;
    const modifier = calculateModifier(statValue);
    const modifierElement = document.getElementById(this.id + '-mod');
    
    modifierElement.textContent = modifier >= 0 ? `+${modifier}` : `${modifier}`;
    
    // Color coding for modifiers
    if (modifier >= 3) {
        modifierElement.style.color = '#4ecdc4'; // Cyan for high
    } else if (modifier >= 1) {
        modifierElement.style.color = '#90ee90'; // Light green for positive
    } else if (modifier === 0) {
        modifierElement.style.color = '#f4f1e8'; // White for neutral
    } else if (modifier >= -2) {
        modifierElement.style.color = '#ffa500'; // Orange for negative
    } else {
        modifierElement.style.color = '#ff6b6b'; // Red for very negative
    }
}

// Roll a d20 + modifier for a specific stat
function rollStat(statName) {
    const statInput = document.getElementById(statName);
    const statValue = parseInt(statInput.value) || 10;
    const modifier = calculateModifier(statValue);
    
    // Roll a d20
    const d20Roll = Math.floor(Math.random() * 20) + 1;
    const totalRoll = d20Roll + modifier;
    
    // Get character name
    const characterName = document.getElementById('characterName').value || 'Character';
    
    // Create roll result object
    const rollResult = {
        character: characterName,
        stat: statName.toUpperCase(),
        d20: d20Roll,
        modifier: modifier,
        total: totalRoll,
        abilityScore: statValue,
        timestamp: new Date()
    };
    
    // Add to history
    rollHistory.unshift(rollResult);
    
    // Limit history to 20 entries
    if (rollHistory.length > 20) {
        rollHistory = rollHistory.slice(0, 20);
    }
    
    // Display the roll
    displayRoll(rollResult);
    
    // Handle Discord integration if enabled
    if (discordMode && discordWebhookUrl) {
        sendToDiscord(rollResult);
    }
}

// Display a roll result in the history
function displayRoll(rollResult) {
    const historyContainer = document.getElementById('rollHistory');
    const rollEntry = document.createElement('div');
    rollEntry.className = 'roll-entry';
    
    // Special styling for natural 20s and 1s
    if (rollResult.d20 === 20) {
        rollEntry.classList.add('natural-twenty');
    } else if (rollResult.d20 === 1) {
        rollEntry.classList.add('critical');
    }
    
    const modifierText = rollResult.modifier >= 0 ? `+${rollResult.modifier}` : `${rollResult.modifier}`;
    const timeString = rollResult.timestamp.toLocaleTimeString();
    
    rollEntry.innerHTML = `
        <strong>${rollResult.character}</strong> - ${rollResult.stat} Check<br>
        <span style="color: #d4af37;">d20:</span> ${rollResult.d20} <span style="color: #90ee90;">${modifierText}</span> = <strong>${rollResult.total}</strong>
        <span style="float: right; font-size: 0.8em; color: rgba(244, 241, 232, 0.6);">${timeString}</span>
    `;
    
    historyContainer.insertBefore(rollEntry, historyContainer.firstChild);
}

// Clear roll history
function clearHistory() {
    rollHistory = [];
    document.getElementById('rollHistory').innerHTML = '';
    showToast('History cleared');
}

// Toggle Discord mode
function toggleDiscordMode() {
    if (!discordMode) {
        // Prompt for webhook URL
        const webhookUrl = prompt('Enter your Discord webhook URL:');
        if (webhookUrl && (webhookUrl.includes('discord.com/api/webhooks/') || webhookUrl.includes('discordapp.com/api/webhooks/'))) {
            discordWebhookUrl = webhookUrl;
            discordMode = true;
            const toggleBtn = document.getElementById('discordToggle');
            toggleBtn.textContent = 'Disable Discord Mode';
            toggleBtn.classList.add('disabled');
            showToast('Discord Mode Enabled - Rolls will be sent to Discord');
            
            // Save webhook URL
            localStorage.setItem('discordWebhookUrl', webhookUrl);
        } else if (webhookUrl) {
            showToast('Invalid Discord webhook URL. Make sure it contains "discord.com/api/webhooks/"');
        }
    } else {
        discordMode = false;
        discordWebhookUrl = '';
        const toggleBtn = document.getElementById('discordToggle');
        toggleBtn.textContent = 'Enable Discord Mode';
        toggleBtn.classList.remove('disabled');
        showToast('Discord Mode Disabled');
        
        // Remove saved webhook URL
        localStorage.removeItem('discordWebhookUrl');
    }
}

// Send roll result to Discord (direct browser call)
async function sendToDiscord(rollResult) {
    try {
        console.log('Sending to Discord:', discordWebhookUrl);
        
        // Create Discord embed
        const embed = {
            title: `🎲 ${rollResult.character} - ${rollResult.stat} Check`,
            color: rollResult.d20 === 20 ? 0x00ff00 : rollResult.d20 === 1 ? 0xff0000 : 0x8b4513,
            fields: [
                {
                    name: "🎯 Roll Result",
                    value: `d20: **${rollResult.d20}** ${rollResult.modifier >= 0 ? '+' : ''}${rollResult.modifier} = **${rollResult.total}**`,
                    inline: false
                },
                {
                    name: "📊 Ability Score",
                    value: `${rollResult.stat}: ${rollResult.abilityScore}`,
                    inline: true
                },
                {
                    name: "⚡ Modifier",
                    value: `${rollResult.modifier >= 0 ? '+' : ''}${rollResult.modifier}`,
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "D&D Character Stats Roller"
            }
        };

        // Add special message for natural 20s and 1s
        if (rollResult.d20 === 20) {
            embed.description = "🌟 **NATURAL 20!** 🌟";
        } else if (rollResult.d20 === 1) {
            embed.description = "💀 **NATURAL 1...** 💀";
        }

        const discordPayload = {
            embeds: [embed]
        };

        console.log('Discord payload:', discordPayload);

        // Send directly to Discord webhook
        const response = await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordPayload)
        });

        console.log('Discord response status:', response.status);

        if (response.ok || response.status === 204) {
            showToast('Roll sent to Discord! 🎲');
            console.log('✅ Discord message sent successfully!');
        } else {
            const errorText = await response.text();
            console.error('Discord error response:', errorText);
            throw new Error(`Discord API error: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error('Discord send error:', error);
        if (error.message.includes('CORS') || error.message.includes('network')) {
            showToast('⚠️ CORS/Network error - this is normal for direct browser calls. Check Discord to see if the message was sent!');
        } else {
            showToast('Failed to send to Discord: ' + error.message);
        }
    }
}

// Test Discord webhook
async function testDiscordWebhook() {
    if (!discordWebhookUrl) {
        showToast('Please enable Discord mode first!');
        return;
    }

    const testRoll = {
        character: 'TestCharacter',
        stat: 'STR',
        d20: 15,
        modifier: 3,
        total: 18,
        abilityScore: 16
    };

    showToast('Testing Discord webhook...');
    await sendToDiscord(testRoll);
}

// Show toast notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(139, 69, 19, 0.9);
        color: #f4f1e8;
        padding: 12px 20px;
        border-radius: 8px;
        border: 1px solid #d4af37;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Add keyframes for animation
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Remove toast after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Save character data to localStorage
function saveCharacterData() {
    const characterData = {
        name: document.getElementById('characterName').value,
        stats: {
            str: document.getElementById('str').value,
            dex: document.getElementById('dex').value,
            con: document.getElementById('con').value,
            int: document.getElementById('int').value,
            wis: document.getElementById('wis').value,
            cha: document.getElementById('cha').value
        }
    };
    
    localStorage.setItem('dndCharacterData', JSON.stringify(characterData));
}

// Load character data from localStorage
function loadCharacterData() {
    const savedData = localStorage.getItem('dndCharacterData');
    if (savedData) {
        try {
            const characterData = JSON.parse(savedData);
            
            if (characterData.name) {
                document.getElementById('characterName').value = characterData.name;
            }
            
            if (characterData.stats) {
                Object.keys(characterData.stats).forEach(stat => {
                    const input = document.getElementById(stat);
                    if (input && characterData.stats[stat]) {
                        input.value = characterData.stats[stat];
                        updateModifier.call(input);
                    }
                });
            }
        } catch (e) {
            console.warn('Failed to load character data:', e);
        }
    }
    
    // Load Discord webhook URL if saved
    const savedWebhookUrl = localStorage.getItem('discordWebhookUrl');
    if (savedWebhookUrl) {
        discordWebhookUrl = savedWebhookUrl;
        discordMode = true;
        const toggleBtn = document.getElementById('discordToggle');
        if (toggleBtn) {
            toggleBtn.textContent = 'Disable Discord Mode';
            toggleBtn.classList.add('disabled');
        }
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + number keys to roll stats quickly
    if (e.altKey && !e.ctrlKey && !e.shiftKey) {
        const statMap = {
            '1': 'str',
            '2': 'dex',
            '3': 'con',
            '4': 'int',
            '5': 'wis',
            '6': 'cha'
        };
        
        if (statMap[e.key]) {
            e.preventDefault();
            rollStat(statMap[e.key]);
        }
    }
    
    // Ctrl + D to toggle Discord mode
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDiscordMode();
    }
    
    // Ctrl + H to clear history
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        clearHistory();
    }
});

// Add help button to the page
document.addEventListener('DOMContentLoaded', function() {
    const helpBtn = document.createElement('button');
    helpBtn.textContent = '?';
    helpBtn.title = 'Show Help';
    helpBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(145deg, #8b4513, #a0522d);
        border: none;
        color: #f4f1e8;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    `;
    helpBtn.addEventListener('click', showHelp);
    document.body.appendChild(helpBtn);
});

function showHelp() {
    const helpText = `
D&D Character Stats Roller - Help

Keyboard Shortcuts:
• Alt + 1-6: Quick roll stats (STR, DEX, CON, INT, WIS, CHA)
• Ctrl + D: Toggle Discord mode
• Ctrl + H: Clear roll history

Discord Integration:
• Get webhook URL from Discord server settings
• Go to channel → Edit Channel → Integrations → Webhooks
• Create new webhook and copy the URL
• Enable Discord mode and paste the URL
• Rolls will be sent directly to your Discord channel!

Features:
• Automatic modifier calculation
• Color-coded results for nat 20s and 1s
• Roll history with timestamps
• Character data auto-save
    `;
    
    alert(helpText);
}