## Bloxtax — Full-stack Technical Assignment

**High-performance crypto transaction management with real-time sync and optimized financial UX.**

a professional-grade dashboard designed to track and manage crypto transactions across multiple networks. This project focuses on data integrity, layout stability, and a seamless user experience.

---

## ✨ Key Features

### 🔍 Smart Search & Filtering
* **Advanced Debounce Strategy**: Implemented a 500ms debounce logic with immediate visual feedback (`isTyping` state), reducing server load while remaining highly responsive.
* **URL as Source of Truth**: Full synchronization between the UI state and URL parameters. Supports browser navigation (back/forward) and deep-linking with filters applied.

### 💎 Crypto-Optimized UI
* **Layout Stability (Anti-Jank)**: Prevents annoying layout shifts (CLS) by using stable containers and opacity transitions during data fetching.
* **Intelligent Data Truncation**: Blockchain addresses and transaction hashes are smartly truncated with **Hover-to-Reveal** tooltips and one-click copy functionality.
* **Semantic Coloring**: Instant visual recognition of transaction types:
  * <span style="color: #10b981;">**Emerald**</span> for Buy/Incoming.
  * <span style="color: #f43f5e;">**Rose**</span> for Sell/Outgoing.
  * **Muted Gray** for Fees and metadata.

### 📱 Responsive Architecture
* **Wide-Screen Ledger**: Optimized for desktop with a `1920px` max-width terminal view.
* **Adaptive Mobile Cards**: Automatically transforms complex tables into detailed, readable cards for mobile users.

---

## 🛠 Tech Stack

* **Runtime**: [Bun](https://bun.sh/)
* **Frontend**: React + Tailwind CSS
* **Icons**: Lucide React
* **Components**: Radix UI / Shadcn
* **Database**: SQLite + Drizzle ORM

---

## ⚙️ Development Highlights

### **Code Modularity**
The project follows a "Separation of Concerns" principle. Complex UI logic is extracted into custom hooks (e.g., `useSearchDebounce`) and atomic components (e.g., `CopyButton`, `TruncatedMonoTooltip`), ensuring the codebase is clean and maintainable.

### **Comprehensive Schema Coverage**
The explorer supports a full array of blockchain metadata:
- **Financials**: Buy/Sell amounts, Token symbols, Currencies, and Fees.
- **Traceability**: Transaction Hashes, Block Heights, and Smart Contracts.
- **Routing**: Sender and Receiver addresses with grouping logic.
- **Context**: Timestamps and custom user Comments.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
bun install
````

### 2. Run Development Server
```bash 
bun dev
```

### 3. Build for Production
```bash
bun build
