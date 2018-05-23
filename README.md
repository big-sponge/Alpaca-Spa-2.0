# Alpaca-spa-2.1 使用帮助

## 简介

### 1.Alpaca-spa-2.1.js 简介

Alpaca-spa.js是一款轻量的前端JS框架，提供前端**路由**功能，前端**视图渲染**功能，前端**页面嵌套**功能。目的是用来提高web项目的开发效率，前后端分离开发，同时使前端代码结构更加整洁。
Alpaca-spa.js 区别于其他框架的主要特点是**轻巧灵活**，**移动端、PC端都适用**，**大小项目都适用**，而且**学习成本低**，
框架没有复杂的概念与特性，不依赖开发环境（如node.js等），都是最基本的JavaScript语法，也就是说读者只要有JavaScript语言基础，就可以很快学会使用 Alpaca-spa.js框架用来构建前端页面。

### 2.使用 Alpaca-spa-2.1.js

Alpaca-spa-2.1.js 目前依赖于jquery.js。使用Alpaca-spa-2.1.js需要引用同时引用jquery.js，当然也可以是zepto.js。


1). 使用 jquery.js 需要在代码中引用：

```
    <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>

```

2). 使用 zepto.js 需要在代码中引用

```
    <script type='text/javascript' src='http://m.sui.taobao.org/assets/js/zepto.js' charset='utf-8'></script>
    <script> $.config = {router: false};</script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>
    <!-- 由于alpaca也有路由功能，上面代码中关闭了 zepto 的路由 -->

```


### 3.实用示例

下面的连接是一个前端Alpaca-Spa框架，后端用Laravel框架搭建一个后台管理系统。登录账号是一个测试帐号，权限只有浏览功能，没有编辑等修改功能。

Alpaca-Spa-Laravel :   http://full.tkc8.com

Alpaca-Spa的官方主页：http://www.tkc8.com


## 入门示例


下面是一个简单的单页面应用示例：一个单页面中有两个子页面，点击按钮分别切换不同的子页面。

```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
    <title>Alpaca - App</title>
    <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>
</head>
<!-- END HEAD -->
<!-- BEGIN BODY -->
<body>
    <a href="#/main/index/page1">点我去Page1</a> |
    <a href="#/main/index/page2">点我去Page2</a>
    <hr>
    <div id="content"></div>
    <hr>
</body>

<!-- page 1 的模版 -->
<script id='tpl_page1' type="text/x-dot-template">
    <div>
        <p>大家好啊, 我单页中的 <b> page 1 </b></p>
        <p>姓名 : {{= it.name}}</p>
        <p>年龄 : {{= it.age}}</p>
    </div>
</script>

<!-- page 2 的模版 -->
<script id='tpl_page2' type="text/x-dot-template">
    <div>
        <p>大家好啊, 我单页中的 <b> page 2 </b></p>
        <p>介绍 :{{= it.desc}}</p>
    </div>
</script>

<script>
    Alpaca.MainModule = {};
    Alpaca.MainModule.IndexController = {
        page1Action: function () {
            return new Alpaca.View({from: "#tpl_page1", to: "#content", data: {name: 'alpaca', age: '2'}});
        },
        page2Action: function () {
            return new Alpaca.View({from: "#tpl_page2", to: "#content", data: {desc: 'alpaca 是一款轻量的前端框架'}});
        },
    };

    $(document).ready(function () {
        Alpaca.run("#/main/index/page1");
    });
</script>

<!-- END BODY -->
</html>

```

运行结果 ：http://www1.tkc8.com/demo/test-001.html


简单解释一下上面的代码:

```
<body>
    <a href="#/main/index/page1">点我去Page1</a> |
    <a href="#/main/index/page2">点我去Page2</a>
    <hr>
    <div id="content"></div>
    <hr>
</body>
```

body中定义了两个a标签、以及一个id为content的Div区域， 第一个a标签的href属性为"#/main/index/page1"，这其实是alpaca的路由格式，后面会详细介绍。
"#content"的div区域用来接受显示page1、page2的内容。


```
<!-- page 1 的模版 -->
<script id='tpl_page1' type="text/x-dot-template">
    <div>
        <p>大家好啊, 我单页中的 <b> page 1 </b></p>
        <p>姓名 : {{= it.name}}</p>
        <p>年龄 : {{= it.age}}</p>
    </div>
</script>

```
上面的内容是page1的内容模板。模版中可以接受参数，在调用模版的时候可以传递参数，后面会详细介绍。
例如{{= it.name}}表示显示传递过来的name值， it是关键字，固定使用，表示传递过来的数据对象。

```
<script>
    Alpaca.MainModule = {};
    Alpaca.MainModule.IndexController = {
        page1Action: function () {
            return new Alpaca.View({from: "#tpl_page1", to: "#content", data: {name: 'alpaca', age: '2'}});
        },
        page2Action: function () {
            return new Alpaca.View({from: "#tpl_page2", to: "#content", data: {desc: 'alpaca 是一款轻量的前端框架'}});
        },
    };

    $(document).ready(function () {
        Alpaca.run("#/main/index/page1");
    });
</script>
```

