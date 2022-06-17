require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

//----------------------------------------------------------------------------------------------------------------------

/*
* GET /
* Homepage
*/

exports.homepage = async (req, res) => {

    try {

        const limitNumber = 5;

        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
        const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
        const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
        const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);

        const food = { latest, thai, american, chinese };

        res.render('index', { title: 'Cooking Blog - Home', categories, food });

    } catch (error) {

        res.status(500).send({ message: error.message || 'An error occurred while retrieving the homepage.' });

    }
}

/*
* GET /recipe/:id
* Recipe
*/

exports.exploreRecipe = async (req, res) => {

    try {

        let recipeId = req.params.id;

        const recipe = await Recipe.findById(recipeId);

        res.render('recipe', { title: 'Cooking Blog - Recipe', recipe });

    } catch (error) {

        res.status(500).send({ message: error.message || 'An error occurred while retrieving the exploreCategories.' });

    }
}

/*
* GET /categories
* Categories
*/

exports.exploreCategories = async (req, res) => {

    try {

        const limitNumber = 20;

        const categories = await Category.find({}).limit(limitNumber);

        res.render('categories', { title: 'Cooking Blog - Categories', categories });

    } catch (error) {

        res.status(500).send({ message: error.message || 'An error occurred while retrieving the exploreCategories.' });

    }
}

/*
* GET /categories/:id
* Categories By Id
* gamabr ga keluar, menit 02:04:07
*/

exports.exploreCategoriesById = async (req, res) => {

    try {

        let categoryId = req.params.id;

        // const limitNumber = 20;

        const categoryById = await Recipe.find({ 'category': categoryId });

        res.render('categories', { title: 'Cooking Blog - Regional Category', categoryById });

    } catch (error) {

        res.status(500).send({ message: error.message || 'An error occurred while retrieving the exploreCategories.' });

    }
}

//----------------------------------------------------------------------------------------------------------------------

/*
* POST /search
* Search
*/

exports.searchRecipe = async (req, res) => {

    try {

        let searchTerm = req.body.searchTerm;

        let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });

        // res.json(recipe); / buat tes aja
        res.render('search', { title: 'Cooking Blog - Search', recipe });

    } catch (error) {

        res.status(500).send({ message: error.message || 'An error occurred while searching the recipe.' });
    }

}

/*
* GET /explore-latest
* Explore Latest
*/

exports.exploreLatest = async (req, res) => {

    try {

        const limitNumber = 20;

        const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);

        res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe });

    } catch (error) {

        res.status(500).send({ message: error.message || 'An error occurred while retrieving the exploreCategories.' });

    }
}

/*
* GET /random
* Random as JSON
*/

exports.random = async (req, res) => {

    try {

        let count = await Recipe.find().countDocuments();

        let random = Math.floor(Math.random() * count);

        let recipe = await Recipe.findOne().skip(random).exec();

        res.render('random', { title: 'Cooking Blog - Explore Latest', recipe });

    } catch (error) {

        res.status(500).send({ message: error.message || 'An error occurred while retrieving the exploreCategories.' });

    }
}

/*
* GET /submit
* Submit
*/

exports.submit = async (req, res) => {

    const infoErrorObject = req.flash('infoError');
    const infoSubmitObject = req.flash('infoSubmit');

    res.render('submit', { title: 'Cooking Blog - Submit', infoErrorObject, infoSubmitObject });
}

/*
* POST /submit
* Post Submit
*/

exports.submitPost = async (req, res) => {

    try {

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No files were uploaded.');
        } else {
            imageUploadFile = req.files.image;

            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function (err) {

                if (err) return res.status(500).send(err);

            });
        };

        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingridients: req.body.ingridients,
            category: req.body.category,
            image: newImageName,
        });

        await newRecipe.save();

        req.flash('infoSubmit', 'Recipe submitted successfully!');

        res.redirect('/submit');

    } catch (error) {

        // res.json(error)

        req.flash('infoError', error);

        res.redirect('/submit');
    }

}

/*
* DELETE /submit
* DELETE Submit
*/

exports.deleteRecipe = async (req, res) => {

    try {

        const infoErrorObject = req.flash('infoError');
        const infoSubmitObject = req.flash('infoSubmit');

        const recipe = await Recipe.deleteOne({ _id: req.params.id });
        // res.render('recipe', { title: 'Cooking Blog - Delete', recipe:null });

    } catch (error) {

        return res.status(500).send({ message: error.message || 'An error occurred while retrieving the exploreCategories.' });
    }

    return res.json({status:'success delete'});
}

// async function updateRecipe() {

//     try {

//         const res = await Recipe.updateOne({ name: 'New Chocolate' }, { name: 'New Chocolate Updated' });

//         res.n; // number of documents updated
//         res.nModified; // number of documents modified

//     } catch (error) {

//         res.status(500).send({ message: error.message || 'An error occurred while retrieving the exploreCategories.' });
//     }
// }

// updateRecipe()

//----------------------------------------------------------------------------------------------------------------------

