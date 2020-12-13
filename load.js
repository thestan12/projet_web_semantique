var endpoint = "https://data.escr.fr/sparql";
var example_prefix = 'http://www.example.org/'
var baseRequests = "BASE <https://data.escr.fr/wiki/Utilisateur:Stan/Projet#> ";




var allClassItemRequest = baseRequests + "SELECT * WHERE { ?s a <className> .}";
var getInfoBoulangerieRequest = baseRequests + "PREFIX ex: <http://www.example.org/> SELECT * WHERE { ex:ID ?p ?v . }";

var boulangeries_list = [];
var baguettes_list = [];
var ingredient_list = [];
// LOAD QUERY


// Point d'entrée
function load_data(typeName){
    loadQuery(callBackAll, allClassItemRequest.replace('className', typeName));
    data = []
    switch (typeName) {
        case "Ingredient":
            data = ingredient_list;
            break;
        case "Baguette":
            data = baguettes_list;
            break;
        default:
            data = boulangeries_list
    }

    return data
}


// Load Request
function loadQuery(callBackSuccess, request){
    loadQuery(callBackSuccess, request, null)
}


function loadQuery(callBackSuccess, request, idRequest){
    current_request = request

    if(idRequest !== null){
        current_request = current_request.replace('ID', idRequest);
    }

    $.ajax({
        url: endpoint,
        dataType: 'json',
        async: false,
        data: {
            queryLn: 'SPARQL',
            query: current_request ,
            limit: 'none',
            infer: 'true',
            Accept: 'application/sparql-results+json'
        },

        success:function (response) {
            (idRequest === null) ? callBackSuccess(response) : callBackSuccess(response, idRequest)
        },

        error: displayError
    });
}

function callBackTwo(data, id){
    var name_object = "";
    var list_object = [];
    var price = null;
    var calorie_ingredient = null;

    $.each(data.results.bindings, function(index, bs) {
        if(bs.v.type === "literal"){
            name_object = bs.v.value
        }
        else{
            if(bs.p.value.toString().includes("baguettePrice")){
                price = deleteExamplePrefix(bs.v.value)
            }
            else if(bs.p.value.toString().includes("ingredientCalorie")){
                calorie_ingredient =  deleteExamplePrefix(bs.v.value)
            }
            else if(isBoulangTable(bs.p.value)){
                list_object.push(deleteExamplePrefix(bs.v.value));
            }
        }
    });

    if(price !== null){
        baguettes_list.push(mapNewBaguette(id, name_object, price, list_object))
    }
    else if(calorie_ingredient !== null){
        ingredient_list.push(mapNewIngredient(id, name_object, calorie_ingredient))
    }
    else{
        boulangeries_list.push(mapNewBoulangerie(id, name_object, list_object))
    }
}



/////// CALL BACK

function callBackAll(data) {
    $.each(data.results.bindings, function(index, bs) {
        id_object = deleteExamplePrefix(bs.s.value);
        loadQuery(callBackTwo, getInfoBoulangerieRequest, id_object)
    });
}

/// MAP
function mapNewBoulangerie(id, name, baguettes){
    boulangerie = {};
    boulangerie.id = id;
    boulangerie.name = name;
    boulangerie.baguettes = [];

    for (const bag in baguettes) {
        baguette = {};
        baguette.id = baguettes[bag];
        boulangerie.baguettes.push(baguette)
    }

    return boulangerie
}

function mapNewBaguette(id, name, price, ingredients){
    baguette = {};
    baguette.id = id;
    baguette.name = name;
    baguette.ingredients = [];
    baguette.price = price;

    for (const bag in ingredients) {
        ingredient = {};
        ingredient.id = ingredients[bag];
        baguette.ingredients.push(ingredient)
    }

    return baguette
}

function mapNewIngredient(id, name, calorie){
    ingredient = {}
    ingredient.id = id
    ingredient.name = name
    ingredient.calorie = calorie
    return ingredient
}

/// Outils
function displayError(xhr, textStatus, errorThrown) {
    console.log(textStatus);
    console.log(errorThrown);
}

function deleteExamplePrefix(string){
    return string.replace(example_prefix, '');
}

function isBoulangTable(value){
    return value.toString().includes("boulangerieBaguette") || value.toString().includes("baguetteIngredients")
}

