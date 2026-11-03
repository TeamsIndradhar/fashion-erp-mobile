// All user-visible text in one place (English v1, Hindi-ready — Q-11).

export const strings = {
  appName: "Fashion ERP",
  common: {
    retry: "Try again",
    cancel: "Cancel",
    ok: "OK",
    loading: "Loading…",
  },
  errors: {
    generic: "Something went wrong. Please try again.",
    server: "The server had a problem. Please try again in a moment.",
    network: "No internet connection. Check your network and try again.",
    timeout: "The server took too long to answer. Please try again.",
  },
  offline: {
    banner: "You are offline. Some information may be old.",
  },
  session: {
    expired: "Your session has ended. Please sign in again.",
    revoked: "You were signed out on this phone. Please sign in again.",
  },
  login: {
    title: "Sign in",
    subtitle: "Use your Fashion ERP email and password.",
    email: "Email",
    password: "Password",
    submit: "Sign in",
    forgot: "Forgot password?",
    emailRequired: "Enter your email.",
    emailInvalid: "Enter a valid email address.",
    passwordRequired: "Enter your password.",
    forgotTitle: "Forgot password",
    forgotBody:
      "Passwords are reset by HR or your ERP admin. Ask them to reset it — you will get a temporary password, and the app will ask you to set your own after you sign in.",
  },
  changePassword: {
    title: "Set your own password",
    forcedBody: "You signed in with a temporary password. Choose a new password to continue.",
    current: "Current (temporary) password",
    next: "New password",
    confirm: "Confirm new password",
    submit: "Save password",
    tooShort: "Use at least 8 characters.",
    mismatch: "The passwords do not match.",
    sameAsCurrent: "The new password must be different from the current one.",
    required: "Enter your current password.",
  },
  suspended: {
    title: "Access paused",
    fallback: "Your account or company is not active. Contact your ERP admin.",
  },
  home: {
    greeting: "Hello",
    noEmployee: "Your login is not linked to an employee record. Attendance is not available — contact HR.",
    attendanceOff: "Attendance isn't enabled for your company.",
  },
  profile: {
    title: "My profile",
    devices: "My devices",
    signOut: "Sign out",
    signOutAll: "Sign out of all phones",
    confirmSignOut: "Sign out of Fashion ERP on this phone?",
    confirmSignOutAll: "Sign out of Fashion ERP on all your phones?",
    thisPhone: "This phone",
    remove: "Remove",
    confirmRemove: "Remove this phone? It will be signed out.",
    noDevices: "No phones registered.",
  },
  update: {
    requiredTitle: "Update required",
    requiredBody: "This version of the app is no longer supported. Please update Fashion ERP to continue.",
    open: "Update now",
  },
} as const;
