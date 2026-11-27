# Vocal Warm-up Studio — Android APK & Web Project

**Vocal Warm-up Studio** (`com.vocalwarmup.studio`) is a bilingual (Bengali + English) vocal training, recitation, live pitch analysis, and recording studio packaged for Android via **Capacitor 8** with automated **GitHub Actions** APK builds and **GitHub Releases**.

---

## Preserved Features & Android Native Capabilities

- **50 Guided Vocal Exercises** across breathing, resonance, posture, pitch glide, articulation, and cool-down.
- **Bengali Poetry Diction Lab (২০ শব্দ)** & **38 Tongue Twisters** with direct studio recording handoff.
- **8 Customizable Daily Routines**, audio-guided practice player, streak tracking, and 90-day activity heatmap.
- **Live YIN Pitch Analyzer** (Hz, Western note, Indian Sargam, cents deviation, pitch contour canvas) + **Real-Time Microphone Wave Volume Meter**.
- **Realistic Physical-Modeling Acoustic Tanpura** & ambient background soundscapes.
- **Native Android Support via Capacitor**:
  - Runtime permissions for `RECORD_AUDIO`, `CAMERA`, `MODIFY_AUDIO_SETTINGS`, and Android 12–15+ storage (`READ_MEDIA_AUDIO`).
  - Hardware Back Button navigation (`@capacitor/app`) across views, player overlay, and lightbox.
  - Native `.WAV` / audio export to `Documents/VocalWarmupStudio` (`@capacitor/filesystem`) and native Android Share sheet (`@capacitor/share`).
  - Video posture mirror using front camera (`getUserMedia`).

---

## Repository Structure

```text
├── .github/
│   └── workflows/
│       └── build-apk.yml          # Automated APK build & GitHub Release workflow
├── android/                       # Native Android Gradle & Capacitor project
│   ├── app/
│   │   ├── build.gradle           # Versioning & GitHub Secrets release signing
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/com/vocalwarmup/studio/MainActivity.java
│   │       └── res/xml/file_paths.xml
│   ├── build.gradle
│   ├── gradle/wrapper/
│   └── gradlew
├── src/                           # React + TypeScript + Tailwind frontend
├── capacitor.config.ts            # Capacitor configuration (com.vocalwarmup.studio)
├── index.html
├── package.json
└── vite.config.ts
```

---

## 1. Upload Project from Google AI Studio to GitHub

1. In Google AI Studio, open the **Export** menu and click **Download ZIP** (or export to GitHub directly if connected).
2. Extract the downloaded ZIP folder on your computer and open a terminal inside the project root.
3. Create a new empty repository on [GitHub](https://github.com/new) (for example: `vocal-warmup-studio`). Do **not** initialize it with a README or `.gitignore`.
4. Push the project to the `main` branch:

```bash
git init
git add .
git commit -m "Initial Vocal Warm-up Studio Android Capacitor setup"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

As soon as you push to `main`, GitHub Actions automatically runs **Build & Release Android APK** and uploads the APK under **Actions → Artifacts**.

---

## 2. Configure Persistent Release Signing (Recommended)

If no signing secrets are set, GitHub Actions signs the APK with an ephemeral CI key so it is still immediately installable. However, **to allow users to install future updates without uninstalling the previous version**, configure a persistent release keystore in GitHub Secrets:

### Step A: Generate a Release Keystore (one-time on your PC)

```bash
keytool -genkeypair -v \
  -keystore vocal-warmup-release.jks \
  -alias vocal-warmup-key \
  -keyalg RSA -keysize 2048 -validity 10000
```

Encode the `.jks` file to Base64 (keep the `.jks` file and passwords private—never commit them to Git):

- **macOS / Linux:**
  ```bash
  base64 -i vocal-warmup-release.jks | tr -d '\n'
  ```
- **Windows PowerShell:**
  ```powershell
  [Convert]::ToBase64String([IO.File]::ReadAllBytes("vocal-warmup-release.jks"))
  ```

### Step B: Add 4 GitHub Repository Secrets

Go to **GitHub Repository → Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret Name | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | Base64 output from Step A |
| `ANDROID_KEYSTORE_PASSWORD` | Your keystore password |
| `ANDROID_KEY_ALIAS` | `vocal-warmup-key` (or the alias you chose) |
| `ANDROID_KEY_PASSWORD` | Your key password |

---

## 3. Create Your First GitHub Release (Auto-Builds & Attaches APK)

### Option A: Browser-Only (No Terminal Commands Required)
1. Open your GitHub repository in a browser and click **Releases → Create a new release**.
2. Click **Choose a tag**, type `v1.0.0`, and select **Create new tag: v1.0.0 on publish**.
3. Click **Publish release**.
4. Wait 2–3 minutes for **Actions → Build & Release Android APK** to finish—the signed `Vocal-Warm-up-Studio-v1.0.0.apk` will automatically appear under that release's **Assets**.

### Option B: Via Git CLI
```bash
git tag v1.0.0
git push origin v1.0.0
```

### What the CI Pipeline (`.github/workflows/build-apk.yml`) Does
1. Sets up **Node.js 22**, **Java 21 (Temurin)**, **Android SDK**, and **Gradle**.
2. Runs `npm run build` and `npx cap sync android` to bundle the web frontend into Capacitor Android.
3. Configures release signing from your 4 GitHub Secrets (or generates a one-time ephemeral CI keystore so the APK remains installable when secrets are not yet configured).
4. Compiles `./gradlew assembleRelease` and uploads `Vocal-Warm-up-Studio-v<version>.apk` as a **GitHub Actions Artifact** (available on `main` pushes, `v*` tag pushes, and manual **Run workflow** triggers).
5. On `v*` tag pushes, automatically creates/updates the **GitHub Release** with release notes and attaches the `.apk` file using `GITHUB_TOKEN`.

---

## 4. Download & Install the APK on Android

1. Open your GitHub repository on your Android phone and tap **Releases** (on the right/bottom of the repo page).
2. Under **Assets** of the latest release (e.g., `v1.0.0`), tap **`Vocal-Warm-up-Studio-v1.0.0.apk`** to download.
3. Open the downloaded `.apk` from your notifications or Files app.
4. If Android asks for permission, tap **Settings → Allow from this source** ("Install unknown apps"), then tap **Install**.
5. Launch **Vocal Warm-up Studio** and grant Microphone/Camera permissions when using the Studio tab.

---

## Local APK Build (Optional)

Requires **Node.js 20+**, **Java 21**, and **Android SDK**:

```bash
npm install
npm run cap:sync
cd android
./gradlew assembleRelease
```

The APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk` (unsigned locally unless `ANDROID_KEYSTORE_*` env vars are exported, or run `./gradlew assembleDebug` for a debug-signed APK).
