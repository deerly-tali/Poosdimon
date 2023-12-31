// Function to detect if the user is on a mobile device
function isMobileDevice() {
    // Check for touch events
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Check for mobile user agent
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    return hasTouchScreen || isMobileUserAgent;
}



// If the user is on a mobile device, show the D-pad
if (isMobileDevice()) {
    document.getElementById("dpad").style.display = "block";
}

// Function to handle touch events on the D-pad buttons
function handleTouch(e) {
    // Get the id of the button that was touched
    var button = e.target.id;

    // Move the character based on the button that was touched
    switch (button) {
        case "up":
            window.handleArrowPress(0, -1);  // Move the character up
            break;
        case "down":
            window.handleArrowPress(0, 1);  // Move the character down
            break;
        case "left":
            window.handleArrowPress(-1, 0);  // Move the character left
            break;
        case "right":
            window.handleArrowPress(1, 0);  // Move the character right
            break;
    }

    // Prevent the browser from doing anything else with the touch event
    e.preventDefault();
}

// Add event listeners for touch events on the D-pad buttons
document.getElementById("up").addEventListener("touchstart", handleTouch);
document.getElementById("down").addEventListener("touchstart", handleTouch);
document.getElementById("left").addEventListener("touchstart", handleTouch);
document.getElementById("right").addEventListener("touchstart", handleTouch);