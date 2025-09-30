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
        input.addEventListener('input', function() {
            updateModifier.call(this);
            updateCalculatedStats();
        });
        input.addEventListener('change', function() {
            updateModifier.call(this);
            updateCalculatedStats();
        });
        // Initialize modifiers
        updateModifier.call(input);
    });
    
    // Set up event listeners for bonus inputs
    const bonusInputs = document.querySelectorAll('.bonus-input');
    bonusInputs.forEach(input => {
        input.addEventListener('input', updateCalculatedStats);
        input.addEventListener('change', updateCalculatedStats);
    });

    // Load saved character data if available
    loadCharacterData();
    
    // Auto-save character data when inputs change
    const characterName = document.getElementById('characterName');
    characterName.addEventListener('input', saveCharacterData);
    statInputs.forEach(input => {
        input.addEventListener('change', saveCharacterData);
    });
    bonusInputs.forEach(input => {
        input.addEventListener('change', saveCharacterData);
    });
    
    // Initial calculation
    updateCalculatedStats();
}

// Update calculated stats (Volontà and Autorità)
function updateCalculatedStats() {
    calculateVolonta();
    calculateAutorita();
}

// Calculate ability modifier from ability score (in this system, the score IS the modifier)
function calculateModifier(score) {
    return score; // The stat value is directly the modifier/bonus
}

// Determine critical type based on individual dice values
function getCriticalType(dice) {
    const [die1, die2, die3] = dice;
    
    // Check for different critical levels
    if (die1 === 10 && die2 === 10 && die3 === 10) {
        return { level: 4, name: "CRITICO LEGGENDARIO", color: "#ff69b4", emoji: "💫" }; // Tutti 10
    } else if (die1 >= 10 && die2 >= 10 && die3 >= 10) {
        return { level: 4, name: "CRITICO LEGGENDARIO", color: "#ff69b4", emoji: "💫" }; // Backup per tutti 10
    } else if (die1 >= 9 && die2 >= 9 && die3 >= 9) {
        return { level: 3, name: "CRITICO EPICO", color: "#ffd700", emoji: "⭐" }; // Tutti 9+
    } else if (die1 >= 8 && die2 >= 8 && die3 >= 8) {
        return { level: 2, name: "CRITICO SUPERIORE", color: "#ff8c00", emoji: "🔥" }; // Tutti 8+
    } else if (die1 >= 7 && die2 >= 7 && die3 >= 7) {
        return { level: 1, name: "CRITICO", color: "#4ecdc4", emoji: "✨" }; // Tutti 7+
    }
    
    return null; // Nessun critico
}

// Calculate Volontà based on mental stats (every 4 points from base -12 adds 1)
function calculateVolonta() {
    const menteValue = parseInt(document.getElementById('mente').value) || 0;
    const spiritoValue = parseInt(document.getElementById('spirito').value) || 0;
    const cuoreValue = parseInt(document.getElementById('cuore').value) || 0;
    
    // Base total is -12 (4 stats * -3 each)
    const totalMental = menteValue + spiritoValue + cuoreValue;
    const baseTotal = -9; // 3 stats * -3 each (since we have 3 mental stats)
    const pointsAboveBase = totalMental - baseTotal;
    const autoValue = Math.floor(pointsAboveBase / 4);
    
    const bonusValue = parseInt(document.getElementById('volonta-bonus').value) || 0;
    const totalValue = autoValue + bonusValue;
    
    // Update display
    document.getElementById('volonta-auto').textContent = autoValue;
    document.getElementById('volonta-total').textContent = totalValue;
    
    // Update modifier display
    const modifierElement = document.getElementById('volonta-mod');
    modifierElement.textContent = totalValue >= 0 ? `+${totalValue}` : `${totalValue}`;
    updateModifierColor(modifierElement, totalValue);
    
    return totalValue;
}

