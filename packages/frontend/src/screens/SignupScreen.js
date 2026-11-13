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

// Create account screen — mirrors the login mock. Frontend-only for now;
// swap handleCreate for supabase.auth.signUp when auth is wired.
export default function SignupScreen({ onAuthed, onSwitchToLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const clearError = () => {
    if (error) setError(null);
  };

  const handleCreate = () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Enter your full name.");
      return;
    }
    if (!trimmedEmail || !password || !confirmPassword) {
      setError("Fill out every field to continue.");
      return;
    }
    if (!trimmedEmail.endsWith("@calpoly.edu")) {
      setError("Use your @calpoly.edu email to create an account.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setError(null);
    // TODO(auth): replace with supabase.auth.signUp.
    onAuthed?.({ email: trimmedEmail, fullName: trimmedName });
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
          <Text style={styles.heading}>Create account</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={fullName}
              onChangeText={(value) => {
                setFullName(value);
                clearError();
              }}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              autoComplete="name"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                clearError();
              }}
              placeholder="you@calpoly.edu"
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
                clearError();
              }}
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                clearError();
              }}
              placeholder="Re-enter your password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              style={styles.input}
            />
          </View>

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <Text style={styles.switchRow}>
              Already have an account?{" "}
              <Text style={styles.switchLink} onPress={onSwitchToLogin}>
                Sign in
              </Text>
            </Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.cta,
              pressed && styles.ctaPressed,
            ]}
            onPress={handleCreate}
          >
            <Text style={styles.ctaText}>Create account</Text>
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
    paddingTop: 64,
    paddingBottom: spacing.xxl,
  },
  brand: {
    fontFamily: fonts.serifBold,
    fontSize: 36,
    color: colors.darkGreen,
    textAlign: "center",
    marginBottom: spacing.lg,
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
