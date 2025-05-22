/**
 * Utility class for common UI elements across game screens
 */
class GameUIUtils {

    /**
 * Get the current game scale factor based on the default design size of 800x600
 * @param {Phaser.Scene} scene - The current scene
 * @returns {object} - The scale factors for width and height
 */
    static getScaleFactor(scene) {
    const designWidth = 800;
    const designHeight = 600;
    const scaleX = scene.cameras.main.width / designWidth;
    const scaleY = scene.cameras.main.height / designHeight;
    
    return { x: scaleX, y: scaleY };
}
    /**
     * Create a back button to navigate to the previous scene
     * 
     * @param {Phaser.Scene} scene - The current scene
     * @param {string} targetScene - The scene to navigate to when clicked
     * @param {number} x - X position
     * @param {number} y - Y position
     * @return {Phaser.GameObjects.Container} - The button container
     */
    static createBackButton(scene, targetScene, x, y) {
        const backButton = scene.add.container(x, y);
        
        // Button background
        const buttonBg = scene.add.graphics();
        buttonBg.fillStyle(0x222266, 1);
        buttonBg.fillRoundedRect(-50, -20, 100, 40, 8);
        buttonBg.lineStyle(2, 0x3366ff, 1);
        buttonBg.strokeRoundedRect(-50, -20, 100, 40, 8);
        
        // Button text
        const buttonText = scene.add.text(0, 0, 'BACK', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center'
        });
        
        buttonText.setOrigin(0.5);
        
        // Add components to container
        backButton.add(buttonBg);
        backButton.add(buttonText);
        
        // Make interactive
        backButton.setSize(100, 40);
        backButton.setInteractive({ useHandCursor: true });
        
