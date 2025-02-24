class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create loading visual indicator
        this.createLoadingUI();
        
        // Try to load assets with error handling
        this.loadGameAssets();
        
        // Handle loading complete
        this.load.on('complete', () => {
            console.log('All assets loaded successfully');
        });
    }
    
    createLoadingUI() {
        // Add loading text
        const loadingText = this.add.text(this.cameras.main.width / 2, 200, 'Loading...', {
            fontSize: '32px',
            fontFamily: 'Orbitron, Arial',
            fill: '#00ffff'
        }).setOrigin(0.5);
        
        // Create a loading bar
        const progressBox = this.add.graphics();
        const progressBar = this.add.graphics();
        
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        // Update progress bar as assets load
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        
        // Clean up progress bar when done
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }
    
    loadGameAssets() {
        try {
            // Basic fallback assets that don't require files
            this.createFallbackAssets();
            
            // Try to load actual assets - with fallbacks if files aren't found
            this.load.image('background', 'assets/background.png');
            this.load.image('player', 'assets/player.png');
            this.load.image('crosshair', 'assets/crosshair.png');
            this.load.image('particle', 'assets/particle.png');
            
            // Add audio with error handling
            this.load.audio('click', 'assets/click.mp3');
            this.load.audio('bgmusic', 'assets/bgmusic.mp3');
        } catch (error) {
            console.warn('Error loading assets:', error);
            // We'll continue with fallback assets
        }
    }
    
    createFallbackAssets() {
        // Create basic texture for background if file isn't found
        const bgTexture = this.textures.createCanvas('fallback-bg', 800, 600);
        const bgContext = bgTexture.getContext();
        bgContext.fillStyle = '#0a0a2a';
        bgContext.fillRect(0, 0, 800, 600);
        
        // Add grid pattern
        bgContext.strokeStyle = '#00ffff44';
        bgContext.lineWidth = 1;
        
        // Draw grid
        for (let x = 0; x <= 800; x += 40) {
            bgContext.beginPath();
            bgContext.moveTo(x, 0);
            bgContext.lineTo(x, 600);
            bgContext.stroke();
        }
        
        for (let y = 0; y <= 600; y += 40) {
            bgContext.beginPath();
            bgContext.moveTo(0, y);
            bgContext.lineTo(800, y);
            bgContext.stroke();
        }
        
        bgTexture.refresh();
        
        // Create player texture
        const playerTexture = this.textures.createCanvas('fallback-player', 60, 30);
        const playerContext = playerTexture.getContext();
        playerContext.fillStyle = '#00ffff';
        playerContext.fillRect(0, 0, 60, 30);
        playerTexture.refresh();
        
        // Create crosshair texture
        const crosshairTexture = this.textures.createCanvas('fallback-crosshair', 20, 20);
        const crossContext = crosshairTexture.getContext();
        crossContext.strokeStyle = '#00ffff';
        crossContext.lineWidth = 2;
        
        // Draw crosshair
        crossContext.beginPath();
        crossContext.moveTo(10, 0);
        crossContext.lineTo(10, 20);
        crossContext.moveTo(0, 10);
        crossContext.lineTo(20, 10);
        crossContext.stroke();
        
        crosshairTexture.refresh();
    }

    create() {
        console.log('BootScene completed, starting MenuScene');
        
        // Add transition effect
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.time.delayedCall(1000, () => {
            this.scene.start('MenuScene');
        });
    }
}