上面代定定义了一个Alpaca的Main模块 （``` Alpaca.MainModule = {}; ```）,
并且在MainModule中定义了Index控制器:IndexController，
然后在IndexController定义了两个动作：page1Action，page2Action，
每一个Action中返会了一个Alpaca.View，用来显示相应页面。
``` Alpaca.run("#/main/index/page1"); ``` 表示默认执行"#/main/index/page1"路由，也就是显示page1。

后面会详细介绍``` Alpaca.View()``` 方法。除了使用``` Alpaca.View()```方法，也可以使用简单的``` Alpaca.Tpl()```方法，
``` Alpaca.Tpl()```比``` Alpaca.View()```简洁，支持的功能较少。

```from: "#tpl_page1"```表示使用 id等于tpl_page1的模版；
```to: "#content"```表示渲染到id=content的区域；
```data: {name: 'alpaca', age: '2'}```表示向模版中专递的数据，在模版中用it关键字获取（注意：传递数据类型必须为对象格式）。

下面看看其他示例：

### 1. 示例： Hello Alpaca

新建文件test-hello.html。在文件中编辑以下内容代码，用浏览器打开观察结果。

```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-spa-2.1 JS</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>
    <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>
    <script>
        $().ready(function () {
            Alpaca.Tpl({data:{text:'Alpaca'},place:'body'});
        });
    </script>
</head>
<body>
hello {{=it.text}} !
</body>
</html>

```

运行结果 ：http://www1.tkc8.com/demo/test-hello.html

```
hello Alpaca !
```

示例中的Alpaca.Tpl( )方法，传递了一个对象作为参数，对像中有两个属性，data表示要传递的数据（对象格式），place表示要渲染的位置。

通过上面的示例可以发现 页面body元素中的 {{=it.text}}被替换成为了 参数data中的text字段，也就是“Alpaca”，从而达到了渲染数据的效果。

**注**， 模板中的 it 是固定关键字，代表传递过来的数据对象。关于Alpaca.Tpl( )方法的详细用法，后续章节会做详细介绍。


### 2. 示例：使用路由


新建文件test-router.html。在文件中编辑以下内容代码，用浏览器打开观察结果。

```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
    <title>Alpaca - App</title>
    <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>
    <script>
        $().ready(function () {
            Alpaca.run();
        });
    </script>
</head>
<body>
</body>
</html>

```
运行结果 ：http://www1.tkc8.com/demo/test-router.html

结果如下，表示Alpaca路由运行成功
```
Welcome use Alpaca-spa 2.0 !
```


新建文件router-index.html。在文件中编辑以下内容代码。

```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-spa-2.1 JS</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

    <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>

    <script>
        //定义index模块
        Alpaca.IndexModule = {};
        //定义index控制器
        Alpaca.IndexModule.IndexController={
            //定义index动作
            indexAction:function(){
                alert('Hello Router');
            },
            //定义index动作
            index2Action:function(){
                Alpaca.Tpl({data:{text:'Hello'},place:'body'});
            },
        };
    </script>

    <script>
        $().ready(function () {
            Alpaca.run();
        });
    </script>

</head>
<body>
{{=it.text }} Alpaca.
</body>
</html>

```
在浏览器中输入 http://www1.tkc8.com/demo/test-router-index.html#/index/index/index

结果弹出提示框：
```
Hello Router
```

在浏览器中输入 http://www1.tkc8.com/demo/test-router-index.html#/index/index/index2

页面中显示：
```
Hello Alpaca.
```

通过上面两个例子，可以发现，Url中 :

```#/index/index/index``` 映射到 ```Alpaca.IndexModule.IndexController.indexAction()```方法

```#/index/index/index2``` 映射到 ```Alpaca.IndexModule.IndexController.index2Action()```方法

这就是**Alpace路由的用途，将Url中hash部分映射到一个js方法**。

关于路由的详细用法以及Alpaca.run()方法，后面章节会详细介绍。

##  模板语法

### 1. 语法

&emsp;&emsp;模板语法的作用是将JavaScript中的数据变量渲染到页面中。

&emsp;&emsp;Alpaca-spa.js 引用dot.js作为模板引擎，并且支持两种模板语法格式，分别是 alpaca 格式， dot.js 默认格式。常用的语法格式如下所示：


* Alpaca 格式 :

  + <?spa ?\>在标签内可以使用任意的JS语法
  + <?spa echo xxx ?\>                       输出变量
  + <?spa if(){ ?\>xxx<?spa } ?\>   条件判断
  + <?spa for(){ ?>xxx<?spa } ?\>   for循环
  + <?spa foreach(xxx as key => val) ?\> xxx <?spa endForeach ?\>   foreach循环
* dot.js 格式 ：
  + {{ }}                                           在标签内可以使用JS表达式和dot.js语法
  + {{=value }}                               当前位置输出变量的值
  + {{ if(){ }} xxx {{ } }}       条件判断
  + {{ for(){ }} xxx {{ } }}     for循环


&emsp;&emsp;学习使用Alpaca-spa.js模板引擎 ，开发人员只需要掌握三种基本的语法格式即可： 输出变量，循环， 条件判断。

**提示：** 在标签<?spa ?\> 或者{{ }}中，可以使用任意的JavaScript语法。

下面介绍如何使用这三种语法格式.

### 2. 输出变量

