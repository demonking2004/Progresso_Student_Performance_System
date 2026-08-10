# Progresso - React Student Performance System

A modern React-based student performance tracking application, converted from the original HTML/CSS/JavaScript project.

## Project Structure

```
react-sps/
├── public/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Header.tsx       # Navigation header
│   │   └── Footer.tsx       # Footer component
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx     # Home/Dashboard page
│   │   ├── LoginPage.tsx    # Login/Authentication page
│   │   ├── AboutPage.tsx    # About page with team info
│   │   ├── AssignmentsPage.tsx  # Assignments listing
│   │   └── ProfilePage.tsx  # User profile management
│   ├── contexts/            # React Context for state management
│   │   └── ThemeContext.tsx # Dark mode theme management
│   ├── data/                # Static data
│   │   └── assignments.json # Sample assignments data
│   ├── styles/              # CSS files
│   │   └── tailwind.css     # Tailwind CSS imports
│   ├── App.js               # Main app component with routing
│   └── index.js             # React entry point
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Project dependencies
```

## Features

✨ **Modern React Architecture**
- Component-based UI structure
- React Router for navigation
- Context API for state management
- TypeScript support (optional)

🎨 **Responsive Design**
- Tailwind CSS for styling
- Mobile-first approach
- Dark mode support

📱 **Pages Included**
- **Home Dashboard**: View GPA, courses, and recent assignments
- **Assignments**: Track and filter assignments by status
- **About**: Learn about the project and team
- **Profile**: Manage user profile information
- **Login**: Authentication interface

🌓 **Dark Mode**
- Theme toggle button in header
- Persistent theme state via Context

## Getting Started

### Installation

1. Navigate to the project directory:
   ```bash
   cd react-sps
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

## Technologies Used

- **React 18**: UI library
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Context API**: State management for theme
- **JavaScript/JSX**: Programming language

## Key Improvements Over Original

1. **Component Reusability**: Separated concerns with dedicated components
2. **State Management**: Centralized theme and data management
3. **Navigation**: Modern routing instead of page navigation
4. **Responsive**: Mobile-first design with Tailwind
5. **Dark Mode**: Full theme support throughout
6. **Scalability**: Modular structure for easy expansion
7. **Performance**: React optimization and code splitting

## Adding New Pages

To add a new page:

1. Create a new component in `src/pages/YourPage.tsx`:
   ```jsx
   const YourPage = () => {
     return <div>Your content here</div>;
   };
   export default YourPage;
   ```

2. Add a route in `src/App.js`:
   ```jsx
   <Route path="/your-page" element={<YourPage />} />
   ```

3. Add navigation link in `src/components/Header.tsx`:
   ```jsx
   <Link to="/your-page">Your Page</Link>
   ```

## Customization

### Changing Theme Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#yourColor',
}
```

### Updating Team Members

Edit `src/pages/AboutPage.tsx` and modify the `teamMembers` array.

### Modifying Assignment Data

Edit `src/data/assignments.json` with your data.

## Future Enhancements

- [ ] API integration for backend data
- [ ] User authentication system
- [ ] Database connectivity
- [ ] More detailed analytics dashboard
- [ ] Teacher/Admin portal
- [ ] Student messaging system
- [ ] Real-time notifications
- [ ] Export to PDF functionality

## Contributing

This project was created by the Progresso Team. For contributions, please maintain the component-based structure and use Tailwind CSS for styling.

## License

Created by the Progresso Project Team - 2025

## Contact

For more information about Progresso, visit our about page or contact: info@progresso.edu
