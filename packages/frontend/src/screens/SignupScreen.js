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
import { signup } from "../services/auth-client";

import { colors } from "../theme";

const INPUT_CLASS =
  "bg-white border border-divider rounded-md px-lg py-14 font-sans text-14 text-text-primary";
const LABEL_CLASS = "font-sans-bold text-13 text-text-primary mb-sm";

// Create account screen — mirrors the login mock.
export default function SignupScreen({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const clearError = () => {
    if (error) setError(null);
  };

  const handleCreate = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password || !confirmPassword) {
      setError("Fill out every field to continue.");
      return;
    }
    /*if (!trimmedEmail.endsWith("@calpoly.edu")) {
      setError("Use your @calpoly.edu email to create an account.");
      return;
    }*/
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await signup(trimmedEmail, password);
      setSuccess("Account created! You can now log in.");
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Signup failed. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
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
          ) : success ? (
            <Text className="font-sans text-13 text-text-muted text-center mt-sm mb-xl">
              {success}{" "}
              <Text
                className="font-sans-bold text-text-primary"
                onPress={onSwitchToLogin}
              >
                Log in
              </Text>
            </Text>
          ) : (
            <Text className="font-sans text-13 text-text-muted text-center mt-sm mb-xl">
              Already have an account?{" "}
              <Text
                className="font-sans-bold text-text-primary"
                onPress={onSwitchToLogin}
              >
                Log in
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
