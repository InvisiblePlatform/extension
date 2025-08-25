/**
 * Authentication helper for Invisible Voice Safari Extension
 * This module handles retrieving auth tokens from the native app context
 */

// Store token in memory for quick access during the extension's lifetime
let cachedToken = null;

/**
 * Get the authentication token from the native app
 * Works in Safari extension environment by communicating with the native app
 * Falls back to browser.storage for other browsers
 * @returns {Promise<string|null>} The auth token or null if not available
 */
async function getAuthToken(anotherIdentifier = null) {
    // For iOS Safari Extension, we access the token via native messaging
    if (typeof browser !== 'undefined' && typeof browser.runtime.sendNativeMessage === 'function') {
        try {
            // Try different extension IDs for Safari extension native messaging
            const extensionIds = [
                "com.morkforid.invisible-voice-neo",
                "com.morkforid.invisible-voice-neo.Invisible-Voice",
                "group.com.morkforid.invisible-voice",
                "com.morkforid.invisible-voice-neo.Extension (C5N688B362)",
                "com.morkforid.invisible-voice-neo.Invisible-Voice (C5N688B362)",
                identifier // This should be defined in your extension context
            ];
            if (anotherIdentifier) {
                extensionIds.push(anotherIdentifier);
            }

            let foundToken = null;

            // Try each extension ID
            for (const extId of extensionIds) {
                try {
                    console.log(`Trying to get auth token with extension ID: ${extId}`);
                    const response = await browser.runtime.sendNativeMessage(extId, {
                        getAuthToken: true
                    });

                    if (response && response.success && response.token) {
                        cachedToken = response.token;
                        console.log(`Successfully retrieved token from native app using ID: ${extId}`);
                        foundToken = response.token;
                        browser.storage.local.set({ apiKey: foundToken });
                        break;
                    }
                } catch (specificError) {
                    console.log(`Error with extension ID ${extId}:`, specificError);
                }
            }

            if (foundToken) {
                return foundToken;
            }
        } catch (e) {
            console.log("All native messaging attempts failed, falling back to browser storage", e);
            // If all native messaging fails, continue to the storage-based approach
        }
    }

    // For other browsers, we use browser storage
    if (cachedToken) {
        return cachedToken;
    }
    console.log("No cached token found, retrieving from storage");
    try {
        const result = await browser.storage.local.get("apiKey");
        cachedToken = result.apiKey || null;
        return cachedToken;
    } catch (e) {
        console.error("Error retrieving auth token:", e);
        return null;
    }
}

/**
 * Apply the token to the current session if available
 * @returns {Promise<boolean>} Whether authentication was successful
 */
async function applyAuthTokenIfAvailable() {
    const token = await getAuthToken();
    if (token) {
        // Set the token in extension storage for consistency
        await browser.storage.local.set({ apiKey: token });
        // Update any global variables that may rely on the token
        if (typeof apiKey !== 'undefined') {
            apiKey = token;
        }
        return true;
    }
    return false;
}

// Export the functions
window.IV_Auth = {
    getAuthToken,
    applyAuthTokenIfAvailable
};
