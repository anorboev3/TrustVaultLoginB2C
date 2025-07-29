// Azure B2C Customization Script
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        elementsToRemove: [
            '#api .intro h2',
            '#api .divider', 
            '#api .create'
        ],
        forgotPasswordSource: '#forgotPassword',
        forgotPasswordTarget: '#newForgotPassword'
    };

    // Function to wait for Azure B2C content to load
    function waitForB2CContent() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const apiElement = document.getElementById('api');
                    
                    // Check if B2C content has been injected
                    if (apiElement && (apiElement.children.length > 0 || apiElement.innerHTML.trim() !== '')) {
                        console.log('Azure B2C content loaded, applying customizations...');
                        applyCustomizations();
                        observer.disconnect(); // Stop observing once content is loaded
                    }
                }
            });
        });

        // Start observing the api element for changes
        const apiElement = document.getElementById('api');
        if (apiElement) {
            observer.observe(apiElement, {
                childList: true,
                subtree: true
            });
        }

        // Fallback: try to apply customizations after delays
        setTimeout(() => {
            if (document.getElementById('api').children.length > 0) {
                applyCustomizations();
                observer.disconnect();
            }
        }, 2000);

        // Additional fallback for slower loading
        setTimeout(() => {
            applyCustomizations();
        }, 5000);
    }

    // Main customization function
    function applyCustomizations() {
        try {
            console.log('Starting B2C customizations...');
            
            // Remove unwanted elements
            removeUnwantedElements();
            
            // Handle forgot password link transfer
            transferForgotPasswordLink();
            
            console.log('B2C customizations completed successfully');
        } catch (error) {
            console.error('Error applying B2C customizations:', error);
        }
    }

    // Function to physically remove unwanted elements
    function removeUnwantedElements() {
        CONFIG.elementsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    console.log(`Removing element: ${selector}`);
                    element.remove(); // Physically remove from DOM
                }
            });
        });
    }

    // Function to transfer forgot password link and remove original
    function transferForgotPasswordLink() {
        // Find the source forgot password element
        const sourceElement = document.querySelector(CONFIG.forgotPasswordSource);
        const targetElement = document.querySelector(CONFIG.forgotPasswordTarget);
        
        if (sourceElement && targetElement) {
            // Look for the forgot password link within the source element
            const forgotLink = sourceElement.querySelector('a[href*="forgotpassword"], a[href*="forgot"], a[href*="reset"]');
            
            if (forgotLink) {
                const href = forgotLink.href;
                console.log(`Found forgot password link: ${href}`);
                
                // Update the target link with the actual href
                targetElement.href = href;
                targetElement.target = '_self'; // Ensure it opens in the same window
                
                console.log(`Updated target link href to: ${href}`);
            } else {
                console.warn('Forgot password link not found in source element');
            }
            
            // Remove the original forgot password element
            console.log('Removing original forgot password element');
            sourceElement.remove();
        } else {
            if (!sourceElement) {
                console.warn('Source forgot password element not found');
            }
            if (!targetElement) {
                console.warn('Target forgot password element not found');
            }
        }
    }

    // Function to ensure elements stay removed (anti-tampering)
    function setupAntiTampering() {
        // Create a more aggressive observer to ensure elements stay removed
        const antiTamperObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Re-apply removal if elements are re-added
                    CONFIG.elementsToRemove.forEach(selector => {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(element => {
                            if (element && element.parentNode) {
                                console.log(`Re-removing tampering attempt: ${selector}`);
                                element.remove();
                            }
                        });
                    });
                }
            });
        });

        // Start anti-tampering observer
        const apiElement = document.getElementById('api');
        if (apiElement) {
            antiTamperObserver.observe(apiElement, {
                childList: true,
                subtree: true
            });
        }
    }

    // Enhanced removal function that handles dynamic content
    function aggressiveElementRemoval() {
        const removeElements = () => {
            CONFIG.elementsToRemove.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element) {
                        // Mark for removal to prevent re-appearance
                        element.style.display = 'none !important';
                        element.style.visibility = 'hidden !important';
                        element.setAttribute('data-removed', 'true');
                        
                        // Remove from DOM
                        setTimeout(() => {
                            if (element.parentNode) {
                                element.remove();
                            }
                        }, 100);
                    }
                });
            });
        };

        // Run removal multiple times to catch dynamic content
        removeElements();
        setTimeout(removeElements, 500);
        setTimeout(removeElements, 1000);
        setTimeout(removeElements, 2000);
    }

    // Initialize when DOM is ready
    function initialize() {
      debugger
        console.log('Initializing Azure B2C customization script...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                waitForB2CContent();
                setupAntiTampering();
            });
        } else {
            waitForB2CContent();
            setupAntiTampering();
        }

        // Check if content is already loaded
        const apiElement = document.getElementById('api');
        if (apiElement && apiElement.children.length > 0) {
            setTimeout(applyCustomizations, 100);
        }
    }

    // Expose functions globally for debugging/external access
    window.B2CCustomizer = {
        applyCustomizations,
        removeUnwantedElements,
        transferForgotPasswordLink,
        aggressiveElementRemoval,
        config: CONFIG
    };

    // Start initialization
    initialize();

})();