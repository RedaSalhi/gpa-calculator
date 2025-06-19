# GPA Calculator

A beautiful and feature-rich GPA calculator app built with React Native and Expo, featuring an interactive theme system with 7 stunning themes.

## Features

### GPA Calculation
- **Multiple Grading Systems**: US (4.0), ECTS European, UK Classification, Percentage
- **Semester Management**: Add, delete, and organize courses by semester
- **Real-time Calculations**: Instant GPA updates as you add courses
- **Target GPA Calculator**: Calculate required GPA to reach your target
- **Cumulative GPA Tracking**: Overall GPA across all semesters

### Interactive Theme System
- **7 Beautiful Themes**:
  - Classic Blue (Default)
  - Dark Mode
  - Ocean Blue
  - Sunset Orange
  - Forest Green
  - Royal Purple
  - Minimal Gray
- **Instant Theme Switching**: No reload required
- **Persistent Storage**: Your theme choice is remembered
- **Visual Previews**: See theme colors before applying

### User Experience
- **Modern UI Design**: Clean, intuitive interface
- **Responsive Layout**: Works on all screen sizes
- **Data Export**: Share your GPA report
- **Data Persistence**: All data saved locally
- **Touch Gestures**: Long press to delete semesters

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gpa-calculator.git
   cd gpa-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## How to Use

### Adding Courses
1. Select your grading system (US, ECTS, UK, or Percentage)
2. Enter course name, grade, and credit hours
3. Tap "Add Course" to add it to the current semester

### Managing Semesters
1. Tap the semester tabs to switch between semesters
2. Tap "+ Add" to create a new semester
3. Long press a semester tab to delete it

### Changing Themes
1. Tap the theme button in the header
2. Browse through available themes
3. Tap any theme to apply it instantly

### Target GPA Calculator
1. Tap "Target GPA" button
2. Enter your target GPA and additional credits
3. Get the required GPA you need to maintain

## Technical Details

### Built With
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **AsyncStorage**: Local data persistence
- **React Hooks**: State management and effects

### Project Structure
```
GPACalculator/
├── App.js                 # Main application component
├── components/
│   └── ThemeSwitcher.js   # Theme selection modal
├── constants/
│   └── Colors.js          # Theme definitions and colors
├── hooks/
│   └── useTheme.js        # Theme management hook
├── assets/                # Images and fonts
└── package.json           # Dependencies and scripts
```

### Theme System Architecture
- **Dynamic Styling**: All UI elements respond to theme changes
- **Memoized Components**: Optimized re-rendering
- **Persistent Storage**: Theme preferences saved locally
- **Type-safe Colors**: Comprehensive color palette for each theme

## Theme System

The app features a sophisticated theme system with:

- **Primary Colors**: Main brand colors for headers and buttons
- **Secondary Colors**: Supporting colors for accents
- **Background Colors**: App background and card surfaces
- **Text Colors**: Primary and secondary text colors
- **Status Colors**: Success, warning, error, and info colors
- **Interactive Elements**: Button, input, and border colors

Each theme is carefully designed for:
- **Accessibility**: High contrast ratios
- **Readability**: Clear text and element distinction
- **Aesthetics**: Beautiful, cohesive color schemes
- **Functionality**: All features work perfectly with any theme

## Grading Systems

### US (4.0 Scale)
- A+, A: 4.0 | A-: 3.7
- B+, B: 3.0 | B-: 2.7
- C+, C: 2.0 | C-: 1.7
- D+, D: 1.0 | F: 0.0

### ECTS European
- A: 4.0 | B: 3.0 | C: 2.0
- D: 1.0 | E: 0.5 | F: 0.0

### UK Classification
- First: 4.0 | 2:1: 3.3 | 2:2: 2.7
- Third: 2.0 | Pass: 1.0 | Fail: 0.0

### Percentage (100 Scale)
- 90-100: 4.0 | 80-89: 3.0
- 70-79: 2.0 | 60-69: 1.0 | 0-59: 0.0

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with React Native and Expo
- Icons and design inspiration from modern mobile apps
- Color palettes inspired by Material Design and iOS design guidelines

## Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with care for students everywhere**
