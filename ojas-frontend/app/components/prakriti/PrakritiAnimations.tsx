'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef } from 'react';

// STARDUST CANVAS (Background particles)
export const StardustCanvas = ({ dosha }: { dosha: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        const particles: any[] = [];
        let animationFrameId: number;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const colors = dosha === 'Vata' ? ['#feb5ca', '#fbb3c7', '#ffd8e9'] : 
                       dosha === 'Pitta' ? ['#ff87c9', '#feb5ca', '#ffdad6'] : 
                       ['#a0d2af', '#bbeeca', '#f5f3ef']; // Kapha colors

        class Stardust {
            x: number = 0;
            y: number = 0;
            radius: number = 0;
            speed: number = 0;
            color: string = '';
            opacity: number = 0;
            life: number = 0;
            maxLife: number = 0;

            constructor() {
                this.init();
                this.y = Math.random() * height; // initial spread
            }

            init() {
                this.x = Math.random() * width;
                this.y = height + 10;
                this.radius = Math.random() * 1.5 + 0.5;
                this.speed = Math.random() * 0.5 + 0.2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.opacity = 0;
                this.life = 0;
                this.maxLife = Math.random() * 200 + 100;
            }

            update() {
                this.y -= this.speed;
                this.life++;
                if (this.life < 50) this.opacity += 0.02;
                if (this.life > this.maxLife - 50) this.opacity -= 0.02;
                if (this.life >= this.maxLife || this.y < -10) this.init();
            }

            draw() {
                if (this.opacity <= 0) return;
                ctx!.beginPath();
                ctx!.fillStyle = this.color;
                ctx!.globalAlpha = this.opacity > 1 ? 1 : this.opacity < 0 ? 0 : this.opacity;
                ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx!.fill();
                
                // Glow
                ctx!.shadowBlur = 8;
                ctx!.shadowColor = this.color;
                ctx!.fill();
                ctx!.shadowBlur = 0; // reset
            }
        }

        for (let i = 0; i < 30; i++) {
            particles.push(new Stardust());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [dosha]);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
};


// ELEMENTAL ORIGIN CANVAS
export const ElementalCanvas = ({ dosha }: { dosha: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let particles: any[] = [];
        let animationFrameId: number;

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            width = canvas.width = rect.width * 2;
            height = canvas.height = rect.height * 2;
        };

        window.addEventListener('resize', resize);
        // We delay resize slightly to ensure parent is rendered
        setTimeout(resize, 0);

        class ElementalParticle {
            x: number = 0;
            y: number = 0;
            angle: number = 0;
            speed: number = 0;
            radius: number = 0;
            color: string = '';
            life: number = 0;
            decay: number = 0;
            type: string = dosha;

            constructor() {
                this.init(true);
            }

            init(firstTime = false) {
                this.life = 1;
                this.decay = Math.random() * 0.01 + 0.005;
                
                if (this.type === 'Vata') {
                    this.x = firstTime ? Math.random() * width : width / 2;
                    this.y = firstTime ? Math.random() * height : height / 2;
                    this.angle = Math.random() * Math.PI * 2;
                    this.speed = Math.random() * 3 + 1;
                    this.radius = Math.random() * 2 + 1;
                    this.color = `rgba(254, 181, 202, `; // Resonant Pink base
                } else if (this.type === 'Pitta') {
                    this.x = firstTime ? Math.random() * width : Math.random() * width;
                    this.y = firstTime ? Math.random() * height : height + 10;
                    this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5; // Upwards
                    this.speed = Math.random() * 4 + 2;
                    this.radius = Math.random() * 3 + 1;
                    this.color = Math.random() > 0.5 ? `rgba(255, 135, 201, ` : `rgba(254, 181, 202, `;
                } else { // Kapha
                    this.x = firstTime ? Math.random() * width : Math.random() * width;
                    this.y = firstTime ? Math.random() * height : -10;
                    this.angle = Math.PI / 2; // Downwards slowly
                    this.speed = Math.random() * 1 + 0.2;
                    this.radius = Math.random() * 4 + 2;
                    this.color = `rgba(160, 210, 175, `; // Primary Fixed Dim
                }
            }

            update() {
                if (this.type === 'Vata') {
                    this.angle += 0.05;
                    this.x += Math.cos(this.angle) * this.speed;
                    this.y += Math.sin(this.angle) * this.speed + (Math.random() - 0.5);
                } else if (this.type === 'Pitta') {
                    this.x += Math.cos(this.angle) * this.speed;
                    this.y += Math.sin(this.angle) * this.speed;
                    this.radius *= 0.98; // Shrink as it rises
                } else {
                    this.y += this.speed;
                    this.x += Math.sin(this.y * 0.01) * 0.5; // Wavy drip
                }
                
                this.life -= this.decay;
                if (this.life <= 0 || this.radius < 0.1) this.init();
            }

            draw() {
                ctx!.beginPath();
                ctx!.fillStyle = `${this.color}${this.life})`;
                ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx!.fill();
            }
        }

        particles = Array.from({ length: 120 }, () => new ElementalParticle());

        const animate = () => {
            // Trail effect
            ctx.fillStyle = 'rgba(27, 28, 26, 0.15)'; 
            ctx.fillRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [dosha]);

    return <canvas ref={canvasRef} id="elemental-canvas" className="block w-full h-full bg-transparent relative z-30" />;
};


// SANCTUARY OVERLAY (Wind, Fire, Water)
export const SanctuaryOverlayCanvas = ({ dosha }: { dosha: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let elements: any[] = [];
        let animationFrameId: number;

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            width = canvas.width = parent.offsetWidth;
            height = canvas.height = parent.offsetHeight;
        };

        window.addEventListener('resize', resize);
        setTimeout(resize, 0);

        class WindLine {
            x: number = 0; y: number = 0; len: number = 0;
            speed: number = 0; opacity: number = 0; thickness: number = 0;
            offset: number = 0; color: string = '';

            constructor() { this.reset(true); }
            reset(first = false) {
                this.x = first ? Math.random() * width : -100;
                this.y = Math.random() * height;
                this.len = Math.random() * 100 + 50;
                this.speed = Math.random() * 1.5 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.thickness = Math.random() * 1 + 0.5;
                this.offset = Math.random() * 100;
                this.color = Math.random() > 0.5 ? '#feb5ca' : '#a0d2af';
            }
            update() {
                this.x += this.speed;
                this.y += Math.sin((this.x + this.offset) * 0.01) * 0.5;
                if (this.x > width + 100) this.reset();
            }
            draw() {
                ctx!.beginPath();
                ctx!.strokeStyle = this.color;
                ctx!.globalAlpha = this.opacity;
                ctx!.lineWidth = this.thickness;
                ctx!.moveTo(this.x, this.y);
                ctx!.bezierCurveTo(this.x + 20, this.y - 10, this.x + 40, this.y + 10, this.x + this.len, this.y);
                ctx!.stroke();
            }
        }

        class FireEmber {
            x: number = 0; y: number = 0; speedY: number = 0; speedX: number = 0;
            size: number = 0; life: number = 0; maxLife: number = 0; color: string = '';
            
            constructor() { this.reset(true); }
            reset(first = false) {
                this.x = Math.random() * width;
                this.y = first ? Math.random() * height : height + 10;
                this.speedY = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 1;
                this.size = Math.random() * 3 + 1;
                this.life = 0;
                this.maxLife = Math.random() * 100 + 50;
                this.color = `rgba(255, ${100 + Math.random() * 100}, 50, 0.8)`;
            }
            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                this.life++;
                if (this.life > this.maxLife || this.y < -10) this.reset();
            }
            draw() {
                const alpha = 1 - (this.life / this.maxLife);
                ctx!.beginPath();
                ctx!.fillStyle = this.color;
                ctx!.globalAlpha = alpha;
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fill();
            }
        }

        class WaterRipple {
            x: number = 0; y: number = 0; radius: number = 0; maxRadius: number = 0;
            speed: number = 0; opacity: number = 0;

            constructor() { this.reset(true); }
            reset(first = false) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = first ? Math.random() * 100 : 0;
                this.maxRadius = Math.random() * 100 + 50;
                this.speed = Math.random() * 0.5 + 0.2;
                this.opacity = 1;
            }
            update() {
                this.radius += this.speed;
                this.opacity = 1 - (this.radius / this.maxRadius);
                if (this.radius > this.maxRadius) this.reset();
            }
            draw() {
                ctx!.beginPath();
                ctx!.strokeStyle = `rgba(160, 210, 175, ${this.opacity * 0.5})`;
                ctx!.lineWidth = 2;
                ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx!.stroke();
            }
        }

        if (dosha === 'Vata') {
            elements = Array.from({ length: 15 }, () => new WindLine());
        } else if (dosha === 'Pitta') {
            elements = Array.from({ length: 30 }, () => new FireEmber());
        } else {
            elements = Array.from({ length: 8 }, () => new WaterRipple());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            elements.forEach(e => {
                e.update();
                e.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [dosha]);

    return <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none opacity-40" />;
};
