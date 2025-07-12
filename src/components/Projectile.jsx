import React, { useState } from 'react';
import ProjectileCanvas from "../projectilecanvas";
import '../App.css';


export const Projectile = () => {
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(50);
  const [gravity, setGravity] = useState(9.8);
  const [shouldLaunch, setShouldLaunch] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);

  const handleLaunch = () => {
    setShouldLaunch(true);
    setResetTrigger(false);
  };

  const handleReset = () => {
    setShouldLaunch(false);
    setResetTrigger(true);
  };

  return (
    <section id='hero'>
      <div className="app-container text-center">
        <h1 className="text-3xl font-bold mt-4">Projectile Motion Simulator</h1>

        <div className="flex flex-row justify-center gap-6 mt-6 items-center flex-wrap">
          <label>
            Angle (°)
            <input
              type="range"
              min="0"
              max="90"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
            />
            <span className="ml-2">{angle}</span>
          </label>

          <label>
            Speed (m/s)
            <input
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <span className="ml-2">{speed}</span>
          </label>

          <label>
            Gravity (m/s²)
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={gravity}
              onChange={(e) => setGravity(Number(e.target.value))}
            />
            <span className="ml-2">{gravity}</span>
          </label>

          <button
            onClick={handleLaunch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Launch
          </button>

          <button
            onClick={handleReset}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reset
          </button>
        </div>

        <ProjectileCanvas
          angle={angle}
          speed={speed}
          gravity={gravity}
          launch={shouldLaunch}
          reset={resetTrigger}
        />
      </div>
    </section>
  );
}


