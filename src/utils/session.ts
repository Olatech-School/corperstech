/**
 * Helper utility for safely managing the student session in localStorage.
 * This prevents SyntaxErrors when reading emails that were stored as plain strings
 * vs JSON object strings ({ "email": "..." }).
 */

export const STUDENT_SESSION_KEY = 'olatech_student_session';

export function getStudentSessionEmail(): string {
  try {
    const saved = localStorage.getItem(STUDENT_SESSION_KEY);
    if (!saved) return '';

    const trimmed = saved.trim();
    
    // Check if stored as JSON object format e.g., { "email": "chinedu@gmail.com" }
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === 'object' && parsed.email) {
          return String(parsed.email).trim();
        }
      } catch (e) {
        // Fallthrough if JSON.parse fails
      }
    }

    // Check if stored as JSON string format e.g., "chinedu@gmail.com"
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === 'string') {
          return parsed.trim();
        }
      } catch (e) {
        // Fallthrough if JSON.parse fails
      }
    }

    // Otherwise treat as a plain string
    return trimmed;
  } catch (err) {
    console.error('Error retrieving student session:', err);
    return '';
  }
}

export function setStudentSessionEmail(email: string): void {
  try {
    if (!email || !email.trim()) {
      localStorage.removeItem(STUDENT_SESSION_KEY);
      return;
    }
    // Store cleanly as a plain string email
    localStorage.setItem(STUDENT_SESSION_KEY, email.trim());
  } catch (err) {
    console.error('Error saving student session:', err);
  }
}

export function clearStudentSessionEmail(): void {
  try {
    localStorage.removeItem(STUDENT_SESSION_KEY);
  } catch (err) {
    console.error('Error clearing student session:', err);
  }
}
