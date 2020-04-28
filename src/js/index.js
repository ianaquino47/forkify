// Global app controller
import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Likes'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import { elements, renderLoader, clearLoader } from './views/base'

// Global state of the app
    // - Search Object
    // - current recipe Object
    // - shopping list Object
    // - liked recipes
const state = {}
window.state = state;

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

    if (id) {
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe)

        //Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        //create recipe object
        state.recipe = new Recipe(id);

        try {
            //get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //calculate servings and time
            state.recipe.calcTime()
            state.recipe.calcServings()
            //render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch (error) {
            console.log(error)
            alert('Error processing recipe!')
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


//List CONTROLLER
const controlList = () => {
    //create a new list IF there is none yet
    if (!state.list) state.list = new List();

    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid

    //Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //delete from state
        state.list.deleteItem(id);

        //delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})


//Like CONTROLLER

const controlLike = () => {
    //create a new likes IF there is none yet
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //User has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //Toggle the like button
        likesView.toggleLikeBtn(true);

        //Add like to the UI list
        likesView.renderLike(newLike);
    //User already liked current recipe
    } else {
        //Remove like to the state
        state.likes.deleteLike(currentID)
        //Toggle the like button
        likesView.toggleLikeBtn(false);
        //Remove like to the UI list
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes())
}

//Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes;

    //Restore likes
    state.likes.readStorage();

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes())

    //Reander the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
})

//Handling Recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe)
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLike();
    }
});



window.l = new List()