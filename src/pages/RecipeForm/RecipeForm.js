import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { createRecipe, getRecipeById, updateRecipe } from '../../services/RecipeServices';
import './RecipeForm.css';

const RecipeForm = () => {
  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    preparationTime: '',
    difficulty: '',
    imageUrl: ''
  });
  const [alert, setAlert] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (id) {
        try {
          const data = await getRecipeById(id);
          setRecipe(data);
          setIsEditing(true);
        } catch (error) {
          setAlert({ variant: 'danger', message: 'Erro ao carregar a receita.' });
        }
      }
    };
    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    setRecipe({
      ...recipe,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipe.title || !recipe.ingredients || !recipe.instructions || !recipe.preparationTime || !recipe.difficulty) {
      setAlert({ variant: 'danger', message: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    try {
      if (isEditing) {
        await updateRecipe(id, recipe);
        setAlert({ variant: 'success', message: 'Receita atualizada com sucesso!' });
      } else {
        await createRecipe(recipe);
        setAlert({ variant: 'success', message: 'Receita criada com sucesso!' });
      }
      setTimeout(() => navigate('/recipes'), 1500);
    } catch (error) {
      setAlert({ variant: 'danger', message: 'Erro ao salvar a receita.' });
    }
  };

  return (
    <Container className="recipe-form-container my-5">
      <h1 className="mb-4">{isEditing ? 'Editar Receita' : 'Nova Receita'}</h1>

      {alert && (
        <Alert variant={alert.variant} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Título</Form.Label>
          <Form.Control 
            type="text"
            placeholder="Digite o título da receita"
            name="title"
            value={recipe.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ingredientes</Form.Label>
          <Form.Control 
            as="textarea"
            rows={4}
            placeholder="Separe os ingredientes por linha"
            name="ingredients"
            value={recipe.ingredients}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Instruções</Form.Label>
          <Form.Control 
            as="textarea"
            rows={6}
            placeholder="Separe as etapas por linha"
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tempo de Preparo (minutos)</Form.Label>
          <Form.Control 
            type="number"
            placeholder="Digite o tempo de preparo"
            name="preparationTime"
            value={recipe.preparationTime}
            onChange={handleChange}
            required
            min={1}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Dificuldade</Form.Label>
          <Form.Select
            name="difficulty"
            value={recipe.difficulty}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a dificuldade</option>
            <option value="Fácil">Fácil</option>
            <option value="Médio">Médio</option>
            <option value="Difícil">Difícil</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Imagem (URL)</Form.Label>
          <Form.Control 
            type="text"
            placeholder="Cole aqui o link da imagem do prato"
            name="imageUrl"
            value={recipe.imageUrl}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="form-buttons">
          <Button variant="secondary" onClick={() => navigate('/recipes')}>
            Voltar
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? 'Atualizar Receita' : 'Criar Receita'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default RecipeForm;
