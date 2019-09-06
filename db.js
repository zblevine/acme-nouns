const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/nouns_db');

const Person = conn.define('person', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

const Place = conn.define('place', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

const Thing = conn.define('thing', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

Person.belongsTo(Place);
Thing.belongsTo(Person);

const syncAndSeed = async () => {
  await conn.sync({force: true});

  const [NYC, Chicago, Jakarta] = await Promise.all([
    Place.create({ name: 'NYC'}),
    Place.create({ name: 'Chicago'}),
    Place.create({ name: 'Jakarta'})
  ]);

  const [Zach, Jesen, Kanye, Haoyu, Maria] = await Promise.all([
    Person.create({name: 'Zach', placeId: NYC.id}),
    Person.create({name: 'Jesen', placeId: NYC.id}),
    Person.create({name: 'Kanye', placeId: Chicago.id}),
    Person.create({name: 'Haoyu', placeId: Jakarta.id}),
    Person.create({name: 'Maria', placeId: Chicago.id})
  ]);

  const [MacBook, Lenovo, vodka, cup, Grammy] = await Promise.all([
    Thing.create({name: 'MacBook', personId: Zach.id}),
    Thing.create({name: 'Lenovo', personId: Jesen.id}),
    Thing.create({name: 'vodka', personId: Maria.id}),
    Thing.create({name: 'cup', personId: Jesen.id}),
    Thing.create({name: 'Grammy', personId: Kanye.id})
  ]);
}

module.exports = {
  syncAndSeed,
  models: {
    Thing,
    Person,
    Place,
  }
}

