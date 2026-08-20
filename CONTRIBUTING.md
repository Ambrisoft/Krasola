# Contributing to Krasola

Thank you for your interest in contributing to **Krasola**! We welcome contributions ranging from new vector pattern formulas, accessibility enhancements, color harmony models, to bug fixes and documentation improvements.

---

## 🧭 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 🛠️ Development Workflow

### 1. Fork & Clone
1. Fork the repository on GitHub: [`https://github.com/Ambrisoft/Krasola`](https://github.com/Ambrisoft/Krasola).
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Krasola.git
   cd Krasola
   ```

### 2. Create a Feature Branch
Always branch off `main`:
```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/your-bug-fix
```

### 3. Local Setup & Testing
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Test production build before committing:
   ```bash
   npm run build
   ```

---

## 📝 Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature or creative studio addition
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style/formatting changes (no logic changes)
- `refactor:` Code refactoring (neither fixes a bug nor adds a feature)
- `perf:` Performance improvements
- `test:` Adding or updating tests

*Example:*
```bash
git commit -m "feat(pattern): add isometric honeycomb vector formula"
```

---

## 📬 Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against the `main` branch on the official repository.
3. Fill out the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
4. Ensure all continuous integration (CI) checks pass.

Thank you for helping make Krasola better for creators worldwide!