语法：

+ <?spa echo it.xxx ?\>
+ {{=it.xxx}}

用途：在渲染页面时，将一个变量显示在页面上

参考如下示例：

```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-spa-2.1 JS</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

    <script src="/common/jquery-2.1.4.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>

    <script>
        $(function(){
            var data = {name : "Cheng",age : 26};
            Alpaca.Tpl({data:data ,from:"#template", to:"#content"});
        });
    </script>

    <script id='template' type="text">
        <div>Name:<?spa echo it.name ?>!</div>
        <div>Age:<?spa echo it.age ?>!</div>
    </script>

</head>
<body>
    <div id="content"></div>
</body>
</html>

```
示例中的Alpaca.Tpl( )方法，传递了一个对象作为参数，对像中有三个属性，data表示要传递的数据（对象格式），from表示模板元素，to表示要渲染的位置。在浏览器中运行这个页面，结果如下：

```
Name:Cheng!
Age:26!
```

### 3. 循环

语法：

+ <?spa foreach() ?\> xxx <?spa endForeach ?\>
+ {{ for(){ }}xxx{{ } }}

用途：在遍历数组或者对象时候使用

参考如下示例：

```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-spa-2.1 JS</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

    <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>

    <script>
        $(function(){
            var data = {
                result:[
                    {type:'支付宝',amount:'125',time:'2016-11-12'},
                    {type:'微信',amount:'130',time:'2016-10-12'}
                    ]
                };
            Alpaca.Tpl({data:data ,from:"#template", to:"#content"});
        });
    </script>
    <script id='template' type="text">
        <?spa foreach(it.result as key => value) ?>
            <div>
                <?spa echo key ?>:
                <div>支付方式：<?spa echo value['type'] ?></div>
                <div>支付金额：<?spa echo value['amount'] ?></div>
                <div>支付时间：<?spa echo value['time'] ?></div>
            </div>
        <?spa endForeach ?>
    </script>
</head>
<body>
    <div id="content"></div>
</body>
</html>

```
结果如下：

```
0:
支付方式：支付宝
支付金额：125
支付时间：2016-11-12
1:
支付方式：微信
支付金额：130
支付时间：2016-10-12
```

### 4. 条件判断

语法：

+ <?spa if(condition){ ?\> xxx <?spa } ?\>
+ {{ if(condition){ }} xxx {{ } }}


用途：在需要做条件判断的分支环境中使用

参考如下示例：

```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-spa-2.1 JS</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

    <script src="/common/jquery-2.1.4.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>

    <script>
        $(function(){
            var data = {check:true,};
            Alpaca.Tpl({data:data ,from:"#template", to:"#content"});
        });
    </script>
    <script id='template' type="text">
        <?spa if(it.check){ ?>
            <font>条件为true的情况</font>
        <?spa }else{ ?>
            <a>条件为false的情况</a>
        <?spa } ?>
    </script>
</head>
<body>
<div id="content"></div>
</body>
</html>

```
输出结果：
```
条件为true的情况
```


### 5. Alpaca.Tpl()方法
```Alpaca.Tpl(option) ```是一个用来渲染页面的方法，接受一个对象参数option，参数option中可以包含以下字段：

+ ```option.data```

&emsp;&emsp;数据对象，为渲染模板提供数据

&emsp;&emsp;Alpaca.Tpl({data:{name:'Alpaca-spa'}})

+ ```option.from```

&emsp;&emsp;模板位置，可以是任意的页面元素，选择方法与Jquery的选择器相同

&emsp;&emsp;Alpaca.Tpl({from:'#template',to:'#div',data:{name:'Alpaca-spa'}})

* ```option.to```

&emsp;&emsp;被渲染位置

&emsp;&emsp;Alpaca.Tpl({from:'#template',to:'#div',data:{name:'Alpaca-spa'}})

+ ```option.place```

&emsp;&emsp;指定模板渲染的位置。当place被指定时，模板位置与被渲染位置相同

&emsp;&emsp;Alpaca.Tpl({place:'body',data:{name:"alpaca"}})

+ ```option.template```

&emsp;&emsp;指定渲染的模板文件。当template被指定时，模板从当前页面元素变为指定的html文件

&emsp;&emsp;Alpaca.Tpl({to:'body',template:'layer.html',data:{name:"Alpaca-spa"}})

&emsp;&emsp;**注：** 使用另一个页面作为模板，需要web服务器的支持，在后面章节【视图高级用法】中会做详细介绍

示例

**使用参数：data from to：**

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>alpaca-spa.2.0</title>
        <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
        <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>
        <script>
            $(function(){
                Alpaca.Tpl({from:'#template',to:'#content',data:{name:"Alpaca-spa"}});
            });
        </script>
        <script id='template' type="text">
            <font>Welcome to {{=it.name}}!</font>
        </script>
    </head>
    <body>
        <div id="content"></div>
    </body>
</html>
```

输出结果：

```
Welcome to Alpaca-spa!
```

**使用参数：place：**

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>alpaca-spa.2.0</title>
        <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
        <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>
        <script>
            $(function(){
                Alpaca.Tpl({place:'body',data:{name:"Alpaca-spa"}});
            });
        </script>
    </head>
    <body>
        Hello {{=it.name}}!
    </body>
</html>
```
输出结果：
```
This is Alpaca-spa!
```

