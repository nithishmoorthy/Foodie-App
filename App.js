// Foodie - single-file Expo app (paste into App.js on snack.expo.dev)
// Dependencies: react-native + @expo/vector-icons (both included in Snack by default)

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  StatusBar,
  Platform,
  BackHandler,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */
const C = {
  bg: '#F5F7F4',
  surface: '#FFFFFF',
  ink: '#1C2420',
  muted: '#667069',
  line: '#DDE3DC',
  basil: '#1F4D3A',
  basilSoft: '#E1ECE5',
  saffron: '#F2B134',
  tomato: '#E5484D',
};

/* ------------------------------------------------------------------ */
/* Recipe data                                                         */
/* ------------------------------------------------------------------ */
const U = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

const r = (id, category, name, photo, time, servings, calories, difficulty, ingredients, steps) => ({
  id,
  category,
  name,
  image: U(photo),
  time,
  servings,
  calories,
  difficulty,
  ingredients,
  steps,
});

const RECIPES = [
  r('i1', 'Italian', 'Margherita Pizza', 'photo-1513104890138-7c749659a591', '35 min', 4, 680, 'Medium',
    ['1 pizza dough ball', '1/2 cup tomato sauce', '200 g fresh mozzarella', 'Fresh basil leaves', '2 tbsp olive oil', 'Pinch of salt'],
    ['Preheat the oven to its highest setting, with a baking tray inside.', 'Stretch the dough into a 30 cm round on a floured surface.', 'Spread the tomato sauce, leaving a thin border.', 'Tear the mozzarella over the top and drizzle with olive oil.', 'Bake 8 to 10 minutes until the crust is golden and the cheese bubbles.', 'Top with basil and serve hot.']),
  r('i2', 'Italian', 'Creamy Pasta Carbonara', 'photo-1621996346565-e3dbc646d9a9', '25 min', 2, 620, 'Medium',
    ['200 g spaghetti', '100 g pancetta, diced', '2 eggs plus 1 yolk', '1/2 cup grated parmesan', 'Black pepper', 'Salt for the water'],
    ['Boil the spaghetti in salted water until al dente. Save a cup of pasta water.', 'Fry the pancetta until crisp.', 'Whisk the eggs, yolk, parmesan and plenty of pepper.', 'Toss the hot pasta with the pancetta off the heat.', 'Stir in the egg mixture, adding pasta water until glossy.', 'Serve straight away with extra parmesan.']),

  r('m1', 'Mexican', 'Street-Style Tacos', 'photo-1565299585323-38d6b0865b47', '30 min', 4, 450, 'Easy',
    ['8 small corn tortillas', '400 g chicken thigh, sliced', '1 tsp cumin', '1 tsp smoked paprika', '1 diced onion', 'Fresh coriander', '2 limes'],
    ['Season the chicken with cumin, paprika, salt and lime juice.', 'Sear in a hot pan for 6 to 8 minutes until browned.', 'Warm the tortillas on a dry pan.', 'Fill with chicken, onion and coriander.', 'Finish with a squeeze of lime.']),
  r('m2', 'Mexican', 'Loaded Veggie Burrito', 'photo-1626700051175-6818013e1d4f', '25 min', 2, 540, 'Easy',
    ['2 large flour tortillas', '1 cup cooked rice', '1 cup black beans', '1 diced avocado', '1/2 cup corn', '1/4 cup salsa', '1/2 cup grated cheese'],
    ['Warm the beans and corn together with a pinch of salt.', 'Lay out the tortillas and layer rice, beans, corn, avocado and cheese.', 'Add salsa, fold in the sides and roll tightly.', 'Toast seam-side down in a pan for 2 minutes per side.']),

  r('a1', 'Asian', 'Tonkotsu-Style Ramen', 'photo-1569718212165-3a8278d5f624', '40 min', 2, 590, 'Medium',
    ['2 portions ramen noodles', '4 cups chicken or pork stock', '2 tbsp soy sauce', '1 tbsp miso paste', '2 soft-boiled eggs', '2 spring onions', 'Nori sheets'],
    ['Simmer the stock with soy sauce and miso for 15 minutes.', 'Cook the noodles separately and drain.', 'Halve the eggs and slice the spring onions.', 'Place noodles in bowls and ladle over the hot broth.', 'Top with eggs, spring onion and nori.']),
  r('a2', 'Asian', 'Chicken Fried Rice', 'photo-1603133872878-684f208fb84b', '20 min', 3, 520, 'Easy',
    ['3 cups cooked day-old rice', '200 g chicken, diced', '2 eggs', '1 cup mixed vegetables', '2 tbsp soy sauce', '1 tsp sesame oil', '2 cloves garlic'],
    ['Stir-fry the chicken in a hot wok until cooked, then set aside.', 'Scramble the eggs in the same wok.', 'Add garlic and vegetables and fry for 2 minutes.', 'Add the rice, chicken and soy sauce and toss over high heat.', 'Finish with sesame oil.']),

  r('d1', 'Desserts', 'Molten Chocolate Cake', 'photo-1578985545062-69928b1d9587', '30 min', 4, 480, 'Medium',
    ['150 g dark chocolate', '100 g butter', '2 eggs plus 2 yolks', '1/3 cup sugar', '2 tbsp flour'],
    ['Preheat oven to 200 C and grease four ramekins.', 'Melt the chocolate and butter together and let cool slightly.', 'Whisk the eggs, yolks and sugar until pale, then fold in the chocolate and flour.', 'Divide among the ramekins and bake for 10 to 12 minutes.', 'Rest for 1 minute, turn out and serve warm.']),
  r('d2', 'Desserts', 'Strawberry Cheesecake Cups', 'photo-1488477181946-6428a0291777', '20 min', 4, 390, 'Easy',
    ['1 cup crushed biscuits', '3 tbsp melted butter', '250 g cream cheese', '1/2 cup whipped cream', '2 tbsp icing sugar', '1 cup chopped strawberries'],
    ['Mix the biscuits with melted butter and press into four glasses.', 'Beat the cream cheese with icing sugar, then fold in the cream.', 'Spoon the filling over the base.', 'Top with strawberries and chill for 1 hour.']),

  r('b1', 'Breakfast', 'Fluffy Buttermilk Pancakes', 'photo-1567620905732-2d1ec7ab7445', '25 min', 4, 410, 'Easy',
    ['1 1/2 cups flour', '1 tbsp sugar', '2 tsp baking powder', '1 1/4 cups buttermilk', '1 egg', '2 tbsp melted butter', 'Maple syrup'],
    ['Whisk the dry ingredients together.', 'Mix the buttermilk, egg and butter, then fold into the dry mix until just combined.', 'Cook 1/4 cup scoops on a medium pan until bubbles form, then flip.', 'Stack and serve with maple syrup.']),
  r('b2', 'Breakfast', 'Avocado Egg Toast', 'photo-1525351484163-7529414344d8', '10 min', 1, 360, 'Easy',
    ['2 slices sourdough', '1 ripe avocado', '2 eggs', 'Chili flakes', 'Lemon juice', 'Salt and pepper'],
    ['Toast the bread.', 'Mash the avocado with lemon juice, salt and pepper.', 'Fry or poach the eggs.', 'Spread avocado on the toast, top with the eggs and chili flakes.']),

  r('v1', 'Vegan', 'Rainbow Buddha Bowl', 'photo-1512621776951-a57141f2eefd', '30 min', 2, 480, 'Easy',
    ['1 cup quinoa', '1 cup chickpeas', '1 sweet potato, cubed', '1 cup spinach', '1/2 avocado', '2 tbsp tahini', '1 lemon'],
    ['Roast the sweet potato and chickpeas at 200 C for 25 minutes.', 'Cook the quinoa according to the packet.', 'Whisk the tahini with lemon juice and a splash of water.', 'Assemble the bowls and drizzle with the dressing.']),
  r('v2', 'Vegan', 'Coconut Chickpea Curry', 'photo-1585937421612-70a008356fbe', '35 min', 4, 430, 'Easy',
    ['2 cans chickpeas', '1 can coconut milk', '1 diced onion', '3 cloves garlic', '2 tbsp curry paste', '1 cup chopped tomatoes', 'Fresh coriander'],
    ['Soften the onion and garlic in oil.', 'Stir in the curry paste for 1 minute.', 'Add tomatoes, chickpeas and coconut milk.', 'Simmer for 20 minutes until thick.', 'Garnish with coriander and serve with rice.']),

  r('q1', 'Quick & Easy', 'Garlic Butter Shrimp', 'photo-1565680018434-b513d5e5fd47', '15 min', 2, 340, 'Easy',
    ['300 g shrimp, peeled', '3 tbsp butter', '4 cloves garlic', '1 lemon', 'Chopped parsley', 'Salt and pepper'],
    ['Melt the butter in a pan and cook the garlic for 30 seconds.', 'Add the shrimp and cook 2 minutes per side.', 'Squeeze over lemon juice and sprinkle with parsley.']),
  r('q2', 'Quick & Easy', 'Ultimate Grilled Cheese', 'photo-1528735602780-2552fd46c7af', '10 min', 1, 470, 'Easy',
    ['2 slices bread', '2 slices cheddar', '1 tbsp butter', '1 slice mozzarella'],
    ['Butter the outside of each bread slice.', 'Layer the cheeses between the slices.', 'Toast in a pan over medium heat for 3 minutes per side until golden.']),

  r('h1', 'Healthy', 'Greek Salad Bowl', 'photo-1546069901-ba9599a7e63c', '15 min', 2, 280, 'Easy',
    ['2 tomatoes', '1 cucumber', '1/2 red onion', '1/2 cup olives', '100 g feta', '2 tbsp olive oil', '1 tsp oregano'],
    ['Chop the tomatoes, cucumber and onion into chunks.', 'Combine with olives in a bowl.', 'Top with feta, olive oil and oregano.']),
  r('h2', 'Healthy', 'Grilled Salmon with Greens', 'photo-1467003909585-2f8a72700288', '25 min', 2, 410, 'Medium',
    ['2 salmon fillets', '1 lemon', '1 tbsp olive oil', '200 g green beans', '1 cup spinach', 'Salt and pepper'],
    ['Season the salmon with oil, salt, pepper and lemon.', 'Grill or pan-sear 4 minutes per side.', 'Steam the green beans for 5 minutes.', 'Serve the salmon over spinach and beans.']),

  r('r1', 'Drinks', 'Berry Banana Smoothie', 'photo-1553530666-ba11a7da3888', '5 min', 2, 220, 'Easy',
    ['1 banana', '1 cup mixed berries', '1 cup milk or oat milk', '1/2 cup yogurt', '1 tsp honey'],
    ['Add everything to a blender.', 'Blend until smooth.', 'Pour into glasses and serve cold.']),
  r('r2', 'Drinks', 'Fresh Mint Lemonade', 'photo-1523677011781-c91d1bbe2f9e', '10 min', 4, 120, 'Easy',
    ['4 lemons', '1/2 cup sugar', '4 cups cold water', 'Handful of fresh mint', 'Ice'],
    ['Juice the lemons and stir with the sugar until dissolved.', 'Muddle the mint gently.', 'Add water and ice, stir and serve.']),

  r('s1', 'Snacks', 'Loaded Nachos', 'photo-1513456852971-30c0b8199d4d', '20 min', 4, 520, 'Easy',
    ['200 g tortilla chips', '1 cup grated cheese', '1/2 cup black beans', '1/4 cup jalapenos', '1/2 cup salsa', 'Sour cream'],
    ['Spread the chips on a lined tray.', 'Scatter beans, cheese and jalapenos over the top.', 'Bake at 190 C for 8 minutes until melted.', 'Serve with salsa and sour cream.']),
  r('s2', 'Snacks', 'Crispy Baked Fries', 'photo-1573080496219-bb080dd4f877', '40 min', 3, 310, 'Easy',
    ['4 large potatoes', '2 tbsp olive oil', '1 tsp paprika', '1 tsp garlic powder', 'Salt'],
    ['Cut the potatoes into thin sticks and soak in cold water for 15 minutes.', 'Dry well and toss with oil and spices.', 'Bake at 220 C for 30 minutes, flipping halfway.']),
];

