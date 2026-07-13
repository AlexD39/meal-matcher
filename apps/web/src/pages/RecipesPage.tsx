import {
  Check,
  CircleAlert,
  Clock3,
  CookingPot,
  Plus,
  ScanLine,
  Trash2,
  Users,
  X,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useNavigate } from 'react-router'

import { useIngredients } from '../context/IngredientContext'

interface Recipe {
  id: string
  name: string
  emoji: string
  time: number
  servings: number
  difficulty: string
  description: string
  requiredIngredients: string[]
  steps: string[]
}

interface RecipeResult extends Recipe {
  availableIngredients: string[]
  missingIngredients: string[]
  percentage: number
}

const recipes: Recipe[] = [
  {
    id: 'guacamole',
    name: 'Guacamole tradicional',
    emoji: '🥑',
    time: 20,
    servings: 2,
    difficulty: 'Fácil',
    description:
      'Una preparación mexicana fresca y cremosa, ideal para acompañar tacos, tostadas o botanas.',
    requiredIngredients: [
      'Aguacate',
      'Cebolla',
      'Jitomate fresco',
      'Limón verde',
      'Cilantro',
      'Sal',
    ],
    steps: [
      'Lava el jitomate, el cilantro y el limón.',
      'Pica finamente la cebolla, el jitomate y el cilantro.',
      'Corta los aguacates y retira la pulpa.',
      'Machaca el aguacate hasta conseguir una textura cremosa.',
      'Agrega el jitomate, la cebolla, el cilantro y el jugo de limón.',
      'Añade sal al gusto, mezcla suavemente y sirve.',
    ],
  },
  {
    id: 'huevos-mexicana',
    name: 'Huevos a la mexicana',
    emoji: '🍳',
    time: 25,
    servings: 2,
    difficulty: 'Fácil',
    description:
      'Huevos revueltos preparados con jitomate, cebolla y chile verde, ideales para un desayuno rápido.',
    requiredIngredients: [
      'Huevo',
      'Cebolla',
      'Jitomate fresco',
      'Chile verde',
      'Sal',
    ],
    steps: [
      'Lava y pica el jitomate, la cebolla y el chile.',
      'Calienta una sartén con una pequeña cantidad de aceite.',
      'Sofríe la cebolla y el chile durante dos minutos.',
      'Agrega el jitomate y cocina hasta que se suavice.',
      'Añade los huevos y mezcla constantemente.',
      'Agrega sal al gusto y cocina hasta obtener la textura deseada.',
    ],
  },
  {
    id: 'tacos-vegetarianos',
    name: 'Tacos vegetarianos',
    emoji: '🌮',
    time: 30,
    servings: 3,
    difficulty: 'Media',
    description:
      'Tacos sencillos preparados con frijoles, aguacate y vegetales frescos.',
    requiredIngredients: [
      'Tortilla',
      'Frijol',
      'Aguacate',
      'Cebolla',
      'Jitomate fresco',
      'Cilantro',
    ],
    steps: [
      'Calienta los frijoles en una olla pequeña.',
      'Pica la cebolla, el jitomate y el cilantro.',
      'Corta el aguacate en rebanadas.',
      'Calienta las tortillas en una sartén.',
      'Coloca frijoles sobre cada tortilla.',
      'Agrega aguacate, cebolla, jitomate y cilantro.',
    ],
  },
  {
    id: 'ensalada-fresca',
    name: 'Ensalada fresca',
    emoji: '🥗',
    time: 15,
    servings: 2,
    difficulty: 'Fácil',
    description:
      'Ensalada ligera y refrescante elaborada con vegetales frescos y jugo de limón.',
    requiredIngredients: [
      'Aguacate',
      'Pepino',
      'Jitomate fresco',
      'Cebolla',
      'Limón verde',
      'Sal',
    ],
    steps: [
      'Lava todos los vegetales.',
      'Corta el pepino, el jitomate y el aguacate en cubos.',
      'Pica finamente la cebolla.',
      'Coloca todos los ingredientes en un recipiente.',
      'Agrega jugo de limón y sal al gusto.',
      'Mezcla suavemente y sirve inmediatamente.',
    ],
  },
  {
    id: 'pico-gallo',
    name: 'Pico de gallo',
    emoji: '🍅',
    time: 15,
    servings: 3,
    difficulty: 'Fácil',
    description:
      'Salsa mexicana fresca hecha con jitomate, cebolla, cilantro y limón.',
    requiredIngredients: [
      'Jitomate fresco',
      'Cebolla',
      'Limón verde',
      'Cilantro',
      'Sal',
    ],
    steps: [
      'Lava el jitomate, el cilantro y el limón.',
      'Corta el jitomate en cubos pequeños.',
      'Pica finamente la cebolla y el cilantro.',
      'Mezcla los ingredientes en un recipiente.',
      'Agrega jugo de limón y sal al gusto.',
      'Deja reposar cinco minutos antes de servir.',
    ],
  },
  {
    id: 'arroz-pollo',
    name: 'Arroz con pollo',
    emoji: '🍚',
    time: 45,
    servings: 4,
    difficulty: 'Media',
    description:
      'Platillo completo preparado con arroz, pollo y vegetales cocinados en una sola olla.',
    requiredIngredients: [
      'Arroz',
      'Pollo',
      'Cebolla',
      'Jitomate fresco',
      'Zanahoria',
      'Sal',
    ],
    steps: [
      'Corta el pollo en trozos pequeños.',
      'Pica la cebolla, el jitomate y la zanahoria.',
      'Dora ligeramente el pollo en una olla.',
      'Agrega los vegetales y cocina durante cinco minutos.',
      'Incorpora el arroz y mezcla.',
      'Agrega agua y sal, tapa la olla y cocina hasta que el arroz esté suave.',
    ],
  },
]

