// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('solar-system').appendChild(renderer.domElement);

// Camera controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(sunLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(50, 50, 50);
scene.add(directionalLight);

function createOrbitalPath(radius) {
    const segments = 256;
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
            Math.cos(theta) * radius,
            0,
            Math.sin(theta) * radius
        ));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: false,
        opacity: 1.0
    });
    return new THREE.Line(geometry, material);
}

// Planet data with orbital periods (in Earth days)
const planets = [
    {
        name: 'Sun',
        radius: 5,
        distance: 0,
        color: 0xffff00,
        rotationSpeed: 0.001,
        orbitalSpeed: 0,
        info: {
            diameter: '1,392,700 km',
            mass: '1.989 × 10^30 kg',
            temperature: '5,778 K'
        }
    },
    {
        name: 'Mercury',
        radius: 0.4,
        distance: 10,
        color: 0x8c8c8c,
        rotationSpeed: 0.004,
        orbitalSpeed: 0.04, // 88 Earth days
        info: {
            diameter: '4,879 km',
            mass: '3.285 × 10^23 kg',
            temperature: '167°C to 427°C'
        }
    },
    {
        name: 'Venus',
        radius: 0.9,
        distance: 15,
        color: 0xe6e6b8,
        rotationSpeed: 0.002,
        orbitalSpeed: 0.015, // 225 Earth days
        info: {
            diameter: '12,104 km',
            mass: '4.867 × 10^24 kg',
            temperature: '462°C'
        }
    },
    {
        name: 'Earth',
        radius: 1,
        distance: 20,
        color: 0x2233ff,
        rotationSpeed: 0.005,
        orbitalSpeed: 0.01, // 365 Earth days
        info: {
            diameter: '12,742 km',
            mass: '5.972 × 10^24 kg',
            temperature: '15°C'
        }
    },
    {
        name: 'Mars',
        radius: 0.5,
        distance: 25,
        color: 0xc1440e,
        rotationSpeed: 0.003,
        orbitalSpeed: 0.005, // 687 Earth days
        info: {
            diameter: '6,779 km',
            mass: '6.39 × 10^23 kg',
            temperature: '-63°C'
        }
    },
    {
        name: 'Jupiter',
        radius: 2.5,
        distance: 35,
        color: 0xd8ca9d,
        rotationSpeed: 0.002,
        orbitalSpeed: 0.002, // 4,333 Earth days
        info: {
            diameter: '139,820 km',
            mass: '1.898 × 10^27 kg',
            temperature: '-110°C'
        }
    },
    {
        name: 'Saturn',
        radius: 2,
        distance: 45,
        color: 0xead6b8,
        rotationSpeed: 0.001,
        orbitalSpeed: 0.0009, // 10,759 Earth days
        info: {
            diameter: '116,460 km',
            mass: '5.683 × 10^26 kg',
            temperature: '-140°C'
        }
    },
    {
        name: 'Uranus',
        radius: 1.5,
        distance: 55,
        color: 0x5580aa,
        rotationSpeed: 0.001,
        orbitalSpeed: 0.0004, // 30,687 Earth days
        info: {
            diameter: '50,724 km',
            mass: '8.681 × 10^25 kg',
            temperature: '-195°C'
        }
    },
    {
        name: 'Neptune',
        radius: 1.5,
        distance: 65,
        color: 0x366896,
        rotationSpeed: 0.001,
        orbitalSpeed: 0.0001, // 60,190 Earth days
        info: {
            diameter: '49,244 km',
            mass: '1.024 × 10^26 kg',
            temperature: '-200°C'
        }
    }
];

// Load the Sun texture
const sunTexture = new THREE.TextureLoader().load('textures/2k_sun.jpg');

// Create planets
const planetObjects = planets.map(planet => {
    // Build the texture path based on the planet name
    const textureName = `2k_${planet.name.toLowerCase()}.jpg`;
    const texturePath = `textures/${textureName}`;
    let material;

    // Try to load the texture for each planet
    const texture = new THREE.TextureLoader().load(
        texturePath,
        undefined,
        undefined,
        function() {
            // On error, fallback to color
            material.map = null;
            material.color = new THREE.Color(planet.color);
        }
    );

    // For the Sun, add emissive for brightness
    if (planet.name === 'Sun') {
        material = new THREE.MeshPhongMaterial({
            map: texture,
            emissive: 0xffff33,
            emissiveMap: texture,
            emissiveIntensity: 2
        });
    } else {
        material = new THREE.MeshPhongMaterial({
            map: texture,
            color: planet.color,
            emissive: 0x111111,
            emissiveIntensity: 0.1,
            specular: 0x080808
        });
    }

    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const mesh = new THREE.Mesh(geometry, material);
    
    // Position planet
    mesh.position.x = planet.distance;
    
    // Store planet data
    mesh.userData = {
        name: planet.name,
        info: planet.info,
        rotationSpeed: planet.rotationSpeed,
        orbitalSpeed: planet.orbitalSpeed,
        distance: planet.distance,
        angle: Math.random() * Math.PI * 2 // Random starting position
    };
    
    scene.add(mesh);

    // Add orbital path for all planets except the Sun
    if (planet.distance > 0) {
        const orbitalPath = createOrbitalPath(planet.distance);
        scene.add(orbitalPath);
    }

    return mesh;
});

// Raycaster for planet selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Handle mouse click
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetObjects);
    
    if (intersects.length > 0) {
        const planet = intersects[0].object;
        const info = planet.userData.info;
        
        document.getElementById('planet-info').innerHTML = `
            <h2>${planet.userData.name}</h2>
            <div class="planet-details">
                <p>Diameter: ${info.diameter}</p>
                <p>Mass: ${info.mass}</p>
                <p>Temperature: ${info.temperature}</p>
            </div>
        `;
    }
});

// Set initial camera position
camera.position.z = 50;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update planet positions and rotations
    planetObjects.forEach(planet => {
        // Rotate planet on its axis
        planet.rotation.y += planet.userData.rotationSpeed;
        
        // Update orbital position
        if (planet.userData.orbitalSpeed > 0) {
            planet.userData.angle += planet.userData.orbitalSpeed;
            planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
            planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
        }
    });
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

const loader = new THREE.TextureLoader();
loader.load('textures/starfield.jpg', function(texture) {
    scene.background = texture;
});
