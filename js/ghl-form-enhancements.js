/**
 * GoHighLevel Form Enhancements for Sentinel Peak Solutions
 * Improves form UX, validation, and integration with n8n workflows
 */

class SentinelGHLEnhancer {
    constructor() {
        this.forms = new Map();
        this.webhookEndpoint = 'https://your-n8n-instance.com/webhook/ghl-form-submission';
        this.init();
    }
    
    init() {
        this.setupFormEnhancements();
        this.setupProgressiveDisclosure();
        this.setupRealTimeValidation();
        this.setupAnalytics();
        this.setupAccessibility();
    }
    
    /**
     * Enhanced form detection and setup
     */
    setupFormEnhancements() {
        // Find all GHL iframes and forms
        const ghlIframes = document.querySelectorAll('iframe[data-form-id]');
        const nativeForms = document.querySelectorAll('form[data-ghl-form]');
        
        ghlIframes.forEach(iframe => {
            this.enhanceGHLIframe(iframe);
        });
        
        nativeForms.forEach(form => {
            this.enhanceNativeForm(form);
        });
        
        // Set up form submission monitoring
        this.monitorFormSubmissions();
    }
    
    /**
     * Enhance GHL iframe forms with additional functionality
     */
    enhanceGHLIframe(iframe) {
        const formId = iframe.getAttribute('data-form-id');
        const formName = iframe.getAttribute('data-form-name');
        
        // Add loading state
        this.addLoadingOverlay(iframe);
        
        // Monitor iframe load
        iframe.addEventListener('load', () => {
            this.removeLoadingOverlay(iframe);
            this.setupIframeMessaging(iframe, formId);
        });
        
        // Store form reference
        this.forms.set(formId, {
            type: 'iframe',
            element: iframe,
            name: formName,
            enhanced: true
        });
    }
    
    /**
     * Setup progressive disclosure for complex forms
     */
    setupProgressiveDisclosure() {
        // Show business valuation questions only for equity partnership interest
        document.addEventListener('change', (e) => {
            if (e.target.name === 'service_interest' || e.target.name === 'serviceInterest') {
                const showEquityFields = e.target.value === 'equity_partnership';
                this.toggleConditionalFields('equity-fields', showEquityFields);
            }
            
            if (e.target.name === 'business_type' || e.target.name === 'businessType') {
                const showRevenueFields = e.target.value === 'existing_business';
                this.toggleConditionalFields('revenue-fields', showRevenueFields);
            }
        });
    }
    
