"use client";

import { create } from "zustand";

interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isHydrated: boolean;
  signIn: (email: string, password: string) => { success: boolean; error?: string };
  signUp: (firstName: string, lastName: string, email: string) => { success: boolean; error?: string };
  signOut: () => void;
  hydrate: () => void;
}

// Session storage key — uses env var if provided, falls back to default
const STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_SESSION_KEY || "skillgap-auth";

// Simple integrity token to detect tampering of stored session data.
// Uses a client-side env var as the signing seed.
const SIGNING_SEED =
  process.env.NEXT_PUBLIC_AUTH_SIGNING_SEED || "skillgap-local-dev-seed-2026";

/**
 * Create a simple hash-based integrity token for a user payload.
 * This isn't cryptographic security (client-side JS can't have real secrets),
 * but it prevents casual localStorage tampering.
 */
function createIntegrityToken(user: AuthUser): string {
  const payload = `${user.id}:${user.email}:${SIGNING_SEED}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash.toString(36);
}

function persistSession(user: AuthUser) {
  try {
    const token = createIntegrityToken(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
  } catch {
    // localStorage may be unavailable in SSR or incognito
  }
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

function loadSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // Support both legacy (plain user) and new (user + token) formats
    const user: AuthUser = parsed.user || parsed;
    const storedToken: string | undefined = parsed.token;

    // Validate required fields exist
    if (!user.id || !user.email || !user.firstName) return null;

    // Verify integrity token if present
    if (storedToken) {
      const expectedToken = createIntegrityToken(user);
      if (storedToken !== expectedToken) {
        // Tampered data — clear and reject
        clearSession();
        return null;
      }
    }

    return user;
  } catch {
    clearSession();
    return null;
  }
}

function generateUserId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isHydrated: false,

  signIn: (email: string, password: string) => {
    if (!email.trim()) {
      return { success: false, error: "Email is required" };
    }
    if (!isValidEmail(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }
    if (!password.trim()) {
      return { success: false, error: "Password is required" };
    }
    if (password.length < 4) {
      return { success: false, error: "Password must be at least 4 characters" };
    }

    const user: AuthUser = {
      id: generateUserId(),
      firstName: email.split("@")[0],
      lastName: "User",
      email: email.trim(),
      imageUrl: "/avatars/placeholder.png",
    };

    persistSession(user);
    set({ isAuthenticated: true, user });
    return { success: true };
  },

  signUp: (firstName: string, lastName: string, email: string) => {
    if (!firstName.trim()) {
      return { success: false, error: "First name is required" };
    }
    if (!lastName.trim()) {
      return { success: false, error: "Last name is required" };
    }
    if (!email.trim()) {
      return { success: false, error: "Email is required" };
    }
    if (!isValidEmail(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    const user: AuthUser = {
      id: generateUserId(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      imageUrl: "/avatars/placeholder.png",
    };

    persistSession(user);
    set({ isAuthenticated: true, user });
    return { success: true };
  },

  signOut: () => {
    clearSession();
    set({ isAuthenticated: false, user: null });
  },

  hydrate: () => {
    const user = loadSession();
    if (user) {
      set({ isAuthenticated: true, user, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },
}));
