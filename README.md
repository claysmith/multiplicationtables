# Times Tables

A multiplication table memorization app built with Expo SDK 56. Tests multiplication facts with a configurable number range, tracks wrong answers, and offers targeted practice mode.

## Tech Stack

- **Expo SDK 56** with Expo Router (file-based routing)
- **React Native 0.85** + **TypeScript 6**
- **react-native-reanimated** (animations)
- **NativeTabs** tab navigator (iOS/Android) + expo-router/ui tabs (web)
- **@expo/ui** components

## Project Structure

```
src/
├── app/
│   ├── _layout.tsx         Root layout — ThemeProvider + PracticeProvider + tab navigator
│   ├── index.tsx           Practice screen — the quiz (with timer support)
│   └── explore.tsx         Settings — color scheme, theme, number range, timer, practice mgmt
├── components/
│   ├── app-tabs.tsx        Native tab bar ("Practice" / "Settings")
│   ├── app-tabs.web.tsx    Web tab bar
│   ├── themed-view.tsx     Themed <View> wrapper
│   ├── themed-text.tsx     Themed <Text> wrapper with preset typography styles
│   └── animated-icon.tsx   Splash overlay + animated logo
├── contexts/
│   ├── theme-context.tsx    ThemeProvider: color scheme + dark/light/system override
│   └── practice-context.tsx PracticeProvider: wrong-fact tracking, practice mode, number range, timer
├── constants/
│   └── theme.ts            Color palettes (5 schemes × light/dark), fonts, spacing scale
├── hooks/
│   ├── use-color-scheme.ts       Resolved color scheme from theme context (native)
│   ├── use-color-scheme.web.ts   Web version with SSR hydration guard
│   └── use-theme.ts              Returns palette for current color scheme + mode
└── global.css               Web-only CSS custom properties for fonts
```

## Features

### Quiz

- **Practice tab** shows a random multiplication question within the configured number range
- Type the answer and tap **Submit** (or press Return/Enter on keyboard)
- Green feedback for correct, red for wrong (shows the correct equation)
- Running score: correct count, total attempts, and percentage
- **Next →** advances to the next question

### Configurable Number Range

Set the range of factors in Settings → **Number Range**:

| Control | Default | Bounds |
|---------|---------|--------|
| Min     | 1       | 1 to (max − 1) |
| Max     | 12      | (min + 1) to 20 |

Use the − / + steppers to adjust. The header on the Practice tab shows the current range (e.g. "1–12").

### Countdown Timer

In Settings → **Timer**, tap to enable. Choose **3–30 seconds** per question.

- A progress bar shrinks from green → yellow → red as time runs out
- When time expires, the answer is marked wrong and the fact is added to the practice pool
- Timer resets for each new question

### Practice Failed Mode

Every wrong answer is tracked in the `PracticeContext`. When **Practice Failed** is enabled in Settings, the quiz draws only from facts you've gotten wrong (within the current range).

- Each fact must be answered correctly **3 times in a row** to be considered mastered
- Getting a wrong answer resets the streak to 0
- A badge in the header shows how many facts remain (e.g. **"3 left"**)
- When all facts are mastered, an **"All mastered!"** screen appears
- The Settings screen lists every tracked fact with its progress (e.g. "7 × 8 — 2/3 correct")
- **Reset practice progress** clears all tracked facts

### Color Schemes

Choose from 5 color palettes in Settings → **Color Scheme**:

| Scheme    | Light mode feel        | Dark mode feel         |
|-----------|------------------------|------------------------|
| Default   | Neutral grays          | Dark grays             |
| Ocean     | Blue-tinted            | Deep navy              |
| Forest    | Green-tinted           | Dark forest            |
| Sunset    | Warm cream             | Dark warm              |
| Midnight  | Purple-tinted          | Deep purple            |

Default is the default.

### Theme

Switch between **Dark**, **Light**, or **System** in Settings → **Appearance**. The `ThemeContext` manages the preference and exposes the resolved mode. All themed components (`ThemedView`, `ThemedText`, `useTheme` hook) automatically adapt.

### Icons

- Blue rounded-square background with a white plus sign
- Generated at 1024×1024 for the main app icon
- Android adaptive icons: foreground (transparent + blue plus), background (solid blue), monochrome (white plus)
- Splash screen: white plus on the `#208AEF` background

## Development

```bash
npm install
npx expo start              # Expo Go / web dev server
npx expo run:ios            # Native iOS development build
npx expo run:android        # Native Android development build
```

### EAS Build (Expo Cloud)

```bash
npm install -g eas-cli
eas login
eas build:configure

eas build --profile development --platform ios
eas build --profile production --platform ios
```

Requires a `development` profile in `eas.json`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

## Scripts

| Script            | Description                |
|-------------------|----------------------------|
| `npm start`       | Start Expo dev server      |
| `npm run ios`     | Start with iOS target      |
| `npm run android` | Start with Android target  |
| `npm run web`     | Start with web target      |
| `npm run lint`    | Run ESLint                 |
| `npm run reset-project` | Reset to blank project |

## Requirements

- **Node.js** 18+
- **Xcode** 16+ (for iOS builds)
- **Expo Go** 56+ or a development build
