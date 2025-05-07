// Define GraphicsUtils in the global scope
// This needs to be loaded BEFORE the scene files
const GraphicsUtils = {
  /**
   * Creates a pixel texture that can be used for particles
   * @param {Phaser.Scene} scene - The scene to create the texture in
   * @param {string} key - The key to store the texture under
   */
  createPixelTexture: function (scene, key = "pixel") {
    // Create a canvas for the pixel
    const canvas = scene.textures.createCanvas(key, 1, 1);
    const ctx = canvas.context;

    // Draw a white pixel
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 1, 1);

    // Update the canvas texture
    canvas.refresh();
  },

  /**
   * Creates a button texture
   */
  createButtonTexture: function (
    scene,
    key = "button",
    width = 200,
    height = 50,
    radius = 10,
    color = 0x3d3d3d,
    borderColor = 0x5d5d5d
  ) {
    // Create a graphics object
    const graphics = scene.make.graphics({ x: 0, y: 0 });

    // Draw button with border
    graphics.lineStyle(2, borderColor);
    graphics.fillStyle(color);
    graphics.fillRoundedRect(0, 0, width, height, radius);
    graphics.strokeRoundedRect(0, 0, width, height, radius);

    // Generate texture from graphics
    graphics.generateTexture(key, width, height);

    // Clean up graphics object
    graphics.destroy();
  },

  /**
   * Creates a panel texture
   */
  createPanelTexture: function (
    scene,
    key = "panel",
    width = 400,
    height = 300,
    radius = 5,
    color = 0x2d2d2d,
    borderColor = 0x4d4d4d
  ) {
    // Create a graphics object
    const graphics = scene.make.graphics({ x: 0, y: 0 });

    // Draw panel with border
    graphics.lineStyle(2, borderColor);
    graphics.fillStyle(color);
    graphics.fillRoundedRect(0, 0, width, height, radius);
    graphics.strokeRoundedRect(0, 0, width, height, radius);

    // Generate texture from graphics
    graphics.generateTexture(key, width, height);

    // Clean up graphics object
    graphics.destroy();
  },

  /**
   * Creates a cyber grid background texture
   */
  createCyberBackgroundTexture: function (
    scene,
    key = "cyber-background",
    width = 800,
    height = 600
  ) {
    // Create a graphics object
    const graphics = scene.make.graphics({ x: 0, y: 0 });

    // Draw gradient background
    graphics.fillGradientStyle(0x000428, 0x000428, 0x004e92, 0x004e92, 1);
    graphics.fillRect(0, 0, width, height);

    // Draw grid
    graphics.lineStyle(1, 0x0066ff, 0.1);

    // Horizontal lines
    for (let y = 0; y < height; y += 40) {
      graphics.lineBetween(0, y, width, y);
    }

    // Vertical lines
    for (let x = 0; x < width; x += 40) {
      graphics.lineBetween(x, 0, x, height);
    }

    // Generate texture from graphics
    graphics.generateTexture(key, width, height);

    // Clean up graphics object
    graphics.destroy();
  },
};
