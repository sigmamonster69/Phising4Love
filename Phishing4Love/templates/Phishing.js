class SwipeApp {
    constructor() {
        this.profiles = [
            {
                name: 'Fred, 69',
                bio: 'Software Engineer | Travel under the seas',
                image: {
                    sprite: 'fish1.aseprite',
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                }
            },
            {
                name: 'Bill, 69',
                bio: 'Photographer | Mountain Climber',
                image: {
                    sprite: 'fish2.aseprite',
                    x: 100,
                    y: 0,
                    width: 100,
                    height: 100
                }
            },
            {
                name: 'Jack, 69',
                bio: 'Startup Eternpure | codes in rust',
                image: {
                    sprite: 'fish3.aseprite',
                    x: 100,
                    y: 0,
                    width: 100,
                    height: 100
                }
            }
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

        profileImage.style.backgroundImage = `url(${profile.image.sprite})`;
        profileName.textContent = profile.name;
        profileBio.textContent = profile.bio;
    }

    initializeEventListeners() {
        document.getElementById('like-btn').addEventListener('click', () => this.swipeRight());
        document.getElementById('dislike-btn').addEventListener('click', () => this.swipeLeft());
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

    animateHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart-animation';
        document.body.appendChild(heart);
        setTimeout(() => {
            heart.remove();
        }, 1000); // Match the animation duration
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
