import { Image } from 'expo-image';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Meal, mealAPI } from '@/services/mealAPI';
import { homeStyles } from '@/assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import CategoryFilter from '@/components/category-filter';
import RecipeCard from '@/components/recipe-card';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [categories, setCategories] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const [categoriesResponse, randomMealsResponse, featuredRecipeResponse] =
        await Promise.all([
          mealAPI.getCategories(),
          mealAPI.getMultipleRandomMeals(12),
          mealAPI.getRandomMeal(),
        ]);

      interface MealCategoryAPI {
        strCategory: string;
        strCategoryThumb: string;
        strCategoryDescription: string;
      }

      interface Category {
        id: number;
        name: string;
        image: string;
        description: string;
      }

      const transformedCategories = categoriesResponse.map(
        (category: MealCategoryAPI, index: number): Category => ({
          id: index + 1,
          name: category.strCategory,
          image: category.strCategoryThumb,
          description: category.strCategoryDescription,
        })
      );
      setCategories(transformedCategories);

      if (!selectedCategory) setSelectedCategory(transformedCategories[0].name);

      const transformedRecipes = randomMealsResponse
        .map((meal) => mealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
      setRecipes(transformedRecipes);

      const transformedFeaturedRecipe = mealAPI.transformMealData(
        featuredRecipeResponse
      );
      setFeaturedRecipe(transformedFeaturedRecipe);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategoryData = async (category: string) => {
    try {
      const filteredMeals = await mealAPI.filterByCategory(category);
      const transformedMeals = filteredMeals
        .map((meal) => mealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
      setRecipes(transformedMeals);
    } catch (e) {
      console.error('Error loading category data:', e);
      setRecipes([]);
    }
  };

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    await loadCategoryData(category);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={homeStyles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Welcome Icons */}
        <View style={homeStyles.welcomeSection}>
          <Image
            source='https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=808'
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source='https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=808'
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source='https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=808'
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>

        {/* Featured Section */}
        {featuredRecipe && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.8}
              onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image
                  source={{ uri: featuredRecipe.image }}
                  style={homeStyles.featuredImage}
                  contentFit='cover'
                  transition={500}
                />

                <View style={homeStyles.featuredOverlay}>
                  <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                  </View>

                  <View style={homeStyles.featuredContent}>
                    <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                      {featuredRecipe.title}
                    </Text>

                    <View style={homeStyles.featuredMeta}>
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name='time-outline'
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featuredRecipe.cookTime}
                        </Text>
                      </View>

                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name='people-outline'
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featuredRecipe.servings}
                        </Text>
                      </View>

                      {featuredRecipe.area && (
                        <View style={homeStyles.metaItem}>
                          <Ionicons
                            name='location-outline'
                            size={16}
                            color={COLORS.white}
                          />
                          <Text style={homeStyles.metaText}>
                            {featuredRecipe.area}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Category Section */}
        {categories.length > 0 ? (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        ) : null}

        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
          </View>
        </View>

        <FlatList
          data={recipes}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={homeStyles.row}
          contentContainerStyle={homeStyles.recipesGrid}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={homeStyles.emptyState}>
              <Ionicons
                name='restaurant-outline'
                size={64}
                color={COLORS.textLight}
              />
              <Text style={homeStyles.emptyTitle}>No recipes found</Text>
              <Text style={homeStyles.emptyDescription}>
                Try a different category
              </Text>
            </View>
          }
        />
      </ScrollView>
    </View>
  );
}
