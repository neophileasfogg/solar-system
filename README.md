# Interactive Solar System Visualization

This is an interactive 3D visualization of our solar system built with Three.js. You can explore the planets, learn about their properties, and interact with the 3D model.

## Features

- Interactive 3D solar system model
- Click on planets to view their information
- Realistic planet sizes and distances (scaled)
- Smooth camera controls
- Responsive design

## How to Run

1. Clone this repository
2. Open the project folder
3. Start a local server (you can use Python's built-in server or any other method)
   - Using Python 3: `python -m http.server`
   - Using Python 2: `python -m SimpleHTTPServer`
4. Open your browser and navigate to `http://localhost:8000`

## Controls

- Left click and drag to rotate the view
- Right click and drag to pan
- Scroll to zoom in/out
- Click on any planet to view its information

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Three.js for 3D rendering
- OrbitControls for camera manipulation

## Project Structure

```
solar-system/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── README.md
``` 