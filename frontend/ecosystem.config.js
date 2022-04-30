module.exports = {
  apps : [ 
  {
    name   : "proj-g",
    cwd: "./../sockets",
    script : "nodemon",
    args: "src/server.js",
    env: {
      NODE_ENV: "development",
      MIN_IN_HR: 2,
      HR_REPEAT: 10
    }
  },
  {
    name   : "proj-h",
    cwd: "./",
    script : "npx react-scripts",
    args: "start"
  }
 ]
}
