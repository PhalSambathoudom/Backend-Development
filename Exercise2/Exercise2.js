const { Sequelize, DataTypes } = require("sequelize");

// Connect to MySQL
const sequelize = new Sequelize(
  "library_db",
  "root",
  "Dom@271006",
  {
    host: "localhost",
    port: 8889,
    dialect: "mysql"
  }
);

// Author Model
const Author = sequelize.define("Author", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  birthYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "Authors",
  timestamps: false
});

// Book Model
const Book = sequelize.define("Book", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  publicationYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pages: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  AuthorId: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: "Books",
  timestamps: false
});

// Relationship
Author.hasMany(Book, { foreignKey: "AuthorId" });
Book.belongsTo(Author, { foreignKey: "AuthorId" });

async function main() {
  try {
    // Connect to MySQL
    await sequelize.authenticate();
    console.log("Connected to MySQL!");

    // 1 Fetch all books by Kim Ang
    console.log("\n===== Books by Kim Ang =====");

    const author = await Author.findOne({
        where: { name: "Kim Ang" },
        include: Book
    });

    console.log(JSON.stringify(author, null, 2));

    // 2 Create a new book
    console.log("\n===== Create New Book =====");

    await author.createBook({
        title: "Mastering SQL",
        publicationYear: 2026,
        pages: 400
    });

    console.log("New book created successfully!");

    // Q3.3 List all authors with their books
    console.log("\n===== All Authors with Books =====");

    const authors = await Author.findAll({
        include: Book
    });

    console.log(JSON.stringify(authors, null, 2));

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
}

main();