**使用参数：template：**

创建两个html页面：template.html，test-template.html

**注：** 使用template参数指定另一个页面为模板时，需要配置web服务器，确保template路径正确，详情请参考后面章节【视图高级用法】。

template.html 文件用来做模板，内容如下：

```
<h1>This is {{=it.name}}.</h1>
```

test-template.html 文件是用来测试该示例的页面，内容如下：

```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-spa-2.1 JS</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

    <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>

    <script>
        $().ready(function () {
            var data = {name:"Alpaca-spa"};
            Alpaca.Tpl({template:'/examples/template.html',to:'body',data:data});
        });
    </script>
</head>
<body>
</body>
</html>

```

在浏览器中访问test-template.html页面，输出结果：
```
This is Alpaca-spa.
```

通过上面的示例，可以发现template.html中的内容被渲染到了当前页面。


##  路由

### 1. 什么是路由

&emsp;&emsp; 如果您已经看过前面入门示例中关于路由的示例，相信您已经了解了在Alpaca-Sap.js中，路由的功能是将Url中hash部分映射到一个js方法。

例如上面的示例：

```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-spa-2.1 JS</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

    <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>

    <script>
        //定义index模块
        Alpaca.IndexModule = {};
        //定义index控制器
        Alpaca.IndexModule.IndexController={
            //定义index动作
            indexAction:function(){
                alert('Hello Router');
            },
            //定义index动作
            index2Action:function(){
                Alpaca.Tpl({data:{text:'Hello'},place:'body'});
            },
        };
    </script>

    <script>
        $().ready(function () {
            Alpaca.run();
        });
    </script>

</head>
<body>
{{=it.text }} Alpaca.
</body>
</html>

```
在浏览器中输入 http://www1.tkc8.com/demo/test-router-index.html#/index/index/index

结果弹出提示框：
```
Hello Router
```

在浏览器中输入 http://www1.tkc8.com/demo/test-router-index.html#/index/index/index2

页面中显示：
```
Hello Alpaca.
```

可以发现，Url中hash的映射关系 :

```#/index/index/index``` 映射到 ```Alpaca.IndexModule.IndexController.indexAction()```方法

```#/index/index/index2``` 映射到 ```Alpaca.IndexModule.IndexController.index2Action()```方法


**路由的组成：**

Alpaca-Sap.js中，路由用Url中的hash部分表示，主要有三部分组成，**模块，控制器，动作**。格式：**#/模块/控制器/动作**

例如：Url中 ```#/admin/user/add``` 表示 ```admin模块，user控制器，add动作```。

对应js代码中 ```Alpaca.AdminModule.UserController.addAction()```方法。

那么如何在js代码中定义模块，控制器，方法呢？

**定义模块：**

```
Alpaca.AdminModule = {};
```
模块是Alpaca的一个对象，以Module结尾。上面示例定义了一个名为admin的模块。

**定义控制器：**

```
Alpaca.AdminModule.UserController ={};
```
控制器是模块的一个对象。以Controller 结尾。上面示例定义了一个名为user的控制器，属于admin模块。

**定义动作：**

```
Alpaca.AdminModule.UserController={
    addAction:function(){
        alert('Hello Router');
    },
}
```

动作是控制器中的一个方法，以Action 结尾。上面示例在user的控制器中定义了一个add方法，


### 2. 如何使用路由

在Alpaca-Spa.js中使用路由有三种方式：

* 1 在浏览器的地址栏中直接输入Url，例如上面的示例。

* 2 在页面加载完成时，使用 Alpaca.run()方法。

* 3 使用Alpaca.to()方法。

下面分别介绍Alpaca.run()方法与Alpaca.to()。


### 3. Alpaca.run()

Alpaca.run()一般在页面加载完成时调用，用来执行默认路由，例如：

```
$().ready(function () {
    Alpaca.run();
});

```
在浏览期中打开页面，结果如下：

```
Welcome use Alpaca-spa 2.0 !
```

这是因为当Alpaca.run()方法中的参数为空时，调用了Alpaca-Spa.js的内置默认路由:#/alpaca/alpaca/index , 对应方法： Alpaca.AlpacaModule.AlpacaController.indexAction()。 这个方法在页面中输出了: ```  Welcome use Alpaca-spa 2.0 !  ```

下面示例如何修改页面加载时的默认路由：

新建页面 router-default.html ，内容入下：
```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-spa-2.1 JS</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

    <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>

    <script>
        //定义index模块
        Alpaca.IndexModule = {};
        //定义index控制器
        Alpaca.IndexModule.IndexController={
            //定义index动作
            indexAction:function(){
                document.write("Hello I'm your default Router.")
            },
        };
    </script>

    <script>
        $().ready(function () {
            Alpaca.run("#/index/index/index");
        });
    </script>

</head>
<body>

</body>
</html>
```
浏览器中打开页面，结果如下：

```
Hello I'm your default Router.
```

通过上面的示例，可以看出为Alpaca.run()方法传递一个参数"#/index/index/index"，就可以改变页面加载时执行**默认的路由**了。上面的示例中，我们将默认路由改为了#/index/index/index。


