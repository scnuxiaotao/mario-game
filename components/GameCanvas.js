'use client';

import React, { useRef, useEffect, useReducer } from 'react';
import { initialGameState, gameReducer, drawGame } from '../utils/gameHelpers';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 400;

export default function GameCanvas() {
  const canvasRef = useRef(null);
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  useEffect(() => {
    const handleKeyDown = (e) => dispatch({ type: 'KEY_DOWN', key: e.key });
    const handleKeyUp = (e) => dispatch({ type: 'KEY_UP', key: e.key });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let animationId;
    const ctx = canvasRef.current.getContext('2d');
    function loop() {
      drawGame(ctx, state);
      dispatch({ type: 'TICK' });
      animationId = requestAnimationFrame(loop);
    }
    loop();
    return () => cancelAnimationFrame(animationId);
  }, [state]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ border: '2px solid #219ebc', background: '#e0fbfc' }} />
    </div>
  );
}
