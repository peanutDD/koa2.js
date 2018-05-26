
/* log4js有1.x和2.x不同版本，网络上搜到的很多文章介绍的配置文件格式都是1.x的，主要表现在appenders配置是一个数组，而2.x配置是一个对象 */

// file: server.js
var log4js = require("log4js");
var express = require("express");

log4js.configure({
    "appenders":{  
        "console":{  
            "type":"console"  
        },  
        "everything":{  
            "type":"DateFile",  
            "filename":"./log/everything",  
            "pattern": "-yyyy-MM-dd.log",  
            "alwaysIncludePattern": true,  
            "layout":{"type":"pattern", "pattern":"[%d{yyyy-MM-dd hh:mm:ss} %5.5p] %m"}  
        },  
        "db":{  
            "type":"DateFile",  
            "filename":"./log/db",  
            "pattern": "-yyyy-MM-dd.log",  
            "alwaysIncludePattern": true,  
            "layout":{"type":"pattern", "pattern":"[%d{yyyy-MM-dd hh:mm:ss} %5.5p] %m"}  
        },  
        "api":{  
            "type":"DateFile",  
            "filename":"./log/api",  
            "pattern": "-yyyy-MM-dd.log",  
            "alwaysIncludePattern": true,  
            "layout":{"type":"pattern", "pattern":"[%d{yyyy-MM-dd hh:mm:ss} %5.5p] %m"}  
        }  
    },  
    "categories":{  
        "default":{  
            "appenders":["console"],  
            "level":"all"  
        },  
        "everything":{  
            "appenders":["console", "everything"],  
            "level":"info"  
        },  
        "db":{  
            "appenders":["console", "everything", "db"],  
            "level":"info"  
        },  
        "api":{  
            "appenders":["console", "everything", "api"],  
            "level":"trace"  
        }  
    }  
});

var app = express();
app.use(
    log4js.connectLogger(log4js.getLogger("access"), {
        level: log4js.levels.INFO
    })
);
app.get("/", function (req, res) {
    res.send("log4js!!!");
});
app.listen(5000);