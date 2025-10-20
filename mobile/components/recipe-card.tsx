import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Meal } from '@/services/mealAPI';
import { useRouter } from 'expo-router';
import { recipeCardStyles } from '@/assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { Image } from 'expo-image';

const RecipeCard = ({ recipe }: { recipe: Meal }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={recipeCardStyles.container}
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      activeOpacity={0.8}
    >
      <View style={recipeCardStyles.imageContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={recipeCardStyles.image}
          contentFit='cover'
          transition={300}
        />
      </View>

      <View style={recipeCardStyles.content}>
        <Text style={recipeCardStyles.title}>{recipe.title}</Text>

        {recipe.description && (
          <Text style={recipeCardStyles.description}>{recipe.description}</Text>
        )}
      </View>

      <View style={recipeCardStyles.footer}>
        {recipe.cookTime && (
          <View style={recipeCardStyles.timeContainer}>
            <Ionicons name='time-outline' size={14} color={COLORS.white} />
            <Text style={recipeCardStyles.timeText}>{recipe.cookTime}</Text>
          </View>
        )}

        {recipe.servings && (
          <View style={recipeCardStyles.servingsContainer}>
            <Ionicons
              name='people-outline'
              size={14}
              color={COLORS.textLight}
            />
            <Text style={recipeCardStyles.servingsText}>{recipe.servings}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;
