import React from 'react';
import PropTypes from 'prop-types';
import './RecipesTable.css';
import { Button } from 'react-bootstrap';

const RecipesTable = ({ recipes, onView, onEdit, onDelete }) => {
  const getDifficultyVariant = (difficulty) => {
    const normalized = (difficulty || '').trim().toLowerCase();
    if (normalized.includes('fácil')) return 'easy';
    if (normalized.includes('médio')) return 'moderate';
    if (normalized.includes('difícil')) return 'hard';
    return 'easy'; // padrão
  };

  return (
    <div className="recipes-grid">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="recipe-card"
          role="button"
          tabIndex={0}
          onClick={() => onView(recipe)}
          onKeyDown={(e) => e.key === 'Enter' && onView(recipe)}
        >
          <div className="recipe-content">
            <h3 className="recipe-title">{recipe.title}</h3>
            <div className={`difficulty-badge ${getDifficultyVariant(recipe.difficulty)}`}>
              {recipe.difficulty}
            </div>

            <div className="button-group mt-3">
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(recipe);
                }}
              >
                Visualizar
              </Button>
              <Button
                variant="warning"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(recipe.id);
                }}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(recipe.id);
                }}
              >
                Remover
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

RecipesTable.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RecipesTable;
