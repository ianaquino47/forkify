// Global app controller
import Search from './models/Search'
import Recipe from './models/Recipe'
import * as searchView from './views/searchView'
import { elements, renderLoader, clearLoader } from './views/base'

// Global state of the app
    // - Search Object
    // - current recipe Object
    // - shopping list Object
    // - liked recipes
const state = {}


//SearchController
const controlSearch = async () => {
    //1 get query from view
    const query = searchView.getInput(); //TODO

    if (query) {
        //2 new search object and add to state
        state.search = new Search(query)

        //3 Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);

        try {
            //4 Search for recipes
            await state.search.getResults(); 
    
            //5 render results on UI
            clearLoader();
            searchView.renderResults(state.search.result)
        } catch (error) {
            alert('Something went wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage)
    }
})

//Recipe Controller
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    console.log(id)

    if (id) {
        //prepare UI for changes
        //create recipe object
        state.recipe = new Recipe(id);

        try {
            //get recipe data
            await state.recipe.getRecipe();
            //calculate servings and time
            state.recipe.calcTime()
            state.recipe.calcServings()
            //render recipe
            console.log(state.recipe)
        } catch (error) {
            alert('Error processing recipe!')
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));