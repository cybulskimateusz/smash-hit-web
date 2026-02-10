import NetworkManager, { MESSAGE_TYPES } from './managers/NetworkManager/NetworkManager';

const createUI = () => {
  const container = document.createElement('div');
  container.id = 'mobile-controller';
  container.innerHTML = `
    <div id="crosshair-display">
      <div id="crosshair"></div>
      <div id="aim-info">Tap anywhere to start</div>
    </div>
    <button id="shoot-btn">FIRE</button>
    <div id="status">Connecting...</div>
    <button id="calibrate-btn">Calibrate</button>
  `;
  document.body.appendChild(container);

  const style = document.createElement('style');
  style.textContent = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      overflow: hidden;
      background: #1a1a2e;
      user-select: none;
      -webkit-user-select: none;
    }
    #mobile-controller {
      position: fixed;
      inset: 0;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      display: flex;
      flex-direction: column;
      touch-action: none;
    }
    #crosshair-display {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 2px solid rgba(255,255,255,0.1);
    }
    #crosshair {
      position: absolute;
      width: 60px;
      height: 60px;
      border: 4px solid #00ff88;
      border-radius: 50%;
      box-shadow: 0 0 30px rgba(0,255,136,0.5), inset 0 0 20px rgba(0,255,136,0.2);
    }
    #crosshair::before, #crosshair::after {
      content: '';
      position: absolute;
      background: #00ff88;
      box-shadow: 0 0 10px #00ff88;
    }
    #crosshair::before {
      width: 3px; height: 20px;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }
    #crosshair::after {
      width: 20px; height: 3px;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }
    #aim-info {
      position: absolute;
      bottom: 20px;
      color: rgba(255,255,255,0.5);
      font-family: system-ui, sans-serif;
      font-size: 14px;
    }
    #shoot-btn {
      height: 120px;
      background: linear-gradient(180deg, #ff4444 0%, #cc0000 100%);
      border: none;
      color: white;
      font-size: 32px;
      font-weight: bold;
      font-family: system-ui, sans-serif;
      letter-spacing: 4px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      box-shadow: 0 4px 15px rgba(255,0,0,0.4);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    #shoot-btn:active {
      background: linear-gradient(180deg, #ff6666 0%, #ff0000 100%);
      transform: scale(0.98);
    }
    #status {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      font-size: 14px;
      font-family: system-ui, sans-serif;
      background: rgba(0,0,0,0.5);
      padding: 5px 15px;
      border-radius: 20px;
    }
    #calibrate-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      padding: 8px 15px;
      border-radius: 20px;
      font-size: 12px;
      font-family: system-ui, sans-serif;
    }
  `;
  document.head.appendChild(style);

  return {
    crosshair: document.getElementById('crosshair') as HTMLDivElement,
    shootBtn: document.getElementById('shoot-btn') as HTMLButtonElement,
    status: document.getElementById('status') as HTMLDivElement,
    aimInfo: document.getElementById('aim-info') as HTMLDivElement,
    calibrateBtn: document.getElementById('calibrate-btn') as HTMLButtonElement,
  };
};

const loadMobile = async () => {
  const ui = createUI();

  NetworkManager.instance.connect();

  let aimX = 0;
  let aimY = 0;
  let smoothedX = 0;
  let smoothedY = 0;
  let hasPermission = false;
  let lastSendTime = 0;

  // Calibration with averaging
  let isCalibrated = false;
  let calibrationSamples: { alpha: number; beta: number }[] = [];
  let offsetAlpha = 0;
  let offsetBeta = 0;

  const requestPermission = async () => {
    // @ts-expect-error - DeviceOrientationEvent.requestPermission is iOS-specific
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        // @ts-expect-error - DeviceOrientationEvent.requestPermission is iOS-specific
        const permission = await DeviceOrientationEvent.requestPermission();
        hasPermission = permission === 'granted';
      } catch {
        hasPermission = false;
      }
    } else {
      hasPermission = true;
    }
    return hasPermission;
  };

  // Calibrate - collect samples and average
  const calibrate = () => {
    isCalibrated = false;
    calibrationSamples = [];
    smoothedX = 0;
    smoothedY = 0;
    ui.aimInfo.textContent = 'Hold still...';
  };

  ui.calibrateBtn.addEventListener('click', calibrate);

  // Handle device orientation
  // Phone flat = center, rotate top of phone toward target
  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha === null || event.beta === null) return;

    // Collect calibration samples (first 10 readings)
    if (!isCalibrated) {
      calibrationSamples.push({ alpha: event.alpha, beta: event.beta });

      if (calibrationSamples.length >= 10) {
        // Average the calibration samples
        offsetAlpha = calibrationSamples.reduce((sum, s) => sum + s.alpha, 0) / calibrationSamples.length;
        offsetBeta = calibrationSamples.reduce((sum, s) => sum + s.beta, 0) / calibrationSamples.length;
        isCalibrated = true;
        ui.aimInfo.textContent = 'Point top of phone to aim';
      }
      return;
    }

    // Alpha = rotation around Z axis (compass heading, 0-360)
    // Beta = tilt forward/back
    let deltaAlpha = event.alpha - offsetAlpha;

    // Handle wrap-around (0 <-> 360)
    if (deltaAlpha > 180) deltaAlpha -= 360;
    if (deltaAlpha < -180) deltaAlpha += 360;

    const beta = event.beta - offsetBeta;

    // Convert to -1 to 1 range
    // Rotate top right = positive alpha = aim RIGHT
    // Tilt top forward = positive beta = aim UP
    const sensitivity = 0.02;
    const rawX = Math.max(-1, Math.min(1, -deltaAlpha * sensitivity));
    const rawY = Math.max(-1, Math.min(1, beta * sensitivity));

    // Heavy smoothing for stability
    const smoothing = 0.1;
    smoothedX += (rawX - smoothedX) * smoothing;
    smoothedY += (rawY - smoothedY) * smoothing;

    aimX = smoothedX;
    aimY = smoothedY;

    // Move crosshair on screen (Y is inverted for screen coords)
    const displayArea = ui.crosshair.parentElement!;
    const maxX = displayArea.clientWidth / 2 - 40;
    const maxY = displayArea.clientHeight / 2 - 40;

    ui.crosshair.style.transform = `translate(${aimX * maxX}px, ${-aimY * maxY}px)`;

    // Throttle network updates (max 15/sec)
    const now = Date.now();
    if (NetworkManager.instance.isConnected && now - lastSendTime > 66) {
      lastSendTime = now;
      NetworkManager.instance.send(MESSAGE_TYPES.AIM_UPDATE, {
        position: [aimX, aimY],
      });
    }
  };

  const startOrientation = async () => {
    const granted = await requestPermission();
    if (granted) {
      window.addEventListener('deviceorientation', handleOrientation);
      calibrate(); // Start calibration
    } else {
      ui.aimInfo.textContent = 'Gyroscope permission denied';
    }
  };

  // Shoot button
  ui.shootBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();

    if (!NetworkManager.instance.isConnected) {
      ui.status.textContent = 'Not connected!';
      return;
    }

    NetworkManager.instance.send(MESSAGE_TYPES.BALL_THROWN, {
      direction: [aimX, aimY, -1],
    });

    ui.status.textContent = `Shot! (${aimX.toFixed(2)}, ${aimY.toFixed(2)})`;

    // Visual feedback
    ui.crosshair.style.boxShadow = '0 0 50px #ff0000, inset 0 0 30px rgba(255,0,0,0.5)';
    ui.crosshair.style.borderColor = '#ff0000';

    setTimeout(() => {
      ui.crosshair.style.boxShadow = '0 0 30px rgba(0,255,136,0.5), inset 0 0 20px rgba(0,255,136,0.2)';
      ui.crosshair.style.borderColor = '#00ff88';
    }, 150);
  });

  // Connection status
  const checkConnection = () => {
    if (NetworkManager.instance.isConnected) {
      ui.status.textContent = 'Connected';
      ui.status.style.background = 'rgba(0,150,0,0.5)';
    } else {
      ui.status.textContent = 'Connecting...';
      ui.status.style.background = 'rgba(150,0,0,0.5)';
    }
    setTimeout(checkConnection, 1000);
  };
  checkConnection();

  // Need user interaction to start on iOS
  document.body.addEventListener('click', () => {
    if (!hasPermission) {
      startOrientation();
    }
  }, { once: true });

  startOrientation();
};

export default loadMobile;