// Calculate Autorità based on physical stats (every 4 points from base -9 adds 1)
function calculateAutorita() {
    const vigoreValue = parseInt(document.getElementById('vigore').value) || 0;
    const riflessiValue = parseInt(document.getElementById('riflessi').value) || 0;
    const virtuValue = parseInt(document.getElementById('virtu').value) || 0;
    
    // Base total is -9 (3 stats * -3 each)
    const totalPhysical = vigoreValue + riflessiValue + virtuValue;
    const baseTotal = -9; // 3 stats * -3 each
    const pointsAboveBase = totalPhysical - baseTotal;
    const autoValue = Math.floor(pointsAboveBase / 4);
    
    const bonusValue = parseInt(document.getElementById('autorita-bonus').value) || 0;
    const totalValue = autoValue + bonusValue;
    
    // Update display
    document.getElementById('autorita-auto').textContent = autoValue;
    document.getElementById('autorita-total').textContent = totalValue;
    
    // Update modifier display
    const modifierElement = document.getElementById('autorita-mod');
    modifierElement.textContent = totalValue >= 0 ? `+${totalValue}` : `${totalValue}`;
    updateModifierColor(modifierElement, totalValue);
    
    return totalValue;
}

// Helper function to update modifier colors
function updateModifierColor(element, value) {
    if (value >= 3) {
        element.style.color = '#4ecdc4'; // Cyan for high
    } else if (value >= 1) {
        element.style.color = '#90ee90'; // Light green for positive
    } else if (value === 0) {
        element.style.color = '#f4f1e8'; // White for neutral
    } else if (value >= -2) {
        element.style.color = '#ffa500'; // Orange for negative
    } else {
        element.style.color = '#ff6b6b'; // Red for very negative
    }
}

// Get the current value for Volontà or Autorità
function getCalculatedStatValue(statName) {
    if (statName === 'volonta') {
        return calculateVolonta();
    } else if (statName === 'autorita') {
        return calculateAutorita();
    } else {
        const element = document.getElementById(statName);
        return element ? parseInt(element.value) || 0 : 0;
    }
}

