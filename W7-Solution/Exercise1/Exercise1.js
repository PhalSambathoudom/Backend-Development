// Broken Code 1 (Fixed)
User.hasOne(Profile);
Profile.belongsTo(User);
await sequelize.sync();

const user = await User.create({ username: 'joe' });
const profile = await user.createProfile({ bio: 'Test' });

// Broken Code 2 (Fixed)
Book.hasMany(Author);
Author.belongsTo(Book);

await sequelize.sync();
const book = await Book.create ({ title: 'Wrong Way' });
const author = await book.createAuthor ({ name: 'Somnang' });

// Broken Code 3 (Fixed)
User.hasOne(Profile);
Profile.belongsTo(User);

const user = await User.create({ username: 'Jon' });
const profile = await Profile.create({ bio: 'hello' });

await user.setProfile(profile);

// Broken Code 4 (Fixed)
Manager.hasMany(Employee);
Employee.belongsTo(Manager);

