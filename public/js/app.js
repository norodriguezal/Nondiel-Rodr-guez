import { INFOGRAPHIC_NODES } from './constants.js';

// Configuration
const CONFIG = {
    DRAG_SENSITIVITY_X: 0.2,
    DRAG_SENSITIVITY_Y: 0.1,
    FOV_DEGREES: 80,
    STAR_COUNT: 250,
    FRICTION: 0.92,
    MAX_TILT: 20
};

class SpaceApp {
    constructor() {
        // DOM Elements
        this.container = document.getElementById('scene-container');
        this.panel = document.getElementById('info-panel');
        this.panelTitle = document.getElementById('panel-title');
        this.panelDesc = document.getElementById('panel-desc');
        this.panelBody = document.getElementById('panel-body');
        
        // State
        this.camera = {
            azimuth: 0,
            elevation: 0,
            targetAzimuth: 0,
            targetElevation: 0,
            velocityAzimuth: 0,
            velocityElevation: 0,
            isDragging: false,
            startX: 0,
            startY: 0
        };

        this.stars = [];
        this.nodes = [];
        this.activeNodeId = null;

        // Screen dimensions (cached)
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelsPerDegree = this.width / CONFIG.FOV_DEGREES;

        this.init();
    }

    init() {
        this.createStars();
        this.createNodes();
        this.setupEventListeners();
        
        // Start Loop
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.animate(t));
    }

    createStars() {
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 2 + 1;
            const azimuth = Math.random() * 360;
            const elevation = Math.random() * 100;
            
            star.className = 'absolute rounded-full bg-white gpu-layer';
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.opacity = Math.random() * 0.5 + 0.3;
            star.style.boxShadow = `0 0 2px #fff`;
            star.style.animation = `twinkle ${Math.random() * 3 + 1}s infinite ease-in-out`;
            
            // Store data for render loop
            this.stars.push({
                el: star,
                azimuth,
                elevation
            });

            fragment.appendChild(star);
        }
        this.container.appendChild(fragment);
    }

    createNodes() {
        const fragment = document.createDocumentFragment();

        INFOGRAPHIC_NODES.forEach(node => {
            const el = document.createElement('div');
            el.className = 'info-point gpu-layer group';
            el.id = `node-${node.id}`;
            
            // Convert Hex to RGBA helper
            const hexToRgba = (hex, alpha) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r},${g},${b},${alpha})`;
            };

            const bgNormal = `radial-gradient(circle, ${hexToRgba(node.color, 0.3)}, rgba(0,0,0,0.8))`;
            const borderNormal = `1px solid ${hexToRgba(node.color, 0.5)}`;
            const shadowNormal = `0 0 15px ${node.color}`;

            el.style.background = bgNormal;
            el.style.border = borderNormal;
            el.style.boxShadow = shadowNormal;

            el.innerHTML = `
                <div class="w-3 h-3 rounded-full mb-2 animate-pulse" style="background-color: ${node.color}"></div>
                <span class="info-point-label" style="border-color: rgba(255,255,255,0.2)">${node.title.split("(")[0]}</span>
                <div class="absolute inset-[-10px] rounded-full border border-dashed border-white/20 animate-[spin_10s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            `;

            // Interaction
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openPanel(node);
            });

            this.nodes.push({
                el,
                data: node,
                azimuth: (node.x / 100) * 360,
                elevation: node.y
            });

            fragment.appendChild(el);
        });

        this.container.appendChild(fragment);
    }

    setupEventListeners() {
        // Resize
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.pixelsPerDegree = this.width / CONFIG.FOV_DEGREES;
        });

        // Mouse / Touch Input
        const handleStart = (x, y) => {
            this.camera.isDragging = true;
            this.camera.startX = x;
            this.camera.startY = y;
            this.container.style.cursor = 'grabbing';
            // Stop inertia
            this.camera.velocityAzimuth = 0;
            this.camera.velocityElevation = 0;
        };

        const handleMove = (x, y) => {
            if (!this.camera.isDragging) return;
            
            const deltaX = x - this.camera.startX;
            const deltaY = y - this.camera.startY;

            // Direct update for responsiveness
            const moveAzimuth = deltaX * CONFIG.DRAG_SENSITIVITY_X;
            const moveElevation = deltaY * CONFIG.DRAG_SENSITIVITY_Y;

            this.camera.targetAzimuth -= moveAzimuth;
            this.camera.targetElevation += moveElevation;

            // Clamp Elevation
            this.camera.targetElevation = Math.max(-CONFIG.MAX_TILT, Math.min(CONFIG.MAX_TILT, this.camera.targetElevation));

            // Store velocity for inertia
            this.camera.velocityAzimuth = -moveAzimuth;
            this.camera.velocityElevation = moveElevation;

            this.camera.startX = x;
            this.camera.startY = y;
        };

        const handleEnd = () => {
            this.camera.isDragging = false;
            this.container.style.cursor = 'grab';
        };

        // DOM Events
        this.container.addEventListener('mousedown', e => handleStart(e.clientX, e.clientY));
        window.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', handleEnd);

        this.container.addEventListener('touchstart', e => handleStart(e.touches[0].clientX, e.touches[0].clientY), {passive: false});
        window.addEventListener('touchmove', e => handleMove(e.touches[0].clientX, e.touches[0].clientY), {passive: false});
        window.addEventListener('touchend', handleEnd);

        // Panel Close
        document.getElementById('panel-close').addEventListener('click', () => this.closePanel());
        document.getElementById('panel-backdrop').addEventListener('click', () => this.closePanel());
    }

    openPanel(node) {
        this.activeNodeId = node.id;
        this.panelTitle.textContent = node.title;
        this.panelDesc.textContent = node.shortDescription || '';
        this.panelBody.innerHTML = node.fullContent;
        
        this.panel.classList.remove('hidden');
        // Force reflow
        void this.panel.offsetWidth; 
        this.panel.classList.add('visible');

        // Highlight Node
        const nodeObj = this.nodes.find(n => n.data.id === node.id);
        if(nodeObj) {
            nodeObj.el.style.border = `2px solid ${node.color}`;
            nodeObj.el.style.boxShadow = `0 0 30px ${node.color}`;
            nodeObj.el.querySelector('.rounded-full').classList.remove('animate-pulse');
        }
    }

    closePanel() {
        this.panel.classList.remove('visible');
        
        // Reset Node Style
        if (this.activeNodeId) {
            const nodeObj = this.nodes.find(n => n.data.id === this.activeNodeId);
            if(nodeObj) {
                const node = nodeObj.data;
                const hexToRgba = (hex, alpha) => {
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    return `rgba(${r},${g},${b},${alpha})`;
                };
                nodeObj.el.style.border = `1px solid ${hexToRgba(node.color, 0.5)}`;
                nodeObj.el.style.boxShadow = `0 0 15px ${node.color}`;
                nodeObj.el.querySelector('.rounded-full').classList.add('animate-pulse');
            }
        }
        
        this.activeNodeId = null;
        setTimeout(() => this.panel.classList.add('hidden'), 300);
    }

    animate(time) {
        // Physics / Inertia
        if (!this.camera.isDragging) {
            this.camera.targetAzimuth += this.camera.velocityAzimuth;
            this.camera.targetElevation += this.camera.velocityElevation;
            
            // Friction
            this.camera.velocityAzimuth *= CONFIG.FRICTION;
            this.camera.velocityElevation *= CONFIG.FRICTION;

            // Stop tiny movements
            if (Math.abs(this.camera.velocityAzimuth) < 0.01) this.camera.velocityAzimuth = 0;
            if (Math.abs(this.camera.velocityElevation) < 0.01) this.camera.velocityElevation = 0;
            
            // Clamp Elevation with bounce back if needed (simplified)
            this.camera.targetElevation = Math.max(-CONFIG.MAX_TILT, Math.min(CONFIG.MAX_TILT, this.camera.targetElevation));
        }

        // Smooth Interpolation
        this.camera.azimuth += (this.camera.targetAzimuth - this.camera.azimuth) * 0.1;
        this.camera.elevation += (this.camera.targetElevation - this.camera.elevation) * 0.1;

        // Render Objects
        this.renderScene();

        requestAnimationFrame((t) => this.animate(t));
    }

    renderScene() {
        const cx = this.width / 2;
        const cy = this.height / 2;
        const camAzimuth = this.camera.azimuth;
        const camElevation = this.camera.elevation;

        // Render Nodes
        for (const node of this.nodes) {
            // Shortest angle difference logic
            let deltaAzimuth = (node.azimuth - camAzimuth) % 360;
            if (deltaAzimuth > 180) deltaAzimuth -= 360;
            if (deltaAzimuth < -180) deltaAzimuth += 360;

            // Culling (optimization)
            if (Math.abs(deltaAzimuth) > (CONFIG.FOV_DEGREES / 2 + 30)) {
                node.el.style.display = 'none';
                continue;
            } else {
                node.el.style.display = 'flex';
            }

            // Project
            const x = cx + (deltaAzimuth * this.pixelsPerDegree);
            const nodeYRel = node.elevation - 50; // -50 to 50
            const y = cy + (nodeYRel * (this.height / 100)) + (camElevation * 5);
            
            const zScale = node.data.z ? 1 + (node.data.z / 100) : 1;

            node.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zScale})`;
            node.el.style.zIndex = Math.floor(zScale * 10);
        }

        // Render Stars
        for (const star of this.stars) {
            let deltaAzimuth = (star.azimuth - camAzimuth) % 360;
            if (deltaAzimuth > 180) deltaAzimuth -= 360;
            if (deltaAzimuth < -180) deltaAzimuth += 360;
            
            // Stars wrap around screen more freely, but let's cull for perf
            if (Math.abs(deltaAzimuth) > 100) { 
                star.el.style.display = 'none';
                continue; 
            }
            star.el.style.display = 'block';

            const x = cx + (deltaAzimuth * this.pixelsPerDegree * 0.5); // 0.5 for depth effect
            const y = cy + ((star.elevation - 50) * (this.height / 80)) + (camElevation * 2);

            star.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
    }
}

// Start
window.addEventListener('load', () => {
    new SpaceApp();
});