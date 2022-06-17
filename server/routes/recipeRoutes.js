const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

//-----------------------------------------------------------------

/*
* App Routes
*/

//-----------------------------------------------------------------

router.get('/', recipeController.homepage);
router.get('/recipe/:id', recipeController.exploreRecipe);
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);

//-----------------------------------------------------------------

router.post('/search', recipeController.searchRecipe);

//-----------------------------------------------------------------

router.get('/explore-latest', recipeController.exploreLatest);
router.get('/random', recipeController.random);

//-----------------------------------------------------------------

router.get('/submit', recipeController.submit);
router.post('/submit', recipeController.submitPost);
router.delete('/recipe/:id', recipeController.deleteRecipe);

//-----------------------------------------------------------------

module.exports = router;