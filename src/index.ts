interface FormGuardConfig {
  apiKey: string;
  apiUrl?: string;
  debug?: boolean;
}

interface SubmissionData {
  email: string;
  fields: Record<string, any>;
  completionTime?: number;
  device?: string;
  browser?: string;
}

interface SubmissionResponse {
  success: boolean;
  allowed: boolean;
  action: "allowed" | "flagged" | "blocked";
  qualityScore: number;
  flags: {
    vpn: boolean;
    proxy: boolean;
    disposableEmail: boolean;
    duplicate: boolean;
    fastCompletion: boolean;
  };
  submissionId: string;
}

interface EventData {
  sessionId: string;
  step?: number;
  field?: string;
  eventType: "start" | "step_change" | "field_error" | "drop_off" | "complete";
  errorMessage?: string;
}

class FormGuardSDK {
  private apiKey: string = "";
  private apiUrl: string = "https://formguard-api.vercel.app/api/v1/ingestion";
  private debug: boolean = false;
  private sessionId: string = "";
  private startTime: number = 0;
  private initialized: boolean = false;

  /**
   * Initialize FormGuard SDK
   */
  init(config: string | FormGuardConfig): void {
    if (typeof config === "string") {
      this.apiKey = config;
    } else {
      this.apiKey = config.apiKey;
      this.apiUrl = config.apiUrl || this.apiUrl;
      this.debug = config.debug || false;
    }

    if (!this.apiKey) {
      throw new Error("FormGuard: API key is required");
    }

    // Generate session ID
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.initialized = true;

    // Track form start
    this.trackEvent({
      sessionId: this.sessionId,
      eventType: "start",
    });

    this.log("FormGuard initialized", { sessionId: this.sessionId });
  }

  /**
   * Track step change in multi-step forms
   */
  trackStep(step: number): void {
    if (!this.initialized) {
      console.warn(
        "FormGuard: SDK not initialized. Call FormGuard.init() first."
      );
      return;
    }

    this.trackEvent({
      sessionId: this.sessionId,
      step,
      eventType: "step_change",
    });

    this.log("Step tracked", { step });
  }

  /**
   * Track field error
   */
  trackError(field: string, errorMessage?: string): void {
    if (!this.initialized) {
      console.warn(
        "FormGuard: SDK not initialized. Call FormGuard.init() first."
      );
      return;
    }

    this.trackEvent({
      sessionId: this.sessionId,
      field,
      eventType: "field_error",
      errorMessage,
    });

    this.log("Error tracked", { field, errorMessage });
  }

  /**
   * Track drop-off
   */
  trackDropOff(step?: number, field?: string): void {
    if (!this.initialized) {
      console.warn(
        "FormGuard: SDK not initialized. Call FormGuard.init() first."
      );
      return;
    }

    this.trackEvent({
      sessionId: this.sessionId,
      step,
      field,
      eventType: "drop_off",
    });

    this.log("Drop-off tracked", { step, field });
  }

  /**
   * Submit form data
   */
  async submit(data: SubmissionData): Promise<SubmissionResponse> {
    if (!this.initialized) {
      throw new Error(
        "FormGuard: SDK not initialized. Call FormGuard.init() first."
      );
    }

    if (!data.email) {
      throw new Error("FormGuard: Email is required");
    }

    // Calculate completion time
    const completionTime =
      data.completionTime || Math.floor((Date.now() - this.startTime) / 1000);

    // Detect device and browser
    const device = data.device || this.detectDevice();
    const browser = data.browser || this.detectBrowser();

    const payload = {
      email: data.email,
      fields: data.fields,
      completionTime,
      device,
      browser,
      sessionId: this.sessionId,
    };

    try {
      const response = await fetch(`${this.apiUrl}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Submission failed");
      }

      const result: SubmissionResponse = await response.json();
      this.log("Submission result", result);

      return result;
    } catch (error) {
      this.log("Submission error", error, true);
      throw error;
    }
  }

  /**
   * Track custom event
   */
  private async trackEvent(eventData: EventData): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
        },
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      this.log("Event tracking error", error, true);
      // Don't throw - event tracking should not break the flow
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Detect device type
   */
  private detectDevice(): string {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return "Mobile";
    if (/tablet|ipad/i.test(ua)) return "Tablet";
    return "Desktop";
  }

  /**
   * Detect browser
   */
  private detectBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    if (ua.includes("Opera")) return "Opera";
    return "Unknown";
  }

  /**
   * Debug logging
   */
  private log(message: string, data?: any, isError: boolean = false): void {
    if (this.debug) {
      const method = isError ? console.error : console.log;
      method(`[FormGuard] ${message}`, data || "");
    }
  }
}

// Create singleton instance
const formGuard = new FormGuardSDK();

// Export for different module systems
if (typeof window !== "undefined") {
  (window as any).FormGuard = formGuard;
}

export default formGuard;
