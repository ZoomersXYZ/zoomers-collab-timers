module.exports = {
  apps : [ 
  {
    name   : "proj-g",
    cwd: "./../sockets",
    script : "npx nodemon",
    args: "src/server.js",
    env: {
      NODE_ENV: "development",
      MIN_IN_HR: 2,
      HR_REPEAT: 20
    }
  },
  {
    name   : "proj-h",
    cwd: "./",
    script : "npx react-scripts start",
    args: "start"
  }
 ]
}
