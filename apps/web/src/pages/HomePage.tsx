import {
  ArrowRight,
  CookingPot,
  ScanLine,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router'

import { useIngredients } from '../context/IngredientContext'

export function HomePage() {
  const navigate = useNavigate()
  const { ingredients } = useIngredients()

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <span className="eyebrow">
            INTELIGENCIA ARTIFICIAL LOCAL
          </span>

          <h2>
            Descubre qué cocinar con los ingredientes que
            tienes
          </h2>

          <p>
            Fotografía tus alimentos, confirma los ingredientes
            detectados y encuentra recetas que puedas preparar.
          </p>

          <div className="home-hero__actions">
            <button
              className="button button--primary"
              type="button"
              onClick={() => navigate('/escanear')}
            >
              <ScanLine size={18} />
              Escanear ingredientes
            </button>

            <button
              className="button button--secondary"
              type="button"
              onClick={() => navigate('/recetas')}
            >
              <CookingPot size={18} />
              Ver recetas
            </button>
          </div>
        </div>

        <div className="home-hero__visual">
          <div className="home-hero__circle">
            <Sparkles size={54} />
          </div>

          <span className="home-hero__badge home-hero__badge--top">
            IA local
          </span>

          <span className="home-hero__badge home-hero__badge--bottom">
            Recetas inteligentes
          </span>
        </div>
      </section>

      <section className="home-summary">
        <article className="summary-card">
          <div className="summary-card__icon">
            <ScanLine size={24} />
          </div>

          <div>
            <span>Ingredientes guardados</span>
            <strong>{ingredients.length}</strong>
          </div>
        </article>

        <article className="summary-card">
          <div className="summary-card__icon">
            <CookingPot size={24} />
          </div>

          <div>
            <span>Recetas disponibles</span>
            <strong>6</strong>
          </div>
        </article>

        <article className="summary-card">
          <div className="summary-card__icon">
            <Sparkles size={24} />
          </div>

          <div>
            <span>Modelo de reconocimiento</span>
            <strong>Activo</strong>
          </div>
        </article>
      </section>

      <section className="home-process">
        <div className="section-heading">
          <div>
            <h3>¿Cómo funciona?</h3>
            <p>
              Solo necesitas completar tres pasos.
            </p>
          </div>
        </div>

        <div className="process-card-grid">
          <article className="process-card">
            <span>01</span>
            <h4>Escanea</h4>
            <p>
              Selecciona una fotografía de un ingrediente.
            </p>
          </article>

          <article className="process-card">
            <span>02</span>
            <h4>Confirma</h4>
            <p>
              Revisa el resultado generado por el modelo.
            </p>
          </article>

          <article className="process-card">
            <span>03</span>
            <h4>Cocina</h4>
            <p>
              Consulta las recetas con mayor coincidencia.
            </p>
          </article>
        </div>

        <button
          className="home-process__link"
          type="button"
          onClick={() => navigate('/escanear')}
        >
          Comenzar ahora
          <ArrowRight size={17} />
        </button>
      </section>
    </div>
  )
}