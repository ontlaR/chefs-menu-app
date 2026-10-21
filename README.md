# Chef's Menu App - Part 3

Snack Link: https://snack.expo.dev/@ntlamir/snackit
GitHub: https://github.com/ontlaR/chefs-menu-app

## Overview
This is Part 3 of the Chef's Menu App. The app allows a chef to Add, View, Edit, and Delete menu items, plus Search, Filter, and view Statistics. Built with React Native in Expo Snack.

## Features Implemented

### Part 2 Features (Retained):
- Add new menu item (Dish Name, Description, Course Type, Price)
- View list of menu items
- Form validation
- Average price calculation
- Filter menu by course (basic)

### Part 3 New Features (Manage Functionality):
1. **Edit Menu Item**: Click Edit button to load item data back into form
2. **Update Menu Item**: Same button changes to "Update Item" when editing
3. **Cancel Edit**: Cancel button to exit edit mode and clear form
4. **Delete Menu Item**: Delete with confirmation Alert dialog
5. **Search Functionality**: Search menu items by dish name (real-time)
6. **Advanced Filter**: Filter by course type using selectable chips (All, Starters, Mains, Desserts)
7. **Clear Filter Button**: Reset search and filter
8. **Menu Statistics**: 
   - Total number of menu items
   - Average price of all items
   - Count per course type

## Change Log Since Part 2

- **Added Manage functionality**: Full CRUD - Create, Read, Update, Delete
- **Added Edit flow**: `editingId` state to track which item is being edited
- **Added Delete flow**: `handleDeleteItem` with `Alert.alert` confirmation
- **Added Search**: `searchText` state and `filteredItems` logic that filters by name
- **Added Course Filter Chips**: `filterCourse` state with UI chips for Starter/Main/Dessert
- **Added Statistics Dashboard**: Top card showing total, average price, and counts
- **Added Better UX**: Form clears after save, scrolls to form when editing, inline validation
- **Added Empty State**: Message when no results found for search/filter

## Refactoring Changes (Part 3 Requirement)

To meet the "Code Refactoring & Structure" criteria, the following refactoring was done:

1.  **Created Reusable Component `MenuItemCard`**:
    - Previously, the menu item card UI was repeated inside `FlatList renderItem`.
    - Now extracted to a separate reusable component `MenuItemCard({ item, onEdit, onDelete })`.
    - This reduces code repetition and improves maintainability.

2.  **Created Reusable Function `clearForm()`**:
    - Previously, clearing form required 4 separate `set...` calls in multiple places.
    - Now centralized in one `clearForm()` function that resets all inputs and `editingId`.

3.  **Combined Add and Update Logic**:
    - Created single function `handleSaveItem()` that handles both Add and Update based on `editingId`.
    - Avoids duplicate validation and save logic.

4.  **Improved Code Organization**:
    - Code is organized into clear sections: // STATE, // REUSABLE COMPONENTS, // HELPER FUNCTIONS, // HANDLERS, // DERIVED DATA, // RENDER
    - Added comments to explain each section.

5.  **Used Meaningful Variable Names**:
    - Changed generic names to descriptive: `editingId`, `searchText`, `filterCourse`, `filteredItems`, `totalItems`, `courseCounts`.

6.  **Added Validation and Error Handling**:
    - Improved validation with specific error messages for each field.
    - Added try/catch and confirmation dialogs for delete.

## How to Run the App

1. Open Expo Snack: https://snack.expo.dev/@ntlamir/snackit
2. Wait for bundler to load
3. Test on Web preview on the right, OR
4. Scan QR code with Expo Go app on Android/iOS:
   - Install Expo Go from Play Store / App Store
   - Open Expo Go > Scan QR
   - Scan the QR code from Snack page

## How to Test

1. Add: Fill form and click "Add to Menu"
2. Edit: Click "Edit" on any card -> form fills -> change and click "Update Item"
3. Delete: Click "Delete" -> confirm
4. Search: Type in search bar (e.g., "pasta")
5. Filter: Click on "Starters", "Mains", "Desserts" chips
6. Check Stats at top update automatically

## Tech Stack
- React Native
- Expo Snack
- React Hooks (useState)
