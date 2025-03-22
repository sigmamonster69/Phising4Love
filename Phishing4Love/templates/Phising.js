class SwipeApp {
    constructor() {
        this.profiles = [
            {
                name: 'Uni, 69',
                bio: 'Software Engineer | Travel Enthusiast',
                image: 'https://media.tenor.com/Mt_aY20VYPkAAAAe/uni-unico.png'
            },
            {
                name: 'UNI again, 69',
                bio: 'Photographer | Mountain Climber',
                image: 'https://static.wikia.nocookie.net/24d105fc-1ba5-40d0-bb7f-0566fc45fe61'
            },
            // Add more profiles here...
        ];
        this.currentProfileIndex = 0;
        this.likedProfiles = [];
        this.dislikedProfiles = [];
        this.superLikedProfiles = []; // Track superliked profiles
        this.actionHistory = []; // Track actions

        this.initializeEventListeners();
        this.renderCurrentProfile();
    }

    renderCurrentProfile() {
        const profile = this.profiles[this.currentProfileIndex];
        const profileCard = document.getElementById('profile-card');
        const profileImage = profileCard.querySelector('.profile-image');
        const profileName = document.getElementById('profile-name');
        const profileBio = document.getElementById('profile-bio');

        profileImage.style.backgroundImage = `url(${profile.image})`;
        profileName.textContent = profile.name;
        profileBio.textContent = profile.bio;
    }

    initializeEventListeners() {
        document.getElementById('like-btn').addEventListener('click', () => this.swipeRight());
        document.getElementById('dislike-btn').addEventListener('click', () => this.swipeLeft());
        document.getElementById('superlike-btn').addEventListener('click', () => this.superLike());
        document.getElementById('boost-btn').addEventListener('click', () => this.boostProfile());
        document.getElementById('reverse-btn').addEventListener('click', () => this.reverseLastAction());
    }

    swipeRight() {
        this.likedProfiles.push(this.profiles[this.currentProfileIndex]);
        this.actionHistory.push({ action: 'like', profile: this.currentProfileIndex });
        this.animateHeart();
        this.moveToNextProfile();
    }

    swipeLeft() {
        this.dislikedProfiles.push(this.profiles[this.currentProfileIndex]);
        this.actionHistory.push({ action: 'dislike', profile: this.currentProfileIndex });
        this.animateDislike();
        this.moveToNextProfile();
    }

    superLike() {
        this.superLikedProfiles.push(this.profiles[this.currentProfileIndex]);
        this.actionHistory.push({ action: 'superlike', profile: this.currentProfileIndex });
        this.animateStar();
        this.moveToNextProfile();
    }

    boostProfile() {
        this.animateFire();
    }

    animateHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart-animation';
        document.body.appendChild(heart);
        setTimeout(() => {
            heart.remove();
        }, 1000); // Match the animation duration
    }

    animateStar() {
        const star = document.createElement('div');
        star.className = 'star-animation';
        document.body.appendChild(star);
        setTimeout(() => {
            star.remove();
        }, 1000); // Match the animation duration
    }

    animateFire() {
        const fire = document.createElement('div');
        fire.className = 'fire-animation';
        document.body.appendChild(fire);
        setTimeout(() => {
            fire.remove();
        }, 3000); // Match the animation duration
    }

    animateDislike() {
        const dislike = document.createElement('div');
        dislike.className = 'dislike-animation';
        dislike.textContent = '❌';
        document.body.appendChild(dislike);
        setTimeout(() => {
            dislike.remove();
        }, 500); // Match the animation duration
    }

    reverseLastAction() {
        if (this.actionHistory.length > 0) {
            const lastAction = this.actionHistory.pop();

            if (lastAction.action === 'like') {
                this.likedProfiles.pop();
            } else if (lastAction.action === 'dislike') {
                this.dislikedProfiles.pop();
            } else if (lastAction.action === 'superlike') {
                this.superLikedProfiles.pop();
            }

            this.currentProfileIndex = lastAction.profile;
            this.renderCurrentProfile();
        }
    }

    moveToNextProfile() {
        this.actionHistory.push({ action: 'next', profile: this.currentProfileIndex });
        this.currentProfileIndex++;
        if (this.currentProfileIndex >= this.profiles.length) {
            this.showNoMoreProfiles();
        } else {
            this.renderCurrentProfile();
        }
    }

    showNoMoreProfiles() {
        const profileCard = document.getElementById('profile-card');
        profileCard.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>No More Profiles</h2>
                <p>Check back later or expand your preferences!</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SwipeApp();
});