// async function insertDymmyCategoryData() {

//     try {

//         await Category.insertMany([
//             {
//                 "name": "American",
//                 "image": "american-food.jpg"
//             },
//             {
//                 "name": "Chinese",
//                 "image": "chinese-food.jpg"
//             },
//             {
//                 "name": "Indian",
//                 "image": "indian-food.jpg"
//             },
//             {
//                 "name": "Mexican",
//                 "image": "mexican-food.jpg"
//             },
//             {
//                 "name": "Spanish",
//                 "image": "spanish-food.jpg"
//             },
//             {
//                 "name": "Thai",
//                 "image": "thai-food.jpg"
//             }
//         ]);

//     } catch (error) {
//         console.log('error : ', error);
//     }
// }

// insertDymmyCategoryData();

//----------------------------------------------------------------------------------------------------------------------

// async function insertDymmyRecipeData() {

//     try {

//         await Recipe.insertMany(
//             [
//                 {
//                     "name": "Mega veggie burgers",
//                     "description": "Tofu is a brilliant carrier of flavours, plus its high in protein, low in saturated fat and a great source of calcium and phosphorus, both of which make for strong and healthy bones",
//                     "email": "a@a.a",
//                     "ingridients": [
//                         "350 g firm silken tofu",
//                         "1 large free-range egg",
//                         "75 g wholemeal breadcrumbs",
//                         "2 heaped teaspoons Marmite",
//                         "8 ripe tomatoes",
//                         "1 tablespoon red wine vinegar",
//                     ],
//                     "category": "American",
//                     "image": "american-food.webp"
//                 },
//                 {
//                     "name": "Mega veggie nachos",
//                     "description": "Most of us know its a source of healthy fats, but avocado also offers a good dose of vitamin E, which acts as an antioxidant to protect cells from the damage caused by free radicals",
//                     "email": "a@a.a",
//                     "ingridients": [
//                         "2 mixed-colour peppers",
//                         "1 fresh red chilli",
//                         "3 ripe tomatoes , on the vine",
//                         "1 bunch of fresh coriander",
//                         "4 corn tortillas",
//                     ],
//                     "category": "Mexican",
//                     "image": "mexican-food.webp"
//                 },
//                 {
//                     "name": "Roasted veggie curry",
//                     "description": "Roasting the veg before immersing them in a ridiculously tasty sauce really intensifies their natural flavour, giving you even more bang for your buck. Ive kept things fairly gentle on the spice front so that all my kids will give it a go, but feel free to add extra heat, if you like. Im also giving you a cheats naan, which all my kids fight over. Were using it as a vehicle to really bring spinach to life, but feel free to stuff with another veg of your choice, or to not stuff it at all! If youre feeding fewer than 8 people, leftover portions of this curry freeze really well, so fill your boots.",
//                     "email": "a@a.a",
//                     "ingridients": [
//                         "1 heaped teaspoon Madras curry paste",
//                         "olive oil",
//                         "red wine vinegar",
//                         "½ a butternut squash , (600g)",
//                         "200 g frozen cauliflower",
//                     ],
//                     "category": "Indian",
//                     "image": "indian-food.jpg"
//                 },
//                 {
//                     "name": "Prawn & crab wontons",
//                     "description": "These simple and delicious steamed wontons are the perfect nibbles for feeding a crowd",
//                     "email": "a@a.a",
//                     "ingridients": [
//                         "30 wonton wrappers , (roughly 10cm)",
//                         "cornflour , for dusting",
//                         "groundnut oil , or vegetable oil",
//                         "sweet chilli sauce , to serve",
//                         "1 thumb-sized piece of ginger",
//                     ],
//                     "category": "Chinese",
//                     "image": "chinese-food.webp"
//                 },
//                 {
//                     "name": "Asian-style tuna steak salad",
//                     "description": "Asian-style tuna steak salad",
//                     "email": "a@a.a",
//                     "ingridients": [
//                         "200 g radishes , ideally with leaves",
//                         "2 heaped teaspoons pickled ginger",
//                         "2 teaspoons low-salt soy sauce",
//                         "250 g frozen soya beans",
//                         "2 x 150 g tuna steaks , (ideally 2cm thick), from sustainable sources",
//                     ],
//                     "category": "Thai",
//                     "image": "thai-food.webp"
//                 },
//                 {
//                     "name": "Roasted chilli frittata",
//                     "description": "This frittata is a meal in itself. Blackening the chillies calms the heat and releases their sweetness to give a really deep flavour.",
//                     "email": "a@a.a",
//                     "ingridients": [
//                         "4-8 chillies , a mixture of green, red and yellow",
//                         "1 red or green pepper , optional",
//                         "1 tbsp red wine vinegar",
//                         "6 sprigs of flat-leaf parsley",
//                         "1 handful of grated Parmesan",
//                     ],
//                     "category": "Spanish",
//                     "image": "spanish-food.jpg"
//                 },
//             ]
//         );

//     } catch (error) {
//         console.log('error : ', error);
//     }
// }

// insertDymmyRecipeData();