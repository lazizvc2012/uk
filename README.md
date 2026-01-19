
# Online Avtobus (Booking)

Premium bus ticket booking application for the **Toshkent → Navoiy** route.

## Features
- **Visual Seat Map**: Interactive 2x2 layout with 44 seats.
- **Seat States**: Real-time tracking of available, selected, and booked seats.
- **Booking Flow**: Multi-step process (Selection -> Info -> Demo Payment -> Success).
- **Client-side Validation**: Robust form handling using React Hook Form and Zod.
- **Data Persistence**: Uses LocalStorage to save bookings across sessions.
- **Uzbek UI**: Fully localized interface.
- **Modern Design**: Clean yellow/black palette with Ubuntu typography.

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (Animations)
- React Hook Form
- Zod

## Setup
1. Clone or download the source code.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Demo Passport Format
When booking, use the following format for the passport number: `AA1234567` (2 letters + 7 digits).
