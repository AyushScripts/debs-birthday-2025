# 💕 Scrapbook App

A beautiful, interactive scrapbook application built with Next.js, TypeScript, and TailwindCSS. Perfect for creating and organizing special memories with draggable polaroid-style photo cards.

## ✨ Features

- 🖼️ **Draggable Polaroid Cards** - Drag and drop photos anywhere on the canvas
- ✏️ **Editable Captions** - Add personalized captions to each photo
- 🔄 **Rotation Controls** - Rotate photos left or right (15° increments)
- 🔍 **Scale Controls** - Zoom in/out on photos (0.5x to 2x)
- 💾 **Auto-Save** - All changes are automatically saved to LocalStorage
- ➕ **Add Photos** - Easily add new photos to your scrapbook
- 🔄 **Reset Layout** - Clear everything and start fresh
- 📥 **Export JSON** - Download your scrapbook data as JSON

## 🚀 Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Add your photos to the `public/photos/` directory:
   - `photo1.jpg`
   - `photo2.jpg`
   - `photo3.jpg`
   
   (You can add more photos and reference them in the code)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
debs-birthday/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles with Tailwind
├── components/
│   ├── Scrapbook.tsx       # Main scrapbook component
│   └── PhotoCard.tsx       # Individual photo card component
├── types/
│   └── index.ts            # TypeScript type definitions
├── utils/
│   └── storage.ts          # LocalStorage utilities
├── public/
│   └── photos/             # Your photos go here
└── package.json
```

## 🎨 Customization

### Changing Default Photos

Edit `components/Scrapbook.tsx` and modify the `DEFAULT_PHOTOS` array to change the initial photos and their positions.

### Styling

The app uses TailwindCSS with custom gradients and colors. You can customize:
- Colors in `tailwind.config.js`
- Styles in `app/globals.css`
- Component styles in individual component files

## 💾 Data Persistence

All scrapbook data is automatically saved to LocalStorage with the key `scrapbook.photos.v1`. The data persists across browser sessions.

## 📦 Export

Click the "Export JSON" button to download your scrapbook data as a JSON file. This includes all photos, positions, captions, rotations, and scales.

## 🛠️ Built With

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework
- **React Draggable** - Drag and drop functionality

## 📝 License

Made with ❤️ for a special birthday!

