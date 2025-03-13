const fetch = require('node-fetch');

class MessageGenerator {
    static async generateMessage() {
        try {
            console.log('Attempting to call HuggingFace API...');
            const message = await this.getMessageFromAPI();
            return message;
        } catch (error) {
            console.error('API Error:', error);
            return this.getRandomPredefinedMessage();
        }
    }

    static async getMessageFromAPI() {
        // List of different prompts for variety
        const prompts = [
            "Generate a brief email: Your account requires an important security update.",
            "Write a short email notification about your recent order confirmation.",
            "Create an email about password reset request.",
            "Compose an email about unusual login activity detected.",
            "Write an email about subscription renewal."
        ];

        const prompt = prompts[Math.floor(Math.random() * prompts.length)];

        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                {
                    headers: {
                        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        inputs: prompt,
                        parameters: {
                            max_length: 100,
                            min_length: 30,
                            temperature: 0.9,
                            do_sample: true
                        },
                    }),
                }
            );

            console.log('API Response Status:', response.status);
            const result = await response.json();
            console.log('API Response Data:', result);

            // Extract the text from the response
            let generatedText;
            if (Array.isArray(result) && result[0]) {
                // Handle both generated_text and summary_text formats
                generatedText = result[0].generated_text || result[0].summary_text;
            } else if (typeof result === 'string') {
                generatedText = result;
            }

            if (!generatedText) {
                throw new Error('No valid text in API response');
            }

            // Clean up the text
            generatedText = generatedText
                .replace(/\n+/g, ' ')
                .trim();

            // Add some randomization to make messages more interesting
            const shouldBePhishing = Math.random() < 0.5;
            if (shouldBePhishing) {
                generatedText = this.makePhishing(generatedText);
            }

            return {
                text: generatedText,
                isPhishing: shouldBePhishing || this.analyzeIfPhishing(generatedText),
                type: 'email'
            };
        } catch (error) {
            console.error('Error in API call:', error);
            throw error;
        }
    }

    static makePhishing(text) {
        const phishingPrefixes = [
            'URGENT ACTION REQUIRED: ',
            'Security Alert - Immediate Action: ',
            'Account Suspension Warning: ',
            'Unauthorized Access Detected: ',
            'Final Warning: '
        ];

        const phishingSuffixes = [
            ' Click here to verify: http://bit.ly/secure-verify',
            ' Update your details now: http://security-update.net',
            ' Confirm your identity: http://account-verify.com',
            ' Login here to prevent suspension: http://secure-login.net',
            ' Update payment info: http://billing-update.com'
        ];

        const prefix = phishingPrefixes[Math.floor(Math.random() * phishingPrefixes.length)];
        const suffix = phishingSuffixes[Math.floor(Math.random() * phishingSuffixes.length)];

        return `${prefix}${text}${suffix}`;
    }

    static getRandomPredefinedMessage() {
        const messages = [
            {
                text: "Your account needs immediate verification. Click here to prevent suspension.",
                isPhishing: true,
                type: 'email'
            },
            {
                text: "Your monthly newsletter subscription has been delivered. Check your inbox for updates.",
                isPhishing: false,
                type: 'email'
            },
            {
                text: "URGENT: Your payment didn't process. Update details within 24hrs: http://bit.ly/fakelink",
                isPhishing: true,
                type: 'email'
            },
            {
                text: "Your support ticket #45678 has been resolved. Rate your experience.",
                isPhishing: false,
                type: 'email'
            },
            {
                text: "Netflix: New sign-in detected. Verify your account now: http://netf1ix-verify.com",
                isPhishing: true,
                type: 'email'
            },
            {
                text: "Your order #12345 has been shipped. Track your delivery status in your account.",
                isPhishing: false,
                type: 'email'
            }
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }

    static analyzeIfPhishing(text) {
        const phishingIndicators = [
            'urgent',
            'account suspended',
            'verify immediately',
            'click here',
            'password expired',
            'unusual activity',
            'suspicious login',
            'confirm identity',
            'limited time offer',
            'act now',
            'verify your account',
            'security breach',
            'unauthorized access',
            'account terminated',
            'suspicious activity',
            'bit.ly',
            'secure-verify',
            'account-verify',
            'billing-update'
        ];

        const text_lower = text.toLowerCase();
        return phishingIndicators.some(indicator => text_lower.includes(indicator));
    }
}

module.exports = MessageGenerator;