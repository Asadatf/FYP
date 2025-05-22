from flask import Flask, jsonify
import random
from flask_cors import CORS
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

print("Loading model...")
# Use the model path as specified
MODEL_NAME = "distilbert/distilgpt2" 

# Load the model directly
try:
    print(f"Attempting to load {MODEL_NAME}...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)
    
    # Fix padding token issues
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
        
    model.to("cpu")  # Force CPU to avoid GPU issues
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    tokenizer = None
    print("Will use fallback message generation")

# Different types of phishing prompts for variety
PHISHING_PROMPTS = [
    "Write a convincing phishing email asking users to verify their bank account due to suspicious activity.",
    "Generate a fake PayPal security notification claiming unusual login attempts.",
    "Create a phishing email pretending to be from Microsoft about an expired password.",
    "Write a deceptive email claiming to be from Amazon about a suspicious purchase requiring verification.",
    "Generate a phishing email about a fake invoice requiring immediate payment."
]

# Different types of legitimate prompts
LEGITIMATE_PROMPTS = [
    "Write a professional email confirming a customer's subscription renewal.",
    "Generate a standard order confirmation email for an online purchase.",
    "Create a routine account notification email from a bank.",
    "Write a standard password change confirmation email.",
    "Generate a professional email confirming an appointment."
]

def generate_text_with_model(prompt, max_length=150):
    """Generate text using the model directly."""
    if model is None or tokenizer is None:
        return ""
    
    try:
        # Encode the prompt with attention mask
        inputs = tokenizer(prompt, return_tensors="pt", padding=True)
        attention_mask = inputs.get("attention_mask", None)
        
        # Generate text
        with torch.no_grad():
            outputs = model.generate(
                inputs["input_ids"],
                attention_mask=attention_mask,
                max_length=max_length,
                pad_token_id=tokenizer.pad_token_id,
                num_return_sequences=1,
                do_sample=True,
                temperature=0.9,
                top_p=0.95,
                top_k=50,
            )
        
        # Decode the generated text
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Remove the prompt from the output
        if prompt in generated_text:
            return generated_text[len(prompt):].strip()
        else:
            return generated_text.strip()
    except Exception as e:
        print(f"Error in text generation: {e}")
        return ""

def is_phishing_text(text):
    """Analyze if the text appears to be a phishing message."""
    phishing_indicators = [
        'urgent', 'account suspended', 'verify immediately', 'click here',
        'password expired', 'unusual activity', 'suspicious login',
        'confirm identity', 'limited time offer', 'act now',
        'verify your account', 'security breach', 'unauthorized access'
    ]
    
    text_lower = text.lower()
    return any(indicator in text_lower for indicator in phishing_indicators)

def get_phishing_domain(company):
    """Generate phishing domains based on company name."""
    company_name = company.lower().replace(' ', '')
    phishing_domains = [
        f"{company_name}-secure.com",
        f"{company_name}1.com",
        f"secure-{company_name}.net",
        f"{company_name}-verify.org",
        f"{company_name}-accounts.info"
    ]
    return random.choice(phishing_domains)

def get_company_name():
    """Get a random company name for the message."""
    companies = [
        'PayPal', 'Amazon', 'Netflix', 'Microsoft', 'Apple', 
        'Google', 'Facebook', 'Twitter', 'Bank of America', 'Chase'
    ]
    return random.choice(companies)

@app.route('/api/messages', methods=['GET'])
def generate_message():
    try:
        # Decide if this will be a phishing or legitimate message
        is_phishing = random.random() < 0.5
        
        # Select appropriate prompt
        if is_phishing:
            prompt = random.choice(PHISHING_PROMPTS)
        else:
            prompt = random.choice(LEGITIMATE_PROMPTS)
        
        # Add some context to the prompt for better results
        company = get_company_name()
        prompt = prompt.replace('PayPal', company).replace('Microsoft', company).replace('Amazon', company)
        
        # Generate text using the model
        message_text = generate_text_with_model(prompt)
        
        # Clean up text and limit length
        if message_text:
            message_text = message_text.replace('\n', ' ').strip()
            message_text = message_text[:300]  # Limit to 300 chars
        
        # Fall back to templates if text generation failed or text is too short
        if not message_text or len(message_text) < 20:
            # Use template-based fallback
            if is_phishing:
                phishing_templates = [
                    f"We've detected unusual login attempts on your {company} account. Please verify your identity immediately to prevent account suspension.",
                    f"Your {company} account has been temporarily limited due to suspicious activities. Verify your information to restore full access.",
                    f"Your {company} account security may have been compromised. Please reset your password within 24 hours to protect your account.",
                    f"We couldn't process your last {company} payment. Update your billing information to avoid service interruption.",
                    f"Unusual purchase activity detected on your {company} account. Please verify this transaction was authorized."
                ]
                message_text = random.choice(phishing_templates)
            else:
                legitimate_templates = [
                    f"Your monthly {company} account statement is now available. You can view it by logging into your account through our official website.",
                    f"Thank you for your recent purchase from {company}. Your order has been confirmed and is being processed. You can check the status anytime in your account.",
                    f"This is a confirmation that your {company} subscription has been successfully renewed for another term. No action is required.",
                    f"Your {company} password was successfully changed. If you didn't make this change, please contact our support team through the official website.",
                    f"We're writing to inform you that your {company} support ticket has been resolved. Please let us know if you need any further assistance."
                ]
                message_text = random.choice(legitimate_templates)
        
        # Generate message metadata
        if is_phishing:
            phishing_domain = get_phishing_domain(company)
            sender = f"security@{phishing_domain}"
            subject = f"URGENT: {company} Security Alert"
            
            # Add phishing URL for extra realism if not already present
            if random.random() < 0.7 and "http" not in message_text:
                message_text += f" Please verify at: http://{phishing_domain}/verify"
        else:
            sender = f"info@{company.lower().replace(' ', '')}.com"
            subject = f"{company} Account Notification"
        
        # Final check if it's phishing based on content
        final_is_phishing = is_phishing or is_phishing_text(message_text)
        
        print(f"Generated {'phishing' if final_is_phishing else 'legitimate'} message for {company}")
        
        return jsonify({
            "text": message_text,
            "subject": subject,
            "sender": sender,
            "isPhishing": final_is_phishing,
            "type": "email"
        })
    
    except Exception as e:
        print(f"Error generating message: {str(e)}")
        # Fallback to a pre-written message
        return jsonify(get_fallback_message())

def get_fallback_message():
    """Generate a fallback message if the model fails."""
    is_phishing = random.random() < 0.5
    company = get_company_name()
    
    if is_phishing:
        return {
            "text": f"We've detected unusual activity on your {company} account. Please verify your identity immediately to prevent account suspension.",
            "subject": f"URGENT: {company} Security Alert",
            "sender": f"security@{company.lower().replace(' ', '')}1.com",
            "isPhishing": True,
            "type": "email"
        }
    else:
        return {
            "text": f"Thank you for your recent purchase from {company}. Your order has been confirmed and is being processed.",
            "subject": f"{company} Order Confirmation",
            "sender": f"no-reply@{company.lower().replace(' ', '')}.com",
            "isPhishing": False,
            "type": "email"
        }

if __name__ == '__main__':
    port = 5001
    print(f"Starting message service on port {port}...")
    app.run(host='0.0.0.0', port=port)