# FormGuard SDK

JavaScript SDK for FormGuard form intelligence and lead quality scoring.

## Installation

### Via CDN (Recommended)

```html
<script src="https://cdn.formguard.com/sdk/v1/formguard.js"></script>
```

### Via NPM

```bash
npm install @formguard/sdk
```

## Quick Start

### Basic Usage

```javascript
// Initialize with your API key
FormGuard.init("fg_live_your_api_key_here");

// Track form submission
const form = document.querySelector("#contact-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const result = await FormGuard.submit({
    email: form.email.value,
    fields: {
      name: form.name.value,
      message: form.message.value,
    },
  });

  if (result.allowed) {
    // Proceed with submission
    form.submit();
  } else {
    // Handle blocked submission
    alert("Submission blocked due to quality concerns");
  }
});
```

### Multi-Step Forms

```javascript
FormGuard.init("fg_live_your_api_key_here");

// Track step changes
FormGuard.trackStep(1);
FormGuard.trackStep(2);
FormGuard.trackStep(3);

// Track field errors
FormGuard.trackError("email", "Invalid email format");

// Track drop-offs (when user leaves)
window.addEventListener("beforeunload", () => {
  FormGuard.trackDropOff(2, "phone");
});
```

### React Example

```jsx
import FormGuard from "@formguard/sdk";
import { useEffect, useState } from "react";

function ContactForm() {
  useEffect(() => {
    FormGuard.init("fg_live_your_api_key_here");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await FormGuard.submit({
      email: e.target.email.value,
      fields: {
        name: e.target.name.value,
      },
    });

    if (result.allowed) {
      // Process form
    } else {
      alert(`Blocked: Quality score ${result.qualityScore}`);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## API Reference

### `FormGuard.init(config)`

Initialize the SDK.

```javascript
FormGuard.init("fg_live_abc123");

// Or with options
FormGuard.init({
  apiKey: "fg_live_abc123",
  apiUrl: "https://api.formguard.com/api/v1/ingestion", // Optional
  debug: true, // Optional
});
```

### `FormGuard.submit(data)`

Submit form data for analysis.

```javascript
const result = await FormGuard.submit({
  email: 'user@example.com',
  fields: { name: 'John', company: 'Acme' },
  completionTime: 45, // Optional, auto-calculated
  device: 'Desktop', // Optional, auto-detected
  browser: 'Chrome', // Optional, auto-detected
});

// Response
{
  success: true,
  allowed: true,
  action: 'allowed', // 'allowed' | 'flagged' | 'blocked'
  qualityScore: 85,
  flags: {
    vpn: false,
    disposableEmail: false,
    duplicate: false,
    fastCompletion: false
  },
  submissionId: '507f1f77bcf86cd799439011'
}
```

### `FormGuard.trackStep(step)`

Track step changes in multi-step forms.

```javascript
FormGuard.trackStep(2);
```

### `FormGuard.trackError(field, errorMessage)`

Track field validation errors.

```javascript
FormGuard.trackError("email", "Invalid email format");
```

### `FormGuard.trackDropOff(step, field)`

Track when users abandon the form.

```javascript
FormGuard.trackDropOff(2, "phone");
```

## License

MIT
