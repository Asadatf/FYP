// src/data/quizData.js
// This file serves as a repository for all quiz data

const quizData = {
  // Quiz 1: Network Security Fundamentals
  1: {
    id: 1,
    title: "Network Security Fundamentals",
    description:
      "Test your knowledge of basic network security concepts, protocols, and best practices to protect digital infrastructure from cyber threats.",
    timeLimit: 15, // minutes
    totalQuestions: 10,
    category: "Network Security",
    difficulty: "Beginner",
    passingScore: 70,
    featuredImage: "/path/to/network-security-image.jpg",
    questions: [
      {
        id: 1,
        question: "Which of the following is NOT a common type of firewall?",
        options: [
          "Packet-filtering firewall",
          "Stateful inspection firewall",
          "Proxy firewall",
          "Quantum encryption firewall",
        ],
        correctAnswer: 3, // Index of correct answer
        explanation:
          "Quantum encryption firewall is not a standard type of firewall. The common types are packet-filtering, stateful inspection, proxy, and next-generation firewalls.",
        hint: "Think about which technologies are currently commercially available.",
      },
      {
        id: 2,
        question: "What is the primary purpose of network segmentation?",
        options: [
          "To increase network speed",
          "To limit access between network parts for security",
          "To reduce hardware costs",
          "To simplify network management",
        ],
        correctAnswer: 1,
        explanation:
          "Network segmentation divides a network into multiple segments or subnets, each acting as its own small network, which improves security by limiting access between different parts of the network.",
        hint: "Consider the security principle of least privilege.",
      },
      {
        id: 3,
        question:
          "Which protocol is typically considered more secure for website connections?",
        options: ["HTTP", "HTTPS", "FTP", "Telnet"],
        correctAnswer: 1,
        explanation:
          "HTTPS (Hypertext Transfer Protocol Secure) encrypts the data sent between your browser and the website, making it more secure than HTTP, FTP, or Telnet.",
        hint: "Look for the protocol that offers encryption.",
      },
      {
        id: 4,
        question: 'What does the "CIA triad" refer to in cybersecurity?',
        options: [
          "Central Intelligence Agencys security framework",
          "Confidentiality, Integrity, and Availability",
          "Critical Infrastructure Assessment",
          "Cyber Intelligence Alliance",
        ],
        correctAnswer: 1,
        explanation:
          "The CIA triad refers to Confidentiality, Integrity, and Availability, which are the three key components of information security.",
        hint: "These are the three fundamental security objectives.",
      },
      {
        id: 5,
        question:
          "Which of these is an example of a social engineering attack?",
        options: [
          "SQL injection",
          "Distributed Denial of Service (DDoS)",
          "Phishing",
          "Buffer overflow",
        ],
        correctAnswer: 2,
        explanation:
          "Phishing is a type of social engineering attack where attackers attempt to trick users into revealing sensitive information by pretending to be a trustworthy entity.",
        hint: "Which attack primarily targets human psychology rather than technical vulnerabilities?",
      },
    ],
  },

  // Quiz 2: Phishing Attack Recognition
  2: {
    id: 2,
    title: "Phishing Attack Recognition",
    description:
      "Learn to identify common phishing techniques and prevention methods to protect yourself and your organization from social engineering attacks.",
    timeLimit: 20,
    totalQuestions: 15,
    category: "Social Engineering",
    difficulty: "Intermediate",
    passingScore: 70,
    featuredImage: "/path/to/phishing-image.jpg",
    questions: [
      // Phishing quiz questions would be listed here
    ],
  },

  // Quiz 3: Advanced Malware Analysis
  3: {
    id: 3,
    title: "Advanced Malware Analysis",
    description:
      "Test your knowledge of malware types, analysis techniques, and defensive strategies against sophisticated malicious software.",
    timeLimit: 30,
    totalQuestions: 20,
    category: "Malware Defense",
    difficulty: "Advanced",
    passingScore: 70,
    featuredImage: "/path/to/malware-image.jpg",
    questions: [
      // Malware quiz questions would be listed here
    ],
  },

  // Quiz 4: Industrial Espionage & Cyber Warfare
  4: {
    id: 4,
    title: "Industrial Espionage & Cyber Warfare",
    description:
      "Test your knowledge of industrial espionage, cyber terrorism, and information warfare concepts. Learn about modern threats to organizations and nations in the digital age.",
    timeLimit: 20,
    totalQuestions: 10,
    category: "Advanced Cyber Threats",
    difficulty: "Intermediate",
    passingScore: 70,
    featuredImage: "/path/to/cyber-warfare-image.jpg",
    questions: [
      {
        id: 1,
        question: "Which of the following BEST describes industrial espionage?",
        options: [
          "Hacking government websites for political reasons",
          "Stealing trade secrets or intellectual property from competing companies",
          "Defacing websites to make political statements",
          "Using ransomware to extort money from businesses",
        ],
        correctAnswer: 1,
        explanation:
          "Industrial espionage specifically refers to the theft of trade secrets, proprietary information, intellectual property, or other confidential business information by competitors or nation-states to gain competitive advantage.",
        hint: "Think about activities specifically targeting business advantages.",
      },
      {
        id: 2,
        question:
          "What tool is commonly used in industrial espionage to record keystrokes on a target's computer?",
        options: ["Firewall", "Keylogger", "Antivirus", "VPN"],
        correctAnswer: 1,
        explanation:
          "A keylogger is a type of surveillance software that records keystrokes made on a computer keyboard. In espionage, it's used to capture credentials, communications, and sensitive information typed by the target.",
        hint: "This tool captures every button pressed on a keyboard.",
      },
      {
        id: 3,
        question:
          'Which of the following is considered an "insider threat" in the context of industrial espionage?',
        options: [
          "A hacker breaking into a company network from outside",
          "Malware downloaded from a suspicious website",
          "An employee stealing confidential documents for a competitor",
          "A phishing email sent to company employees",
        ],
        correctAnswer: 2,
        explanation:
          "An insider threat refers to employees, contractors, or business associates who have legitimate access to an organization's systems but misuse that access to steal, damage, or expose sensitive information.",
        hint: "Consider who already has authorized access to company resources.",
      },
      {
        id: 4,
        question:
          "What is the primary difference between cyber terrorism and hacktivism?",
        options: [
          "Cyber terrorism is always performed by nation-states, while hacktivism is by individuals",
          "Cyber terrorism aims to cause fear or physical harm, while hacktivism is primarily political protest",
          "Cyber terrorism only targets government institutions, while hacktivism targets corporations",
          "Cyber terrorism uses malware, while hacktivism only uses DDoS attacks",
        ],
        correctAnswer: 1,
        explanation:
          "Cyber terrorism is designed to cause fear, panic, physical harm, or severe economic damage, often with political or ideological motivations. Hacktivism, while also politically motivated, focuses more on disruption, information disclosure, or website defacement as forms of protest without intent to cause physical harm.",
        hint: "Consider the ultimate goals and potential real-world impacts of each activity.",
      },
      {
        id: 5,
        question:
          "Which critical infrastructure sector has been a frequent target of state-sponsored cyber attacks?",
        options: [
          "Restaurants and food service",
          "Entertainment and media",
          "Energy and power grids",
          "Retail stores",
        ],
        correctAnswer: 2,
        explanation:
          "Energy infrastructure, particularly power grids, has been a common target for state-sponsored attacks because disrupting power can have cascading effects on other critical services and cause significant economic damage or public safety issues.",
        hint: "Think about which infrastructure would cause the most disruption if attacked.",
      },
      {
        id: 6,
        question: "The 2010 Stuxnet worm is a famous example of:",
        options: [
          "Corporate espionage between competing tech companies",
          "Hacktivists protesting government surveillance",
          "Cyber criminals stealing credit card information",
          "State-sponsored cyber warfare targeting physical infrastructure",
        ],
        correctAnswer: 3,
        explanation:
          "Stuxnet is widely regarded as the first major cyber weapon used by nation-states. It specifically targeted Iranian nuclear facilities and was designed to physically damage centrifuges by manipulating their control systems while hiding its presence.",
        hint: "This was designed to cause physical damage to specific industrial equipment.",
      },
      {
        id: 7,
        question:
          "Which of the following techniques is MOST commonly used in the initial stages of industrial espionage?",
        options: [
          "Breaking into office buildings to steal documents",
          "Spear phishing targeted at specific employees",
          "Jamming wireless signals",
          "Direct hacking of mainframe computers",
        ],
        correctAnswer: 1,
        explanation:
          "Spear phishing involves sending targeted, personalized emails to specific individuals with access to valuable information. It's typically the first step in gaining initial access to systems for industrial espionage because it exploits human vulnerabilities rather than technical ones.",
        hint: "Consider which method requires the least technical skill but high success rates.",
      },
      {
        id: 8,
        question: 'What is "information warfare" in the cyber context?',
        options: [
          "Using only denial-of-service attacks to disrupt websites",
          "Strategic use of information and disinformation to gain advantages over adversaries",
          "Physically destroying computer equipment during conflicts",
          "Using only encryption to protect sensitive communications",
        ],
        correctAnswer: 1,
        explanation:
          "Information warfare refers to the strategic use of information and disinformation campaigns, often combined with cyber operations, to influence, disrupt, corrupt, or usurp enemy decision making while protecting one's own information systems and decision processes.",
        hint: "This concept extends beyond just technical attacks to include influence operations.",
      },
      {
        id: 9,
        question:
          "Which of the following is a growing trend in state-sponsored cyber warfare?",
        options: [
          "Decreasing focus on critical infrastructure",
          "Exclusively targeting military installations",
          "Increasing use of artificial intelligence and automation",
          "Reducing attribution complexity to clearly signal responsibility",
        ],
        correctAnswer: 2,
        explanation:
          "A major trend in cyber warfare is the increasing use of AI and automation to conduct more sophisticated, persistent, and scalable attacks while reducing human involvement. This includes automated vulnerability discovery, adaptive malware, and intelligent evasion techniques.",
        hint: "Consider how modern technology is changing attack capabilities.",
      },
      {
        id: 10,
        question:
          "What method would cybersecurity professionals MOST recommend to counter insider threats?",
        options: [
          "Installing antivirus software on all computers",
          "Implementing the principle of least privilege and access monitoring",
          "Blocking all external websites",
          "Prohibiting employees from using email",
        ],
        correctAnswer: 1,
        explanation:
          "The principle of least privilege (giving users only the access they need to perform their jobs) combined with robust monitoring of user activities, especially for sensitive data access, is the most effective approach to mitigating insider threats while balancing security and operational needs.",
        hint: "Think about balancing proper access control with the need to detect suspicious behavior.",
      },
    ],
  },
};

export default quizData;