    /**
     * Toggle conditional form fields
     */
    toggleConditionalFields(fieldGroup, show) {
        const fields = document.querySelectorAll(`[data-conditional-group=\"${fieldGroup}\"]`);
        fields.forEach(field => {
            if (show) {
                field.classList.add('show');
                field.style.display = 'block';
                // Enable validation for shown fields
                const inputs = field.querySelectorAll('input, select, textarea');
                inputs.forEach(input => input.removeAttribute('disabled'));
            } else {
                field.classList.remove('show');
                field.style.display = 'none';
                // Disable validation for hidden fields
                const inputs = field.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.setAttribute('disabled', 'true');
                    input.value = '';
                });
            }
        });
    }
    
    /**
     * Real-time form validation with UX improvements
     */
    setupRealTimeValidation() {
        document.addEventListener('input', (e) => {
            const field = e.target;
            if (!field.closest('[data-ghl-form]') && !field.closest('iframe[data-form-id]')) return;
            
            this.validateField(field);
        });
        
        document.addEventListener('blur', (e) => {
            const field = e.target;
            if (!field.closest('[data-ghl-form]') && !field.closest('iframe[data-form-id]')) return;
            
            this.validateField(field, true);
        });
    }
    
    /**
     * Field-specific validation with business logic
     */
    validateField(field, showErrors = false) {
        const fieldContainer = field.closest('.form-group') || field.parentElement;
        let isValid = true;
        let errorMessage = '';
        
        // Email validation with business domain detection
        if (field.type === 'email') {
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            isValid = emailRegex.test(field.value);
            
            if (isValid && this.isBusinessEmail(field.value)) {
                this.addFieldBadge(fieldContainer, '🏢 Business Email', 'business-email');
            }
            
            if (!isValid && showErrors) {
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation with formatting
        if (field.type === 'tel' || field.name.includes('phone')) {
            const formatted = this.formatPhoneNumber(field.value);
            if (formatted !== field.value) {
                field.value = formatted;
            }
            isValid = formatted.length >= 14; // (555) 555-5555
            
            if (!isValid && showErrors) {
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // Revenue validation with formatting
        if (field.name === 'annual_revenue' || field.name === 'annualRevenue') {
            const numericValue = field.value.replace(/[^0-9]/g, '');
            const formattedValue = this.formatCurrency(numericValue);
            
            if (formattedValue !== field.value) {
                field.value = formattedValue;
            }
            
            // Add qualification indicator
            const revenue = parseInt(numericValue);
            if (revenue >= 100000) {
                this.addFieldBadge(fieldContainer, '🎯 Equity Qualified', 'equity-qualified');
            } else {
                this.removeFieldBadge(fieldContainer, 'equity-qualified');
            }
        }
        
        // Update field state
        this.updateFieldState(fieldContainer, isValid, errorMessage);
        
        return isValid;
    }
    
    /**
     * Setup analytics tracking for form interactions
     */
    setupAnalytics() {
        // Track form starts
        document.addEventListener('focus', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                const form = e.target.closest('form, iframe[data-form-id]');
                if (form && !form.dataset.analyticsStarted) {
                    form.dataset.analyticsStarted = 'true';
                    this.trackEvent('form_started', {
                        form_name: form.getAttribute('data-form-name') || 'unknown',
                        form_id: form.getAttribute('data-form-id') || 'unknown',
                        page_url: window.location.href
                    });
                }
            }
        });
        
        // Track form completions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.hasAttribute('data-ghl-form')) {
                this.trackEvent('form_submitted', {
                    form_name: form.getAttribute('data-form-name') || 'unknown',
                    form_id: form.getAttribute('data-form-id') || 'unknown',
                    page_url: window.location.href,
                    submission_time: new Date().toISOString()
                });
            }
        });
    }
    
    /**
     * Enhanced accessibility features
     */
    setupAccessibility() {
        // Add aria-labels to form fields
        document.querySelectorAll('input, select, textarea').forEach(field => {
            if (!field.getAttribute('aria-label') && !field.getAttribute('aria-labelledby')) {
                const label = field.closest('.form-group')?.querySelector('label');
                if (label) {
                    field.setAttribute('aria-labelledby', label.id || `label-${Date.now()}`);
                    if (!label.id) {
                        label.id = `label-${Date.now()}`;
                    }
                }
            }
        });
        
        // Improve keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const activeElement = document.activeElement;
                if (activeElement?.tagName === 'IFRAME') {
                    // Handle iframe focus
                    this.handleIframeFocus(activeElement, e);
                }
            }
        });
    }
    
    /**
     * Utility functions
     */
    
    isBusinessEmail(email) {
        const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
        const domain = email.split('@')[1]?.toLowerCase();
        return domain && !freeProviders.includes(domain);
    }
    
    formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\\D/g, '');
        const match = cleaned.match(/^(\\d{3})(\\d{3})(\\d{4})$/);
        return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
    }
    
    formatCurrency(value) {
        if (!value) return '';
        const number = parseInt(value);
        return `$${number.toLocaleString()}`;
    }
    
    addFieldBadge(container, text, className) {
        this.removeFieldBadge(container, className);
        const badge = document.createElement('span');
        badge.className = `field-badge ${className}`;
        badge.textContent = text;
        container.appendChild(badge);
    }
    
    removeFieldBadge(container, className) {
        const existing = container.querySelector(`.field-badge.${className}`);
        if (existing) {
            existing.remove();
        }
    }
    
    updateFieldState(container, isValid, errorMessage) {
        container.classList.toggle('error', !isValid && errorMessage);
        container.classList.toggle('success', isValid);
        
        // Update error message
        let errorElement = container.querySelector('.error-message');
        if (!isValid && errorMessage) {
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                container.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        } else if (errorElement) {
            errorElement.remove();
        }
    }
    
    addLoadingOverlay(iframe) {
        const overlay = document.createElement('div');
        overlay.className = 'ghl-loading-overlay';
        overlay.innerHTML = `
            <div class=\"loading-spinner\"></div>
            <p>Loading form...</p>
        `;
        iframe.parentElement.appendChild(overlay);
    }
    
    removeLoadingOverlay(iframe) {
        const overlay = iframe.parentElement.querySelector('.ghl-loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    setupIframeMessaging(iframe, formId) {
        window.addEventListener('message', (event) => {
            if (event.source !== iframe.contentWindow) return;
            
            const { type, data } = event.data;
            
            switch (type) {
                case 'form_submission':
                    this.handleFormSubmission(formId, data);
                    break;
                case 'form_validation_error':
                    this.handleValidationError(formId, data);
                    break;
            }
        });
    }
    
    handleFormSubmission(formId, data) {
        // Send to n8n webhook for advanced processing
        if (this.webhookEndpoint) {
            fetch(this.webhookEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formId,
                    submissionData: data,
                    timestamp: new Date().toISOString(),
                    pageUrl: window.location.href,
                    userAgent: navigator.userAgent
                })
            }).catch(error => {
                console.warn('Failed to send to n8n webhook:', error);
            });
        }
        
        this.trackEvent('ghl_form_completed', {
            form_id: formId,
            ...data
        });
    }
    
    handleValidationError(formId, data) {
        this.trackEvent('form_validation_error', {
            form_id: formId,
            errors: data
        });
    }
    
    trackEvent(eventName, properties) {
        // Send to analytics (Google Analytics, etc.)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Console log for development
        console.log('GHL Form Event:', eventName, properties);
    }
    
    monitorFormSubmissions() {
        // Monitor for successful form submissions and show thank you messages
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Look for GHL success messages
                        const successMessages = node.querySelectorAll('[class*=\"success\"], [class*=\"thank\"]');
                        successMessages.forEach(message => {
                            this.enhanceSuccessMessage(message);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    enhanceSuccessMessage(messageElement) {
        // Add custom styling and next steps
        messageElement.style.cssText += `
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
            color: white;
            padding: 2rem;
            border-radius: var(--radius-lg);
            margin: 1rem 0;
            box-shadow: 0 10px 30px rgba(44, 139, 139, 0.3);
        `;
        
        // Add next steps information
        const nextSteps = document.createElement('div');
        nextSteps.className = 'success-next-steps';
        nextSteps.innerHTML = `
            <h4>What happens next?</h4>
            <ul>
                <li>✅ We'll review your information within 2 hours</li>
                <li>📞 Our team will contact you to discuss your needs</li>
                <li>📊 We'll prepare a custom analysis for your business</li>
            </ul>
        `;
        messageElement.appendChild(nextSteps);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sentinelGHLEnhancer = new SentinelGHLEnhancer();
});

// CSS styles for enhanced forms
const formEnhancementStyles = `
<style>
.ghl-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    z-index: 10;
    border-radius: var(--radius-lg);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid var(--color-primary-light);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

.field-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-radius: var(--radius-sm);
    margin-left: 0.5rem;
    font-weight: 500;
}

.field-badge.business-email {
    background: rgba(44, 139, 139, 0.1);
    color: var(--color-primary-light);
    border: 1px solid var(--color-primary-light);
}

.field-badge.equity-qualified {
    background: rgba(255, 215, 0, 0.1);
    color: #ffd700;
    border: 1px solid #ffd700;
    animation: pulse 2s infinite;
}

.form-group.conditional {
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease;
}

.form-group.conditional.show {
    opacity: 1;
    max-height: 200px;
    margin: 1rem 0;
}

.success-next-steps {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.success-next-steps h4 {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
}

.success-next-steps ul {
    list-style: none;
    padding: 0;
}

.success-next-steps li {
    padding: 0.25rem 0;
    font-size: 0.9rem;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', formEnhancementStyles);