var mysql = require('mysql')
var config = require('./defaultConfig')

//链接数据库
//连接线程池
var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    port: config.database.PORT,
})

//统一连接数据库的方法
let allServers = {
    query: function (sql, values) { //sql是操作数据库的语句,values是
        return new Promise((resolve, reject) => {//建立连接
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (err, rows) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                        connection.release() //关闭连接，释放连接，一直建立连接会销毁性能
                    })
                }
            })
        })
    }
}

//读取测试
let getAllUsers = function () {
    let _sql = `select * from users;`
    return allServers.query(_sql)
}
// 用户登录
let userLogin = function (username, userpwd) {
    let _sql = `select * from users where username="${username}" and userpwd="${userpwd}";`
    return allServers.query(_sql)
}

//查找用户
let findUser = function (username) {
    let _sql = `select * from users where username="${username}";`
    return allServers.query(_sql)
}

//用户注册
let insertUser = function (value) {
    let _sql = `insert into users set username=?,userpwd=?,nickname=?;`
    return allServers.query(_sql, value)
}

// 根据日记类型查找对应的列表
let findNoteListByType = function (note_type, userId) {
    let _sql = `select * from note where note_type="${note_type}" and useId="${userId}";`
    return allServers.query(_sql)
}

// 根据文章id查找文章详情
let findNoteDetailById = function (id) {
    let _sql = `select * from note where id="${id}";`
    return allServers.query(_sql)
}

// 发表日记
let insertNote = function (options) {
    let _sql = `insert into note set c_time=?,m_time=?,note_content=?,head_img=?,title=?,note_type=?,useId=?,nickname=?;`
    return allServers.query(_sql, options)
}

//导出方法
module.exports = {
    getAllUsers,
    userLogin,
    findUser,
    insertUser,
    findNoteListByType,
    findNoteDetailById,
    insertNote
}
