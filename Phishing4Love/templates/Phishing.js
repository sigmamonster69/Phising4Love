"use strict";

class PhishingGame {
    constructor() {
        this.emails = [
            {
                subject: "Urgent: Account Security Alert",
                sender: "secure@bank.com",
                body: "We noticed unusual activity on your account. Please verify your identity by clicking the link below.",
                isPhishing: true,
                image: "https://example.com/fish1.png"
            },
            {
                subject: "Your Subscription Will Expire Soon",
                sender: "support@streaming.com",
                body: "Renew your subscription now to continue enjoying our service. Click the link below to renew.",
                isPhishing: false,
                image: "https://example.com/fish2.png"
            },
            {
                subject: "Congratulations! You've Won a Prize",
                sender: "contests@lottery.com",
                body: "You've been selected as our lucky winner! Claim your prize by providing your personal details.",
                isPhishing: true,
                image: "https://example.com/fish3.png"
            }
        ];

        this.currentEmailIndex = 0;
        this.score = 0;
        this.trustLevel = 50;
        this.actionHistory = [];

        this.tinderContainer = document.querySelector(".tinder");
        this.cardsContainer = document.querySelector(".tinder--cards");
        this.nopeButton = document.getElementById("nope");
        this.loveButton = document.getElementById("love");
        this.infoButton = document.getElementById("info");
        this.infoPanel = document.querySelector(".tinder--info");

        this.initializeEventListeners();
        this.renderEmailCards();
        this.tinderContainer.classList.add("loaded");
    }

    initializeEventListeners() {
        this.nopeButton.addEventListener("click", () => this.swipeLeft());
        this.loveButton.addEventListener("click", () => this.swipeRight());
        this.infoButton.addEventListener("click", () => this.toggleInfoPanel());
        document.querySelector(".closeMe").addEventListener("click", () => this.toggleInfoPanel(true));
        document.querySelector(".covering").addEventListener("click", () => this.toggleInfoPanel(true));
    }

    renderEmailCards() {
        this.cardsContainer.innerHTML = "";
        this.emails.forEach((email, index) => {
            const card = document.createElement("div");
            card.className = `tinder--card ${index === 0 ? "cover" : ""}`;
            card.innerHTML = `
                <div class="profile-image" style="background-image: url(${email.image});"></div>
                <h3>${email.subject}</h3>
                <p><strong>From:</strong> ${email.sender}</p>
                <p>${email.body}</p>
            `;
            this.cardsContainer.appendChild(card);
            
            if (index === 0) {
                this.addHammerEvents(card);
            }
        });
    }

    addHammerEvents(card) {
        const hammertime = new Hammer(card);

        hammertime.on("pan", (event) => {
            card.classList.add("moving");
            this.tinderContainer.classList.toggle("tinder_love", event.deltaX > 0);
            this.tinderContainer.classList.toggle("tinder_nope", event.deltaX < 0);

            const rotate = event.deltaX * 0.03;
            card.style.transform = `translate(${event.deltaX}px, ${event.deltaY}px) rotate(${rotate}deg)`;
        });

        hammertime.on("panend", (event) => {
            card.classList.remove("moving");
            this.tinderContainer.classList.remove("tinder_love");
            this.tinderContainer.classList.remove("tinder_nope");

            const moveOutWidth = document.body.clientWidth;
            const keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;
            card.classList.toggle("removed", !keep);

            if (keep) {
                card.style.transform = "";
            } else {
                const endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
                const toX = event.deltaX > 0 ? endX : -endX;
                card.style.transform = `translate(${toX}px, ${event.deltaY}px) rotate(${event.deltaX * 0.03}deg)`;
                setTimeout(() => this.moveToNextEmail(), 300);
            }
        });
    }

    swipeRight() {
        this.makeDecision(true);
    }

    swipeLeft() {
        this.makeDecision(false);
    }

    makeDecision(isTrustworthy) {
        const currentEmail = this.emails[this.currentEmailIndex];
        let scoreChange = 0;

        if (isTrustworthy) {
            if (currentEmail.isPhishing) {
                // Trusted a phishing email
                scoreChange = -10;
            } else {
                // Correctly trusted a legitimate email
                scoreChange = 20;
            }
        } else {
            if (currentEmail.isPhishing) {
                // Correctly identified a phishing email
                scoreChange = 30;
            } else {
                // Incorrectly dismissed a legitimate email
                scoreChange = -15;
            }
        }

        this.score += scoreChange;
        this.trustLevel = Math.max(0, Math.min(100, this.trustLevel + scoreChange));
        this.moveToNextEmail();
    }

    moveToNextEmail() {
        this.currentEmailIndex++;
        
        if (this.currentEmailIndex >= this.emails.length) {
            this.showEndScreen();
            return;
        }
        
        const cards = document.querySelectorAll(".tinder--card");
        cards.forEach((card, index) => {
            card.style.zIndex = cards.length - index;
            card.style.transform = `scale(${(20 - index) / 20}) translateY(-${50 * index}px)`;
        });
        
        this.addHammerEvents(cards[0]);
    }

    showEndScreen() {
        const card = document.querySelector(".tinder--card");
        card.innerHTML = `
            <h2>Game Over!</h2>
            <p>Your final score: ${this.score}</p>
            <p>Trust accuracy: ${this.trustLevel}%</p>
        `;
    }

    toggleInfoPanel(close = false) {
        if (close) {
            this.infoPanel.style.top = "100vh";
        } else {
            this.infoPanel.style.top = "10%";
        }
        this.infoPanel.classList.toggle("active");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PhishingGame();
});