### 4. Alpaca.to()

在介绍Alpaca.to()方法使用之前，先来看一个示例：

```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-spa-2.1 JS</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

    <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>

    <script>
        //定义index模块
        Alpaca.IndexModule = {};
        //定义index控制器
        Alpaca.IndexModule.IndexController={
            //定义index动作
            indexAction:function(){
                Alpaca.Tpl({data:{title:"Test Router:"},place:"body"});
            },

            //定义index2动作
            index2Action:function(){
                $('#index2-content').html("调用index2！");
            }
        };
    </script>

    <script>
        $().ready(function () {
            Alpaca.run("#/index/index/index");
        });
    </script>

</head>
<body>
<h4>{{= it.title}}</h4>
<a onclick='Alpaca.to("#/index/index/index2")'>点我执行index2</a>
<div id="index2-content"></div>
</body>
</html>
```
在浏览器中运行该页面，然后点击“点我执行index2”，结果如下：

```
<h4>Test Router:</h4>
点我执行index2
调用index2！
```

通过上面的示例，可以看出Alpaca.to()方法的作用是调用路由。

Alpaca.to()方法可以传递两个参数Alpaca.to(router,data), 其中router是上面示例中的路由，data是可选参数，一个对象类型，代表传递的数据。参考下面的示例：

```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-spa-2.1 JS</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>

    <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>

    <script>
        //定义index模块
        Alpaca.IndexModule = {};
        //定义index控制器
        Alpaca.IndexModule.IndexController={
            //定义index动作
            indexAction:function(){
                Alpaca.Tpl({data:{title:"Test Router:"},place:"body"});
            },

            //定义index2动作
            index2Action:function(data){
                $('#index2-content').html("调用index2: "+data.text);
            }
        };
    </script>

    <script>
        $().ready(function () {
            Alpaca.run("#/index/index/index");
        });
    </script>

</head>
<body>
<h4>{{= it.title}}</h4>
<a onclick='Alpaca.to("#/index/index/index2",{text:"hello alpaca!"})'>点我执行index2</a>
<div id="index2-content"></div>
</body>
</html>
```
在浏览器中运行该页面，然后点击“点我执行index2”，结果如下：

```
<h4>Test Router:</h4>
点我执行index2
调用index2: hello alpaca!
```

通过上面的示例，可以看出动作index2对应的方法可以接受一个参数data，这个data就是Alpaca.to(router,data)方法传递过去的data对象。

### 5 获取路由中的参数

通过 ```Alpaca.Router.getParams();``` 可以获取路由中的参数。例如


```
<!DOCTYPE html>
<html>
<head>
    <title>Alpaca-spa-2.1 JS</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>
    <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>
    <script>
        //定义index模块
        Alpaca.IndexModule = {};
        //定义index控制器
        Alpaca.IndexModule.IndexController={
            //定义index动作
            indexAction:function(){
                var v1 = Alpaca.Router.getParams(0);
                var v2 = Alpaca.Router.getParams(1);
                var v_a = Alpaca.Router.getParams('a');
                var v_b = Alpaca.Router.getParams('b');

                var result = "v1 = " + v1 +'<br>';
                result += "v2 = " + v2 +'<br>';
                result += "v_a = " + v_a +'<br>';
                result += "v_b = " + v_b +'<br>';

                $('#result').html(result);
            },
        };
    </script>

    <script>
        $().ready(function () {
            Alpaca.run("#/index/index/index");
        });
    </script>

</head>
<body>
<div id='result'></div>
</body>
</html>
```

运行结果 ：http://www1.tkc8.com/demo/test-param.html?a=aaaaa#/index/index/index/11111/22222?b=bbbbb


```
v1 = 11111
v2 = 22222
v_a = aaaaa
v_b = bbbbb

```

** 注: ** 使用```Alpaca.Router.getParams()```获取url中的参数时，如果#后面与#号前面有相同名字的参数，**优先获取#后面的**。


##  视图高级用法(多页结构的前后分离)

### 1 简介

视图功能是Alpaca-Spa.js的核心功能，主要解决前端JavaScript实现页面嵌套，页面数据渲染，页面局部渲染等功能。
使用alpaca-spa的View功能，可以轻松构建多页面前后分离结构，尤其是在开发后台功能时，非常实用。
当然，使用alpaca-spa开发移动端h5网站,单页面结构网站也是非常不错的选择。
使用视图功能需要配置web服务器，例如apache, nginx，node等。
这里使用apache举例，假设你的网站根目录位于：

```
    C:\www\

```

当然你可以配置apache的虚拟主机，将网站的根目录放在任意你喜欢的地方。

如果你们项目的前后端在同一个域名下面，也就是网站根目录前后端用的是同一个，那前端的代码一般不会直接放在根木目下面，
在根目录下面建立一个叫 ```alpaca-spa```或者叫其他名字的目录（只要不与后端路由冲突既可），例如将前端代码放到 ```alpaca-spa```目录下面


一个简单的目录结构如下：

```
--C:\www\alpaca-spa\
　 --main\
　　  --controller\
　　     index.js
　　  --view\
　　     --index\
            index.html
            index-2.html
            index-3.html
　　     --layout\
            --part\
               leftMenu.html
            layout.html
　　  main.js
   index.html
```

