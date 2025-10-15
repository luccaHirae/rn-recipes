import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import { authStyles } from '@/assets/styles/auth.styles';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }

    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        Alert.alert('Error', 'Sign-in not complete. Please try again.');
      }
    } catch (e) {
      Alert.alert(
        'Error',
        e instanceof Error
          ? e.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source='https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=808'
              style={authStyles.image}
              contentFit='contain'
            />

            <Text style={authStyles.title}>Welcome Back</Text>

            {/* Form Container */}
            <View style={authStyles.formContainer}>
              {/* Email Input */}
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder='Enter email'
                  placeholderTextColor={COLORS.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
              </View>

              {/* Password Input */}
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder='Enter password'
                  placeholderTextColor={COLORS.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize='none'
                />

                <TouchableOpacity
                  style={authStyles.eyeButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={COLORS.textLight}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  authStyles.authButton,
                  isLoading && authStyles.buttonDisabled,
                ]}
                onPress={handleSignIn}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={authStyles.buttonText}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <TouchableOpacity
                style={authStyles.linkContainer}
                onPress={() => router.push('/(auth)/sign-up')}
              >
                <Text style={authStyles.linkText}>
                  Don&apos;t have an account?
                  <Text style={authStyles.link}>Sign up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;
