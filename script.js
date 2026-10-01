// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusOverlay = document.getElementById('statusOverlay');
const statusText = document.getElementById('statusText');
const motionStatus = document.getElementById('motionStatus');
const frameCountEl = document.getElementById('frameCount');
const motionCountEl = document.getElementById('motionCount');
const logList = document.getElementById('logList');
const sensitivitySlider = document.getElementById('sensitivity');
const minAreaSlider = document.getElementById('minArea');
const showDiffCheckbox = document.getElementById('showDiff');
const sensitivityBtn = document.getElementById('sensitivityBtn');
const settingsModal = document.getElementById('settingsModal');
const modalSensitivity = document.getElementById('modalSensitivity');
const saveSettingsBtn = document.getElementById('saveSettings');
const closeBtn = document.querySelector('.close');

// Variables
let stream = null;
let previousFrame = null;
let isRunning = false;
let animationId = null;
let frameCount = 0;
let motionCount = 0;
let sensitivity = 20;
let minMotionArea = 150;

// Sync sliders
sensitivitySlider.addEventListener('input', () => {
    sensitivity = parseInt(sensitivitySlider.value);
    modalSensitivity.value = sensitivity;
});
modalSensitivity.addEventListener('input', () => {
    sensitivity = parseInt(modalSensitivity.value);
    sensitivitySlider.value = sensitivity;
});
minAreaSlider.addEventListener('input', () => {
    minMotionArea = parseInt(minAreaSlider.value);
});

// Modal controls
sensitivityBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
});
closeBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});
saveSettingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

// Start Camera
startBtn.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: 'environment',
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        });
        
        video.srcObject = stream;
        await video.play();
        
        // Set canvas size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Update UI
        isRunning = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusText.textContent = 'Scanning...';
        statusOverlay.classList.remove('active');
        motionStatus.textContent = 'Monitoring';
        motionStatus.className = 'value no-motion';
        
        // Reset
        previousFrame = null;
        frameCount = 0;
        motionCount = 0;
        frameCountEl.textContent = '0';
        motionCountEl.textContent = '0';
        logList.innerHTML = '<p class="empty">No activity yet</p>';
        
        // Start detection
        detectMotion();
        
    } catch (err) {
        alert('Camera access denied or not available. Please allow camera permissions.');
        console.error('Camera error:', err);
    }
});

// Stop Camera
stopBtn.addEventListener('click', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    isRunning = false;
    if (animationId) cancelAnimationFrame(animationId);
    
    video.srcObject = null;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusText.textContent = 'Camera Off';
    statusOverlay.classList.remove('active');
    motionStatus.textContent = '—';
    motionStatus.className = 'value';
});

// Motion Detection Core
function detectMotion() {
    if (!isRunning) return;
    
    animationId = requestAnimationFrame(detectMotion);
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get current frame data
    const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Skip first frame, store baseline
    if (!previousFrame) {
        previousFrame = currentFrame;
        return;
    }
    
    frameCount++;
    frameCountEl.textContent = frameCount;
    
    // Compare frames
    const motionDetected = compareFrames(previousFrame, currentFrame);
    
    if (motionDetected) {
        motionCount++;
        motionCountEl.textContent = motionCount;
        motionStatus.textContent = 'DETECTED';
        motionStatus.className = 'value detected';
        statusOverlay.classList.add('active');
        
        addLog(`Motion detected — ${new Date().toLocaleTimeString()}`);
    } else {
        motionStatus.textContent = 'Clear';
        motionStatus.className = 'value no-motion';
        statusOverlay.classList.remove('active');
    }
    
    // Show difference if enabled
    if (showDiffCheckbox.checked) {
        canvas.style.display = 'block';
    } else {
        canvas.style.display = 'none';
    }
    
    // Save current as previous for next loop
    previousFrame = currentFrame;
}

// Compare two frames and return true if motion found
function compareFrames(prev, curr) {
    const pData = prev.data;
    const cData = curr.data;
    
    let changedPixels = 0;
    const threshold = sensitivity; // Higher = less sensitive
    
    // Step by 4 (RGBA channels)
    for (let i = 0; i < pData.length; i += 4) {
        // Convert to grayscale for better comparison
        const pGray = (pData[i] + pData[i+1] + pData[i+2]) / 3;
        const cGray = (cData[i] + cData[i+1] + cData[i+2]) / 3;
        
        // Calculate difference
        const diff = Math.abs(pGray - cGray);
        
        if (diff > threshold) {
            changedPixels++;
            
            // Highlight changed pixels in red if showing diff
            if (showDiffCheckbox.checked) {
                cData[i] = 255;     // R
                cData[i+1] = 0;     // G
                cData[i+2] = 0;     // B
                cData[i+3] = 255;   // A
            }
        }
    }
    
    // Update canvas with highlighted diff
    if (showDiffCheckbox.checked) {
        ctx.putImageData(curr, 0, 0);
    }
    
    // Calculate motion area percentage
    const totalPixels = canvas.width * canvas.height;
    const motionArea = (changedPixels / totalPixels) * 100;
    
    // Return true only if area exceeds minimum
    return changedPixels > minMotionArea;
}

// Add log entry
function addLog(message) {
    // Remove empty notice
    const empty = logList.querySelector('.empty');
    if (empty) empty.remove();
    
    const item = document.createElement('div');
    item.className = 'log-item';
    item.textContent = message;
    logList.insertBefore(item, logList.firstChild);
    
    // Keep last 10 entries
    while (logList.children.length > 10) {
        logList.removeChild(logList.lastChild);
    }
}

// Cleanup on page close
window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});