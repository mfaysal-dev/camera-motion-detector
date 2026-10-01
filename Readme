
All four files must be placed in the exact same folder — do not put them in separate subfolders, otherwise the website will not load properly.

---

## 🚀 Step-by-Step Setup & Usage Guide

### Option 1: Run Directly on Your Computer (Local Use)
1. Create a new empty folder on your computer
2. Copy the `index.html`, `style.css` and `script.js` files into this folder
3. Make sure all three files are sitting together in the same place
4. Double-click `index.html` to open it in your web browser
5. When the page loads, you will see the title and interface
6. Click the button labeled **Start Camera**
7. Your web browser will show a permission prompt — select **Allow** or **Grant Permission** to access your camera
8. Once the camera feed appears, move your hand or any object in front of the camera — the status will immediately change to **DETECTED** and the counter will increase
9. To stop the camera at any time, click the **Stop Camera** button

> 💡 If you open the file directly without a web server, some browsers may still work but for full functionality it is best to use Option 2 or run through a local web server.

### Option 2: Upload to Your Website (mfaysal.com)
1. Open your website hosting control panel or FTP file manager
2. Navigate to the folder where you want this to be installed
3. Upload all four files — `index.html`, `style.css`, `script.js` and `README.md`
4. Visit your website address in a modern web browser
5. Important: Your website must use **HTTPS** — modern web browsers will not allow camera access on unencrypted plain HTTP connections
6. Click Start Camera, grant permission, and the motion detector will be fully operational

---

## ⚙️ All Controls Explained in Detail

| Control Element | What It Does |
|---|---|
| Start Camera Button | Turns on your device camera and begins continuous motion scanning immediately |
| Stop Camera Button | Completely shuts down the camera stream and pauses all detection — privacy-friendly |
| Sensitivity Slider | Adjust how easily motion is detected. Move LEFT = MORE sensitive (detects smaller changes), move RIGHT = LESS sensitive (only reacts to bigger movements) |
| Minimum Area Slider | Sets how large a moving change must be before it counts as motion. Higher values help prevent false alerts from shadows, lighting changes or small insects |
| Show Difference Checkbox | When checked, the video feed will show red coloring over every pixel that changed between frames — very helpful for understanding exactly what triggered detection |
| Motion Status | Shows "Monitoring" when everything is clear, turns red and shows "DETECTED" the moment movement is spotted |
| Frames Checked | Counts how many video frames have been processed since starting |
| Motion Events | Total number of separate movement detections recorded |
| Recent Activity Log | Lists the time of each detection, keeping the most recent 10 entries visible |

---

## 📋 System Requirements

- A modern web browser: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari 14 or newer
- A device with a working camera — built-in webcam, external USB camera, or phone camera
- Camera permission granted when prompted by your browser
- For online use: HTTPS enabled on your web hosting
- For local use: opening through `localhost` or directly from file works in most browsers

---

## 🔬 How the Motion Detection Actually Works

The system follows this process continuously while running:

1. Captures a single image frame from your live camera video feed
2. Converts the full-color image to grayscale — this simplifies comparison and improves speed
3. Takes the current frame and compares it pixel-by-pixel against the immediately previous frame
4. Calculates the brightness difference for every corresponding pixel between the two frames
5. Counts how many pixels have changed beyond the sensitivity threshold value
6. If the total number of changed pixels is greater than your minimum area setting → motion is confirmed
7. Updates the on-screen status, increments the counter, adds a timestamped entry to the activity log
8. Stores the current frame as the reference frame and repeats the process instantly — 30 times or more per second

---

## 🎨 How to Customize for mfaysal.com

### Change Colors and Appearance
Open `style.css` and edit the color values at the very top of the file:
```css
:root {
    --primary: #2563eb;    /* Main blue color — change to your preferred brand color */
    --success: #10b981;    /* Green color shown when no motion detected */
    --danger: #ef4444;     /* Red color shown when motion is found */
    --dark: #1e293b;       /* Main text color */
    --light: #f8fafc;      /* Page background shade */
}