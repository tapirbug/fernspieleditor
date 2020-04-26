module.exports = {
  moduleDirectories: [
    "node_modules",
    "assets/javascript"
  ],
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Adding this line solved the issue
    '^.+\\.tsx?$': 'ts-jest'
  }
}
