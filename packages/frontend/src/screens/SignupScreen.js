import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "../theme";

const INPUT_CLASS =
  "bg-white border border-divider rounded-md px-lg py-14 font-sans text-14 text-text-primary";
const LABEL_CLASS = "font-sans-bold text-13 text-text-primary mb-sm";

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
    <SafeAreaView className="flex-1 bg-off-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="px-28 pt-64 pb-xxl"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="font-serif-bold text-36 text-dark-green text-center mb-lg">
            OurLibrary
          </Text>
          <Text className="font-serif-bold text-24 text-text-primary text-center mb-xl">
            Create account
          </Text>

          <View className="mb-lg">
            <Text className={LABEL_CLASS}>Full name</Text>
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
              className={INPUT_CLASS}
            />
          </View>

          <View className="mb-lg">
            <Text className={LABEL_CLASS}>Email</Text>
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
              className={INPUT_CLASS}
            />
          </View>

          <View className="mb-lg">
            <Text className={LABEL_CLASS}>Password</Text>
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
              className={INPUT_CLASS}
            />
          </View>

          <View className="mb-lg">
            <Text className={LABEL_CLASS}>Confirm password</Text>
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
              className={INPUT_CLASS}
            />
          </View>

          {error ? (
            <Text className="font-sans-medium text-13 text-coral text-center mt-sm mb-xl">
              {error}
            </Text>
          ) : (
            <Text className="font-sans text-13 text-text-muted text-center mt-sm mb-xl">
              Already have an account?{" "}
              <Text
                className="font-sans-bold text-text-primary"
                onPress={onSwitchToLogin}
              >
                Sign in
              </Text>
            </Text>
          )}

          <Pressable
            className="bg-dark-green rounded-lg py-16 items-center active:opacity-85"
            onPress={handleCreate}
          >
            <Text className="font-sans-bold text-16 text-white">
              Create account
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