function normalizeName(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('es')
}

export function RecipesPage() {
  const navigate = useNavigate()

  const [selectedRecipe, setSelectedRecipe] =
  useState<RecipeResult | null>(null)

  const {
    ingredients,
    removeIngredient,
    clearIngredients,
  } = useIngredients()

  const recipeResults = useMemo(() => {
    const availableNames = new Set(
      ingredients.map((ingredient) =>
        normalizeName(ingredient.name),
      ),
    )

    return recipes
      .map((recipe) => {
        const availableIngredients =
          recipe.requiredIngredients.filter((ingredient) =>
            availableNames.has(normalizeName(ingredient)),
          )

        const missingIngredients =
          recipe.requiredIngredients.filter(
            (ingredient) =>
              !availableNames.has(normalizeName(ingredient)),
          )

        const percentage =
          recipe.requiredIngredients.length === 0
            ? 0
            : Math.round(
                (availableIngredients.length /
                  recipe.requiredIngredients.length) *
                  100,
              )

        return {
          ...recipe,
          availableIngredients,
          missingIngredients,
          percentage,
        }
      })
      .sort((firstRecipe, secondRecipe) => {
        if (
          secondRecipe.percentage !== firstRecipe.percentage
        ) {
          return (
            secondRecipe.percentage -
            firstRecipe.percentage
          )
        }

        return (
          firstRecipe.missingIngredients.length -
          secondRecipe.missingIngredients.length
        )
      })
  }, [ingredients])

  useEffect(() => {
    if (!selectedRecipe) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedRecipe(null)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [selectedRecipe])

  return (
    <div className="recipes-page">
      <section className="page-heading">
        <div>
          <span className="eyebrow">
            RECOMENDACIONES PERSONALIZADAS
          </span>

          <h2>¿Qué puedes cocinar hoy?</h2>

          <p>
            Las recetas están ordenadas según los ingredientes
            que tienes disponibles.
          </p>
        </div>

        <button
          className="button button--secondary"
          type="button"
          onClick={() => navigate('/escanear')}
        >
          <ScanLine size={18} />
          Escanear otro ingrediente
        </button>
      </section>

      <section className="recipe-inventory panel">
        <div className="recipe-inventory__header">
          <div>
            <h3>Tus ingredientes</h3>
            <p>
              El cálculo se actualiza automáticamente al modificar
              el inventario.
            </p>
          </div>

          {ingredients.length > 0 && (
            <button
              className="clear-inventory-button"
              type="button"
              onClick={clearIngredients}
            >
              <Trash2 size={15} />
              Limpiar
            </button>
          )}
        </div>

        {ingredients.length === 0 ? (
          <div className="recipe-inventory__empty">
            <span>No has agregado ingredientes.</span>

            <button
              type="button"
              onClick={() => navigate('/escanear')}
            >
              <Plus size={16} />
              Agregar ingredientes
            </button>
          </div>
        ) : (
          <div className="ingredient-list recipe-ingredient-list">
            {ingredients.map((ingredient) => (
              <span
                className="ingredient-pill"
                key={ingredient.id}
              >
                <span className="ingredient-pill__indicator" />

                {ingredient.name}

                <button
                  type="button"
                  onClick={() =>
                    removeIngredient(ingredient.id)
                  }
                  aria-label={`Eliminar ${ingredient.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="recommendations-section">
        <div className="section-heading">
          <div>
            <h3>Recomendaciones</h3>
            <p>
              {recipeResults.length} recetas encontradas.
            </p>
          </div>
        </div>

        <div className="recipe-grid">
          {recipeResults.map((recipe) => {
            const matchVariant =
              recipe.percentage >= 70
                ? 'high'
                : recipe.percentage >= 40
                  ? 'medium'
                  : 'low'

            return (
              <article
                className="recipe-card"
                key={recipe.id}
              >
                <div className="recipe-card__image">
                  <span>{recipe.emoji}</span>

                  <strong
                    className={`match-badge match-badge--${matchVariant}`}
                  >
                    {recipe.percentage} %
                  </strong>
                </div>

                <div className="recipe-card__content">
                  <h4>{recipe.name}</h4>

                  <div className="recipe-card__metadata">
                    <span>
                      <Clock3 size={14} />
                      {recipe.time} min
                    </span>

                    <span>
                      <CookingPot size={14} />
                      {recipe.difficulty}
                    </span>
                  </div>

                  <div className="recipe-card__ingredients">
                    <div>
                      <strong>Ya tienes</strong>
                      <p>
                        {recipe.availableIngredients.length > 0
                          ? recipe.availableIngredients.join(
                              ' · ',
                            )
                          : 'Ninguno'}
                      </p>
                    </div>

                    <div>
                      <strong>Te falta</strong>
                      <p>
                        {recipe.missingIngredients.length > 0
                          ? recipe.missingIngredients.join(
                              ' · ',
                            )
                          : 'Nada, receta completa'}
                      </p>
                    </div>
                  </div>

                  <button
  className="button button--secondary button--full"
  type="button"
  onClick={() => setSelectedRecipe(recipe)}
>
  Ver receta
</button>

                </div>
              </article>
            )
          })}
        </div>
      </section>

      {selectedRecipe && (
        <div
          className="recipe-modal-backdrop"
          role="presentation"
          onMouseDown={() => setSelectedRecipe(null)}
        >
          <section
            className="recipe-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recipe-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="recipe-modal__close"
              type="button"
              onClick={() => setSelectedRecipe(null)}
              aria-label="Cerrar receta"
            >
              <X size={22} />
            </button>

            <div className="recipe-modal__header">
              <div className="recipe-modal__visual">
                <span>{selectedRecipe.emoji}</span>

                <strong
                  className={`match-badge ${
                    selectedRecipe.percentage >= 70
                      ? 'match-badge--high'
                      : selectedRecipe.percentage >= 40
                        ? 'match-badge--medium'
                        : 'match-badge--low'
                  }`}
                >
                  {selectedRecipe.percentage} % de coincidencia
                </strong>
              </div>

              <div className="recipe-modal__summary">
                <span className="eyebrow">
                  RECETA RECOMENDADA
                </span>

                <h2 id="recipe-modal-title">
                  {selectedRecipe.name}
                </h2>

                <p>{selectedRecipe.description}</p>

                <div className="recipe-modal__metrics">
                  <div>
                    <Clock3 size={19} />
                    <span>
                      <strong>{selectedRecipe.time} min</strong>
                      <small>Preparación</small>
                    </span>
                  </div>

                  <div>
                    <Users size={19} />
                    <span>
                      <strong>
                        {selectedRecipe.servings} porciones
                      </strong>
                      <small>Rendimiento</small>
                    </span>
                  </div>

                  <div>
                    <CookingPot size={19} />
                    <span>
                      <strong>
                        {selectedRecipe.difficulty}
                      </strong>
                      <small>Dificultad</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="recipe-modal__body">
              <section className="recipe-modal__ingredients">
                <div className="recipe-modal__section-heading">
                  <div>
                    <h3>Ingredientes</h3>

                    <p>
                      {
                        selectedRecipe.availableIngredients
                          .length
                      }{' '}
                      de{' '}
                      {
                        selectedRecipe.requiredIngredients
                          .length
                      }{' '}
                      disponibles
                    </p>
                  </div>
                </div>

                <div className="modal-ingredient-list">
                  {selectedRecipe.requiredIngredients.map(
                    (ingredient) => {
                      const isAvailable =
                        selectedRecipe.availableIngredients.includes(
                          ingredient,
                        )

                      return (
                        <div
                          className={`modal-ingredient ${
                            isAvailable
                              ? 'modal-ingredient--available'
                              : 'modal-ingredient--missing'
                          }`}
                          key={ingredient}
                        >
                          <span className="modal-ingredient__status">
                            {isAvailable ? (
                              <Check size={15} />
                            ) : (
                              <CircleAlert size={15} />
                            )}
                          </span>

                          <div>
                            <strong>{ingredient}</strong>

                            <small>
                              {isAvailable
                                ? 'Disponible'
                                : 'Ingrediente faltante'}
                            </small>
                          </div>
                        </div>
                      )
                    },
                  )}
                </div>

                {selectedRecipe.missingIngredients.length >
                  0 && (
                  <div className="recipe-modal__warning">
                    <CircleAlert size={18} />

                    <span>
                      Te faltan{' '}
                      {
                        selectedRecipe.missingIngredients
                          .length
                      }{' '}
                      ingredientes para completar esta receta.
                    </span>
                  </div>
                )}
              </section>

              <section className="recipe-modal__preparation">
                <div className="recipe-modal__section-heading">
                  <div>
                    <h3>Preparación</h3>
                    <p>
                      Sigue los pasos en el orden indicado.
                    </p>
                  </div>
                </div>

                <ol className="preparation-steps">
                  {selectedRecipe.steps.map(
                    (step, index) => (
                      <li key={`${selectedRecipe.id}-${index}`}>
                        <span>
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <p>{step}</p>
                      </li>
                    ),
                  )}
                </ol>
              </section>
            </div>

            <footer className="recipe-modal__footer">
              <button
                className="button button--secondary"
                type="button"
                onClick={() => setSelectedRecipe(null)}
              >
                Cerrar
              </button>
              
            </footer>
          </section>
        </div>
      )}

    </div>
  )
}

