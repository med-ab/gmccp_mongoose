import { Schema, model, connect, disconnect } from 'mongoose'
var { log, error } = console
await connect(process.argv[2] || 'mongodb://127.0.0.1:27017')
// person prototype:
// name: string [required]  
// age: number
// favoriteFoods: array of strings (*)  
// - Use the mongoose basic schema types. If you want you can also add more fields, use simple validators like required or unique, and set default values.
var person = model('person', new Schema({
  name: { type: String, require: true, default: 'foulan' },
  age: { type: Number, default: null },
  favoriteFoods: [String]
}))
// clean previous runs
await person.deleteMany({}).exec()
// Create a document instance using the Person constructor you built before. Pass to the constructor an object having the fields name, age, and favoriteFoods. Their types must conform to the ones in the Person Schema. Then call the method document.save() on the returned document instance. Pass to it a callback using the Node convention
await new person({
  name: 'foulan', age: 33, favoriteFoods: ['chicken', 'beef', 'pomegranates']
}).save()
// Sometimes you need to create many instances of your models, e.g. when seeding a database with initial data. Model.create() takes an array of objects like [{name: 'John', ...}, {...}, ...] as the first argument and saves them all in the DB
// Create several people with **Model.create()**, using the function argument arrayOfPeople
await ((...arrayOfPeople) => person.create(arrayOfPeople))(
  { name: 'foulani', age: 40, favoriteFoods: ['couscous', 'burritos'] },
  { name: 'foulana', age: 28, favoriteFoods: ['salad', 'spaghetti'] },
  { name: 'Mary', age: 39, favoriteFoods: ['burritos', 'sushi'] },
  { name: 'foulan', age: 102, favoriteFoods: ['soup', 'whale liver'] },
  { name: 'Mary', age: 48, favoriteFoods: ['kaftaji', 'lablabi'] },
  { name: 'feltan', age: 53, favoriteFoods: ['burritos', 'fish'] },
  { name: 'feltana', age: 47, favoriteFoods: ['whale liver','burritos'] },
) //.then(log, error)
// get a random person for tests
await person.aggregate().sample(1).exec().then(o => globalThis['random'] = o[0])
// Find all the people having a given name, using Model.find() -> [Person]
await person.find({ name: 'foulan' }).exec()
// Find just one person which has a certain food in the person's favorites, using Model.findOne() -> Person. Use the function argument food as a search key.
await (food => person.findOne({ favoriteFoods: [food].flat()[0] }).exec())('couscous')
// Find the (only!!) person having a given _id, using Model.findById() -> Person. Use the function argument personId as the search key.
await (personId => person.findById({ _id: personId }).exec())(random._id)
// Find a person by _id ( use any of the above methods ) with the parameter personId as a search key. Add "hamburger" to the list of the person's favoriteFoods (you can use Array.push()). Then - inside the find callback - save() the updated Person.
await (personId => person.findOne({ _id: personId }).exec())(random._id).then(o => (o.favoriteFoods.push('hamburger'), o.save()))
// Find a person by Name and set the person's age to 20. Use the function parameter personName as a search key.
//**Note:** You should return the updated document. To do that you need to pass the options document { new: true } as the 3rd argument to findOneAndUpdate()
await (personName => person.findOneAndUpdate({ name: personName }, { $set: { age: 20 } }, { new: true }).exec())('foulana')
// Delete one person by the person's _id. You should use one of the methods findByIdAndRemove() or findOneAndRemove(). They are like the previous update methods. They pass the removed document to the DB. As usual, use the function argument personId as the search key
await (personId => person.findByIdAndDelete({ _id: personId }).exec())(random._id)
// Delete all the people whose name is “Mary”, using Model.remove()
await person.deleteMany({ name: 'Mary' })
// Find people who like burritos. Sort them by name, limit the results to two documents, and hide their age. Chain .find(), .sort(), .limit(), .select(), and then .exec().
await person.find({ favoriteFoods: 'burritos' }).sort({ name: 1 }).limit(2).select({ age: 0 }).exec()

await disconnect()