```
1. 示例中的www是项目的根目录，应该将web服务器的根目录设置为此目录。

2. alpaca-spa是前端项目的目录，目录下面有1个子目录，1个html文件。
   main         main目录用来存放当前项目中所有main模块的文件。可以创建多个模块。
   index.html   index.html用来做当前项目的入口文件

3.index目录里面有两个目录controller，view，一个js文件
   controller   用来存放main模块的控制器的js代码。里面有一个控制器js文件，index.js
   view         用来存放main模块的视图部分的js代码。
                示例中view目录里面有一个子目录index，用于存放index控制器中相关的模板，
                本示例中，有三个模板：index.html，index2.html，index3.html
                还有一个子目录layout，用于存放公共的布局信息，
                layout目录中的layout.html是默认的布局模板文件
                layout目录中的还有一个子目录part，用来存放页面中其他公共区域，例如菜单等
   main.js      main.js是main模块的模块级别的js代码。
                推荐在这个文件里面做模块的定义，例如：Alpaca.MainModule = {};
```

示例访问地址: http://www1.tkc8.com/alpaca-spa/index.html

### 2 使用View

了解完上面的目录结构之后，我们来学习使用Alpaca.View()方法，参看下面的示例。

alpaca-spa/index.html 文件中的内容:

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>alpaca-spa.2.1</title>

    <!-- 简单调整一下样式 -->
    <link  type="text/css" href="common/css/style.css">

    <!-- 引入alpaca-spa.js-->
    <script type='text/javascript' src='http://spa.tkc8.com/common/js/jquery-2.1.4.min.js'></script>
    <script type="text/javascript" src="http://spa.tkc8.com/common/js/alpaca-spa-2.1.js"></script>

    <!-- 引入main模块main.js-->
    <script type="text/javascript" src="main/main.js"></script>
    <!-- 引入main模块下index控制器index.js-->
    <script type="text/javascript" src="main/controller/index.js"></script>

    <!-- 运行 alpaca-spa Js-->
    <script>
        $(function () {
            /* 配置baseUrl。
             * 由于alpaca请求视图模版是从根目录进行寻址，
             * 当前项目不在根目录，在根目录的下一级目录中
             * */
            Alpaca.Config.baseUrl = "/alpaca-spa/";

            /*启动alpaca，指定默认路由 #/main/index/index */
            Alpaca.run("#/main/index/index");
        });
    </script>
</head>
<body>
</body>
</html>

```

alpaca-spa/main/main.js 文件中的内容:

```
/* 1 定义Index模块 */
Alpaca.MainModule = {};

