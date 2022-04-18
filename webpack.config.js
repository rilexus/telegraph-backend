const path = require("path");

const getRootFolderPath = () => {
  return path.resolve(process.env.PWD);
};

module.exports = ({ development, production }) => {
  const rootPath = getRootFolderPath();

  return {
    target: "node",
    mode: "production",
    entry: {
      index: `${rootPath}/src/index.js`,
    },
    output: {
      path: path.resolve(rootPath, "build"),
      // filename: "[name].js", => name is set in the entry prop
      filename: "[name].js",
    },
  };
};
