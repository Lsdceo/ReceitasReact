import React, { useState, useEffect } from 'react';
import { Badge, Button, Container, Alert, Modal, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import RecipesTable from '../../components/recipestable/RecipesTable';
import { getAllRecipes, deleteRecipe } from '../../services/RecipeServices';
import '../Recipes/RecipesList.css';

const RecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const mapDifficultyToColor = (difficulty) => {
    const normalized = difficulty.trim().toLowerCase();
    if (normalized.includes('fácil')) return 'success';
    if (normalized.includes('médio')) return 'warning';
    if (normalized.includes('difícil')) return 'danger';
    return 'secondary';
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        setRecipes(data);
      } catch (error) {
        setAlert({ variant: 'danger', message: 'Erro ao carregar receitas' });
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta receita?')) {
      try {
        await deleteRecipe(id);
        setRecipes(recipes.filter(recipe => recipe.id !== id));
        setAlert({ variant: 'success', message: 'Receita excluída com sucesso!' });
      } catch (error) {
        setAlert({ variant: 'danger', message: 'Erro ao excluir receita' });
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/recipes/edit/${id}`);
  };

  const handleView = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="recipes-container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Receitas</h1>
        <Button variant="primary" onClick={() => navigate('/recipes/new')}>
          + Nova Receita
        </Button>
      </div>

      {alert && (
        <Alert variant={alert.variant} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      <RecipesTable 
        recipes={recipes} 
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal de Visualização da Receita */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecipe?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecipe && (
            <>
              {selectedRecipe.imageUrl && (
                <div className="text-center mb-4">
                  <Image 
                    src={selectedRecipe.imageUrl} 
                    alt={selectedRecipe.title} 
                    fluid 
                    rounded 
                    className="recipe-image-preview"
                  />
                </div>
              )}

              <div className="mb-3">
                <h5>Detalhes</h5>
                <p>
                  <strong>Tempo de Preparo:</strong> {selectedRecipe.preparationTime} minutos<br />
                  <strong>Dificuldade:</strong>{' '}
                  <Badge bg={mapDifficultyToColor(selectedRecipe.difficulty)}>
                    {selectedRecipe.difficulty}
                  </Badge>
                </p>
              </div>

              <h5>Ingredientes</h5>
              <ul>
                {selectedRecipe.ingredients.split('\n').map((item, i) => (
                  <li key={i}>{item.trim()}</li>
                ))}
              </ul>

              <h5 className="mt-4">Modo de Preparo</h5>
              <ol>
                {selectedRecipe.instructions.split('\n').map((step, i) => (
                  <li key={i}>{step.trim()}</li>
                ))}
              </ol>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
          <Button 
            variant="warning" 
            onClick={() => {
              setShowModal(false);
              handleEdit(selectedRecipe.id);
            }}
          >
            Editar Receita
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RecipesList;
