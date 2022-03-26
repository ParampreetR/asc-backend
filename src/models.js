const { DataTypes } = require("sequelize");

const notifications = async (sequelize) => {
  return await sequelize.define(
    "Notifications",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.TEXT,
      },
      url: {
        type: DataTypes.TEXT,
      },
    },
    {}
  );
};

const quickLinks = async (sequelize) => {
  return await sequelize.define(
    "QuickLinks",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.TEXT,
      },
      info: {
        type: DataTypes.TEXT,
      },
      url: {
        type: DataTypes.TEXT,
      },
    },
    {}
  );
};

const events = async (sequelize) => {
  return await sequelize.define(
    "Events",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.TEXT,
      },
      info: {
        type: DataTypes.TEXT,
      },
    },
    {}
  );
};

const articles = async (sequelize) => {
  return await sequelize.define(
    "Articles",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.TEXT,
      },
      content: {
        type: DataTypes.TEXT,
      },
      category: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
      },
      publishedBy: {
        type: DataTypes.TEXT,
      },
      writtenBy: {
        type: DataTypes.TEXT,
      },
    },
    {}
  );
};

const metaData = async (sequelize) => {
  return await sequelize.define(
    "MetaData",
    {
      key: {
        type: DataTypes.TEXT,
      },
      value: {
        type: DataTypes.TEXT,
      },
    },
    {}
  );
};

// Secondary Objective
//
// const navCategories = async (sequelize) => {
//   let NavButtons = await sequelize.define("NavButtons", {
//     name: { type: DataTypes.TEXT },
//     description: { type: DataTypes.TEXT },
//   });

//   let Pages = await sequelize.define("Pages", {
//     title: { type: DataTypes.TEXT },
//     content: { type: DataTypes.TEXT },
//   });

//   // Relationships
//   NavButtons.hasMany(Pages, { as: "page" });
//   Pages.hasOne(NavButtons, { as: "category" });
// };

const users = async (sequelize) => {
  return await sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.TEXT,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
      },
    },
    {}
  );
};

const syncAllTables = async (sequelize) => {
  (await notifications(sequelize)).sync();
  (await quickLinks(sequelize)).sync();
  (await events(sequelize)).sync();
  (await articles(sequelize)).sync();
  (await metaData(sequelize)).sync();
  (await users(sequelize)).sync();
};

module.exports = {
  notifications,
  quickLinks,
  events,
  articles,
  metaData,
  users,
  syncAllTables,
};
