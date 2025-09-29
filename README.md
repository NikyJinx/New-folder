# 🎲 D&D Character Stats Roller# D&D Character Stats Roller



Una webapp interattiva per gestire le statistiche dei personaggi D&D e tirare dadi con integrazione Discord.An interactive web application for managing D&D character ability scores and rolling ability checks with modifiers. Features seamless Roll20 integration for online gameplay.



![D&D Stats](https://img.shields.io/badge/D&D-5e-red) ![Discord](https://img.shields.io/badge/Discord-Integration-blue) ![License](https://img.shields.io/badge/License-MIT-green)## Features



## ✨ Caratteristiche### Core Functionality

- **6 Ability Scores**: STR, DEX, CON, INT, WIS, CHA with input fields (1-30)

- **🎯 Tiri di Dado Automatici:** Clicca per tirare d20 + modificatore- **Automatic Modifier Calculation**: Shows modifier (+/-) based on ability scores

- **📊 Calcolo Modificatori:** Calcolo automatico dei modificatori dalle statistiche- **One-Click Rolling**: Click "Roll" buttons to roll d20 + modifier

- **🎮 Integrazione Discord:** Invia i risultati direttamente al tuo canale Discord- **Roll History**: Tracks all rolls with timestamps and results

- **📱 Design Responsivo:** Funziona su desktop e mobile- **Character Persistence**: Automatically saves character data to browser storage

- **💾 Salvataggio Automatico:** I dati del personaggio vengono salvati automaticamente

- **⌨️ Scorciatoie da Tastiera:** Alt+1-6 per tiri rapidi, Ctrl+D per Discord### Advanced Features

- **Visual Feedback**: Color-coded modifiers and special highlighting for nat 20s/1s

## 🚀 Demo Live- **Keyboard Shortcuts**: 

  - Alt + 1-6: Quick roll stats

**[▶️ Prova Subito il Programma](https://tuousername.github.io/dnd-character-stats)**  - Ctrl + R: Toggle Roll20 mode

  - Ctrl + H: Clear history

## 🎮 Come Usare- **Click-to-Copy**: Click any roll result to copy to clipboard

- **Responsive Design**: Works on desktop and mobile devices

1. **Apri il link della demo** sopra

2. **Inserisci il nome del personaggio**### Roll20 Integration

3. **Imposta le statistiche** (FOR, DES, COS, INT, SAG, CAR)- **Copy-to-Clipboard**: Automatic Roll20 command formatting

4. **Clicca "Roll"** per tirare i dadi- **Userscript Widget**: Floating widget directly in Roll20 interface

5. **Per Discord:** Abilita la modalità Discord e incolla l'URL del webhook- **Chat Commands**: Direct integration with Roll20 chat system



## 🔧 Setup Discord### Discord Integration

- **Webhook Support**: Send rolls directly to Discord text channels

1. Vai nelle impostazioni del tuo server Discord- **Rich Embeds**: Beautiful formatted messages with colors and emojis

2. **Integrazioni** → **Webhook** → **Nuovo Webhook**- **Automatic Detection**: Special formatting for natural 20s and 1s

3. Scegli il canale e copia l'URL del webhook- **Easy Setup**: Simple webhook configuration

4. Nel programma: **Abilita Modalità Discord** e incolla l'URL

5. I tiri appariranno automaticamente in Discord! 🎲## Installation & Setup



## ⌨️ Scorciatoie### Basic Usage

1. Install Node.js (version 14 or higher)

| Tasto | Azione |2. Open terminal in the project folder

|-------|--------|3. Run `npm install` to install dependencies

| Alt + 1 | Tira Forza |4. Run `npm start` to start the server

| Alt + 2 | Tira Destrezza |5. Open `http://localhost:3000` in your browser

| Alt + 3 | Tira Costituzione |6. Enter your character name and set ability scores

| Alt + 4 | Tira Intelligenza |7. Click "Roll" buttons to make ability checks

| Alt + 5 | Tira Saggezza |

| Alt + 6 | Tira Carisma |### Discord Integration Setup

| Ctrl + D | Attiva/Disattiva Discord |1. **Create Discord Webhook:**

| Ctrl + H | Cancella Cronologia |   - Go to your Discord server settings

   - Navigate to "Integrations" → "Webhooks"

## 🛠️ Installazione Locale   - Click "New Webhook"

   - Choose the text channel for rolls

```bash   - Copy the webhook URL

# Clona il repository

git clone https://github.com/tuousername/dnd-character-stats.git2. **Enable Discord Mode:**

   - Click "Enable Discord Mode" in the app

# Entra nella cartella   - Paste your webhook URL when prompted

cd dnd-character-stats   - All future rolls will be sent to Discord!



# Apri index.html nel browser o usa un server locale### Roll20 Integration - Method 1: Copy-Paste

python -m http.server 80801. Enable "Roll20 Mode" in the app

```2. Roll stats as normal

3. Commands are automatically copied to clipboard

## 🎯 Perfetto Per4. Paste into Roll20 chat



- **Sessioni D&D Remote** su Discord### Roll20 Integration - Method 2: Userscript (Advanced)

- **Sessioni Ibride** con giocatori online e offline  1. Install a userscript manager (Tampermonkey, Greasemonkey, etc.)

- **Tiri Veloci** durante il gioco2. Install the provided `roll20-userscript.js`

- **Trasparenza** - tutti vedono i risultati!3. Open Roll20 - the widget will appear automatically

4. Use the floating widget directly in Roll20

## 📄 Licenza

## File Structure

MIT License - Libero di usare e modificare!

```

## 🤝 Contributidnd-character-stats/

├── index.html          # Main application

I contributi sono benvenuti! Apri una Issue o una Pull Request.├── styles.css          # Styling and theme

├── script.js           # Core functionality

## 📞 Supporto├── server.js           # Node.js server for Discord integration

├── package.json        # Node.js dependencies

Hai problemi? Apri una [Issue](https://github.com/tuousername/dnd-character-stats/issues) su GitHub!├── roll20-userscript.js # Roll20 integration
└── README.md           # This file
```

## How to Use

### Setting Up Your Character
1. **Character Name**: Enter in the top field (auto-saved)
2. **Ability Scores**: Enter values 1-30 for each ability
3. **Modifiers**: Automatically calculated and color-coded:
   - Cyan: +3 or higher
   - Green: +1 to +2
   - White: 0
   - Orange: -1 to -2
   - Red: -3 or lower

### Making Rolls
1. **Click Roll Buttons**: Rolls d20 + modifier for that ability
2. **Use Keyboard Shortcuts**: Alt + number (1-6) for quick rolls
3. **View Results**: Shows in history with breakdown of roll components
4. **Copy Results**: Click any result to copy formatted text

### Roll20 Integration Options

#### Option 1: Manual Copy-Paste
1. Enable Roll20 Mode
2. Roll stats normally
3. Results auto-copy as Roll20 commands like: `/roll 1d20+3 Character STR Check`
4. Paste directly into Roll20 chat

#### Option 2: Userscript Widget
1. Install userscript manager (Tampermonkey recommended)
2. Add the `roll20-userscript.js` file as a new userscript
3. Configure to run on Roll20 domains:
   - `https://app.roll20.net/editor/`
   - `https://roll20.net/editor/`
4. Reload Roll20 to see the floating widget

### Userscript Features
- **Floating Widget**: Draggable stats panel in Roll20
- **Direct Chat Integration**: Rolls go straight to Roll20 chat
- **Minimize/Maximize**: Collapsible interface
- **Chat Commands**: Use `!stats [ability]` commands
- **Handout Integration**: Save/load character data (requires API)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Alt + 1 | Roll Strength |
| Alt + 2 | Roll Dexterity |
| Alt + 3 | Roll Constitution |
| Alt + 4 | Roll Intelligence |
| Alt + 5 | Roll Wisdom |
| Alt + 6 | Roll Charisma |
| Ctrl + R | Toggle Roll20 Mode |
| Ctrl + D | Toggle Discord Mode |
| Ctrl + H | Clear Roll History |

## Technical Details

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design

### Storage
- Uses localStorage for character persistence
- No server required - runs entirely in browser
- Data saved automatically on changes

### Roll20 Userscript Requirements
- Userscript manager (Tampermonkey, Greasemonkey, etc.)
- Roll20 Pro account (recommended for full API features)
- Modern browser with userscript support

## Troubleshooting

### Common Issues

**Userscript not loading:**
- Verify userscript manager is installed and enabled
- Check that the script matches Roll20 URLs exactly
- Refresh Roll20 page after installing script

**Rolls not appearing in Roll20:**
- Ensure you're in a Roll20 game (not just campaign page)
- Check that chat is visible and functional
- Try typing manually first to test chat

**Character data not saving:**
- Check browser privacy settings
- Ensure localStorage is enabled
- Try clearing browser cache and re-entering data

### Contact & Support
This is a standalone application - modify the code as needed for your specific requirements.

## Customization

### Adding New Features
- Modify `script.js` for new functionality
- Update `styles.css` for visual changes
- Extend userscript for additional Roll20 features

### Theming
- Edit CSS variables for color schemes
- Modify font families and sizes
- Add animations and transitions

### Roll20 Enhancements
- Add support for other dice types
- Integrate with character sheets
- Create macros for complex rolls

## License

Free to use and modify for personal and commercial purposes.