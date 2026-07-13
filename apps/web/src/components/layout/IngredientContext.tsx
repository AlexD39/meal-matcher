import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type IngredientSource = 'scan' | 'manual'

export interface Ingredient {
  id: string
  name: string
  source: IngredientSource
}

interface IngredientContextValue {
  ingredients: Ingredient[]
  addIngredient: (
    name: string,
    source: IngredientSource,
  ) => boolean
  removeIngredient: (id: string) => void
  clearIngredients: () => void
}

interface IngredientProviderProps {
  children: ReactNode
}

const STORAGE_KEY = 'meal-matcher.ingredients'

const IngredientContext = createContext<
  IngredientContextValue | undefined
>(undefined)

function readStoredIngredients(): Ingredient[] {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY)

    if (!storedValue) {
      return []
    }

    const parsedValue: unknown = JSON.parse(storedValue)

    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue as Ingredient[]
  } catch {
    return []
  }
}

export function IngredientProvider({
  children,
}: IngredientProviderProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    readStoredIngredients,
  )

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(ingredients),
    )
  }, [ingredients])

  function normalizeName(value: string): string {
    return value.trim().toLocaleLowerCase('es')
  }

  function addIngredient(
    name: string,
    source: IngredientSource,
  ): boolean {
    const cleanName = name.trim()

    if (!cleanName) {
      return false
    }

    const alreadyExists = ingredients.some(
      (ingredient) =>
        normalizeName(ingredient.name) ===
        normalizeName(cleanName),
    )

    if (alreadyExists) {
      return false
    }

    setIngredients((currentIngredients) => [
      ...currentIngredients,
      {
        id: crypto.randomUUID(),
        name: cleanName,
        source,
      },
    ])

    return true
  }

  function removeIngredient(id: string): void {
    setIngredients((currentIngredients) =>
      currentIngredients.filter(
        (ingredient) => ingredient.id !== id,
      ),
    )
  }

  function clearIngredients(): void {
    setIngredients([])
  }

  return (
    <IngredientContext.Provider
      value={{
        ingredients,
        addIngredient,
        removeIngredient,
        clearIngredients,
      }}
    >
      {children}
    </IngredientContext.Provider>
  )
}

export function useIngredients(): IngredientContextValue {
  const context = useContext(IngredientContext)

  if (!context) {
    throw new Error(
      'useIngredients debe utilizarse dentro de IngredientProvider',
    )
  }

  return context
}