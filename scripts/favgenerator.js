// Get the first letter of the page title
var pageTitle = document.title.charAt(0);

// Create a canvas element to draw the favicon
var canvas = document.createElement('canvas');
canvas.width = 16;
canvas.height = 16;

// Get the canvas context
var ctx = canvas.getContext('2d');

// Set the favicon background color
ctx.fillStyle = '#000'; // Change this to your desired background color

// Draw a circle with the background color
ctx.beginPath();
ctx.arc(8, 8, 8, 0, 2 * Math.PI);
ctx.fill();

// Set the text color and font
ctx.fillStyle = '#fff'; // Change this to your desired text color
ctx.font = 'bold 12px Arial'; // Change this to your desired font and font size

// Measure the width of the text
var textWidth = ctx.measureText(pageTitle).width;

// Draw the first letter of the page title as centered text on the canvas
ctx.fillText(pageTitle, 8 - (textWidth / 2), 12);

// Set the favicon link element
var link = document.createElement('link');
link.type = 'image/png';
link.rel = 'icon';
link.href = canvas.toDataURL('image/png');

// Add the favicon link element to the document head
document.head.appendChild(link);