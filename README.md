# एक कप चाय (Ek Cup Chai) ☕
> **A Soothing 90s Roadside Chai Stall Nostalgia Experience**

Welcome to **एक कप चाय**, a premium interactive ambient web experience designed to transport you back to a cozy dusk at a classic 90s Indian roadside tea stall (*Chai Tapri*). Enjoy the comforting sounds, read a vintage newspaper, watch the ticking analog wall clock, and listen to a curated cassette tape loop of timeless retro Hindi hits.

---

## 📻 Key Features

### 1. Retro Walkman Cassette Player
* **9 Classic Retro Hits**: Loaded with a single-loop tape playing classics like *Ajeeb Dastaan Hai Yeh*, *Pal Pal Dil Ke Paas*, *Abhi Na Jao Chhod Kar*, and more.
* **Mechanical Casing & Buttons**: Brushed metallic Walkman aesthetics with satisfying tactile buttons that sink physically when pressed, complete with functional LED indicator dots.
* **Animated Tape Window**: Two cassette gear cogs that spin dynamically in real-time when the music is playing.
* **Backlit LCD Dashboard**: A glowing amber display panel featuring a color-graded bouncing LED VU meter (Green/Amber/Red) that reacts during playback.
* **Radio Dial Tuner**: A frequency slider progress bar with a bright red sweeping tuner needle.

### 2. Retro Analog Clock
* A classic wall clock hanging in the top-left corner.
* Features a stylized brass bezel (`border: 4px solid #4a3525`) and notched indicators.
* Ticks in real-time with independent Hour, Minute, and Second sweeping hands.
* Tilted slightly (`transform: rotate(-1deg)`) to capture the imperfect, rustic charm of a roadside stall.

### 3. Interactive Chai Tapri Scene
* **Bulb Toggle**: Click the hanging bulb in the center of the stall to toggle its warm glow.
* **Tea Kettle**: Click the kettle to release puffs of steam accompanied by a boiling sound.
* **Cutting Chai Glasses**: Click the glasses to hear the comforting sound of hot tea being poured.
* **1996 Newspaper**: Click the folded newspaper on the table to open a readable modal containing period-accurate headlines and nostalgia snippets.
* **Listener Slate**: A hand-written chalkboard slate in the top-right counting the nostalgic souls listening in.

---

## 🛠️ Technology Stack
* **Framework**: React 19 + Vite 8
* **Styling**: Vanilla CSS for detailed 3D bevels, glows, and custom animations.
* **Audio Engine**: Web Audio API & HTML5 Audio for seamless button clicks, ambient sounds, and local audio playback.
* **Artwork Lookup**: Integrated iTunes API and Spotify Client Credentials flow to dynamically search and load authentic album cover art.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Md-Arif-hasnat99/EkCupChai.git
   cd EkCupChai
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the local Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Build
Generate the optimized production build:
```bash
npm run build
```
The output files will be located in the `dist/` directory.

---

## 🎶 Curated Tracklist (Tape A & B)
1. **Ajeeb Dastaan Hai Yeh** – Lata Mangeshkar (*Dil Apna Aur Preet Parai*, 1960)
2. **Mere Samne Wali Khidki Mein** – Kishore Kumar (*Padosan*, 1968)
3. **Ek Ladki Bheegi Bhagi Si** – Kishore Kumar (*Chalti Ka Naam Gaadi*, 1958)
4. **Aaja Re Pardesi** – Lata Mangeshkar (*Madhumati*, 1958)
5. **Chalo Ek Bar Phir Se** – Mahendra Kapoor (*Gumrah*, 1963)
6. **Pal Pal Dil Ke Paas** – Kishore Kumar (*Blackmail*, 1973)
7. **Pyar Kiya To Darna Kya** – Lata Mangeshkar (*Mughal-E-Azam*, 1960)
8. **Abhi Na Jao Chhod Kar** – Dev Anand & Sadhana (*Hum Dono*, 1961)
9. **Ae Mere Humsafar** – Aamir Khan & Juhi Chawla (*Qayamat Se Qayamat Tak*, 1988)

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Made with love for chai and 90s nostalgia.* ☕✨