```

alpaca-spa/main/controller/index.js 文件中的内容:
```
/* 1 定义Main模块中的Index控制器 */
Alpaca.MainModule.IndexController = {
    //index动作，创建一个视图index
    indexAction: function () {
        //视图默认渲染到#content位置，可以通过参数中传递to字段改变渲染位置
        //视图模板默认位于index/view/index/index.html,可以通过参数中传递template字段改变模块路径
        //即：默认模板位置为：[模块名]/view/[控制器名]/[动作名].html
        var view = new Alpaca.View({data:{desc:'我是一条数据，在controller中传递到view视图模版里面！'}});

        //layout 布局视图
        var layout = new Alpaca.Layout();

        //part 部件视图，默认路由位于view/layout/part中，文件名默认与name属性相同
        //part 的默认渲染位置与其name属性相同，当然也可以通过to属性指定
        var part = new Alpaca.Part({name: 'leftMenu'});

        //将part添加到layout中，part的默认渲染位置与其name属性相同，也可以通过to属性指定
        layout.addChild(part);

        //设置视图的layout
        view.setLayout(layout);

        //在view中，向layout中传递数据
        view.setLayoutData({'layoutData': 666});

        //在view中，向part中传递数据
        view.setPartData({leftMenu: {'partData': 888}});

        return view;
    },

    //index2动作，创建视图index2
    index2Action: function () {
        var view   = new Alpaca.View();
        var layout = new Alpaca.Layout();
        var part   = new Alpaca.Part({name: 'leftMenu'});
        layout.addChild(part);
        view.setLayout(layout);
        view.setLayoutData({'layoutData': '666 - 2'});
        view.setPartData({leftMenu: {'partData': '888 - 2'}});
        return view;
    },

    //index3动作，创建视图index3
    index3Action: function () {
        var view   = new Alpaca.View();
        var layout = new Alpaca.Layout();
        var part   = new Alpaca.Part({name: 'leftMenu'});
        layout.addChild(part);
        view.setLayout(layout);
        view.setLayoutData({'layoutData': '666 -- 3'});
        view.setPartData({leftMenu: {'partData': '888 -- 3'}});
        return view;
    },
};
```

alpaca-spa/main/index/view/index.html 文件中的内容:
```
<div> 我是内容区域：当前显示的是index.html里面的内容 </div>
<h5>我有一条数据:</h5>
{{= it.desc }}
```

alpaca-spa/main/index/view/index2.html 文件中的内容:
```
<div> 我是内容区域：当前显示的是index2.html里面的内容 </div>
```

alpaca-spa/main/index/view/index3.html 文件中的内容:
```
<div> 我是内容区域：当前显示的是index3.html里面的内容 </div>
```

在浏览器中访问: http://www1.tkc8.com/alpaca-spa/index.html

点击按钮，可以看到内容区域切换到对应的页面了，整体布局layout、菜单leftMenu除了数据其他的都没有变化，

上面的示例中，我们创建了Main模块，index控制器，index动作，并且在indexAction中通过Alpaca.View()方法创建了一个视图，运行结果是视图模板中的内容被渲染到了页面的#content位置中。这就是Alpaca.View()的用途。

**Alpaca.View()方法**

Alpaca.View(option) 是一个用来创建视图页面的方法，接受一个对象参数option，参数option中可以包含以下字段：

+ **option.data**

&emsp;&emsp;数据对象，为渲染模板提供数据

&emsp;&emsp;例如：Alpaca.View({data:{name:'Alpaca-spa'}})

+ **option.to**

&emsp;&emsp;设置被渲染位置，默认位置是#content

&emsp;&emsp;例如：Alpaca.View({data:{name:'Alpaca-spa'},to:'#divId'})

+ **option.template**

&emsp;&emsp;指定渲染的模板文件。默认是所属模块view目录下所属controller同名目录下action同名的.html文件，即：默认模板位置为：[模块名]/view/[控制器名]/[动作名].html

&emsp;&emsp;如果需要改变视图模板，只需要这样写即可：template:'index2'，这样就会使用同名controller下的index2.html作为模板。

&emsp;&emsp;这是因为函数内部自动格式化了该参数，如果不想使用自动格式化功能，请使用notFormat参数，设置notFormat:true 即可。

&emsp;&emsp;例如：Alpaca.View({data:{name:'Alpaca-spa'},to:'body',template:'index2'})

+ **option.notFormat (一般不用，不推荐使用，可以跳过不看)**

&emsp;&emsp;默认为false，表示系统会自动格式化template参数，如果设置为true，如下例，视图将使用根目录下的index-test.html文件作为视图模板。
Alpaca.View(template:'/index-test.html',notFormat:true})


### 3 使用Layout和Part

实际的web项目开发中，大部分页面都是有结构的，比如总体的布局，公用的菜单、页头、页尾等。Alpaca-sap.js使用layout，part来解决这类问题。

继续上面介绍View的示例：

观察alpaca-spa/main/controller/index.js 文件中的内容：

```
indexAction: function () {
        //视图默认渲染到#content位置，可以通过参数中传递to字段改变渲染位置
        //视图模板默认位于index/view/index/index.html,可以通过参数中传递template字段改变模块路径
        //即：默认模板位置为：[模块名]/view/[控制器名]/[动作名].html
        var view = new Alpaca.View({data:{desc:'我是一条数据，在controller中传递到view视图模版里面！'}});

        //layout 布局视图
        var layout = new Alpaca.Layout();

        //part 部件视图，默认路由位于view/layout/part中，文件名默认与name属性相同
        //part 的默认渲染位置与其name属性相同，当然也可以通过to属性指定
        var part = new Alpaca.Part({name: 'leftMenu'});

        //将part添加到layout中，part的默认渲染位置与其name属性相同，也可以通过to属性指定
        layout.addChild(part);

        //设置视图的layout
        view.setLayout(layout);

        //在view中，向layout中传递数据
        view.setLayoutData({'layoutData': 666});

        //在view中，向part中传递数据
        view.setPartData({leftMenu: {'partData': 888}});

        return view;
    },
```


以及：alpaca-spa/main/view/layout/layout.html 文件中的内容为：

```
<style>
    .layout-css {
        border: 1px solid green;
        padding: 20px;
    }

    #content, #leftMenu {
        border: 1px dashed green;
    }

    #content {
        padding: 20px;
    }
</style>

<div class="layout-css">

    <h2> 我是layout! 数据【{{=it.layoutData}}】是在控制器中传递给我的。</h2>

    <h5>左边菜单：</h5>
    <div id="leftMenu"></div>

    <h5>页面内容区域：</h5>
    <div id="content"></div>

</div>
```

alpaca-spa/main/view/layout/part/leftMenu.html 文件中的内容为：

```
<style>
    .lm-css {
        padding: 20px;;
    }
</style>

<div class="lm-css">
    <h3>我是左边的菜单，请把我放到左面! 数据【{{=it.partData}}】是在控制器中传递给我的。</h3>
    <h6>点下面的连接可以切换其他页面</h6>

    <button type="button" onclick="toIndex1()"> 页面Index1</button>
    <button type="button" onclick="toIndex2()"> 页面Index2</button>
    <button type="button" onclick="toIndex3()"> 页面Index3</button>
</div>


<script>
    /*必须注意 在模版中写js，注释不可以用“//”*/
    var toIndex1 = function () {
        Alpaca.to('#/main/index/index');
    };
    var toIndex2 = function () {
        Alpaca.to('#/main/index/index2');
    };
    var toIndex3 = function () {
        Alpaca.to('#/main/index/index3');
    }
