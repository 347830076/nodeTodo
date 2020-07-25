const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// for parsing application/json
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

const models = require('../db/models');

//解决跨域
app.all('*',function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

/**
 * 查询任务列表
 */
app.get('/list/:status/:page', async (req, res, next) => {
    // 1.状态 1：表示代办，2：完成， 3：删除 -1: 全部
    // 2.分页的处理
    let { status, page } = req.params;
    console.log(status, page)
    let limit = 10;
    let offset = (page - 1) * limit;
    let where = {};
    if (status != -1) {
        where.status = status;
    }
    let list = await models.Todo.findAndCountAll({
        order: [
            ['id', 'DESC']  // 逆序
            // ['id'] 正序
        ],
        where,
        offset,
        limit
    });
    res.json({
        list,
        message: '列表查询成功'
    })
});

/**
 * 创建一个tobo
 */

app.post('/create', async (req, res, next) => {
    try {
        let { name, deadline, content } = req.body;
        console.log(req.body);
        let todo = await models.Todo.create({
            name,
            deadline,
            content
        });
        res.json({
            todo,
            message: '数据创建成功'
        });
    } catch (error) {
        next(error);
    }
});


/**
 * 修改一个tobo
 */

app.post('/update', async (req, res, next) => {
    try {
        let { name, deadline, content, id } = req.body;
        console.log(req.body);
        let todo = await models.Todo.findOne({
            where: {
                id
            }
        });
        if (todo) {
            // 执行更新
            todo = await todo.update({
                name,
                deadline,
                content
            });
        }
        res.json({
            todo,
            message: '更新成功'
        });
    } catch (error) {
        next(error)
    }
});

/**
 * 更新todo状态
 */

app.post('/updata_status', async (req, res, next) => {
    try {
        let { id, status } = req.body;
        console.log('status', status);
        let todo = await models.Todo.findOne({
            where: {
                id
            }
        });
        if (todo && status != todo.status) {
            // 执行更新
            todo = await todo.update({
                status,
            });
        }
        res.json({
            todo
        });
    } catch (error) {
        next(error)
    }
});

app.post('/delete', async (req, res, next) => {
    try {
        let { id } = req.body;
        let todo = await models.Todo.findByPk(id);
        console.log('todo----------',todo);
        if (todo) {
            // 执行更新
            todo = await todo.destroy();
        }
        res.json({
            todo,
            message: '删除成功'
        });
    } catch (error) {
        next(error)
    }
});

app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({
            message: err.message
        })
    }
})



var server = app.listen(8082, '0.0.0.0', function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://"+ host + ':' + port,)
    console.log(server.address())
  })