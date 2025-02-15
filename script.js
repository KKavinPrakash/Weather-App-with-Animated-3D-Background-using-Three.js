document.addEventListener('DOMContentLoaded', () => {
  let inputCity = document.getElementById('city-input');
  let btn = document.getElementById('get-weather-btn');
  let cityName = document.getElementById('city-name');
  let temperature = document.getElementById('temperature');
  let description = document.getElementById('description');
  let weatherInfo = document.querySelector('.weather-info');
  let error = document.getElementById('Error');

  const API_KEY = 'ccf81e355311ed3e336ba6b4295a768c';

  btn.addEventListener('click', async () => {
    const city = inputCity.value.trim();
    if (city === '') return;

    try {
      const weatherData = await getWeather(city);
      displayWeather(weatherData);
    } catch (err) {
      displayError();
    }
  });

  async function getWeather(city) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) {
      throw new Error('City Not Found!');
    }
    return await response.json();
  }

  function displayWeather(weatherData) {
    const { name, main, weather } = weatherData;
    weatherInfo.classList.remove('hidden');
    error.classList.add('hidden');

    cityName.textContent = `City: ${name}`;
    temperature.textContent = `Temperature: ${main.temp}°C`;
    description.textContent = `Description: ${weather[0].description}`;
  }

  function displayError() {
    weatherInfo.classList.add('hidden');
    error.classList.remove('hidden');
  }

  // 3D Background with Three.js
  function create3DBackground() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create stars (Particles)
    const starsGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    for (let i = 0; i < 1000; i++) {
      let x = (Math.random() - 0.5) * 2000;
      let y = (Math.random() - 0.5) * 2000;
      let z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starVertices, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    camera.position.z = 500;

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      starField.rotation.y += 0.0005;
      renderer.render(scene, camera);
    }
    animate();

    // Adjust canvas size on window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  create3DBackground();
});
