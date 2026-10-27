# Recipe Finder - Student Starter Template

This is a static, UI-only starter template for the Recipe Finder application. It contains all layout structure, Tailwind CSS styling, and dummy data. No logic, routing, or API calls are included yet.

## Getting Started

1. Install dependencies:
   npm install

2. Start the development server:
   npm run dev

3. Open the URL printed in the terminal (typically http://localhost:5173).

## Offline Usage and Previewing Pages

All recipe images are stored locally in public/images/. No internet connection or API is required to run this template.

To preview different pages before routing is implemented:
- In src/App.jsx, toggle comments between <Home />, <RecipeDetail />, and <NotFound />.
- In src/pages/Home.jsx, toggle between CASE 1 (recipes found) and CASE 2 (recipes not found).

## What Will Be Added in Class

Students will implement full functionality during class:
- Routing: Add react-router-dom with BrowserRouter, Routes, Route, and Link navigation.
- State Management (useState): Store recipes, search text, active query, and pagination count.
- Side Effects (useEffect): Trigger data fetching on page mount and parameter changes.
- API Integration: Replace dummy data with real API requests to fetch recipes.
- Search Functionality: Filter recipes by search query submitted through the search form.
- Pagination: Implement the Load More button to fetch subsequent pages of recipes.
- Conditional Rendering: Handle loading spinners, error alerts, and empty search results.
