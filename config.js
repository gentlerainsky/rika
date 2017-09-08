require('dotenv').config()

module.exports = {
  DATABASE_URI: process.env.DATABASE_URI || 'mongodb://apirouter.app:3edqwe!@192.168.142.5:27020/columbus?replicaSet=rsa&authSource=admin' || 'mongodb://localhost/columbus'
}
