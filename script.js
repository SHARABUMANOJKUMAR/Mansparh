// Mansparsh - Main Script

document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Customization ---
    const themeBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Check local storage
    const savedTheme = localStorage.getItem('mansparsh-theme') || 'light';
    root.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('mansparsh-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (themeBtn) {
            themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("scroll-bar").style.width = scrolled + "%";
    });

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.textContent = '☰';
            }
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // --- 3D Tilt Effect on Cards ---
    const cards = document.querySelectorAll('.card, .tilt-effect');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // --- Particles.js Config ---
    if (window.tsParticles) {
        tsParticles.load("tsparticles", {
            fpsLimit: 60,
            particles: {
                color: { value: "#ffffff" },
                links: {
                    color: "#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: false,
                    straight: false,
                    outModes: "out"
                },
                number: {
                    density: { enable: true, area: 800 },
                    value: 40
                },
                opacity: {
                    value: 0.3
                },
                shape: {
                    type: "circle"
                },
                size: {
                    value: { min: 1, max: 3 }
                }
            },
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse"
                    },
                    onClick: {
                        enable: true,
                        mode: "push"
                    }
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { quantity: 4 }
                }
            },
            detectRetina: true
        });
    }

    // --- Accordion Logic ---
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(acc => {
        acc.addEventListener('click', () => {
            const item = acc.parentElement;
            item.classList.toggle('active');
        });
    });

    // --- Google Sheets Form Submission ---
    const form = document.getElementById("bookingForm");
    if (form) {
        const scriptURL = "https://script.google.com/macros/s/AKfycbzet52Q4rrd1mWiYTaLyV4RtTt-VMjhF7FUjAgzfS3tjq6CW1AyzV6uQAXA0ew0xOw/exec";

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const submitBtn = form.querySelector("button[type='submit']");
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = "Submitting...";

            // Show loading spinner if you have one
            // document.getElementById('loader').style.display = 'flex';

            const formData = {
                fullName: document.getElementById("fullName").value.trim(),
                email: document.getElementById("email").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                preferredTime: document.getElementById("preferredTime").value,
                message: document.getElementById("message").value.trim()
            };

            fetch(scriptURL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        // Confetti Effect
                        confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 }
                        });

                        alert("🌿 Your session request has been submitted successfully!");
                        form.reset();
                    } else {
                        alert("⚠ Something went wrong. Please try again.");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("❌ Server error. Please try again later.");
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                });
        });
    }

    // --- Contact Page 3D Scene (Three.js) ---
    const contactScene = document.getElementById('contact-3d-scene');
    if (contactScene && window.THREE) {
        initContact3D();
    }

    function initContact3D() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, contactScene.clientWidth / contactScene.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(contactScene.clientWidth, contactScene.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        contactScene.appendChild(renderer.domElement);

        // Abstract Sphere (Mental Peace)
        const geometry = new THREE.IcosahedronGeometry(2, 20);
        const material = new THREE.MeshPhongMaterial({
            color: 0x6a11cb,
            wireframe: true,
            transparent: true,
            opacity: 0.2,
            shininess: 100
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Core Glowing Sphere
        const coreGeo = new THREE.SphereGeometry(1, 32, 32);
        const coreMat = new THREE.MeshPhongMaterial({
            color: 0x00ffcc,
            transparent: true,
            opacity: 0.5,
            emissive: 0x00ffcc,
            emissiveIntensity: 0.5
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        // Particles
        const partCount = 200;
        const partGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(partCount * 3);
        for (let i = 0; i < partCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 4;
        }
        partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const partMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.8 });
        const particles = new THREE.Points(partGeo, partMat);
        scene.add(particles);

        // Lights
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x404040));

        camera.position.z = 5;

        // Animation Loop
        let frame = 0;
        function animate() {
            requestAnimationFrame(animate);
            frame += 0.01;
            sphere.rotation.y += 0.005;
            sphere.rotation.x += 0.002;
            core.scale.set(1 + Math.sin(frame) * 0.1, 1 + Math.sin(frame) * 0.1, 1 + Math.sin(frame) * 0.1);
            particles.rotation.y -= 0.002;
            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            camera.aspect = contactScene.clientWidth / contactScene.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(contactScene.clientWidth, contactScene.clientHeight);
        });
        animate();
    }

    // --- Background Drifting Icons ---
    const drifterWrap = document.createElement('div');
    drifterWrap.className = 'floating-3d-wrap';
    document.body.appendChild(drifterWrap);
    const icons = ['🧠', '🧘', '🌿', '✨', '💙'];

    for (let i = 0; i < 15; i++) {
        const span = document.createElement('span');
        span.className = 'float-bg';
        span.textContent = icons[Math.floor(Math.random() * icons.length)];
        span.style.left = Math.random() * 100 + 'vw';
        span.style.top = Math.random() * 100 + 'vh';
        span.style.animationDelay = Math.random() * 10 + 's';
        span.style.fontSize = (Math.random() * 2 + 1) + 'rem';
        drifterWrap.appendChild(span);
    }
});
