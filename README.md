# Dynamic Data Table Manager

[![TypeScript](https://img.shields.io/badge/TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-blue.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black.svg)](https://nextjs.org/)


## Description

The Dynamic Data Table Manager is a React-based web application built with Next.js, TypeScript, and Material UI (MUI). It allows users to manage data in a table format, with features such as importing data from CSV files, exporting data to CSV, searching, sorting, pagination, and dynamic column management (adding, deleting, reordering, and toggling visibility).

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [How to Use](#how-to-use)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Important Links](#important-links)
- [Footer](#footer)

## Features

- **Import CSV Data:**  Import data into the table from CSV files. Uses `papaparse` for parsing CSV data.
- **Export CSV Data:**  Export the current table data to a CSV file. Leverages `file-saver` to trigger the download.
- **Dynamic Column Management:**  Add, delete, reorder, and toggle the visibility of columns.
- **Searching:**  Filter the table data based on a search query. The search applies to all columns.
- **Sorting:**  Sort the table data by clicking on the column headers. Supports ascending and descending order.
- **Pagination:**  Navigate through large datasets using pagination.
- **Inline Cell Editing:**  Edit cell values directly within the table.
- **Column Reordering:** Drag and drop columns to reorder them using `@dnd-kit/sortable`.
- **Toggle Dark/Light Mode:** Switch between light and dark themes using Material UI's `ThemeProvider`.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) - React framework for building web applications.
- **UI Library:** [Material UI (MUI)](https://mui.com/) -  A popular React UI framework for building responsive and accessible interfaces.
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) -  For managing application state.
- **Drag and Drop:** [@dnd-kit](https://dndkit.com/) - Modern drag and drop toolkit for React.
- **CSV Parsing:** [PapaParse](https://www.papaparse.com/) -  Powerful CSV parser for the browser.
- **File Saving:** [FileSaver.js](https://github.com/eligrey/FileSaver.js/) -  For saving files client-side.
- **Styling:** [CSS Modules](https://github.com/css-modules/css-modules) - Used with global styles for component styling
- **Language:** [TypeScript](https://www.typescriptlang.org/) -  A superset of JavaScript that adds static typing.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Vinayak-P1/dynamic-table.git
   cd dynamic-table
   ```

2. **Install dependencies:**

   ```bash
   npm install # or yarn install or pnpm install or bun install
   ```

3. **Run the development server:**

   ```bash
   npm run dev # or yarn dev or pnpm dev or bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

### Importing Data

1. Click the "Import CSV" button.
2. Select a CSV file from your computer.
3. The data from the CSV file will be added to the table.

### Exporting Data

1. Click the "Export CSV" button.
2. A CSV file containing the current table data will be downloaded to your computer.

### Managing Columns

1. Click the "Manage Columns" button.
2. A modal will appear allowing you to:
   - Toggle the visibility of columns by checking/unchecking the checkboxes.
   - Reorder columns by dragging and dropping them.
   - Add new columns by entering a name in the text field and clicking "Add".
   - Delete dynamic columns by clicking the delete icon (trash icon).

### Searching

- Enter a search query in the search bar. The table will be filtered to show only rows that match the query in any column.

### Sorting

- Click on a column header to sort the table by that column. Click again to change the sort direction (ascending/descending).

### Editing Cells

- Click the "Edit" icon (pencil icon) in the row you want to edit.
- The row will become editable, and you can change the values of the cells.
- Click the "Save" icon (save icon) to save the changes, or the "Cancel" icon (close icon) to discard them.

### Adding new columns

- Open "Manage Columns" modal by clicking on "Manage Columns" Button
- Enter column name in the text field and click "Add" to add new column.

## How to use

This project is designed as a dynamic data table manager, making it suitable for various real-world applications. Here's how you can use it:

### Use Cases

- **Customer Relationship Management (CRM):** Manage customer data efficiently, including contact information, purchase history, and support interactions. You can easily import customer data from CSV files, search for specific customers, and sort them based on different criteria.

- **Inventory Management:** Keep track of product inventory, stock levels, and supplier information. The dynamic column management feature allows you to add columns for specific product attributes, such as size, color, or weight.

- **Project Management:** Organize project tasks, assignees, and deadlines. You can add custom columns for task status, priority, or dependencies, and sort tasks based on their due dates.

- **Data Analysis and Reporting:** Import data from various sources, perform data cleaning and transformation, and generate reports. The export to CSV feature allows you to export the data for further analysis in other tools like Excel or Tableau.

### Example

1. **Import Data:** Start by importing a CSV file containing your dataset.

   ```typescript
   // Example of importing data using PapaParse
   Papa.parse(file, {
     header: true,
     skipEmptyLines: true,
     complete: (res) => {
       const rows = (res.data as any[]).map(r => {
         if (r.age !== undefined && r.age !== null && r.age !== "") {
           const num = Number(r.age);
           r.age = Number.isNaN(num) ? r.age : num;
         }
         return r;
       });
       dispatch(addRows(rows as any));
     },
     error: (err) => alert("CSV parse error: " + err.message)
   });
   ```

2. **Customize Columns:** Use the "Manage Columns" feature to show/hide columns, reorder them, or add new ones.

   ```typescript
   // Example of toggling column visibility
   dispatch(toggleColumn('newColumn'));
   ```

3. **Search and Sort:** Use the search bar to filter data and click on column headers to sort the data.

   ```typescript
   // Example of setting search term
   dispatch(setSearch('example@email.com'));
   ```

## Project Structure

```
 dynamic-table/
 ├── .eslintrc.json
 ├── README.md
 ├── next.config.mjs
 ├── package.json
 ├── src
 │   ├── app
 │   │   ├── globals.css
 │   │   ├── layout.tsx
 │   │   ├── page.module.css
 │   │   └── page.tsx
 │   ├── components
 │   │   ├── ManageColumnsModal.tsx
 │   │   ├── SearchBar.tsx
 │   │   ├── SortableItem.tsx
 │   │   └── TableManager.tsx
 │   ├── redux
 │   │   ├── Providers.tsx
 │   │   ├── store.ts
 │   │   └── tableSlice.ts
 │   └── utils
 │       └── csv.ts
 ├── tsconfig.json
 ```

- `src/app`: Contains the Next.js application pages and layout.
- `src/components`:  Reusable React components, including the table manager, search bar, and column management modal.
- `src/redux`: Redux store configuration and slices for managing application state.
- `src/utils`: Utility functions, such as CSV parsing and exporting.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear and concise messages.
4. Submit a pull request.

## License

This project has no specified license.

## Important Links

- **Repository:** [https://github.com/Vinayak-P1/dynamic-table](https://github.com/Vinayak-P1/dynamic-table)

## Footer

Dynamic Data Table Manager - [https://github.com/Vinayak-P1/dynamic-table](https://github.com/Vinayak-P1/dynamic-table) by [Vinayak-P1](https://github.com/Vinayak-P1).

⭐️ Fork, like, star, and raise issues!


---
**<p align="center">Generated by [ReadmeCodeGen](https://www.readmecodegen.com/)</p>**