const CATEGORIES = [
  { key: 'All', icon: 'apps' },
  { key: 'My Food', icon: 'person-circle' },
  { key: 'Italian', icon: 'pizza' },
  { key: 'Mexican', icon: 'flame' },
  { key: 'Asian', icon: 'restaurant' },
  { key: 'Desserts', icon: 'ice-cream' },
  { key: 'Breakfast', icon: 'cafe' },
  { key: 'Vegan', icon: 'leaf' },
  { key: 'Quick & Easy', icon: 'flash' },
  { key: 'Healthy', icon: 'heart-circle' },
  { key: 'Drinks', icon: 'beer' },
  { key: 'Snacks', icon: 'fast-food' },
];

/* ------------------------------------------------------------------ */
/* State (Context)                                                     */
/* ------------------------------------------------------------------ */
const FoodieContext = createContext(null);
const useFoodie = () => useContext(FoodieContext);

function FoodieProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const addRecipe = useCallback((data) => {
    const recipe = { ...data, id: 'my-' + Date.now(), mine: true };
    setMyRecipes((prev) => [recipe, ...prev]);
  }, []);

  const updateRecipe = useCallback((id, data) => {
    setMyRecipes((prev) => prev.map((x) => (x.id === id ? { ...x, ...data } : x)));
  }, []);

  const deleteRecipe = useCallback((id) => {
    setMyRecipes((prev) => prev.filter((x) => x.id !== id));
    setFavorites((prev) => prev.filter((x) => x !== id));
  }, []);

  const findRecipe = useCallback(
    (id) => RECIPES.find((x) => x.id === id) || myRecipes.find((x) => x.id === id),
    [myRecipes]
  );

  return (
    <FoodieContext.Provider
      value={{ favorites, myRecipes, toggleFavorite, addRecipe, updateRecipe, deleteRecipe, findRecipe }}
    >
      {children}
    </FoodieContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Shared components                                                   */
/* ------------------------------------------------------------------ */
function RecipeImage({ uri, style }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [uri]);
  if (!uri || failed) {
    return (
      <View style={[style, styles.imageFallback]}>
        <Ionicons name="restaurant-outline" size={36} color={C.basil} />
      </View>
    );
  }
  return <Image source={{ uri }} style={style} resizeMode="cover" onError={() => setFailed(true)} />;
}

