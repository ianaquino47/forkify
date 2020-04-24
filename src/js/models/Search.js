import axios from 'axios';
// const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`); 

export default class Search {
    constructor(query) {
        this.query = query;
    }
     
    async getResults() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result)
            // console.log(this)
        } catch (error) {
            alert(error)
        }
    }
}