        // Hover effects
        backButton.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x3366ff, 1);
            buttonBg.fillRoundedRect(-50, -20, 100, 40, 8);
            buttonBg.lineStyle(2, 0x66aaff, 1);
            buttonBg.strokeRoundedRect(-50, -20, 100, 40, 8);
        });
        
        backButton.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x222266, 1);
            buttonBg.fillRoundedRect(-50, -20, 100, 40, 8);
            buttonBg.lineStyle(2, 0x3366ff, 1);
            buttonBg.strokeRoundedRect(-50, -20, 100, 40, 8);
        });
        
        // Click action
        backButton.on('pointerdown', () => {
            scene.cameras.main.fade(500, 0, 0, 0);
            scene.time.delayedCall(500, () => {
                scene.scene.start(targetScene);
            });
        });
        
        return backButton;
    }
    
    /**
     * Create a reset button to restart the current level
     * 
     * @param {Phaser.Scene} scene - The current scene
     * @param {string} targetScene - Usually the current scene to restart
     * @param {number} x - X position
     * @param {number} y - Y position
     * @return {Phaser.GameObjects.Container} - The button container
     */
    static createResetButton(scene, targetScene, x, y) {
        const resetButton = scene.add.container(x, y);
        
        // Button background - using circular button for reset
        const buttonBg = scene.add.graphics();
        buttonBg.fillStyle(0x662200, 1);
        buttonBg.fillCircle(0, 0, 25);
        buttonBg.lineStyle(2, 0xff6600, 1);
        buttonBg.strokeCircle(0, 0, 25);
        
        // Reset icon (simple arrows in a circle)
        const resetIcon = scene.add.graphics();
        resetIcon.lineStyle(3, 0xffffff, 1);
        
        // Draw circular arrow icon
        resetIcon.beginPath();
        resetIcon.arc(0, 0, 12, Phaser.Math.DegToRad(60), Phaser.Math.DegToRad(330), false);
        resetIcon.strokePath();
        
        // Arrow head
        resetIcon.lineStyle(3, 0xffffff, 1);
        resetIcon.beginPath();
        resetIcon.moveTo(10, -8);
        resetIcon.lineTo(15, -3);
        resetIcon.lineTo(10, 2);
        resetIcon.strokePath();
        
        // Add components to container
        resetButton.add(buttonBg);
        resetButton.add(resetIcon);
        
        // Add tooltip text that appears on hover
        const tooltipBg = scene.add.graphics();
        tooltipBg.fillStyle(0x000000, 0.8);
        tooltipBg.fillRoundedRect(-40, 30, 80, 30, 5);
        
        const tooltipText = scene.add.text(0, 45, 'RESET', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center'
        });
        
        tooltipText.setOrigin(0.5);
        
        // Initially hide tooltip
        tooltipBg.visible = false;
        tooltipText.visible = false;
        
        resetButton.add(tooltipBg);
        resetButton.add(tooltipText);
        
        // Make interactive
        resetButton.setSize(50, 50);
        resetButton.setInteractive({ useHandCursor: true });
        
        // Hover effects
        resetButton.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0xff6600, 1);
            buttonBg.fillCircle(0, 0, 25);
            buttonBg.lineStyle(2, 0xffaa00, 1);
            buttonBg.strokeCircle(0, 0, 25);
            
            // Show tooltip
            tooltipBg.visible = true;
            tooltipText.visible = true;
            
            // Rotate icon
            scene.tweens.add({
                targets: resetIcon,
                angle: 180,
                duration: 500,
                ease: 'Cubic.easeOut'
            });
        });
        
        resetButton.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x662200, 1);
            buttonBg.fillCircle(0, 0, 25);
            buttonBg.lineStyle(2, 0xff6600, 1);
            buttonBg.strokeCircle(0, 0, 25);
            
            // Hide tooltip
            tooltipBg.visible = false;
            tooltipText.visible = false;
            
            // Reset rotation
            scene.tweens.add({
                targets: resetIcon,
                angle: 0,
                duration: 500,
                ease: 'Cubic.easeOut'
            });
        });
        
        // Click action
        resetButton.on('pointerdown', () => {
            // Visual feedback
            scene.cameras.main.flash(300, 255, 153, 0);
            
            // Confirmation dialog
            const confirmContainer = scene.add.container(scene.cameras.main.width / 2, scene.cameras.main.height / 2);
            
            // Dialog background
            const dialogBg = scene.add.graphics();
            dialogBg.fillStyle(0x000000, 0.8);
            dialogBg.fillRoundedRect(-150, -100, 300, 200, 10);
            dialogBg.lineStyle(2, 0xff6600, 1);
            dialogBg.strokeRoundedRect(-150, -100, 300, 200, 10);
            
            // Dialog title
            const titleText = scene.add.text(0, -60, 'RESET LEVEL?', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '24px',
                color: '#ffffff',
                align: 'center',
                fontStyle: 'bold'
            });
            
            titleText.setOrigin(0.5);
            
            // Dialog message
            const messageText = scene.add.text(0, -15, 'Are you sure you want to\nreset this level?', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '18px',
                color: '#ffffff',
                align: 'center'
            });
            
            messageText.setOrigin(0.5);
            
            // Yes button
            const yesButton = scene.add.graphics();
            yesButton.fillStyle(0x006600, 1);
            yesButton.fillRoundedRect(-100, 30, 90, 40, 8);
            yesButton.lineStyle(2, 0x00aa00, 1);
            yesButton.strokeRoundedRect(-100, 30, 90, 40, 8);
            
            const yesText = scene.add.text(-55, 50, 'YES', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '18px',
                color: '#ffffff',
                align: 'center'
            });
            
            yesText.setOrigin(0.5);
            
            // No button
            const noButton = scene.add.graphics();
            noButton.fillStyle(0x660000, 1);
            noButton.fillRoundedRect(10, 30, 90, 40, 8);
            noButton.lineStyle(2, 0xaa0000, 1);
            noButton.strokeRoundedRect(10, 30, 90, 40, 8);
            
            const noText = scene.add.text(55, 50, 'NO', {
                fontFamily: 'Arial, sans-serif',
                fontSize: '18px',
                color: '#ffffff',
                align: 'center'
            });
            
            noText.setOrigin(0.5);
            
            // Add components to dialog
            confirmContainer.add(dialogBg);
            confirmContainer.add(titleText);
            confirmContainer.add(messageText);
            confirmContainer.add(yesButton);
            confirmContainer.add(yesText);
            confirmContainer.add(noButton);
            confirmContainer.add(noText);
            
            // Make buttons interactive
            const yesHitArea = new Phaser.Geom.Rectangle(-100, 30, 90, 40);
            const yesHitAreaCallback = Phaser.Geom.Rectangle.Contains;
            confirmContainer.setInteractive(yesHitArea, yesHitAreaCallback);
            
            const noHitArea = new Phaser.Geom.Rectangle(10, 30, 90, 40);
            const noHitAreaCallback = Phaser.Geom.Rectangle.Contains;
            confirmContainer.setInteractive(noHitArea, noHitAreaCallback);
            
            // Yes button action
            confirmContainer.on('pointerdown', (pointer) => {
                if (yesHitArea.contains(pointer.x - confirmContainer.x, pointer.y - confirmContainer.y)) {
                    scene.cameras.main.fade(500, 0, 0, 0);
                    scene.time.delayedCall(500, () => {
                        // Properly restart the scene by stopping it first
                        scene.scene.restart();
                    });
                    confirmContainer.destroy();
                } else if (noHitArea.contains(pointer.x - confirmContainer.x, pointer.y - confirmContainer.y)) {
                    confirmContainer.destroy();
                }
            });
            
            // Animation for dialog appearance
            confirmContainer.setScale(0.8);
            confirmContainer.setAlpha(0);
            
            scene.tweens.add({
                targets: confirmContainer,
                scale: 1,
                alpha: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        return resetButton;
    }
    
    /**
     * Adds a reset and back button to the scene
     * 
     * @param {Phaser.Scene} scene - The current scene
     * @param {string} backTarget - The scene to navigate to when back is clicked
     * @param {string} resetTarget - The current scene for resetting
     */
    static addLevelControlButtons(scene, backTarget, resetTarget) {
        // Create back button in top left
        this.createBackButton(scene, backTarget, 80, 40);
        
        // Create reset button in top right
        this.createResetButton(scene, resetTarget, scene.cameras.main.width - 40, 40);
    }
    
    /**
     * Create a completion button with customizable text
     * 
     * @param {Phaser.Scene} scene - The current scene
     * @param {string} text - Button text
     * @param {string} targetScene - The scene to navigate to when clicked
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {object} options - Optional parameters like width, height
     * @return {Phaser.GameObjects.Container} - The button container
     */
    static createCompleteButton(scene, text, targetScene, x, y, options = {}) {
        const width = options.width || 200;
        const height = options.height || 50;
        
        const buttonContainer = scene.add.container(x, y);
        
        // Button background
        const buttonBg = scene.add.graphics();
        buttonBg.fillStyle(0x00aa00, 1);
        buttonBg.fillRoundedRect(-width/2, -height/2, width, height, 10);
        buttonBg.lineStyle(2, 0x00ff00, 1);
        buttonBg.strokeRoundedRect(-width/2, -height/2, width, height, 10);
        
        // Button text
        const buttonText = scene.add.text(0, 0, text, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#ffffff',
            align: 'center',
            fontStyle: 'bold'
        });
        
        buttonText.setOrigin(0.5);
        
        // Add components to container
        buttonContainer.add(buttonBg);
        buttonContainer.add(buttonText);
        
        // Make interactive
        buttonContainer.setSize(width, height);
        buttonContainer.setInteractive({ useHandCursor: true });
        
        // Hover effects
        buttonContainer.on('pointerover', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x00cc00, 1);
            buttonBg.fillRoundedRect(-width/2, -height/2, width, height, 10);
            buttonBg.lineStyle(2, 0x66ff66, 1);
            buttonBg.strokeRoundedRect(-width/2, -height/2, width, height, 10);
            
            // Scale up slightly
            scene.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100,
                ease: 'Power1'
            });
        });
        
        buttonContainer.on('pointerout', () => {
            buttonBg.clear();
            buttonBg.fillStyle(0x00aa00, 1);
            buttonBg.fillRoundedRect(-width/2, -height/2, width, height, 10);
            buttonBg.lineStyle(2, 0x00ff00, 1);
            buttonBg.strokeRoundedRect(-width/2, -height/2, width, height, 10);
            
            // Scale back to normal
            scene.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 100,
                ease: 'Power1'
            });
        });
        
        // Click action
        buttonContainer.on('pointerdown', () => {
            scene.cameras.main.fade(500, 0, 0, 0);
            scene.time.delayedCall(500, () => {
                scene.scene.start(targetScene);
            });
        });
        
        return buttonContainer;
    }
}