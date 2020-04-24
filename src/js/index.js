// Global app controller
import Search from './models/Search'

// Global state of the app
    // - Search Object
    // - current recipe Object
    // - shopping list Object
    // - liked recipes
const state = {}

const controlSearch = async () => {
    //1 get query from view
    const query = 'pizza'; //TODO

    if (query) {
        //2 new search object and add to state
        state.search = new Search(query)

        //3 Prepare UI for results

        //4 Search for recipes
        await state.search.getResults(); 

        //5 render results on UI
        console.log(state.search.result)
    }
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

