let authState = {
  isAuthenticated: false,
  user: null,
};

const BACKEND_URL = "https://simple-pos-api.onrender.com";
const FRONTEND_URL = "https://simple-pos-api.netlify.app";

function openGoogleAuthPopup() {
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    `${BACKEND_URL}/auth/google`,
    "Google Auth",
    `width=${width},height=${height},left=${left},top=${top}`
  );

  // Listen for message from popup
  window.addEventListener("message", (event) => {
    console.log("PostMessage received:", event.origin, event.data);

    // Accept only messages from our own frontend
    if (event.origin !== FRONTEND_URL) return;

    if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
      authState.isAuthenticated = true;
      authState.user = event.data.user;

      updateAuthUI();

      if (popup) popup.close();
    }
  });
}

async function checkAuthStatus() {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/status`, {
      credentials: "include",
      mode: "cors",
    });

    const data = await response.json();
    authState.isAuthenticated = data.authenticated;
    authState.user = data.user;

    updateAuthUI();
  } catch (error) {
    console.error("Error checking auth status:", error);
  }
}

function updateAuthUI() {
  const loginButton = document.getElementById("loginButton");
  const userInfo = document.getElementById("userInfo");
  const logoutButton = document.getElementById("logoutButton");
  const appMessage = document.getElementById("appMessage");
  const productForm = document.getElementById("productForm");

  productForm.style.display = "none";

  if (authState.isAuthenticated) {
    if (loginButton) loginButton.style.display = "none";
    if (userInfo) {
      userInfo.style.display = "block";
      userInfo.textContent = `Welcome, ${authState.user.displayName}`;
      console.log("userInfo:", userInfo.textContent);
    }
    if (logoutButton) logoutButton.style.display = "block";
    if (appMessage) appMessage.textContent = "Ready for testing";
    productForm.style.display = "flex";
  } else {
    if (loginButton) loginButton.style.display = "block";
    if (userInfo) userInfo.style.display = "none";
    if (logoutButton) logoutButton.style.display = "none";
    if (appMessage)
      appMessage.textContent =
        "Please sign in with Google to access this feature.";
    productForm.style.display = "none";
  }
}

async function handleLogout() {
  try {
    await fetch(`${BACKEND_URL}/logout`, {
      credentials: "include",
      mode: "cors",
    });

    authState.isAuthenticated = false;
    authState.user = null;

    updateAuthUI();
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logoutButton");

  if (loginButton) {
    loginButton.addEventListener("click", openGoogleAuthPopup);
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  checkAuthStatus();
});
