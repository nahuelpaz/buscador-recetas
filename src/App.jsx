import React, { useState, useEffect } from 'react';
import { buscarRecetasPorIngredientes } from './spoonacularAPI'; 
import './App.css';

function App() {
    const [ingredientes, setIngredientes] = useState('');
    const [recetas, setRecetas] = useState([]);
    const [recetasFavoritas, setRecetasFavoritas] = useState([]);
    const [error, setError] = useState(null);
    const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('recetasFavoritas'));
        if (storedFavorites && Array.isArray(storedFavorites)) {
            setRecetasFavoritas(storedFavorites);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('recetasFavoritas', JSON.stringify(recetasFavoritas));
    }, [recetasFavoritas]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await buscarRecetasPorIngredientes(ingredientes.split(',').map(ingredient => ingredient.trim()));
            setRecetas(response);
            setError(null);
        } catch (error) {
            console.error('Error al buscar recetas:', error);
            setError('Hubo un error al buscar las recetas. Por favor, intenta de nuevo.');
        }
    };

    const toggleFavorito = (receta) => {
        const index = recetasFavoritas.findIndex(fav => fav.id === receta.id);
        if (index !== -1) {
            const updatedFavorites = [...recetasFavoritas];
            updatedFavorites.splice(index, 1);
            setRecetasFavoritas(updatedFavorites);
        } else {
            setRecetasFavoritas([...recetasFavoritas, receta]);
        }
    };

    const esRecetaFavorita = (receta) => {
        return recetasFavoritas.some(fav => fav.id === receta.id);
    };

    const handleRecetaClick = (receta) => {
        setRecetaSeleccionada(recetaSeleccionada && recetaSeleccionada.id === receta.id ? null : receta);
    };

    return (
        <div className="container">
            <h1><a href="/">Buscador de Recetas</a></h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="ingredients">Ingresa los ingredientes que tienes disponibles (separados por comas):</label>
                <input 
                    type="text" 
                    id="ingredients" 
                    value={ingredientes} 
                    onChange={(e) => setIngredientes(e.target.value)} 
                    required 
                />
                <button type="submit">Buscar Recetas</button>
            </form>
            {error && <p>{error}</p>}
            {recetas.length > 0 && (
                <div id="recipeResults">
                    <h2>Resultados:</h2>
                    <ul>
                        {recetas.map(recipe => (
                            <li key={recipe.id}>
                                <div className="recipe">
                                    <img src={recipe.image} alt={recipe.title} />
                                    <div>
                                        <h3 onClick={() => handleRecetaClick(recipe)}>
                                            {recipe.title}
                                        </h3>
                                        {recetaSeleccionada && recetaSeleccionada.id === recipe.id && (
                                            <div className="recipe-details">
                                                <p>Ingredientes:</p>
                                                <ul>
                                                    {recipe.ingredients.map((ingredient, index) => (
                                                        <li key={index}>{ingredient}</li>
                                                    ))}
                                                </ul>
                                                <button onClick={() => toggleFavorito(recipe)}>
                                                    {esRecetaFavorita(recipe) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="favorites">
                <h2>Mis recetas favoritas</h2>
                <ul>
                    {recetasFavoritas.map((receta) => (
                        <li key={receta.id}>
                            {receta.title}
                            <button onClick={() => toggleFavorito(receta)}>
                                Quitar de favoritos
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
