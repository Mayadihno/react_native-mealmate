type ButtonProps = {
  title?: string;
  onPress?: () => void;
  width?: DimensionValue;
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
};

type Recipes = {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  cookingMinutes?: number;
  category: string;
  dishTypes: string;
  image: string;
  ingredients: string;
  instructions: string;
};

interface Recipe {
  category: string;
  cookingMinutes: string;
  imageUri: string;
  ingredients: Ingredient[];
  instructions: string;
  timeStamp: Date;
  title: string;
  userId: string;
  id: string;
}

interface Ingredient {
  name: string;
  quantity: string;
}
