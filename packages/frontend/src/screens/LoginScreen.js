import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, fonts, radii, spacing } from "../theme";

// Login screen — matches the OurLibrary mock. Frontend-only for now; the
// onAuthed / onSwitchToSignup callbacks are the seams Supabase auth will plug
// into later (replace the fake sign-in with a supabase.auth.signInWithPassword
// call).
export default function LoginScreen({ onAuthed, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignIn = () => {
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (!trimmed.endsWith("@calpoly.edu")) {
      setError("Use your @calpoly.edu email to sign in.");
      return;
    }

    setError(null);
    // TODO(auth): replace with supabase.auth.signInWithPassword.
    onAuthed?.({ email: trimmed });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.brand}>OurLibrary</Text>
          <Text style={styles.heading}>Login</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (error) setError(null);
              }}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (error) setError(null);
              }}
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              style={styles.input}
            />
          </View>

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <Text style={styles.switchRow}>
              New to OurLibrary?{" "}
              <Text style={styles.switchLink} onPress={onSwitchToSignup}>
                Create account
              </Text>
            </Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.cta,
              pressed && styles.ctaPressed,
            ]}
            onPress={handleSignIn}
          >
            <Text style={styles.ctaText}>Sign in</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: spacing.xxl,
  },
  brand: {
    fontFamily: fonts.serifBold,
    fontSize: 36,
    color: colors.darkGreen,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  heading: {
    fontFamily: fonts.serifBold,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.textPrimary,
  },
  switchRow: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  switchLink: {
    fontFamily: fonts.sansBold,
    color: colors.textPrimary,
  },
  error: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.coral,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  cta: {
    backgroundColor: colors.darkGreen,
    borderRadius: radii.lg,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaText: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    color: colors.white,
  },
});
