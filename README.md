# FormGuard SDK

[![npm version](https://badge.fury.io/js/@formguard%2Fsdk.svg)](https://www.npmjs.com/package/@formguard/sdk)
[![Downloads](https://img.shields.io/npm/dm/@formguard/sdk.svg)](https://www.npmjs.com/package/@formguard/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/OmAiR1Kh/formguard-sdk.svg)](https://github.com/OmAiR1Kh/formguard-sdk/stargazers)

JavaScript SDK for FormGuard - Stop wasting time on fake form submissions. Detect bots, score lead quality, and track drop-offs automatically.

## Features

✅ **Lead Quality Scoring** - Automatically score every submission 0-100  
✅ **Bot Detection** - Detect VPNs, proxies, and disposable emails  
✅ **Drop-off Tracking** - See exactly where users abandon your forms  
✅ **Multi-step Forms** - Track progress through complex forms  
✅ **Real-time Actions** - Block, flag, or allow submissions instantly  
✅ **Lightweight** - Only 9KB minified  
✅ **Framework Agnostic** - Works with React, Vue, Angular, vanilla JS  
✅ **TypeScript Support** - Full type definitions included

---

## Installation

### Via NPM

```bash
npm install @formguard/sdk
```

### Via Yarn

```bash
yarn add @formguard/sdk
```

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@formguard/sdk@latest/dist/formguard.js"></script>
```

---

## Quick Start

### 1. Get Your API Key

Sign up at [formguard](https://formguard-mu.vercel.app) and create a form to get your API key.

### 2. Basic Usage (Vanilla JavaScript)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Contact Form</title>
  </head>
  <body>
    <form id="contactForm">
      <input type="email" name="email" placeholder="Email" required />
      <input type="text" name="name" placeholder="Name" required />
      <button type="submit">Submit</button>
    </form>

    <!-- Load FormGuard SDK -->
    <script src="https://cdn.jsdelivr.net/npm/@formguard/sdk@latest/dist/formguard.js"></script>

    <script>
      // Initialize FormGuard
      FormGuard.init("fg_live_your_api_key_here");

      // Handle form submission
      document
        .getElementById("contactForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();

          const form = e.target;

          try {
            const result = await FormGuard.submit({
              email: form.email.value,
              fields: {
                name: form.name.value,
              },
            });

            if (result.allowed) {
              // ✅ High quality submission - proceed
              console.log("Quality Score:", result.qualityScore);
              form.submit();
            } else if (result.action === "flagged") {
              // ⚠️ Low quality - review manually
              console.log("Submission flagged for review");
              alert("Your submission will be reviewed");
            } else {
              // 🚫 Blocked - likely spam
              console.log("Submission blocked");
              alert("Submission blocked due to quality concerns");
            }
          } catch (error) {
            console.error("FormGuard error:", error);
            // Fail open - allow submission if FormGuard fails
            form.submit();
          }
        });
    </script>
  </body>
</html>
```

---

## Framework Examples

### React / Next.js

```tsx
import { useEffect } from "react";
import FormGuard from "@formguard/sdk";

function ContactForm() {
  useEffect(() => {
    FormGuard.init({
      apiKey: "fg_live_your_api_key_here",
      debug: process.env.NODE_ENV === "development",
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    try {
      const result = await FormGuard.submit({
        email: form.email.value,
        fields: {
          name: form.name.value,
          company: form.company.value,
        },
      });

      if (result.allowed) {
        // Process the form
        console.log("Quality Score:", result.qualityScore);
      } else {
        alert(`Submission ${result.action}: Score ${result.qualityScore}`);
      }
    } catch (error) {
      console.error("FormGuard error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="name" type="text" placeholder="Name" required />
      <input name="company" type="text" placeholder="Company" />
      <button type="submit">Submit</button>
    </form>
  );
}

export default ContactForm;
```

### Vue.js

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="name" type="text" placeholder="Name" required />
    <button type="submit">Submit</button>
  </form>
</template>

<script>
import FormGuard from "@formguard/sdk";

export default {
  data() {
    return {
      email: "",
      name: "",
    };
  },
  mounted() {
    FormGuard.init({
      apiKey: "fg_live_your_api_key_here",
      debug: true,
    });
  },
  methods: {
    async handleSubmit() {
      try {
        const result = await FormGuard.submit({
          email: this.email,
          fields: {
            name: this.name,
          },
        });

        if (result.allowed) {
          console.log("Quality Score:", result.qualityScore);
          // Process form
        } else {
          alert(`Submission ${result.action}`);
        }
      } catch (error) {
        console.error("FormGuard error:", error);
      }
    },
  },
};
</script>
```

### Angular

```typescript
import { Component, OnInit } from "@angular/core";
import FormGuard from "@formguard/sdk";

@Component({
  selector: "app-contact-form",
  template: `
    <form (ngSubmit)="onSubmit()">
      <input
        [(ngModel)]="email"
        name="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        [(ngModel)]="name"
        name="name"
        type="text"
        placeholder="Name"
        required
      />
      <button type="submit">Submit</button>
    </form>
  `,
})
export class ContactFormComponent implements OnInit {
  email = "";
  name = "";

  ngOnInit() {
    FormGuard.init({
      apiKey: "fg_live_your_api_key_here",
    });
  }

  async onSubmit() {
    try {
      const result = await FormGuard.submit({
        email: this.email,
        fields: {
          name: this.name,
        },
      });

      if (result.allowed) {
        console.log("Quality Score:", result.qualityScore);
      } else {
        alert(`Submission ${result.action}`);
      }
    } catch (error) {
      console.error("FormGuard error:", error);
    }
  }
}
```

---

## Advanced Usage

### Multi-Step Forms

Track user progress through multi-step forms to identify drop-off points:

```javascript
FormGuard.init("fg_live_your_api_key_here");

// Track when user completes each step
function goToStep(stepNumber) {
  FormGuard.trackStep(stepNumber);
  showStep(stepNumber);
}

// Track field validation errors
function validateEmail(email) {
  if (!isValidEmail(email)) {
    FormGuard.trackError("email", "Invalid email format");
    return false;
  }
  return true;
}

// Track when user abandons the form
window.addEventListener("beforeunload", () => {
  const currentStep = getCurrentStep();
  FormGuard.trackDropOff(currentStep);
});

// Final submission
async function submitForm() {
  const result = await FormGuard.submit({
    email: form.email.value,
    fields: getAllFormData(),
  });

  if (result.allowed) {
    // Process submission
  }
}
```

### Custom Completion Time

By default, FormGuard tracks completion time from initialization. You can override this:

```javascript
const startTime = Date.now();

// ... user fills form ...

const completionTime = Math.floor((Date.now() - startTime) / 1000); // seconds

const result = await FormGuard.submit({
  email: form.email.value,
  fields: { name: form.name.value },
  completionTime: completionTime,
});
```

### Custom Device/Browser Detection

Override automatic detection:

```javascript
const result = await FormGuard.submit({
  email: form.email.value,
  fields: { name: form.name.value },
  device: "Mobile", // or 'Desktop', 'Tablet'
  browser: "Chrome", // or 'Firefox', 'Safari', etc.
});
```

### Debug Mode

Enable debug logging to see what's happening:

```javascript
FormGuard.init({
  apiKey: "fg_live_your_api_key_here",
  debug: true, // Logs all events to console
});
```

### Custom API URL (Self-Hosted)

If you're self-hosting FormGuard:

```javascript
FormGuard.init({
  apiKey: "fg_live_your_api_key_here",
  apiUrl: "https://your-api-domain.com/api/v1/ingestion",
});
```

---

## API Reference

### `FormGuard.init(config)`

Initialize the SDK. Must be called before any other methods.

**Parameters:**

```typescript
config: string | {
  apiKey: string;        // Required: Your FormGuard API key
  apiUrl?: string;       // Optional: Custom API URL
  debug?: boolean;       // Optional: Enable debug logging
}
```

**Example:**

```javascript
// Simple initialization
FormGuard.init("fg_live_your_api_key_here");

// With options
FormGuard.init({
  apiKey: "fg_live_your_api_key_here",
  debug: true,
  apiUrl: "https://custom-api.com/api/v1/ingestion",
});
```

---

### `FormGuard.submit(data)`

Submit form data for quality analysis.

**Parameters:**

```typescript
data: {
  email: string;                    // Required: User's email
  fields: Record<string, any>;      // Required: All form fields
  completionTime?: number;          // Optional: Time in seconds
  device?: string;                  // Optional: 'Desktop' | 'Mobile' | 'Tablet'
  browser?: string;                 // Optional: Browser name
}
```

**Returns:** `Promise<SubmissionResponse>`

```typescript
{
  success: boolean;
  allowed: boolean; // true if submission should proceed
  action: "allowed" | "flagged" | "blocked";
  qualityScore: number; // 0-100
  flags: {
    vpn: boolean;
    proxy: boolean;
    disposableEmail: boolean;
    duplicate: boolean;
    fastCompletion: boolean;
  }
  submissionId: string; // Unique submission ID
}
```

**Example:**

```javascript
const result = await FormGuard.submit({
  email: "user@example.com",
  fields: {
    name: "John Doe",
    company: "Acme Inc",
    message: "Hello world",
  },
});

console.log("Quality Score:", result.qualityScore);
console.log("Action:", result.action);
console.log("Flags:", result.flags);
```

---

### `FormGuard.trackStep(step)`

Track when a user completes a step in a multi-step form.

**Parameters:**

- `step` (number): The step number (1, 2, 3, etc.)

**Example:**

```javascript
FormGuard.trackStep(1); // User completed step 1
FormGuard.trackStep(2); // User completed step 2
```

---

### `FormGuard.trackError(field, errorMessage?)`

Track field validation errors.

**Parameters:**

- `field` (string): Name of the field with the error
- `errorMessage` (string, optional): Description of the error

**Example:**

```javascript
FormGuard.trackError("email", "Invalid email format");
FormGuard.trackError("phone", "Phone number required");
```

---

### `FormGuard.trackDropOff(step?, field?)`

Track when a user abandons the form.

**Parameters:**

- `step` (number, optional): The step where they dropped off
- `field` (string, optional): The field they were on

**Example:**

```javascript
// On page unload
window.addEventListener("beforeunload", () => {
  FormGuard.trackDropOff(2, "phone");
});
```

---

## Understanding Quality Scores

FormGuard assigns each submission a quality score from 0-100 based on multiple signals:

### Scoring Factors

| Signal                   | Impact | Description                                |
| ------------------------ | ------ | ------------------------------------------ |
| **Disposable Email**     | -30    | Uses tempmail.com, guerrillamail.com, etc. |
| **VPN Detection**        | -25    | Submission comes through a VPN             |
| **Proxy Detection**      | -25    | Submission comes through a proxy           |
| **Fast Completion**      | -20    | Form completed in less than 5 seconds      |
| **Duplicate Submission** | -15    | Same email submitted within 24 hours       |
| **Country Mismatch**     | -10    | Location doesn't match expected country    |

### Score Ranges

- **80-100**: High quality lead ✅
- **50-79**: Medium quality - worth following up 📧
- **20-49**: Low quality - likely spam ⚠️
- **0-19**: Very low quality - almost certainly fake 🚫

### Actions

Based on your form settings and the quality score:

- **allowed**: Submission passes all checks
- **flagged**: Low score, review manually
- **blocked**: Very low score or triggered auto-block rule

---

## Dashboard Features

View detailed analytics in your FormGuard dashboard:

- 📊 **Quality Score Distribution** - See the breakdown of submission quality
- 📉 **Drop-off Analysis** - Identify where users abandon your forms
- 🚨 **Flagged Submissions** - Review suspicious submissions
- 🔍 **Field Error Tracking** - See which fields cause the most problems
- 📈 **Submission Trends** - Track submissions over time
- 🌍 **Geographic Data** - See where your submissions come from
- 🤖 **Bot Detection Stats** - Monitor VPN, proxy, and disposable email usage

---

## Best Practices

### 1. Fail Open, Not Closed

Always handle errors gracefully. If FormGuard fails, allow the submission:

```javascript
try {
  const result = await FormGuard.submit({ ... });
  if (result.allowed) {
    processForm();
  }
} catch (error) {
  console.error('FormGuard error:', error);
  // Still process the form
  processForm();
}
```

### 2. Show User-Friendly Messages

Don't expose technical details to users:

```javascript
if (result.action === 'blocked') {
  alert('We couldn't process your submission. Please contact support.');
} else if (result.action === 'flagged') {
  alert('Your submission is under review. We\'ll get back to you soon.');
}
```

### 3. Review Flagged Submissions

Don't automatically reject flagged submissions. Review them in your dashboard first.

### 4. Adjust Thresholds Based on Your Needs

In the dashboard, customize:

- Auto-block threshold
- VPN blocking
- Disposable email blocking

Different forms have different needs. A newsletter signup can be more lenient than a demo request form.

### 5. Track Everything in Multi-Step Forms

The more data you send, the better insights you get:

```javascript
// Track all steps
FormGuard.trackStep(1);
FormGuard.trackStep(2);
FormGuard.trackStep(3);

// Track all errors
FormGuard.trackError("email");
FormGuard.trackError("phone");

// Track drop-offs
window.addEventListener("beforeunload", () => {
  FormGuard.trackDropOff(currentStep);
});
```

---

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import FormGuard from "@formguard/sdk";

interface FormData {
  email: string;
  name: string;
  company?: string;
}

const handleSubmit = async (data: FormData) => {
  const result = await FormGuard.submit({
    email: data.email,
    fields: {
      name: data.name,
      company: data.company,
    },
  });

  // result is fully typed
  console.log(result.qualityScore); // number
  console.log(result.action); // 'allowed' | 'flagged' | 'blocked'
  console.log(result.flags.vpn); // boolean
};
```

---

## Browser Support

FormGuard SDK works in all modern browsers:

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Minimum requirements:

- ES2015+ support
- Fetch API
- Promise support

For older browsers, include polyfills.

---

## Security & Privacy

### Data Collection

FormGuard collects:

- ✅ Email address
- ✅ Form field data you send
- ✅ IP address (for fraud detection)
- ✅ Device type and browser
- ✅ Completion time
- ❌ No passwords
- ❌ No payment information
- ❌ No tracking across sites

### GDPR Compliance

FormGuard is GDPR compliant:

- Data is encrypted in transit and at rest
- Users can request data deletion
- Data retention policies in place
- Privacy policy available at formguard-mu.vercel.app/privacy

### Data Storage

- Data is stored securely in encrypted databases
- We don't sell or share your data
- You can export or delete your data anytime

---

## FAQ

### How much does FormGuard cost?

See pricing at [formguard pricing](https://formguard-mu.vercel.app/#pricing)

- **Free**: 100 submissions/month
- **Starter**: $9/mo - 1,000 submissions
- **Pro**: $29/mo - 5,000 submissions
- **Agency**: $79/mo - 20,000 submissions

### Does FormGuard slow down my forms?

No. The SDK is only 9KB and all API calls are asynchronous. Average response time is under 200ms.

### What happens if FormGuard is down?

The SDK has built-in error handling. If the API is unreachable, the SDK will fail gracefully and your forms will continue to work.

### Can I use FormGuard with any form?

Yes! FormGuard works with:

- Custom HTML forms
- React forms
- Vue forms
- Angular forms
- WordPress forms
- Any JavaScript-based form

### Do I need a backend?

No. FormGuard handles all the processing. You just need to integrate the SDK in your frontend.

### Can I self-host FormGuard?

Not yet, but we're working on it. Contact us if you're interested.

### How accurate is the bot detection?

FormGuard uses multiple signals to detect bots:

- IP reputation databases
- Disposable email detection (99%+ accuracy)
- VPN/proxy detection (95%+ accuracy)
- Behavioral analysis

False positives are rare, and you can always review flagged submissions.

---

## Support

### Documentation

Full documentation: [formguard docs](https://www.npmjs.com/package/@formguard/sdk)

### Issues

Found a bug? [Open an issue on GitHub](https://github.com/OmAiR1Kh/formguard-sdk/issues)

### Email

Contact us: support@formguard.com

### Community

Join our Discord: [discord.gg/formguard](https://discord.gg/formguard)

---

## Changelog

### v1.0.0 (2026-01-01)

- 🎉 Initial release
- ✅ Lead quality scoring
- ✅ Bot detection (VPN, proxy, disposable email)
- ✅ Drop-off tracking
- ✅ Multi-step form support
- ✅ TypeScript support
- ✅ Framework agnostic

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Credits

Built with ❤️ by [Omair Khoder](https://github.com/OmAiR1Kh)

---

## Links

- 🌐 Website: [formguard](https://formguard-mu.vercel.app)
- 📦 NPM: [@formguard/sdk](https://www.npmjs.com/package/@formguard/sdk)
- 📚 Documentation: [formguard](https://www.npmjs.com/package/@formguard/sdk)
- 🐙 GitHub: [github.com/OmAiR1Kh/formguard-sdk](https://github.com/OmAiR1Kh/formguard-sdk)
- 🐦 Twitter: [@formguard](https://twitter.com/formguard)

---

**Ready to stop wasting time on fake leads?**

```bash
npm install @formguard/sdk
```

[Get Started →](https://formguard-mu.vercel.app/register)
