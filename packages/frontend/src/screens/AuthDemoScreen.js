import { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  API_URL,
  getUserById,
  loginWithPassword,
  logout,
  signupWithPassword,
} from "../services/apiClient";
import { getAccessToken, getUserId } from "../services/tokenStorage";
import { colors } from "../theme";

const MAX_CONTENT_WIDTH = 560;
const DEMO_USER_ID = "5a1676c7-0105-47cb-adda-f905228c8793";

function Field({ label, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        placeholderTextColor={colors.softMuted}
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}

function ResponsePanel({ feedback }) {
  if (!feedback) {
    return null;
  }

  return (
    <View style={[styles.message, feedback.isError && styles.errorMessage]}>
      <Text style={styles.messageLabel}>{feedback.isError ? "ERROR" : "RESPONSE"}</Text>
      <Text style={styles.messageText}>{feedback.text}</Text>
    </View>
  );
}

function formatPayload(payload) {
  if (typeof payload === "string") {
    return payload;
  }

  return JSON.stringify(payload, null, 2);
}

function formatApiError(error) {
  const payload = error.data ?? error.message;
  const status = error.status ? `HTTP ${error.status}\n` : "";
  return `${status}${formatPayload(payload)}`;
}

function formatLoginResponse(session) {
  return formatPayload({
    user: session.user,
    token_type: session.token_type,
    expires_at: session.expires_at,
  });
}

export function AuthDemoScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lookupUserId, setLookupUserId] = useState(DEMO_USER_ID);
  const [userId, setUserId] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [busy, setBusy] = useState(false);
  const [protectionFeedback, setProtectionFeedback] = useState(null);
  const [authFeedback, setAuthFeedback] = useState({
    text: "Checking for a saved session…",
    isError: false,
  });

  useEffect(() => {
    let mounted = true;

    Promise.all([getAccessToken(), getUserId()])
      .then(([token, savedUserId]) => {
        if (!mounted) return;
        setHasToken(Boolean(token));
        setUserId(savedUserId || "");
        setAuthFeedback({
          text: token ? "A saved access token is ready." : "No saved access token found.",
          isError: false,
        });
      })
      .catch((error) => {
        if (!mounted) return;
        setAuthFeedback({ text: error.message, isError: true });
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setAuthFeedback({ text: "Enter both an email and password.", isError: true });
      return;
    }

    setBusy(true);

    try {
      const session = await loginWithPassword(email.trim(), password);
      setHasToken(true);
      setUserId(session.user?.id || "");
      setPassword("");
      setAuthFeedback({
        text: formatLoginResponse(session),
        isError: false,
      });
    } catch (error) {
      setAuthFeedback({ text: formatApiError(error), isError: true });
    } finally {
      setBusy(false);
    }
  };

  const handleSignup = async () => {
    if (!email.trim() || !password) {
      setAuthFeedback({ text: "Enter both an email and password.", isError: true });
      return;
    }

    if (password.length < 6) {
      setAuthFeedback({
        text: "Use a password with at least six characters.",
        isError: true,
      });
      return;
    }

    setBusy(true);

    try {
      const user = await signupWithPassword(email.trim(), password);
      setPassword("");
      setAuthFeedback({
        text: formatPayload(user),
        isError: false,
      });
    } catch (error) {
      setAuthFeedback({ text: formatApiError(error), isError: true });
    } finally {
      setBusy(false);
    }
  };

  const handleProtectionCheck = async () => {
    if (!lookupUserId.trim()) {
      setProtectionFeedback({
        text: "Enter a user ID for the protection check.",
        isError: true,
      });
      return;
    }

    setBusy(true);

    try {
      const users = await getUserById(lookupUserId.trim());
      setProtectionFeedback({
        text: formatPayload(users),
        isError: false,
      });
    } catch (error) {
      setProtectionFeedback({
        text: formatApiError(error),
        isError: true,
      });
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);

    try {
      await logout();
      setHasToken(false);
      setUserId("");
      setAuthFeedback({ text: "The stored access token was removed.", isError: false });
    } catch (error) {
      setAuthFeedback({ text: error.message, isError: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.topBar}>
              <Text style={styles.wordmark}>OUR/LIBRARY</Text>
              <View style={[styles.statusDot, hasToken && styles.statusDotActive]} />
            </View>

            <View style={styles.intro}>
              <Text style={styles.eyebrow}>AUTHENTICATION DEMO</Text>
              <Text style={styles.heading}>SIGN IN TO SHARE A BOOK.</Text>
              <Text style={styles.subheading}>
                The login token is stored locally and added to protected HTTP calls.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardNumber}>01</Text>
              <Text style={styles.cardTitle}>PROTECTION CHECK</Text>
              <Text style={styles.cardCopy}>
                Sends the stored token when one exists. The backend decides whether to use an
                anonymous or authenticated client. Note: This currently requires WAY more data than it should, currently
                figuring out how to limit this...
              </Text>
              <Field 
                label="USER ID"
                onChangeText={setLookupUserId}
                placeholder="User UUID"
                value={lookupUserId}
              />
              <Pressable
                accessibilityRole="button"
                disabled={busy}
                onPress={handleProtectionCheck}
                style={({ pressed }) => [
                  styles.signupButton,
                  (pressed || busy) && styles.pressed,
                ]}
              >
                <Text style={styles.signupButtonText}>GET USER</Text>
              </Pressable>
              <ResponsePanel feedback={protectionFeedback} />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardNumber}>02</Text>
              <Text style={styles.cardTitle}>LOG IN OR SIGN UP</Text>
              <Text style={styles.cardCopy}>
                You must log in after signing up.
              </Text>
              <Field
                autoComplete="email"
                keyboardType="email-address"
                label="EMAIL"
                onChangeText={setEmail}
                placeholder="reader@email.com"
                value={email}
              />
              <Field
                autoComplete="password"
                label="PASSWORD"
                onChangeText={setPassword}
                placeholder="Enter your password (6-72 characters)"
                secureTextEntry
                value={password}
              />
              <Pressable
                accessibilityRole="button"
                disabled={busy}
                onPress={handleLogin}
                style={({ pressed }) => [styles.primaryButton, (pressed || busy) && styles.pressed]}
              >
                <Text style={styles.primaryButtonText}>{busy ? "WORKING…" : "LOG IN (SAVE ACCESS TOKEN)"}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={busy}
                onPress={handleSignup}
                style={({ pressed }) => [
                  styles.signupButton,
                  (pressed || busy) && styles.pressed,
                ]}
              >
                <Text style={styles.signupButtonText}>CREATE ACCOUNT</Text>
              </Pressable>
              {hasToken && (
                <Pressable accessibilityRole="button" disabled={busy} onPress={handleLogout}>
                  <Text style={styles.logout}>LOG OUT (REMOVE SAVED TOKEN)</Text>
                </Pressable>
              )}
              <ResponsePanel feedback={authFeedback} />
            </View>

            <View style={styles.instructionBox}>
              <Text style={styles.instructionText}>
                Logged in? Go back to Section 1 and select GET USER to make an authenticated
                request.
              </Text>
            </View>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingTop: Platform.OS === "android" ? NativeStatusBar.currentHeight : 0,
  },
  screen: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { paddingBottom: 32 },
  content: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    minHeight: "100%",
    alignSelf: "center",
    backgroundColor: colors.paper,
    paddingHorizontal: 18,
  },
  topBar: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  wordmark: { color: colors.ink, fontSize: 16, fontWeight: "900", letterSpacing: -0.6 },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.softMuted },
  statusDotActive: { backgroundColor: colors.acid, borderWidth: 1, borderColor: colors.ink },
  intro: { paddingTop: 30, paddingBottom: 24 },
  eyebrow: { color: colors.muted, fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  heading: {
    maxWidth: 420,
    marginTop: 8,
    color: colors.ink,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    letterSpacing: -1.1,
  },
  subheading: { maxWidth: 430, marginTop: 10, color: colors.muted, fontSize: 14, lineHeight: 20 },
  card: { marginBottom: 14, padding: 16, backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line },
  cardNumber: { color: colors.softMuted, fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  cardTitle: { marginTop: 4, marginBottom: 14, color: colors.ink, fontSize: 18, fontWeight: "900" },
  cardCopy: { marginTop: -8, marginBottom: 14, color: colors.muted, fontSize: 12, lineHeight: 18 },
  field: { marginBottom: 12 },
  label: { marginBottom: 6, color: colors.ink, fontSize: 10, fontWeight: "900", letterSpacing: 0.8 },
  input: {
    height: 48,
    paddingHorizontal: 12,
    color: colors.ink,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    fontSize: 14,
  },
  primaryButton: { minHeight: 48, alignItems: "center", justifyContent: "center", backgroundColor: colors.ink },
  primaryButtonText: { color: colors.paper, fontSize: 11, fontWeight: "900", letterSpacing: 0.7 },
  signupButton: {
    minHeight: 48,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  signupButtonText: { color: colors.ink, fontSize: 11, fontWeight: "900", letterSpacing: 0.7 },
  instructionBox: {
    marginBottom: 14,
    padding: 14,
    backgroundColor: colors.sky,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  instructionText: { color: colors.ink, fontSize: 12, lineHeight: 18, fontWeight: "700" },
  dangerCard: { borderColor: colors.coral },
  dangerButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.coral,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  dangerButtonText: { color: colors.ink, fontSize: 11, fontWeight: "900", letterSpacing: 0.7 },
  pressed: { opacity: 0.5 },
  message: { marginTop: 4, padding: 14, backgroundColor: colors.sky },
  errorMessage: { backgroundColor: colors.coral },
  messageLabel: { color: colors.ink, fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  messageText: { marginTop: 5, color: colors.ink, fontSize: 12, lineHeight: 18 },
  endpoint: { marginTop: 14, color: colors.softMuted, fontSize: 9, fontWeight: "700" },
  logout: { paddingVertical: 18, color: colors.ink, fontSize: 10, fontWeight: "900", textAlign: "center", textDecorationLine: "underline" },
});
