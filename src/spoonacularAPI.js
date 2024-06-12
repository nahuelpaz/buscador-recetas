import axios from 'axios';

const apiKey = 'c70fda18e6da4b9a988e44343ae6bd2e';

// Función para buscar recetas por ingredientes
export async function buscarRecetasPorIngredientes(ingredientes) {
  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
      params: {
        ingredients: ingredientes.join(','), // Convertimos el array de ingredientes en una cadena separada por comas
        apiKey: apiKey,
      },
    });

    const recetas = response.data;

    // Obtener los detalles completos de cada receta, incluyendo los ingredientes
    const recetasConDetalles = await Promise.all(recetas.map(async (receta) => {
      const detallesResponse = await axios.get(`https://api.spoonacular.com/recipes/${receta.id}/information`, {
        params: {
          apiKey: apiKey,
        },
      });

      const detalles = detallesResponse.data;

      return {
        id: detalles.id,
        title: detalles.title,
        image: detalles.image,
        ingredients: detalles.extendedIngredients.map(ingredient => ingredient.original),
      };
    }));

    return recetasConDetalles;
  } catch (error) {
    console.error('Error al buscar recetas:', error);
    throw error;
  }
}