/**
 * Utility class to help with UI scaling across different screen sizes
 */
class ScalingManager {
    /**
     * Initialize the scaling manager for a scene
     * @param {Phaser.Scene} scene - The scene to initialize for
     */
    constructor(scene) {

        this.scene = scene;
        this.baseWidth = 800;
        this.baseHeight = 600;
        this.scaleX = 1;
        this.scaleY = 1;
        this.uniformScale = 1;

        // Only set up resize event if scene is active
        if (scene && scene.uniformScale && scene.uniformScale.on) {
            // Listen for resize events
            scene.scale.on('resize', this.handleResize, this);
        }
        
        // Initialize scale factors
        this.updateScaleFactor();
    }
    
    /**
     * Update the scale factor based on current screen dimensions
     */
    updateScaleFactor() {
        if (!this.scene || !this.scene.cameras || !this.scene.cameras.main) {
            // Return default values if cameras aren't available yet
            this.scaleX = 1;
            this.scaleY = 1;
            this.uniformScale = 1;
            return;
        }
        
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        
        this.scaleX = width / this.baseWidth;
        this.scaleY = height / this.baseHeight;
        this.uniformScale = Math.min(this.scaleX, this.scaleY);
    }
    
    /**
     * Handle resize events
     */
    handleResize() {
        this.updateScaleFactor();
        
        // You can trigger UI updates here if needed
        if (this.scene && this.scene.refreshUI) {
            this.scene.refreshUI();
        }
    }
    
    /**
     * Scale a value based on current scale factor
     * @param {number} value - The original value to scale
     * @param {boolean} useUniformScale - Whether to use the minimum scale for both dimensions
     * @returns {number} - The scaled value
     */
    scale(value, useUniformScale = true) {
        if (useUniformScale) {
            return value * this.uniformScale;
        }
        return value * this.scaleX;
    }
    
    /**
     * Scale a position based on current screen dimensions
     * @param {number} x - The original x position (based on 800x600)
     * @param {number} y - The original y position (based on 800x600)
     * @returns {object} - The scaled position {x, y}
     */
    position(x, y) {
        // Calculate center offsets for proper positioning
        const centerXOffset = (this.scene.cameras.main.width - (this.baseWidth * this.uniformScale)) / 2;
        const centerYOffset = (this.scene.cameras.main.height - (this.baseHeight * this.uniformScale)) / 2;
        
        return {
            x: (x * this.uniformScale) + centerXOffset,
            y: (y * this.uniformScale) + centerYOffset
        };
    }
    
    /**
     * Get the available game area for the scene in pixels
     * @returns {object} - The available width and height
     */
    getGameArea() {
        return {
            width: this.scene.cameras.main.width,
            height: this.scene.cameras.main.height
        };
    }
    
    /**
     * Calculate the center of the screen
     * @returns {object} - The center position {x, y}
     */
    getCenter() {
        return {
            x: this.scene.cameras.main.width / 2,
            y: this.scene.cameras.main.height / 2
        };
    }
    
    /**
     * Destroy the scaling manager, removing event listeners
     */
    destroy() {
        if (this.scene && this.scene.scale) {
            this.scene.scale.off('resize', this.handleResize, this);
        }
        this.scene = null;
    }
}