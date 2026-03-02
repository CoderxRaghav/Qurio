export const toAuthMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return "Authentication failed. Please try again.";
  }

  const code = (error as { code?: string }).code || "";

  switch (code) {
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before completion.";
    case "auth/popup-blocked":
      return "Popup was blocked by browser. Enable popups and try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "This email is already registered. Try logging in.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/network-request-failed":
      return "Network error. Check your internet and try again.";
    default:
      return error.message || "Authentication failed. Please try again.";
  }
};
