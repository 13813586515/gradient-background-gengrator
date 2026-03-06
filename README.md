# Gradient Background Generator

A powerful Next.js application for creating stunning SVG gradient backgrounds with real-time preview, interactive color wheel, and AI-powered color harmony recommendations.

## Features

- **Real-time Preview**: See your gradient backgrounds update instantly as you modify colors
- **Interactive Color Wheel**: Visual color selection with drag-and-drop support
- **Dual Selection Modes**:
  - **Free Selection Mode**: Manually pick colors on the color wheel
  - **Recommendation Mode**: AI-powered color harmony suggestions based on color theory
- **Color Harmony Algorithms**: 7 professional color harmony schemes
  - Complementary (互补色)
  - Analogous (类似色)
  - Triadic (三色组)
  - Split Complementary (分裂互补色)
  - Tetradic (四色组)
  - Square (方形配色)
  - Monochromatic (单色系)
- **Preset Templates**: Choose from professionally designed color combinations
- **API Integration**: Generate gradients programmatically via REST API
- **SVG Export**: Download your creations as high-quality SVG files
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

Read the documentation at https://opennext.js.org/cloudflare.

## Develop

Run the Next.js development server:

```bash
npm run dev
# or similar package manager command
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Testing

Run the test suite to verify color utility functions:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npx jest src/lib/__tests__/colorUtils.test.ts
```

### Test Coverage

The test suite covers:
- ✅ Hex ↔ HSL color conversion
- ✅ Complementary color generation
- ✅ Analogous color generation
- ✅ Triadic color generation
- ✅ Split complementary color generation
- ✅ Tetradic color generation
- ✅ Square color generation
- ✅ Monochromatic color generation
- ✅ Color wheel position calculations
- ✅ Edge case handling
- ✅ Color harmony validation

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or similar package manager command
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or similar package manager command
```

## Custom Domain

The deployed application is available at:

**gbg.nuclearrockstone.xyz**

Configure your DNS and Cloudflare settings accordingly (add the appropriate CNAME/A records and route the domain to your Cloudflare deployment).

## API Usage

Generate gradients programmatically using the REST API:

```
GET https://gbg.nuclearrockstone.xyz/api?colors=hex_FF0000&colors=hex_00FF00&width=800&height=600
```

### Parameters:
- `colors`: Hex colors with `hex_` prefix (e.g., `hex_FF0000` for red)
- `width`: Image width in pixels (100-2000)
- `height`: Image height in pixels (100-2000)

## Color Selection Features

### Color Wheel Interface
The application features an interactive color wheel that allows you to:
- **Click** on the wheel to add new colors
- **Drag** existing color indicators to adjust their values
- **Visual feedback**: Colors are positioned based on their hue and saturation

### Selection Modes

#### 1. Free Selection Mode (自由选择)
- Manually select colors by clicking or dragging on the color wheel
- Distance from center controls saturation (center = low saturation, edge = high saturation)
- Angular position controls hue
- Add up to 8 colors for your gradient

#### 2. Recommendation Mode (推荐选择)
- Select a base color on the wheel
- The system automatically generates harmonious color combinations
- Choose from 7 color harmony schemes:
  - **Complementary**: High contrast, visually striking
  - **Analogous**: Harmonious and comfortable to the eye
  - **Triadic**: Rich colors, well-balanced
  - **Split Complementary**: Strong contrast but less intense
  - **Tetradic**: Rich and colorful, needs careful balancing
  - **Square**: Four evenly distributed colors
  - **Monochromatic**: Clean, elegant, layered look

### Color Harmony Theory

The recommendation system is based on established color theory principles:

| Harmony Type | Description | Hue Relationship |
|--------------|-------------|------------------|
| Complementary | Colors opposite on the color wheel | 180° apart |
| Analogous | Colors adjacent on the color wheel | 30° apart |
| Triadic | Three evenly spaced colors | 120° apart |
| Split Complementary | Base color + two adjacent to its complement | Base ± 150° |
| Tetradic | Four colors forming a rectangle | 0°, 60°, 180°, 240° |
| Square | Four evenly spaced colors | 90° apart |
| Monochromatic | Variations of a single hue | Same hue, different lightness |

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main page
├── components/
│   ├── ui/            # UI components
│   └── ColorWheel.tsx # Color wheel component
├── hooks/
│   └── useGradientGenerator.tsx
├── lib/
│   ├── services/
│   │   └── gradientGenerator.ts
│   ├── __tests__/     # Test files
│   ├── colorUtils.ts  # Color theory algorithms
│   ├── constants.ts   # Color presets
│   └── utils.ts       # Utility functions
```

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Testing**: Jest + ts-jest
- **Deployment**: Cloudflare Pages

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Color Theory](https://en.wikipedia.org/wiki/Color_theory) - understand the science behind color harmonies.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## License

MIT License - feel free to use this project for personal or commercial purposes.
