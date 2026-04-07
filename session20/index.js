//console.log("Hello, World! This is session 20.");

//[section] array
//an array is also a storage for multiple elements/values
// the best practice is values/elements stored  in an array should be of the same data type.

let pokemon = ["Pikachu", "Charmander", "Squirtle"];
console.log(pokemon);

console.log(pokemon[0]); //accessing the first element of the array
console.log(pokemon[2]);

console.log(`my fav ppokemon is ${pokemon[0]}.`);

console.log(`my fav ppokemon is ${pokemon[0]. toLocaleUpperCase()} .`);

console.log(pokemon.length);  

console.log(pokemon[5]); //undefined

//array mutation
//modifying array ellemnts

pokemon[3] = "Bulbasaur"; //adding a new element to the array

console.log(pokemon);
console.log(pokemon.length);

pokemon[1] = "Charmeleon";

console.log(pokemon);
console.log(pokemon.length);

pokemon[10] = "Mewtwo";

console.log(pokemon);
console.log(pokemon.length);

//add an ellement on the tail of an array without knowing the actual length o

console.log(pokemon.length);
pokemon[pokemon.length] = "snorlax";

console.log(pokemon);
console.log(pokemon.length);

console.log(pokemon[pokemon.length - 1]); //accessing the last element of the array

//section] modern arrays mutation methods

let fruits = ["apple", "banana", "melon"];

//add an ellement at the end of an array
console.log("original  fruits array: " + fruits);

fruits.push("stawberry"); //push method adds an element at the end of an array
console.log("push method: " + fruits);


//pop method removes the last element of an array and returns it
console.log("original  fruits array: " + fruits);
fruits.pop(); //stawberry will be removed from the array
fruits.pop();//melon will be removed from the array
console.log("pop method: " + fruits);


//add an element at the beginning of an array
fruits.unshift("strawberry"); //unshift method adds an element at the beginning of an array
console.log("unshift method: " + fruits);

fruits.unshift("grape", "melon", "kiwi"); //we can add multiple elements at the beginning of an array using unshift method
console.log("unshift method: " + fruits);

//shift method removes the first element of an array and returns it
fruits.shift(); //grape will be removed from the array
fruits.shift(); //melon will be removed from the array
console.log("shift method: " + fruits);

//sort() sorts the elements of an array in place and returns the sorted array
fruits.sort(); //sorts the elements of the array in alphabetical order
console.log(fruits);

//reverse() reverses the order of the elements in an array in place and returns the reversed array
fruits.reverse();
console.log(fruits);

//splice() method changes the contents of an array by removing or replacing existing elements and/or adding new elements in place
fruits.splice(1, 2, "blue berry"); //adds grape and melon at index 1 without removing any element
console.log(fruits);

fruits.splice(1, 1); //removes the element at index 1 which is blue berry
console.log(fruits);

//forEach() method executes a provided function once for each array element
fruits.forEach(function(x) {
    console.log(x);
});

