// Auth state
let authState = {
    isAuthenticated: false,
    user: null
};

// Function to open Google auth popup
function openGoogleAuthPopup() {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
        'https://simple-pos-api.onrender.com/auth/google',
        'Google Auth',
        `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for message from popup
    window.addEventListener('message', (event) => {
        // Verify origin
        if (event.origin !== 'https://simple-pos-api.onrender.com') return;

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
            authState.isAuthenticated = true;
            authState.user = event.data.user;

            // Update UI
            updateAuthUI();

            // Close popup if it's still open
            if (popup) popup.close();
        }
    });
}

// Function to check auth status
async function checkAuthStatus() {
    try {
        const response = await fetch('https://simple-pos-api.onrender.com/auth/status', {
            credentials: 'include',
            mode: 'cors'
        });

        const data = await response.json();
        authState.isAuthenticated = data.authenticated;
        authState.user = data.user;

        // Update UI
        updateAuthUI();
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

// Function to update UI based on auth state
function updateAuthUI() {
    const loginButton = document.getElementById('loginButton');
    const userInfo = document.getElementById('userInfo');
    const logoutButton = document.getElementById('logoutButton');

    if (authState.isAuthenticated) {
        // Show user info and logout button
        if (loginButton) loginButton.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'block';
            userInfo.textContent = `Welcome, ${authState.user.displayName}`;
        }
        if (logoutButton) logoutButton.style.display = 'block';
    } else {
        // Show login button
        if (loginButton) loginButton.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'none';
    }
}

// Function to handle logout
async function handleLogout() {
    try {
        await fetch('https://simple-pos-api.onrender.com/logout', {
            credentials: 'include',
            mode: 'cors'
        });

        authState.isAuthenticated = false;
        authState.user = null;

        // Update UI
        updateAuthUI();
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');

    if (loginButton) {
        loginButton.addEventListener('click', openGoogleAuthPopup);
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Check initial auth status
    checkAuthStatus();
}); 