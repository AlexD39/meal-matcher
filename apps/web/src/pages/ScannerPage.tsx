import {
  Camera,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ImagePlus,
  Plus,
  ScanLine,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from 'react'

import { useNavigate } from 'react-router'

import {
  useIngredients,
  type Ingredient,
  type IngredientSource,
} from '../context/IngredientContext'

type ScanStatus = 'idle' | 'preview' | 'scanning' | 'success'

const ingredientOptions = [
  'Aguacate',
  'Arroz',
  'Cebolla',
  'Chile verde',
  'Cilantro',
  'Frijol',
  'Huevo',
  'Jitomate fresco',
  'Limón verde',
  'Papa',
  'Pepino',
  'Pollo',
  'Sal',
  'Tortilla',
  'Zanahoria',
]

const inspirationRecipes = [
  {
    name: 'Guacamole fresco',
    ingredients: '6 ingredientes',
    emoji: '🥑',
    variant: 'green',
  },
  {
    name: 'Huevos a la mexicana',
    ingredients: '5 ingredientes',
    emoji: '🍳',
    variant: 'yellow',
  },
  {
    name: 'Ensalada crujiente',
    ingredients: '7 ingredientes',
    emoji: '🥗',
    variant: 'mint',
  },
]

export function ScannerPage() {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const {
    ingredients,
    addIngredient: saveIngredient,
    removeIngredient,
  } = useIngredients()


  const [manualIngredient, setManualIngredient] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle')
  const [detectedIngredient, setDetectedIngredient] = useState('Aguacate')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function normalizeName(value: string) {
    return value.trim().toLocaleLowerCase('es')
  }

  function addIngredient(
  name: string,
  source: IngredientSource,
) {
  const cleanName = name.trim()

  if (!cleanName) {
    return
  }

  const ingredientAdded = saveIngredient(
    cleanName,
    source,
  )

  if (!ingredientAdded) {
    setErrorMessage(
      `${cleanName} ya está en tu inventario.`,
    )
    return
  }

  setErrorMessage('')
}

  function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    addIngredient(manualIngredient, 'manual')
    setManualIngredient('')
  }

  function validateAndSelectFile(file: File) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maximumSize = 10 * 1024 * 1024

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Selecciona una imagen JPG, PNG o WEBP.')
      return
    }

    if (file.size > maximumSize) {
      setErrorMessage('La imagen no debe superar los 10 MB.')
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setScanStatus('preview')
    setDetectedIngredient('Aguacate')
    setErrorMessage('')
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (file) {
      validateAndSelectFile(file)
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()

    const file = event.dataTransfer.files?.[0]

    if (file) {
      validateAndSelectFile(file)
    }
  }

  function handleAnalyzeImage() {
    if (!selectedFile) {
      setErrorMessage('Primero selecciona una imagen.')
      return
    }

    setScanStatus('scanning')
    setErrorMessage('')

    window.setTimeout(() => {
      setScanStatus('success')
    }, 1600)
  }

  function handleAddDetectedIngredient() {
    addIngredient(detectedIngredient, 'scan')
  }

  function resetScanner() {
    setSelectedFile(null)
    setPreviewUrl(null)
    setScanStatus('idle')
    setDetectedIngredient('Aguacate')

    if (inputFileRef.current) {
      inputFileRef.current.value = ''
    }
  }

  const isSuccessfulScan = scanStatus === 'success'

  return (
    <div className="scanner-page">
      <section className="page-heading">
        <div>
          <span className="eyebrow">INTELIGENCIA ARTIFICIAL LOCAL</span>

          <h2>
            {isSuccessfulScan
              ? 'Ingrediente detectado'
              : 'Convierte tu refrigerador en una receta'}
          </h2>

          <p>
            {isSuccessfulScan
              ? 'Revisa el resultado antes de agregarlo a tu inventario.'
              : 'Escanea ingredientes, confirma lo detectado y encuentra qué cocinar hoy.'}
          </p>
        </div>

        <div className="process-steps">
          {['Escanea', 'Confirma', 'Cocina'].map((step, index) => (
            <div
              className={`process-step ${
                index === 0 || isSuccessfulScan
                  ? 'process-step--active'
                  : ''
              }`}
              key={step}
            >
              <span>{index + 1}</span>
              <small>{step}</small>
            </div>
          ))}
        </div>
      </section>

      {errorMessage && (
        <div className="notification notification--error">
          <CircleAlert size={19} />
          <span>{errorMessage}</span>

          <button
            type="button"
            onClick={() => setErrorMessage('')}
            aria-label="Cerrar mensaje"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <section className="scanner-layout">
        <article className="panel scanner-panel">
          <header className="panel__header">
            <div>
              <h3>
                {isSuccessfulScan
                  ? 'Análisis de imagen'
                  : 'Escáner de ingredientes'}
              </h3>

              <p>
                {isSuccessfulScan
                  ? 'La imagen fue procesada correctamente.'
                  : 'Usa la cámara o selecciona una fotografía.'}
              </p>
            </div>

            <span className="status-label">
              <Sparkles size={15} />
              IA local
            </span>
          </header>

          <input
            ref={inputFileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            hidden
          />

          {!previewUrl ? (
            <div
              className="dropzone"
              role="button"
              tabIndex={0}
              onClick={() => inputFileRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  inputFileRef.current?.click()
                }
              }}
            >
              <div className="dropzone__icon">
                <UploadCloud size={37} />
              </div>

              <h4>Arrastra una imagen aquí</h4>
              <p>JPG, PNG o WEBP · máximo 10 MB</p>

              <button className="button button--primary" type="button">
                <ImagePlus size={18} />
                Seleccionar imagen
              </button>

              <span className="dropzone__camera">
                <Camera size={16} />
                También puedes utilizar la cámara
              </span>
            </div>
          ) : (
            <div className="image-analysis">
              <div className="image-analysis__preview">
                <img src={previewUrl} alt="Ingrediente seleccionado" />

                {scanStatus === 'scanning' && (
                  <>
                    <span className="scanner-corner scanner-corner--top-left" />
                    <span className="scanner-corner scanner-corner--top-right" />
                    <span className="scanner-corner scanner-corner--bottom-left" />
                    <span className="scanner-corner scanner-corner--bottom-right" />
                    <span className="scanner-beam" />
                  </>
                )}

                {scanStatus === 'success' && (
                  <div className="image-analysis__success">
                    <CheckCircle2 size={22} />
                    Análisis completado
                  </div>
                )}
              </div>

              {scanStatus === 'preview' && (
                <div className="image-actions">
                  <button
                    className="button button--secondary"
                    type="button"
                    onClick={resetScanner}
                  >
                    Cambiar imagen
                  </button>

                  <button
                    className="button button--primary"
                    type="button"
                    onClick={handleAnalyzeImage}
                  >
                    <ScanLine size={18} />
                    Analizar con IA
                  </button>
                </div>
              )}

              {scanStatus === 'scanning' && (
                <div className="scanning-status">
                  <div className="scanning-status__header">
                    <span>Analizando características visuales...</span>
                    <strong>Procesando</strong>
                  </div>

                  <div className="scanning-status__progress">
                    <span />
                  </div>
                </div>
              )}

              {scanStatus === 'success' && (
                <div className="prediction-result">
                  <div className="prediction-result__check">
                    <Check size={21} />
                  </div>

                  <div>
                    <span>Resultado principal</span>
                    <strong>{detectedIngredient}</strong>
                    <small>Confianza del modelo: 96.4 %</small>
                  </div>

                  <span className="prediction-result__class">Clase #04</span>
                </div>
              )}
            </div>
          )}

          <footer className="privacy-message">
            <CheckCircle2 size={16} />
            La imagen se procesa localmente y no se guarda permanentemente.
          </footer>
        </article>

        {!isSuccessfulScan ? (
          <InventoryPanel
            ingredients={ingredients}
            manualIngredient={manualIngredient}
            setManualIngredient={setManualIngredient}
            handleManualSubmit={handleManualSubmit}
            removeIngredient={removeIngredient}
            onSearch={() => navigate('/recetas')}
          />
        ) : (
          <article className="panel confirmation-panel">
            <header className="panel__header">
              <div>
                <h3>Confirmar detección</h3>
                <p>Corrige el ingrediente si la predicción no es correcta.</p>
              </div>
            </header>

            <label className="form-field">
              <span>Ingrediente detectado</span>

              <select
                value={detectedIngredient}
                onChange={(event) =>
                  setDetectedIngredient(event.target.value)
                }
              >
                {ingredientOptions.map((ingredient) => (
                  <option key={ingredient} value={ingredient}>
                    {ingredient}
                  </option>
                ))}
              </select>
            </label>

            <div className="confirmation-inventory">
              <div className="section-label">
                <span>Inventario actual</span>
                <strong>{ingredients.length}</strong>
              </div>

              <IngredientList
                ingredients={ingredients}
                removeIngredient={removeIngredient}
                emptyText="Todavía no hay ingredientes confirmados."
              />
            </div>

            <div className="information-box">
              <Sparkles size={21} />

              <div>
                <strong>Este ingrediente mejora 4 recetas</strong>
                <span>Guacamole podría alcanzar una coincidencia del 83 %.</span>
              </div>
            </div>

            <div className="confirmation-actions">
              <button
                className="button button--primary button--full"
                type="button"
                onClick={handleAddDetectedIngredient}
              >
                <Plus size={18} />
                Agregar a mis ingredientes
              </button>

              <button
                className="button button--secondary button--full"
                type="button"
                onClick={resetScanner}
              >
                <ScanLine size={18} />
                Escanear otra imagen
              </button>

              <button
                className="button button--text"
                type="button"
                onClick={resetScanner}
              >
                Descartar resultado
              </button>
            </div>
          </article>
        )}
      </section>

      {!isSuccessfulScan && (
        <section className="inspiration-section">
          <div className="section-heading">
            <div>
              <h3>Inspiración rápida</h3>
              <p>Algunas recetas que podrás encontrar en Meal Matcher.</p>
            </div>

            <button type="button">Ver todas</button>
          </div>

          <div className="inspiration-grid">
            {inspirationRecipes.map((recipe) => (
              <article className="inspiration-card" key={recipe.name}>
                <div
                  className={`inspiration-card__visual inspiration-card__visual--${recipe.variant}`}
                >
                  <span>{recipe.emoji}</span>
                </div>

                <div>
                  <h4>{recipe.name}</h4>
                  <p>{recipe.ingredients}</p>

                  <span className="recipe-time">
                    <Clock3 size={15} />
                    20–30 min
                  </span>

                  <button type="button">Ver inspiración →</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

interface InventoryPanelProps {
  ingredients: Ingredient[]
  manualIngredient: string
  setManualIngredient: (value: string) => void
  handleManualSubmit: (event: FormEvent<HTMLFormElement>) => void
  removeIngredient: (id: string) => void
  onSearch: () => void
}

function InventoryPanel({
  ingredients,
  manualIngredient,
  setManualIngredient,
  handleManualSubmit,
  removeIngredient,
  onSearch,
}: InventoryPanelProps) {
  return (
    <article className="panel inventory-panel">
      <header className="panel__header">
        <div>
          <h3>Tus ingredientes</h3>
          <p>Agrega o elimina elementos antes de buscar recetas.</p>
        </div>

        <span className="ingredient-counter">
          {ingredients.length} agregados
        </span>
      </header>

      <form className="ingredient-form" onSubmit={handleManualSubmit}>
        <input
          type="text"
          value={manualIngredient}
          list="ingredient-options"
          placeholder="Escribe un ingrediente..."
          onChange={(event) => setManualIngredient(event.target.value)}
        />

        <datalist id="ingredient-options">
          {ingredientOptions.map((ingredient) => (
            <option key={ingredient} value={ingredient} />
          ))}
        </datalist>

        <button type="submit" aria-label="Agregar ingrediente">
          <Plus size={20} />
        </button>
      </form>

      <IngredientList
        ingredients={ingredients}
        removeIngredient={removeIngredient}
        emptyText="Escanea o agrega un ingrediente manualmente."
      />

      <button
  className="button button--primary button--full inventory-panel__search"
  type="button"
  disabled={ingredients.length === 0}
  onClick={onSearch}
>
  <CookingPotIcon />
  Buscar recetas
</button>

    </article>
  )
}

interface IngredientListProps {
  ingredients: Ingredient[]
  removeIngredient: (id: string) => void
  emptyText: string
}

function IngredientList({
  ingredients,
  removeIngredient,
  emptyText,
}: IngredientListProps) {
  if (ingredients.length === 0) {
    return (
      <div className="inventory-empty">
        <div className="inventory-empty__icon">
          <ScanLine size={34} />
        </div>

        <h4>Aún no tienes ingredientes</h4>
        <p>{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="ingredient-list">
      {ingredients.map((ingredient) => (
        <span className="ingredient-pill" key={ingredient.id}>
          <span className="ingredient-pill__indicator" />

          {ingredient.name}

          <button
            type="button"
            onClick={() => removeIngredient(ingredient.id)}
            aria-label={`Eliminar ${ingredient.name}`}
          >
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  )
}

function CookingPotIcon() {
  return <ChefHat size={18} />
}

function ChefHat({ size }: { size: number }) {
  return <Sparkles size={size} />
}