function HeartButton({ id, style }) {
  const { favorites, toggleFavorite } = useFoodie();
  const active = favorites.includes(id);
  return (
    <TouchableOpacity
      style={[styles.heartBtn, style]}
      onPress={() => toggleFavorite(id)}
      accessibilityLabel={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={22}
        color={active ? C.tomato : C.ink}
      />
    </TouchableOpacity>
  );
}

function RecipeCard({ recipe, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <RecipeImage uri={recipe.image} style={styles.cardImage} />
      <HeartButton id={recipe.id} style={styles.cardHeart} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{recipe.name}</Text>
        {recipe.mine ? (
          <Text style={styles.cardMeta}>Your recipe</Text>
        ) : (
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color={C.muted} />
            <Text style={styles.cardMeta}>{recipe.time}</Text>
            <Ionicons name="flame-outline" size={14} color={C.muted} style={{ marginLeft: 12 }} />
            <Text style={styles.cardMeta}>{recipe.calories} kcal</Text>
            <Ionicons name="speedometer-outline" size={14} color={C.muted} style={{ marginLeft: 12 }} />
            <Text style={styles.cardMeta}>{recipe.difficulty}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function EmptyState({ icon, title, text }) {
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={44} color={C.line} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Home (feed + categories)                                            */
/* ------------------------------------------------------------------ */
function HomeScreen({ openRecipe, goMyFood }) {
  const [category, setCategory] = useState('All');
  const list = category === 'All' ? RECIPES : RECIPES.filter((x) => x.category === category);

  const onCategory = (key) => {
    if (key === 'My Food') {
      goMyFood();
      return;
    }
    setCategory(key);
  };

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.brand}>Foodie</Text>
        <Text style={styles.tagline}>What are we cooking today?</Text>
      </View>

      <View style={styles.chipsWrap}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(i) => i.key}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => {
            const active = item.key === category;
            return (
              <TouchableOpacity
                onPress={() => onCategory(item.key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Ionicons name={item.icon} size={16} color={active ? '#fff' : C.basil} />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.key}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={list}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>
            {category === 'All' ? 'All recipes' : category} ({list.length})
          </Text>
        }
        renderItem={({ item }) => <RecipeCard recipe={item} onPress={() => openRecipe(item.id)} />}
        ListEmptyComponent={
          <EmptyState icon="search" title="No recipes here yet" text="Try another category." />
        }
      />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Favorites                                                           */
/* ------------------------------------------------------------------ */
function FavoritesScreen({ openRecipe }) {
  const { favorites, findRecipe } = useFoodie();
  const list = favorites.map(findRecipe).filter(Boolean);
  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Text style={styles.brand}>Favorites</Text>
        <Text style={styles.tagline}>Recipes you saved with the heart</Text>
      </View>
      <FlatList
        data={list}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        renderItem={({ item }) => <RecipeCard recipe={item} onPress={() => openRecipe(item.id)} />}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No favorites yet"
            text="Tap the heart on any recipe to save it here."
          />
        }
      />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* My Food (form + My Recipes with Edit / Delete)                      */
/* ------------------------------------------------------------------ */
function MyFoodScreen({ openRecipe }) {
  const { myRecipes, addRecipe, updateRecipe, deleteRecipe } = useFoodie();
  const scrollRef = useRef(null);

  const empty = { name: '', image: '', ingredients: '', steps: '' };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [toDelete, setToDelete] = useState(null);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const resetForm = () => {
    setForm(empty);
    setEditingId(null);
    setErrors({});
  };

  const splitLines = (t) =>
    t.split('\n').map((s) => s.replace(/^\s*(\d+[.)]|[-*•])\s*/, '').trim()).filter(Boolean);

  const save = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Enter a recipe name.';
    if (splitLines(form.ingredients).length === 0) e.ingredients = 'Add at least one ingredient, one per line.';
    if (splitLines(form.steps).length === 0) e.steps = 'Add at least one step, one per line.';
    setErrors(e);
    if (Object.keys(e).length) return;

    const data = {
      name: form.name.trim(),
      image: form.image.trim(),
      ingredients: splitLines(form.ingredients),
      steps: splitLines(form.steps),
    };
    if (editingId) updateRecipe(editingId, data);
    else addRecipe(data);
    resetForm();
  };

  const startEdit = (rec) => {
    setEditingId(rec.id);
    setErrors({});
    setForm({
      name: rec.name,
      image: rec.image || '',
      ingredients: rec.ingredients.join('\n'),
      steps: rec.steps.join('\n'),
    });
    scrollRef.current && scrollRef.current.scrollTo({ y: 0, animated: true });
  };

  const confirmDelete = () => {
    if (toDelete) {
      if (editingId === toDelete.id) resetForm();
      deleteRecipe(toDelete.id);
    }
    setToDelete(null);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.brand}>My Food</Text>
        <Text style={styles.tagline}>Write down your own recipes</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{editingId ? 'Edit recipe' : 'Add New Recipe'}</Text>

          <Text style={styles.label}>Recipe name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="e.g. Grandma's lemon rice"
            placeholderTextColor={C.muted}
            value={form.name}
            onChangeText={set('name')}
          />
          {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor={C.muted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            value={form.image}
            onChangeText={set('image')}
          />

          <Text style={styles.label}>Ingredients (one per line)</Text>
          <TextInput
            style={[styles.input, styles.multiline, errors.ingredients && styles.inputError]}
            placeholder={'2 cups rice\n1 lemon\n1 tsp mustard seeds'}
            placeholderTextColor={C.muted}
            multiline
            textAlignVertical="top"
            value={form.ingredients}
            onChangeText={set('ingredients')}
          />
          {errors.ingredients ? <Text style={styles.error}>{errors.ingredients}</Text> : null}

          <Text style={styles.label}>Step-by-step instructions (one step per line)</Text>
          <TextInput
            style={[styles.input, styles.multiline, errors.steps && styles.inputError]}
            placeholder={'Cook the rice.\nTemper the mustard seeds.\nMix everything together.'}
            placeholderTextColor={C.muted}
            multiline
            textAlignVertical="top"
            value={form.steps}
            onChangeText={set('steps')}
          />
          {errors.steps ? <Text style={styles.error}>{errors.steps}</Text> : null}

          <View style={styles.formActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={save}>
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>{editingId ? 'Update Recipe' : 'Save Recipe'}</Text>
            </TouchableOpacity>
            {editingId ? (
              <TouchableOpacity style={styles.ghostBtn} onPress={resetForm}>
                <Text style={styles.ghostBtnText}>Cancel</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* My Recipes */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>My Recipes ({myRecipes.length})</Text>
        {myRecipes.length === 0 ? (
          <EmptyState
            icon="book-outline"
            title="Nothing here yet"
            text="Fill in the form above and tap Save Recipe."
          />
        ) : (
          myRecipes.map((rec) => (
            <View key={rec.id} style={styles.myRow}>
              <TouchableOpacity style={styles.myRowMain} onPress={() => openRecipe(rec.id)} activeOpacity={0.8}>
                <RecipeImage uri={rec.image} style={styles.myThumb} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{rec.name}</Text>
                  <Text style={styles.cardMeta}>
                    {rec.ingredients.length} ingredients, {rec.steps.length} steps
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => startEdit(rec)} accessibilityLabel="Edit recipe">
                <Ionicons name="create-outline" size={20} color={C.basil} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setToDelete(rec)} accessibilityLabel="Delete recipe">
                <Ionicons name="trash-outline" size={20} color={C.tomato} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Delete confirmation */}
      <Modal transparent visible={!!toDelete} animationType="fade" onRequestClose={() => setToDelete(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete this recipe?</Text>
            <Text style={styles.modalText}>
              "{toDelete ? toDelete.name : ''}" will be removed from My Recipes and Favorites.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.ghostBtn} onPress={() => setToDelete(null)}>
                <Text style={styles.ghostBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: C.tomato }]} onPress={confirmDelete}>
                <Text style={styles.primaryBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

/* ------------------------------------------------------------------ */
/* Recipe details                                                      */
/* ------------------------------------------------------------------ */
function DetailsScreen({ id, onBack }) {
  const { findRecipe } = useFoodie();
  const recipe = findRecipe(id);

  useEffect(() => {
    if (!recipe) onBack();
  }, [recipe]);

  if (!recipe) return null;

  const stats = recipe.mine
    ? []
    : [
        { icon: 'time-outline', label: 'Prep time', value: recipe.time },
        { icon: 'people-outline', label: 'Servings', value: String(recipe.servings) },
        { icon: 'flame-outline', label: 'Calories', value: `${recipe.calories} kcal` },
        { icon: 'speedometer-outline', label: 'Difficulty', value: recipe.difficulty },
      ];

  return (
    <View style={styles.flex}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View>
          <RecipeImage uri={recipe.image} style={styles.hero} />
          <TouchableOpacity style={styles.backBtn} onPress={onBack} accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={22} color={C.ink} />
          </TouchableOpacity>
          <HeartButton id={recipe.id} style={styles.heroHeart} />
        </View>

        <View style={styles.detailBody}>
          <Text style={styles.detailTitle}>{recipe.name}</Text>

          {stats.length > 0 && (
            <View style={styles.statsGrid}>
              {stats.map((s) => (
                <View key={s.label} style={styles.stat}>
                  <Ionicons name={s.icon} size={20} color={C.basil} />
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.detailHeading}>Ingredients</Text>
          {recipe.ingredients.map((ing, i) => (
            <View key={i} style={styles.ingRow}>
              <View style={styles.dot} />
              <Text style={styles.ingText}>{ing}</Text>
            </View>
          ))}

          <Text style={styles.detailHeading}>Instructions</Text>
          {recipe.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Bottom tab bar                                                      */
/* ------------------------------------------------------------------ */
const TABS = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'favorites', label: 'Favorites', icon: 'heart' },
  { key: 'myfood', label: 'My Food', icon: 'book' },
];

function TabBar({ tab, setTab }) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((t) => {
        const active = tab === t.key;
        return (
          <TouchableOpacity key={t.key} style={styles.tabItem} onPress={() => setTab(t.key)}>
            <Ionicons name={active ? t.icon : `${t.icon}-outline`} size={22} color={active ? C.basil : C.muted} />
            <Text style={[styles.tabLabel, active && { color: C.basil, fontWeight: '700' }]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* App (state-based navigation, back works on iOS + Android)           */
/* ------------------------------------------------------------------ */
function Root() {
  const [tab, setTab] = useState('home');
  const [stack, setStack] = useState([]); // pushed screens, e.g. { name: 'details', id }

  const push = (route) => setStack((s) => [...s, route]);
  const pop = useCallback(() => setStack((s) => s.slice(0, -1)), []);
  const top = stack[stack.length - 1];

  // Android hardware back button
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 0) {
        pop();
        return true;
      }
      if (tab !== 'home') {
        setTab('home');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [stack.length, tab, pop]);

  const openRecipe = (id) => push({ name: 'details', id });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <View style={styles.flex}>
        {top && top.name === 'details' ? (
          <DetailsScreen id={top.id} onBack={pop} />
        ) : (
          <>
            <View style={styles.flex}>
              {tab === 'home' && <HomeScreen openRecipe={openRecipe} goMyFood={() => setTab('myfood')} />}
              {tab === 'favorites' && <FavoritesScreen openRecipe={openRecipe} />}
              {tab === 'myfood' && <MyFoodScreen openRecipe={openRecipe} />}
            </View>
            <TabBar tab={tab} setTab={setTab} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <FoodieProvider>
      <Root />
    </FoodieProvider>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: {
    flex: 1,
    backgroundColor: C.bg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },

  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  brand: { fontSize: 30, fontWeight: '800', color: C.basil, letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: C.muted, marginTop: 2 },

  chipsWrap: { height: 52, justifyContent: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.basilSoft,
    marginRight: 8,
  },
  chipActive: { backgroundColor: C.basil },
  chipText: { marginLeft: 6, fontSize: 14, fontWeight: '600', color: C.basil },
  chipTextActive: { color: '#fff' },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 12 },

  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.line,
  },
  cardImage: { width: '100%', height: 170 },
  cardHeart: { position: 'absolute', top: 10, right: 10 },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: C.ink },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  cardMeta: { fontSize: 13, color: C.muted, marginLeft: 4 },

  imageFallback: { backgroundColor: C.basilSoft, alignItems: 'center', justifyContent: 'center' },

  heartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: C.ink, marginTop: 10 },
  emptyText: { fontSize: 14, color: C.muted, marginTop: 4, textAlign: 'center' },

  /* form */
  formCard: {
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.line,
  },
  formTitle: { fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 4 },
  label: { fontSize: 13, fontWeight: '600', color: C.ink, marginTop: 14, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: C.ink,
    backgroundColor: C.bg,
  },
  multiline: { minHeight: 100 },
  inputError: { borderColor: C.tomato },
  error: { color: C.tomato, fontSize: 12, marginTop: 4 },
  formActions: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.basil,
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 22,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15, marginLeft: 6 },
  ghostBtn: { paddingHorizontal: 16, height: 44, justifyContent: 'center' },
  ghostBtnText: { color: C.muted, fontWeight: '600', fontSize: 15 },

  /* my recipes */
  myRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.line,
  },
  myRowMain: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  myThumb: { width: 56, height: 56, borderRadius: 10 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  /* modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: { backgroundColor: C.surface, borderRadius: 16, padding: 20, width: '100%', maxWidth: 380 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: C.ink },
  modalText: { fontSize: 14, color: C.muted, marginTop: 8 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },

  /* details */
  hero: { width: '100%', height: 280 },
  backBtn: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroHeart: { position: 'absolute', top: 14, right: 14, width: 42, height: 42, borderRadius: 21 },
  detailBody: { padding: 20 },
  detailTitle: { fontSize: 26, fontWeight: '800', color: C.ink, letterSpacing: -0.4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, marginHorizontal: -4 },
  stat: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  statValue: { fontSize: 16, fontWeight: '700', color: C.ink, marginTop: 4 },
  statLabel: { fontSize: 12, color: C.muted },
  detailHeading: { fontSize: 20, fontWeight: '700', color: C.basil, marginTop: 24, marginBottom: 10 },
  ingRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.saffron, marginTop: 7, marginRight: 12 },
  ingText: { flex: 1, fontSize: 15, color: C.ink, lineHeight: 22 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.basil,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  stepText: { flex: 1, fontSize: 15, color: C.ink, lineHeight: 22 },

  /* tab bar */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.line,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 6 : 10,
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabLabel: { fontSize: 12, color: C.muted, marginTop: 2 },
});