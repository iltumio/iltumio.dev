# Manuel Tumiati - Personal Website

A single page application (SPA) built with Leptos (Rust) showcasing the professional profile of Manuel Tumiati, Web3 CTO & Blockchain Engineer.

## 🚀 Features

- **Pure Client-Side SPA**: No server-side rendering, runs entirely in the browser
- **Built with Leptos**: Modern Rust web framework for WebAssembly
- **Tailwind CSS**: Beautiful, responsive design with modern UI components
- **Professional Portfolio**: Showcases current positions, technical skills, and contact information

## 🏗 Project Structure

```
.
├── src/
│   ├── lib.rs              # Main library entry point
│   ├── app.rs              # Root app component
│   └── components/
│       ├── mod.rs          # Component module exports
│       ├── header.rs       # Header with profile info
│       ├── current_jobs.rs # Current positions section
│       ├── skills.rs       # Technical skills grid
│       ├── cta.rs          # Call-to-action section
│       ├── social.rs       # Social media links
│       ├── skill.rs        # Individual skill component
│       ├── job_position.rs # Job position card
│       └── icons.rs        # SVG icon components
├── index.html              # Entry HTML file
├── Cargo.toml              # Rust dependencies
└── pkg/                    # Generated WebAssembly files
```

## 🛠 Build Instructions

### Prerequisites

- Rust toolchain (latest stable)
- `wasm-pack` for WebAssembly compilation
- `cargo-leptos` (optional, for advanced features)

### Building the Project

1. **Install wasm-pack** (if not already installed):
   ```bash
   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
   ```

2. **Build the WebAssembly package**:
   ```bash
   wasm-pack build --target web --out-dir pkg
   ```

3. **Serve the application**:
   ```bash
   python3 -m http.server 8000
   ```

4. **Open in browser**:
   Navigate to `http://localhost:8000`

## 🎯 Key Components

### Header
Displays profile picture, name, title, description, and social media links.

### Current Jobs
Shows current professional positions with company details and descriptions.

### Skills
Grid layout displaying technical expertise including:
- Rust
- Solidity
- TypeScript
- Web3 Technologies
- Zero-Knowledge Proofs
- Blockchain Architecture

### Call-to-Action
Contact section with email and calendar scheduling links.

## 🔧 Technical Details

- **Framework**: Leptos 0.7 with client-side rendering (CSR)
- **Language**: Rust compiled to WebAssembly
- **Styling**: Tailwind CSS via CDN
- **Icons**: Custom SVG components
- **Build Output**: Static files ready for deployment

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🚀 Deployment

The built application consists of static files that can be deployed to any static hosting service:

- `index.html` - Entry point
- `pkg/` - WebAssembly files and JavaScript bindings
- No server required

Compatible with:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any static hosting provider

## 📞 Contact

**Manuel Tumiati**
- Email: manuel@zyphe.com
- LinkedIn: [manuel-tumiati-94a13a154](https://www.linkedin.com/in/manuel-tumiati-94a13a154/)
- GitHub: [Meschreiber](https://github.com/Meschreiber)
- Twitter: [ManuelTumiati](https://twitter.com/ManuelTumiati)

---

*Redefining digital identity with seamless, innovative solutions for everyone at Zyphe Inc*