// Update modifier display when stat changes
function updateModifier() {
    const statValue = parseInt(this.value) || 0;
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

// Roll 3d10 + modifier for a specific stat
function rollStat(statName) {
    const statValue = getCalculatedStatValue(statName);
    const modifier = calculateModifier(statValue);
    
    // Roll 3d10
    const die1 = Math.floor(Math.random() * 10) + 1;
    const die2 = Math.floor(Math.random() * 10) + 1;
    const die3 = Math.floor(Math.random() * 10) + 1;
    const diceRoll = die1 + die2 + die3;
    const totalRoll = diceRoll + modifier;
    
    // Get character name
    const characterName = document.getElementById('characterName').value || 'Character';
    
    // Check for critical
    const critical = getCriticalType([die1, die2, die3]);
    
    // Create roll result object
    const rollResult = {
        character: characterName,
        stat: statName.toUpperCase(),
        dice: [die1, die2, die3],
        diceTotal: diceRoll,
        modifier: modifier,
        total: totalRoll,
        abilityScore: statValue,
        critical: critical,
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
    
    // Check for critical hits
    const critical = getCriticalType(rollResult.dice);
    
    // Special styling for different critical levels
    if (critical) {
        rollEntry.classList.add('critical-hit');
        rollEntry.style.borderLeftColor = critical.color;
        rollEntry.style.background = `linear-gradient(90deg, ${critical.color}15, rgba(244, 241, 232, 0.1))`;
    } else if (rollResult.diceTotal === 30) {
        rollEntry.classList.add('natural-twenty'); // Reuse existing class for max roll
    } else if (rollResult.diceTotal === 3) {
        rollEntry.classList.add('critical'); // Reuse existing class for min roll
    }
    
    const modifierText = rollResult.modifier >= 0 ? `+${rollResult.modifier}` : `${rollResult.modifier}`;
    const timeString = rollResult.timestamp.toLocaleTimeString();
    const diceDisplay = `[${rollResult.dice.join(', ')}]`;
    
    let criticalDisplay = '';
    if (critical) {
        criticalDisplay = `<div style="color: ${critical.color}; font-weight: bold; margin-top: 5px;">${critical.emoji} ${critical.name} ${critical.emoji}</div>`;
    }
    
    rollEntry.innerHTML = `
        <strong>${rollResult.character}</strong> - ${rollResult.stat} Check<br>
        <span style="color: #d4af37;">3d10:</span> ${diceDisplay} = ${rollResult.diceTotal} <span style="color: #90ee90;">${modifierText}</span> = <strong>${rollResult.total}</strong>
        ${criticalDisplay}
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
            color: rollResult.critical ? parseInt(rollResult.critical.color.replace('#', '0x')) : 
                   (rollResult.diceTotal === 30 ? 0x00ff00 : rollResult.diceTotal === 3 ? 0xff0000 : 0x8b4513),
            fields: [
                {
                    name: "🎯 Roll Result",
                    value: `3d10: [${rollResult.dice.join(', ')}] = **${rollResult.diceTotal}** ${rollResult.modifier >= 0 ? '+' : ''}${rollResult.modifier} = **${rollResult.total}**`,
                    inline: false
                },
                {
                    name: "📊 Stat Value",
                    value: `${rollResult.stat}: ${rollResult.abilityScore}`,
                    inline: true
                },
                {
                    name: "⚡ Bonus",
                    value: `${rollResult.modifier >= 0 ? '+' : ''}${rollResult.modifier}`,
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "Character Stats Roller (3d10)"
            }
        };

        // Add special message for critical hits and extreme rolls
        if (rollResult.critical) {
            embed.description = `${rollResult.critical.emoji} **${rollResult.critical.name}!** ${rollResult.critical.emoji}`;
        } else if (rollResult.diceTotal === 30) {
            embed.description = "🌟 **MAXIMUM ROLL (30)!** 🌟";
        } else if (rollResult.diceTotal === 3) {
            embed.description = "💀 **MINIMUM ROLL (3)...** 💀";
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
        stat: 'MENTE',
        dice: [7, 4, 6],
        diceTotal: 17,
        modifier: 2,
        total: 19,
        abilityScore: 2
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
            mente: document.getElementById('mente').value,
            spirito: document.getElementById('spirito').value,
            cuore: document.getElementById('cuore').value,
            vigore: document.getElementById('vigore').value,
            riflessi: document.getElementById('riflessi').value,
            virtu: document.getElementById('virtu').value
        },
        bonuses: {
            volonta: document.getElementById('volonta-bonus').value,
            autorita: document.getElementById('autorita-bonus').value
        }
    };
    
    localStorage.setItem('characterData', JSON.stringify(characterData));
}

// Load character data from localStorage
function loadCharacterData() {
    const savedData = localStorage.getItem('characterData');
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
            
            if (characterData.bonuses) {
                Object.keys(characterData.bonuses).forEach(stat => {
                    const input = document.getElementById(stat + '-bonus');
                    if (input && characterData.bonuses[stat]) {
                        input.value = characterData.bonuses[stat];
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
            '1': 'mente',
            '2': 'spirito', 
            '3': 'cuore',
            '4': 'volonta',
            '5': 'vigore',
            '6': 'riflessi',
            '7': 'virtu',
            '8': 'autorita'
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

/* // Add help button to the page
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
Character Stats Roller (3d10) - Help

Sistema di Statistiche:
• Statistiche base vanno da -5 a +20/+30
• Il valore della statistica È direttamente il bonus
• VOLONTÀ = (Mentali - base) ÷ 4 + bonus extra
• AUTORITÀ = (Fisiche - base) ÷ 4 + bonus extra
• Base = -3 per ogni statistica

Sistema di Critici:
• ✨ CRITICO: Tutti i dadi ≥ 7
• 🔥 CRITICO SUPERIORE: Tutti i dadi ≥ 8  
• ⭐ CRITICO EPICO: Tutti i dadi ≥ 9
• 💫 CRITICO LEGGENDARIO: Tutti i dadi = 10

Keyboard Shortcuts:
• Alt + 1-4: Statistiche Mentali (MENTE, SPIRITO, CUORE, VOLONTÀ)
• Alt + 5-8: Statistiche Fisiche (VIGORE, RIFLESSI, VIRTÙ, AUTORITÀ)
• Ctrl + D: Toggle Discord mode
• Ctrl + H: Clear roll history

Discord Integration:
• Get webhook URL from Discord server settings
• Go to channel → Edit Channel → Integrations → Webhooks
• Create new webhook and copy the URL
• Enable Discord mode and paste the URL
• 3d10 rolls will be sent directly to your Discord channel!

Features:
• Calcolo automatico di Volontà e Autorità
• Sistema di critici a 4 livelli
• Color-coded results for critical hits
• Roll history with timestamps
• Character data auto-save
    `;
    
    alert(helpText);
} */