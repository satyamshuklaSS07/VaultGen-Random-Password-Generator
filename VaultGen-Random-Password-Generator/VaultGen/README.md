# VaultGen — Random Password Generator

A polished, responsive password generator built for the VEDA Technology internship task.

## Features
- Adjustable password length: 4–64 characters
- Uppercase, lowercase, numbers and symbols
- Guarantees at least one character from each selected type
- Secure randomness with the Web Crypto API
- Strength indicator
- One-click copy to clipboard
- Responsive mobile/desktop layout
- Animated 3D/8D-inspired glass UI
- No backend and no password storage

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript
- Web Crypto API

## Run
Open `index.html` in a modern browser.

## Security note
`Math.random()` is intentionally not used for password generation. The Web Crypto API provides stronger randomness suitable for client-side password generation.

## Interview points
**How is the character pool built?**  
The selected checkbox categories are mapped to character sets and concatenated into one pool.

**How is an empty selection handled?**  
Generation stops and the interface asks the user to select at least one character type.

**Why not Math.random()?**  
`Math.random()` is not designed to provide cryptographically secure randomness. This project uses `crypto.getRandomValues()` instead.

## Deliverables
- Length slider
- Character-type checkboxes
- Generated password display
- Copy-to-clipboard button
