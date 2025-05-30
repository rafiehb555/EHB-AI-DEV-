# Assets

This directory contains static assets used in the EHB Admin Panel.

## Directory Structure

- `/images`: Logo, icons, and other image assets
- `/fonts`: Custom fonts
- `/docs`: Documentation files
- `/svg`: SVG icons and illustrations

## Usage

Import and use assets in your components:

```jsx
import Logo from 'assets/images/logo.png';

function Header() {
  return (
    <div className="header">
      <img src={Logo} alt="EHB Logo" />
    </div>
  );
}
```