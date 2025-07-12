import React, { useRef, useEffect, useState } from 'react';

const ProjectileCanvas = ({ angle, speed, gravity, launch, reset }) => {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    const [info, setInfo] = useState({ x: 0, y: 0, vx: 0, vy: 0, t: 0 });
    const [isPaused, setIsPaused] = useState(false);
    const [isStopped, setIsStopped] = useState(false);

    let time = useRef(0);
    let tracePoints = useRef([]);
    let maxHeight = useRef(0);
    let totalRange = useRef(0);

    useEffect(() => {
        

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const origin = { x: 50, y: canvas.height - 30 };

        /* canvas.width = canvas.offsetWidth;
        canvas.height = 500; */

        let x = 0;
        let y = 0;
        const rad = (angle * Math.PI) / 180;
        const vx = speed * Math.cos(rad);
        const vyInit = speed * Math.sin(rad);

        const draw = () => {
            if (isPaused || isStopped) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGround(ctx, canvas);
            drawAxes(ctx, canvas);

            x = vx * time.current;
            y = vyInit * time.current - 0.5 * gravity * time.current ** 2;
            const vyCurrent = vyInit - gravity * time.current;

            const drawX = origin.x + x;
            const drawY = origin.y - y;

            // Store max height
            if (y > maxHeight.current) maxHeight.current = y;

            // Save current position
            tracePoints.current.push({ x: drawX, y: drawY });

            // Draw path
            ctx.fillStyle = 'blue';
            tracePoints.current.forEach((point) => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
                ctx.fill();
            });

            // Draw projectile
            ctx.beginPath();
            ctx.arc(drawX, drawY, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();

            setInfo({
                x: x.toFixed(2),
                y: y.toFixed(2),
                vx: vx.toFixed(2),
                vy: vyCurrent.toFixed(2),
                t: time.current.toFixed(2),
            });

            time.current += 0.05;

            if (y >= 0) {
                requestRef.current = requestAnimationFrame(draw);
            } else {
                // Stop animation at landing
                totalRange.current = x;
                drawFinalStats(ctx, canvas, origin, maxHeight.current, totalRange.current);
                cancelAnimationFrame(requestRef.current);
            }
        };

        if (launch && !isPaused) {
            time.current = 0;
            tracePoints.current = [];
            maxHeight.current = 0;
            totalRange.current = 0;
            setIsStopped(false);
            draw();
        }

        if (reset) {
            cancelAnimationFrame(requestRef.current);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGround(ctx, canvas);
            drawAxes(ctx, canvas);
            setInfo({ x: 0, y: 0, vx: 0, vy: 0, t: 0 });
            tracePoints.current = [];
            time.current = 0;
            maxHeight.current = 0;
            totalRange.current = 0;
            setIsPaused(false);
            setIsStopped(false);
        }

        return () => cancelAnimationFrame(requestRef.current);
    }, [angle, speed, gravity, launch, reset, isPaused, isStopped]);

    const drawAxes = (ctx, canvas) => {
        ctx.strokeStyle = '#888';
        ctx.beginPath();
        ctx.moveTo(50, 0); // Y-axis
        ctx.lineTo(50, canvas.height);
        ctx.moveTo(0, canvas.height - 30); // X-axis
        ctx.lineTo(canvas.width, canvas.height - 30);
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.fillText('Y (m)', 10, 20);
        ctx.fillText('X (m)', canvas.width - 40, canvas.height - 10);
    };

    const drawGround = (ctx, canvas) => {
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGradient.addColorStop(0, "#87CEEB");
        skyGradient.addColorStop(1, "#ffffff");
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

        ctx.strokeStyle = "#2e7d32";
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 20);
        ctx.lineTo(canvas.width, canvas.height - 20);
        ctx.stroke();
    };

    const drawFinalStats = (ctx, canvas, origin, maxH, range) => {
        ctx.fillStyle = 'black';
        ctx.font = '16px monospace';
        ctx.fillText(`Max Height: ${maxH.toFixed(2)} m`, origin.x + 10, 30);
        ctx.fillText(`Range: ${range.toFixed(2)} m`, origin.x + 10, 50);
    };

    const handlePauseResume = () => {
        if (!launch) return;
        setIsPaused((prev) => !prev);
        if (isPaused) {
            requestRef.current = requestAnimationFrame(() => {
                time.current += 0.05;
            });
        }
    };

    const handleStop = () => {
        cancelAnimationFrame(requestRef.current);
        setIsStopped(true);
        setIsPaused(false);
    };

    return (
        <div style={{ textAlign: 'center' }} className='canvas-container gap-3 align-middle mt-10'>
            <canvas ref={canvasRef} width={1000} height={500}></canvas>
            <div style={{ marginTop: '20px', fontFamily: 'monospace' }} className='flex flex-row gap-3 '>
                <strong>Time:</strong> {info.t}s 
                <strong> X:</strong> {info.x} m
                <strong> Y:</strong> {info.y} m 
                <strong> Vx:</strong> {info.vx} m/s 
                <strong> Vy:</strong> {info.vy} m/s
            </div>
            <div style={{ marginTop: '20px' }} className='mr-90 flex gap-3'>
                <button onClick={handlePauseResume} style={btnStyle}>
                    {isPaused ? 'Startover' : 'Pause'}
                </button>
                <button onClick={handleStop} style={btnStyle}>
                    Stop
                </button>
            </div>
        </div>
    );
};

const btnStyle = {
    margin: '0 10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
};

export default ProjectileCanvas;
