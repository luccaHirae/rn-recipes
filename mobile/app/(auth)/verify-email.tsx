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
import { useSignUp } from '@clerk/clerk-expo';
import { authStyles } from '@/assets/styles/auth.styles';
import { Image } from 'expo-image';
import { COLORS } from '@/constants/colors';

const VerifyEmail = ({
  email,
  onBackPress,
}: {
  email: string;
  onBackPress: () => void;
}) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        Alert.alert('Error', 'Verification not complete. Please try again.');
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Container */}
          <View style={authStyles.imageContainer}>
            <Image
              source='https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=808'
              style={authStyles.image}
              contentFit='contain'
            />
          </View>

          {/* Title */}
          <Text style={authStyles.title}>Verify your email</Text>
          <Text style={authStyles.subtitle}>
            We&apos;ve sent a verification code to {email}
          </Text>

          <View style={authStyles.formContainer}>
            {/* Veirification Code Input */}
            <TextInput
              style={authStyles.textInput}
              placeholder='Enter verification code'
              placeholderTextColor={COLORS.textLight}
              value={code}
              onChangeText={setCode}
              keyboardType='number-pad'
              autoCapitalize='none'
            />
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              authStyles.buttonDisabled,
              isLoading && authStyles.buttonDisabled,
            ]}
            onPress={handleVerify}
            disabled={isLoading || code.length === 0}
            activeOpacity={0.8}
          >
            <Text style={authStyles.buttonText}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Text>
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity
            onPress={onBackPress}
            style={authStyles.linkContainer}
          >
            <Text style={authStyles.linkText}>Back to Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmail;