</script>
```

上面的示例演示了如何使用 layout、part来渲染复杂页面。


**Alpaca.Layout()方法**

Alpaca.Layout(option) 是用来创建一个layout布局的视图对象的方法，接受一个对象参数option，参数option中可以包含以下字段：

+ **option.data**

&emsp;&emsp;数据对象，为渲染模板提供数据

&emsp;&emsp;例如：Alpaca.Layout({data:{name:'Alpaca-spa'}})

+ **option.to**

&emsp;&emsp;设置被渲染位置，默认位置是body

&emsp;&emsp;例如：Alpaca.Layout({data:{name:'Alpaca-spa'},to:'#divId'})

+ **option.name**

&emsp;&emsp;指定layout的名字。默认为layout

&emsp;&emsp;layout默认的模板路径是所属模块view目录下layout目录下的layout.html文件

&emsp;&emsp;通过name字段可以修改模板的路径为：所属模块view目录下layout目录下与name同名的html文件

&emsp;&emsp;例如：Alpaca.Layout({data:{name:'Alpaca-spa'},to:'body',name:'layout2'})


**Alpaca.Part()方法**

Alpaca.Part(option) 是用来创建一个part布局的视图对象的方法，接受一个对象参数option，参数option中可以包含以下字段：

+ **option.data**

&emsp;&emsp;数据对象，为渲染模板提供数据

&emsp;&emsp;例如：Alpaca.Part({data:{name:'Alpaca-spa'}})

+ **option.name**

&emsp;&emsp;指定Part的名字。

&emsp;&emsp;Part默认的模板路径是所属模块view\layout\part目录下与其name同名的html文件

&emsp;&emsp;Part默认的渲染位置是id与其name同名的元素

&emsp;&emsp;通过name字段可以达到指定他的视图模板路径，以及渲染位置的效果，例如，

&emsp;&emsp;例如：Alpaca.Part({data:{name:'Alpaca-spa'},name:'top'})

+ **option.to**

&emsp;&emsp;设置被渲染位置，默认位置是id与其name同名的元素

&emsp;&emsp;例如：Alpaca.Part({data:{name:'Alpaca-spa'},to:'#divId'})


### 4. 如何改变layout、view的默认渲染位置

+ 1、layout默认渲染位置是 ```<body></body>```位置,

通过设置Alpaca.ViewModel.DefaultLayoutCaptureTo = "body"; 可以全局改变layout的默认渲染位置

如果只修改当前视图的渲染位置，有两种方法：

```
var layout = new Alpaca.Layout({to:'body'}});
```
或者

```
var layout = new Alpaca.Layout();
layout.setCaptureTo('.layout-area');
```

+ 2、view默认渲染位置是 ```<div id="content"> </div> ```位置，

通过设置Alpaca.ViewModel.DefaultViewCaptureTo   = "body";可以全局改变view的默认渲染位置

如果只修改当前视图的渲染位置，有两种方法：

```
var view = new Alpaca.View({to:'#content'}});
```
或者

```
var view = new Alpaca.View();
view.setCaptureTo('.content-area');
```

layout、view的默认渲染位置非常重要，一个路由执行后，url中的hash是否改变，就依据layout、view的默认位置决定。而hash是否改变，会影响刷新点击按钮的结果。


+ 1、如果当前view没有使用layout，```则view的CaptureTo等于DefaultLayoutCaptureTo时```，hash会改变
+ 2、如果使用了layout，```则layout的CaptureTo等于DefaultLayoutCaptureTo时```，hash会改变


### 5 ready()方法

视图渲染完毕后会执行view.ready()方法，例如

```
var view = new Alpaca.View()

//视图渲染完成后执行ready方法。
view.ready(function () {
	console.log('视图渲染完成了...');
})

return view;
```

### 6 自定义显示效果

通过设置view.show方法可以自定义视图显示效果，例如：

```
var view = new Alpaca.View();

//自定义视图渲染效果为闪入效果。
//注意：在自定义视图显示效果时，需要调用onLoad事件，来触发执行ready函数。
view.show = function (to, html) {
    var that = this;
    $(to).fadeOut("fast", function () {
        $(to).html(html);
        $(to).fadeIn("fast", function () {
            that.onLoad();
        });
    });
};

return view;
```
上面面示例代码，实现了视图渲染时的闪入效果。

### 7 init()与release()方法

如果在控制器中定义了init()方法，那么在执行当前控制器的所有action方法前都会执行init()方法。如果在控制器中定义了release()方法，那么在执行完成当前控制器的所有action方法之后，都会执行release()方法，

模块中也可以定义init()、release()方法。

参考示例：

```
/* 定义Index模块中的TestController */
Alpaca.IndexModule.TestController = {

	//init方法,当前控制下的所有动作在执行前，都会执行init方法
	init:function(){
		console.log('执行action之前，执行init()方法');
	},

	//release方法,当前控制下的所有动作在执行前，都会执行release方法
	release:function(){
		console.log('执行action之后，执行release)方法');
	},
};
```

### 8. 关于hash何时被改变

```
1：如果未使用layout，则view的CaptureTo等于DefaultLayoutCaptureTo
2：如果使用了layout，则layout的CaptureTo等于DefaultLayoutCaptureTo

```

##  内置对象与方法

##  交流方式

### 联系我们

QQ群： 298420174

![图片名称](http://www.tkc8.com/index_files/Image%20[10].png)

作者： Sponge
邮箱： 1796512918@qq.com

