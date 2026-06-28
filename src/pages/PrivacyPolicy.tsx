export const PrivacyPolicy = ({ supportEmail }: { supportEmail: string }) => {
  return (
    <div className="flex flex-col gap-6 max-w-lg m-auto">
      <h1 className="underline">Privacy Policy</h1>
      <h1>Effective Date: 20/03/2025</h1>

      <div className="flex flex-col gap-2">
        <h2 className="underline">1. Introduction</h2>
        <p>
          Welcome to Shelfie ("we," "our," or "us"). Your privacy is important
          to us. This Privacy Policy explains how we collect, use, and protect
          your information when you use our website, www.shelfie.georgesheppard.dev (the
          "Service").
        </p>
        <p>
          By using Shelfie, you agree to the collection and use of information
          as described in this policy.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="underline">2. Information We Collect</h2>
        <p>
          We collect the following types of information when you use our
          Service:
        </p>
        <ul>
          <li>
            <strong>Images</strong>: We collect and store images of your
            bookshelf to generate book recommendations.
          </li>
          <li>
            <strong>Email (Optional)</strong>: If you provide your email, we use
            it to send you recommendations. If you sign up for recurring
            recommendations, we retain your email until you opt out.
          </li>
          <li>
            <strong>IP Address</strong>: We collect your IP address to determine
            your country and tailor our services accordingly. We do not store
            full IP addresses.
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="underline">3. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul>
          <li>
            To generate book recommendations based on the images you upload.
          </li>
          <li>To send recommendations via email, if you provide your email.</li>
          <li>To provide recurring recommendations if you opt in.</li>
          <li>To tailor our service based on your country.</li>
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="underline">4. Data Storage & Security</h2>
        <p>
          Images are stored securely on our servers. Emails are encrypted for
          security. We delete one-time-use emails after sending recommendations
          unless you have subscribed to recurring recommendations. You can
          request the deletion of your data at any time.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="underline">5. Third-Party Services</h2>
        <p>We use third-party services to operate our Service:</p>
        <ul>
          <li>
            <strong>Mailgun</strong>: We use Mailgun to send recommendation
            emails.
          </li>
          <li>
            <strong>OpenAI</strong>: We use OpenAI to generate book
            recommendations.
          </li>
        </ul>
        <p>
          These third parties may process data on our behalf but are required to
          handle it securely.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="underline">6. User Rights & Controls</h2>
        <p>You have the following rights: </p>
        <ul>
          <li>
            <strong>Opt-Out</strong>: You can unsubscribe from recurring emails
            at any time.
          </li>
          <li>
            <strong>Data Deletion</strong>: You can request that we delete your
            stored images and any associated data.
          </li>
          <li>
            <strong>Access & Updates</strong>: You can request access to any
            personal data we hold about you.
          </li>
        </ul>
        <p>To exercise your rights, contact us at {supportEmail}.</p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="underline">7. Cookies & Tracking</h2>
        <p>We do not use cookies or tracking technologies on our website.</p>
      </div>
      <div className="flex flex-col gap-2">
        <h2>8. Children's Privacy</h2>
        <p>
          There are no age restrictions for using our Service. However, we do
          not knowingly collect personal information from children under 13. If
          you believe a child has provided us with personal data, please contact
          us, and we will remove it.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="underline">9. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated "Effective Date." Continued use
          of our Service after changes means you accept the revised policy.
        </p>
      </div>
      <div>
        <h2 className="underline">10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at {supportEmail}.
        </p>
      </div>
    </div>
  );
};
