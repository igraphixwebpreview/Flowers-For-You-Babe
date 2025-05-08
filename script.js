document.addEventListener('DOMContentLoaded', () => {
    const loadingBar = document.getElementById('loadingBar');
    const startButton = document.getElementById('startButton');
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingText = document.getElementById('loadingText');
    const startText = document.getElementById('startText');
    const heartsContainer = document.getElementById('hearts-container');
    const lightShow = document.getElementById('lightShow');
    const cardsSection = document.getElementById('cardsSection');

    // Track user's choices
    let userChoices = [];

    // Card data
    const cards = [
        {
            question: "Babe, you know I love you?",
            buttons: ["Yes I know", "No you don't"]
        },
        {
            question: "You know you are the queen and princess of gorgeousness right?",
            buttons: ["Of course, how you mean LOL!", "Yes babe, I know"]
        },
        {
            question: "Babe, not a question—just want to take the time to let you know that I love you so much, and you are my favorite person that ever happened to me!",
            buttons: ["Hmmm, I hope so!", "Wow, I love you too"]
        },
        {
            question: "Do you want to know a secret?",
            buttons: ["Yes sure", "Sure, I'm nervous"]
        },
        {
            question: "Are you sure darling? 😏",
            buttons: ["Yessssss", "Asiay babe, tell me"]
        }
    ];

    let currentCardIndex = 0;

    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 1;
        loadingBar.style.width = `${progress}%`;

        // When loading is complete
        if (progress >= 100) {
            clearInterval(loadingInterval);
            // Hide loading text and bar after 3 seconds
            setTimeout(() => {
                loadingText.classList.add('fade-out');
                document.querySelector('.loading-bar-container').classList.add('fade-out');
                // Show start text and button after 4 seconds
                setTimeout(() => {
                    startText.style.display = 'block';
                    // Force a reflow
                    void startText.offsetWidth;
                    startText.classList.add('fade-in');
                    setTimeout(() => {
                        startButton.style.display = 'block';
                        // Force a reflow
                        void startButton.offsetWidth;
                        startButton.classList.add('fade-in');
                    }, 500);
                }, 1000);
            }, 3000);
        }
    }, 30);

    // Create heart explosion effect
    function createHeartExplosion(x, y) {
        const numHearts = 30;
        
        for (let i = 0; i < numHearts; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            
            const angle = (Math.random() * Math.PI * 2);
            const distance = 100 + Math.random() * 200;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            heart.style.setProperty('--tx', `${tx}px`);
            heart.style.setProperty('--ty', `${ty}px`);
            
            const duration = 0.8 + Math.random() * 0.4;
            heart.style.animation = `heartExplosion ${duration}s ease-out forwards`;
            
            heartsContainer.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, duration * 1000);
        }
    }

    // Create falling hearts
    function createFallingHearts() {
        const container = document.querySelector('.falling-hearts');
        const heart = document.createElement('div');
        heart.className = 'falling-heart';
        heart.innerHTML = '❤';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDuration = `${2 + Math.random() * 3}s`;
        container.appendChild(heart);

        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    // Start light show
    function startLightShow() {
        loadingScreen.style.display = 'none';
        lightShow.style.display = 'block';
        
        // Create initial falling hearts
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createFallingHearts();
            }, i * 200);
        }

        // Continue creating hearts
        const heartInterval = setInterval(() => {
            createFallingHearts();
        }, 300);

        // Transition to cards after 5 seconds
        setTimeout(() => {
            clearInterval(heartInterval);
            document.querySelector('.transition-overlay').style.opacity = '1';
            
            setTimeout(() => {
                lightShow.style.display = 'none';
                cardsSection.style.display = 'flex';
                showCard(0);
            }, 1000);
        }, 5000);
    }

    // Function to send choices via WhatsApp
    function sendChoicesViaWhatsApp() {
        // Format the message
        const message = `💝 My Love's Choices 💝\n\n` +
            userChoices.map((choice, index) => 
                `Question ${index + 1}: ${cards[index].question}\n` +
                `Her Answer: ${choice}\n`
            ).join('\n') +
            `\n💖 She received my love letter and flowers! 💖`;

        // Create a popup asking for permission
        const popup = document.createElement('div');
        popup.className = 'whatsapp-popup';
        popup.innerHTML = `
            <div class="whatsapp-popup-content">
                <h3>💖 Share Your Journey 💖</h3>
                <p>Would you like to share your beautiful responses with Vernon?</p>
                <div class="whatsapp-buttons">
                    <button class="whatsapp-yes">Yes, Share Now 💝</button>
                    <button class="whatsapp-no">Maybe Later</button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        // Style the popup
        const style = document.createElement('style');
        style.textContent = `
            .whatsapp-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease-out;
            }
            .whatsapp-popup-content {
                background: white;
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            }
            .whatsapp-popup h3 {
                color: #ff4081;
                margin-bottom: 15px;
                font-size: 1.5rem;
            }
            .whatsapp-popup p {
                color: #666;
                margin-bottom: 20px;
                line-height: 1.5;
            }
            .whatsapp-buttons {
                display: flex;
                gap: 15px;
                justify-content: center;
            }
            .whatsapp-yes, .whatsapp-no {
                padding: 12px 24px;
                border: none;
                border-radius: 25px;
                font-size: 1rem;
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .whatsapp-yes {
                background: #ff4081;
                color: white;
            }
            .whatsapp-no {
                background: #f0f0f0;
                color: #666;
            }
            .whatsapp-yes:hover, .whatsapp-no:hover {
                transform: scale(1.05);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
        `;
        document.head.appendChild(style);

        // Handle button clicks
        const yesButton = popup.querySelector('.whatsapp-yes');
        const noButton = popup.querySelector('.whatsapp-no');

        yesButton.addEventListener('click', () => {
            // Encode the message for URL
            const encodedMessage = encodeURIComponent(message);
            const phoneNumber = '17584846768';
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
            popup.remove();
        });

        noButton.addEventListener('click', () => {
            popup.remove();
        });
    }

    // Show card with heart transition
    function showCard(index) {
        return new Promise((resolve) => {
            const cardsContainer = document.querySelector('.cards-container');
            
            // Create transition heart
            const heart = document.createElement('div');
            heart.className = 'transition-heart';
            document.body.appendChild(heart);

            // Start heart expansion animation
            heart.style.animation = 'heartExpand 0.5s ease-in-out forwards';

            // After heart expands, update card content
            setTimeout(() => {
                cardsContainer.innerHTML = '';

                const card = document.createElement('div');
                card.className = 'card';
                
                const question = document.createElement('div');
                question.className = 'card-question';
                question.textContent = cards[index].question;
                
                const buttons = document.createElement('div');
                buttons.className = 'card-buttons';
                
                cards[index].buttons.forEach(buttonText => {
                    const button = document.createElement('button');
                    button.className = 'card-button';
                    button.textContent = buttonText;
                    button.addEventListener('click', () => {
                        // Store the choice
                        userChoices.push(buttonText);
                        
                        if (index < cards.length - 1) {
                            transitionToNextCard(index + 1);
                            updateProgress(index + 1);
                        } else {
                            // Show love letter after last card
                            showLoveLetter();
                        }
                    });
                    buttons.appendChild(button);
                });

                card.appendChild(question);
                card.appendChild(buttons);
                cardsContainer.appendChild(card);

                // Start heart contraction animation
                heart.style.animation = 'heartContract 0.5s ease-in-out forwards';

                // Show new card after heart starts contracting
                setTimeout(() => {
                    card.classList.add('active');
                    resolve();
                }, 100);

                // Remove heart element after animation
                setTimeout(() => {
                    heart.remove();
                }, 500);
            }, 500);
        });
    }

    // Show love letter
    function showLoveLetter() {
        const loveLetter = document.getElementById('loveLetter');
        const letterContent = document.querySelector('.letter-content');
        
        // Hide cards section
        document.getElementById('cardsSection').style.display = 'none';
        
        // Show love letter
        loveLetter.style.display = 'flex';
        
        // Animate letter content
        setTimeout(() => {
            letterContent.classList.add('active');
        }, 100);

        // Handle letter button click
        const letterButton = document.querySelector('.letter-button');
        letterButton.addEventListener('click', () => {
            showEndScreen();
        });
    }

    // Show end screen
    function showEndScreen() {
        const endScreen = document.getElementById('endScreen');
        const loveLetter = document.getElementById('loveLetter');
        
        // Hide love letter
        loveLetter.style.display = 'none';
        
        // Show end screen
        endScreen.style.display = 'flex';
        
        // Animate end screen
        setTimeout(() => {
            endScreen.classList.add('active');
            // Send choices via WhatsApp after a short delay
            setTimeout(sendChoicesViaWhatsApp, 1000);
        }, 100);
    }

    // Transition to next card
    async function transitionToNextCard(index) {
        await showCard(index);
    }

    // Update progress indicator
    function updateProgress(index) {
        const hearts = document.querySelectorAll('.heart-progress');
        hearts.forEach((heart, i) => {
            heart.classList.toggle('active', i <= index);
        });
    }

    // Handle start button click
    startButton.addEventListener('click', (e) => {
        const rect = startButton.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        createHeartExplosion(x, y);
        startLightShow();
    });
}); 