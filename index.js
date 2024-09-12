// Get references to DOM elements
let container = document.querySelector(".container");
let downloadArtButton = document.getElementById("download-art");
let gridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let colorButton = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");

// Object to handle different events for mouse and touch devices
let events = {
  mouse: {
    down: "mousedown",
    move: "mousemove",
    up: "mouseup",
  },
  touch: {
    down: "touchstart",
    move: "touchmove",
    up: "touchend",
  },
};

let deviceType = ""; // Variable to store the type of device (mouse or touch)
let draw = false; // Boolean to determine if drawing is active
let erase = false; // Boolean to determine if erasing is active

// Function to detect if the device is a touch device
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch"; // Set deviceType to 'touch'
    return true;
  } catch (e) {
    deviceType = "mouse"; // Set deviceType to 'mouse'
    return false;
  }
};

isTouchDevice(); // Call the function to initialize deviceType

// Event listener for the "Create Grid" button
gridButton.addEventListener("click", () => {
  container.innerHTML = ""; // Clear the container
  let count = 0;
  for (let i = 0; i < gridHeight.value; i++) {
    count += 2;
    let div = document.createElement("div");
    div.classList.add("gridRow");

    for (let j = 0; j < gridWidth.value; j++) {
      count += 2;
      let col = document.createElement("div");
      col.classList.add("gridCol");
      col.setAttribute("id", `gridCol${count}`);
      
      // Event listener for mouse down or touch start
      col.addEventListener(events[deviceType].down, () => {
        draw = true;
        if (erase) {
          col.style.backgroundColor = "transparent"; // Set cell to transparent if erasing
        } else {
          col.style.backgroundColor = colorButton.value; // Set cell to selected color
        }
      });

      // Event listener for mouse move or touch move
      col.addEventListener(events[deviceType].move, (e) => {
        let elementId = document.elementFromPoint(
          !isTouchDevice() ? e.clientX : e.touches[0].clientX,
          !isTouchDevice() ? e.clientY : e.touches[0].clientY
        ).id;
        checker(elementId); // Update cell color based on position
      });

      // Event listener for mouse up or touch end
      col.addEventListener(events[deviceType].up, () => {
        draw = false; // Stop drawing
      });

      div.appendChild(col); // Append cell to row
    }

    container.appendChild(div); // Append row to container
  }
});

// Function to update cell color based on its ID
function checker(elementId) {
  let gridColumns = document.querySelectorAll(".gridCol");
  gridColumns.forEach((element) => {
    if (elementId == element.id) {
      if (draw && !erase) {
        element.style.backgroundColor = colorButton.value; // Set color if drawing
      } else if (draw && erase) {
        element.style.backgroundColor = "transparent"; // Set transparent if erasing
      }
    }
  });
}

// Event listener for the "Clear Grid" button
clearGridButton.addEventListener("click", () => {
  container.innerHTML = ""; // Clear the container
});

// Event listener for the "Erase" button
eraseBtn.addEventListener("click", () => {
  erase = true; // Set erase mode
});

// Event listener for the "Paint" button
paintBtn.addEventListener("click", () => {
  erase = false; // Set paint mode
});

// Event listener for grid width range input
gridWidth.addEventListener("input", () => {
  widthValue.innerHTML =
    gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value; // Update width value display
});

// Event listener for grid height range input
gridHeight.addEventListener("input", () => {
  heightValue.innerHTML =
    gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value; // Update height value display
});

// Event listener for the "Download Art" button
downloadArtButton.addEventListener("click", () => {
  html2canvas(container).then((canvas) => {
    let link = document.createElement("a");
    link.download = "art.png"; // Set the file name for the download
    link.href = canvas.toDataURL("image/png"); // Convert canvas to image data URL
    link.click(); // Trigger the download
  });
});

// Initialize grid size and create the grid on page load
window.onload = () => {
  gridHeight.value = 25;
  gridWidth.value = 30;
  widthValue.innerHTML =
    gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value;
  heightValue.innerHTML =
    gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value;
  gridButton.click(); // Trigger grid creation on page load
};
