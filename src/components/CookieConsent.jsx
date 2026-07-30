import React from "react";
import { Link } from "@tanstack/react-router";

const CONSENT_KEY = "adv_cookie_consent_v1";

function getStoredConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function storeConsent(status, analyticsEnabled) {
  try {
    window.localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({
        status,
        analytics: analyticsEnabled,
        savedAt: new Date().toISOString(),
      }),
    );
  } catch {
    // Browsers can block storage in private modes. The site still works without persistence.
  }
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showPreferences, setShowPreferences] = React.useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(false);

  React.useEffect(() => {
    if (!getStoredConsent()) {
      setIsVisible(true);
    }
  }, []);

  const saveChoice = (status, analytics) => {
    storeConsent(status, analytics);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <section
      className="cookie-consent"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <h2 id="cookie-consent-title" className="cookie-consent__sr-only">
        Cookie preferences
      </h2>
      <p id="cookie-consent-description" className="cookie-consent__copy">
        We use essential cookies to make our site work. With your consent, we may also use
        non-essential cookies to improve user experience and analyze website traffic. By clicking
        "Accept," you agree to our website's cookie use as described in our{" "}
        <Link to="/privacy-policy/">Cookie Policy</Link>. You can change your cookie settings at
        any time by clicking "Preferences."
      </p>

      {showPreferences ? (
        <div className="cookie-consent__preferences" aria-label="Cookie settings">
          <div className="cookie-consent__preference-row">
            <div>
              <strong>Essential cookies</strong>
              <span>Required for navigation, security, and basic website functions.</span>
            </div>
            <span className="cookie-consent__status">Always on</span>
          </div>
          <label className="cookie-consent__preference-row cookie-consent__preference-row--toggle">
            <span>
              <strong>Analytics cookies</strong>
              <span>Help ADV understand page performance and improve content.</span>
            </span>
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(event) => setAnalyticsEnabled(event.target.checked)}
            />
          </label>
        </div>
      ) : null}

      <div className="cookie-consent__actions">
        <button
          className="cookie-consent__button cookie-consent__button--outline"
          type="button"
          aria-expanded={showPreferences}
          onClick={() => setShowPreferences((value) => !value)}
        >
          Preferences
        </button>
        <button
          className="cookie-consent__button cookie-consent__button--light"
          type="button"
          onClick={() => saveChoice("declined", false)}
        >
          Decline
        </button>
        <button
          className="cookie-consent__button cookie-consent__button--primary"
          type="button"
          onClick={() =>
            showPreferences
              ? saveChoice("custom", analyticsEnabled)
              : saveChoice("accepted", true)
          }
        >
          {showPreferences ? "Save preferences" : "Accept"}
        </button>
      </div>
    </section>
  );
}
