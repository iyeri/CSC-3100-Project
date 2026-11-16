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
import { login } from "../services/signuplogin-service";

import { colors } from "../theme";

const INPUT_CLASS =
  "bg-white border border-divider rounded-md px-lg py-14 font-sans text-14 text-text-primary";

// Login screen — matches the OurLibrary mock. Frontend-only for now; the
// onAuthed / onSwitchToSignup callbacks are the seams Supabase auth will plug
// into later (replace the fake sign-in with a supabase.auth.signInWithPassword
// call).
export default function LoginScreen({ onAuthed, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !password) {
      setError("Enter your email and password.");
      return;
    }
    /*if (!trimmed.endsWith("@calpoly.edu")) {
      setError("Use your @calpoly.edu email to sign in.");
      return;
    }*/

    setError(null);
    setIsSubmitting(true);

    try {
      const session = await login(trimmed, password);
      onAuthed?.(session);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Check your credentials and try again.");
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
          contentContainerClassName="px-28 pt-80 pb-xxl"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="font-serif-bold text-36 text-dark-green text-center mb-xl">
            OurLibrary
          </Text>
          <Text className="font-serif-bold text-24 text-text-primary text-center mb-xl">
            Login
          </Text>

          <View className="mb-lg">
            <Text className="font-sans-bold text-13 text-text-primary mb-sm">
              Email
            </Text>
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
              className={INPUT_CLASS}
            />
          </View>

          <View className="mb-lg">
            <Text className="font-sans-bold text-13 text-text-primary mb-sm">
              Password
            </Text>
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
              className={INPUT_CLASS}
            />
          </View>

          {error ? (
            <Text className="font-sans-medium text-13 text-coral text-center mt-sm mb-xl">
              {error}
            </Text>
          ) : (
            <Text className="font-sans text-13 text-text-muted text-center mt-sm mb-xl">
              New to OurLibrary?{" "}
              <Text
                className="font-sans-bold text-text-primary"
                onPress={onSwitchToSignup}
              >
                Create account
              </Text>
            </Text>
          )}

          <Pressable
            className="bg-dark-green rounded-lg py-16 items-center active:opacity-85"
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            <Text className="font-sans-bold text-16 text-white">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
