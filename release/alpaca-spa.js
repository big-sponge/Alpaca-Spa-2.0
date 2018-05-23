// 2016, ChengCheng ,http://tkc8.com:8080/summary/alpaca-spa.git

var VERSIONMODE_DEVELOPMENT = 1;
var VERSIONMODE_PRODUCT     = 2;

var Alpaca = {

    config: {
        baseUrl: '/',
    },

    Version: {
        VersionMode: VERSIONMODE_DEVELOPMENT,
        VersionNumber: "1.0.0",
        update: function () {
            if (this.VersionMode == VERSIONMODE_DEVELOPMENT) {
                try {
                    localStorage.clear();
                } catch (e) {

                }
            } else {
                try {
                    var localVersion  = localStorage.getItem("localVersion");
                    var serverVersion = this.VersionNumber;

                    console.log("Server Version:" + this.VersionNumber);
                    console.log("Local Version:" + localVersion);

                    if (!localVersion || localVersion != serverVersion) {
                        localStorage.clear();
                        localStorage.setItem("localVersion", serverVersion);
                    }
                }
                catch (e) {

                }
            }
            return;
        }
    },

    isChangeHash: undefined,

    changeHash: function(){
        Alpaca.forward(window.location.hash);
        Alpaca.onhashchange();
    },

    extend: function (target, obj) {
        for (var i in obj) {  // jshint ignore:line
            target[i] = obj[i];
        }
    },

    hashchange:[],

    addChangeHash:function(func){
        this['hashchange'].push(func);
    },

    bind:function( target, func ){
        this[target].push(func);
    },

    onhashchange : function(){
        for (var index in this.hashchange) {
            this.hashchange[index]();
        }
    },

    render: function (data, template, destination) {

        if (!destination) {
            destination = template;
        }
        var interText = doT.template($(template).text());
        $(destination).html(interText(data));
    },

    run: function (runHash) {

        //1.检查版本
        this.Version.update();

        //2.记录当前页面路由
        var nowHash = window.location.hash;

        if (!nowHash) {
            nowHash = "";
        }
        if (!runHash) {
            runHash = "";
        }

        //解决刷新问题，防治每次刷新都进入默认路由，而不是进入url中的hash路由
        if (runHash != null && nowHash == null) {
            //3.1 url中的hash为空，应用默认路由
            this.forward(runHash);
        } else {
            //3.2 url中的hash不为空 执行url中Hash路由.
            this.forward(nowHash);
        }
    },

    forward: function (inHash) {

        //开始路由
        var router       = new this.Router.create();
        var routerResult = router.start(inHash);

        router = null;

        if (routerResult == false || !routerResult) {
            Alpaca.Router.InHash = null;
            return false;
        }

        /* 设置hash,解决什么时候修改url中的hash，
           inHsah必须有效，
           如果未使用layout，则view的CaptureTo等于DefaultLayoutCaptureTo
           如果使用了layout，则layout的CaptureTo等于DefaultLayoutCaptureTo
           */
        var isSetHash = inHash && ( routerResult.CaptureTo == Alpaca.ViewModel.DefaultLayoutCaptureTo || (routerResult.UseLayout == true && routerResult.Layout.CaptureTo == Alpaca.ViewModel.DefaultLayoutCaptureTo));

        if (isSetHash || Alpaca.isChangeHash === true ) {
            //关闭Onhashchange事件
            window.onhashchange = null;
            window.location.hash = inHash;
            //触发Alpaca自己的hashchange事件
            Alpaca.onhashchange();
            //开启Onhashchange事件
            setTimeout(function(){ window.onhashchange = Alpaca.changeHash;},50);
        }

        Alpaca.Router.InHash = null;
        return true;
    },

    Router: {
        Params: new Array(),

        InHash: null,

        ModulePostfix: 'Module',

        ControllerPostfix: 'Controller',

        ActionPostfix: 'Action',

        DefaultModule: 'index',

        DefaultController: 'index',

        DefaultAction: 'index',

        Module: null,

        Controller: null,

        Action: null,

        ModuleName: null,

        ControllerName: null,

        ActionName: null,

        ModuleFullName: null,

        ControllerFullName: null,

        create: function () {
            return {

                start: function (inHash) {

                    //解析路由，生成Module、Controller、Action
                    var actionName = this.parser(inHash);
                    if (actionName == null) {
                        return false;
                    }

                    //执行分发之前的事件
                    var initResult = this.init();
                    if (initResult !== undefined) {
                        return;
                    }

                    //分发-执行Action 返回view
                    var view = this.dispatcher(actionName);

                    //渲染视图
                    if (view) {
                        view.display();
                    }

                    //执行分发后的事件
                    var releaseResult = this.release();

                    return view;
                },

                parser: function (inHash) {

                    if (!inHash) {
                        inHash = "";
                    }

                    if (inHash.indexOf("?") != -1) {
                        inHash = inHash.slice(0, inHash.indexOf("?"));
                    }

                    console.log(inHash);
                    var segments = new Array();

                    segments = inHash.split("/");


                    if (!segments[3]) {
                        segments.splice(1, 0, Alpaca.Router.DefaultModule);
                    }
                    if (!segments[3]) {
                        segments.splice(2, 0, Alpaca.Router.DefaultController);
                    }

                    if (!segments[3]) {
                        segments.splice(3, 0, Alpaca.Router.DefaultAction);
                    }

                    if (Alpaca.Router.InHash == inHash) {
                        return null;
                    }

                    Alpaca.Router.InHash = inHash;

                    //保存路由中的其他字段到参数
                    Alpaca.Router.Params = segments.slice(4);

                    // Module
                    Alpaca.Router.Module         = segments[1];
                    Alpaca.Router.ModuleName     = Alpaca.Router.Module + Alpaca.Router.ModulePostfix;
                    Alpaca.Router.ModuleName     = Alpaca.Router.ModuleName.replace(/(\w)/, function (v) {
                        return v.toUpperCase()
                    });
                    Alpaca.Router.ModuleFullName = "Alpaca." + Alpaca.Router.ModuleName;

                    // Controller
                    Alpaca.Router.Controller         = segments[2];
                    Alpaca.Router.ControllerName     = Alpaca.Router.Controller + Alpaca.Router.ControllerPostfix;
                    Alpaca.Router.ControllerName     = Alpaca.Router.ControllerName.replace(/(\w)/, function (v) {
                        return v.toUpperCase()
                    });
                    Alpaca.Router.ControllerFullName = Alpaca.Router.ModuleFullName + "." + Alpaca.Router.ControllerName;

                    // Action
                    Alpaca.Router.Action         = segments[3];
                    Alpaca.Router.ActionName     = Alpaca.Router.Action + Alpaca.Router.ActionPostfix;
                    Alpaca.Router.ActionFullName = Alpaca.Router.ControllerFullName + "." + Alpaca.Router.ActionName;

                    console.log(Alpaca.Router.ModuleName, Alpaca.Router.ControllerName, Alpaca.Router.ActionName);

                    var alpacaController = "Alpaca.AlpacaModule.AlpacaController";
                    if (!eval(Alpaca.Router.ModuleFullName)) {
                        actionName = alpacaController + ".moduleNotFoundAction";
                    } else if (!eval(Alpaca.Router.ControllerFullName)) {
                        actionName = alpacaController + ".controllerNotFoundAction";
                    } else if (!eval(Alpaca.Router.ActionFullName)) {
                        actionName = alpacaController + ".actionNotFoundAction";
                    } else {
                        actionName = Alpaca.Router.ActionFullName;
                    }

                    return actionName;
                },

                init: function () {
                    //执行模块init方法，如果该方法存在
                    var moduleResult = undefined;
                    if (eval(Alpaca.Router.ModuleFullName) && eval(Alpaca.Router.ModuleFullName + ".init")) {
                        moduleResult = eval(Alpaca.Router.ModuleFullName + ".init" + "()");
                    } else {
                        moduleResult = eval("Alpaca.AlpacaModule.init()");
                    }

                    if (moduleResult !== undefined) {
                        return moduleResult;
                    }

                    //执行控制器init方法，如果该方法存在
                    var controllerResult = undefined;
                    if (eval(Alpaca.Router.ModuleFullName) && eval(Alpaca.Router.ControllerFullName) && eval(Alpaca.Router.ControllerFullName + ".init")) {
                        controllerResult = eval(Alpaca.Router.ControllerFullName + ".init" + "()");
                    } else {
                        controllerResult = eval("Alpaca.AlpacaModule.AlpacaController.init()");
                    }

                    if (controllerResult !== undefined) {
                        return controllerResult;
                    }

                    return undefined;
                },

                dispatcher: function (actionName) {

                    //执行Action
                    var view = eval(actionName + "()");

                    //View
                    if (!view) {
                        if (eval(Alpaca.Router.ControllerFullName + ".getDefaultView")) {
                            view = eval(Alpaca.Router.ControllerFullName + ".getDefaultView" + "(view)");
                        } else if (eval(Alpaca.Router.ModuleFullName + ".getDefaultView")) {
                            view = eval(Alpaca.Router.ModuleFullName + ".getDefaultView" + "(view)");
                        } else {
                            view = Alpaca.ViewModel.getDefaultView(view);
                        }

                        //View为空直接返回
                        if (!view) {
                            return;
                        }
                    }

                    //View - Template
                    if (!view.Template) {

                        //console.log(eval(Alpaca.Router.ControllerFullName));

                        if (eval(Alpaca.Router.ControllerFullName + ".getDefaultViewTemplate")) {
                            view.Template = eval(Alpaca.Router.ControllerFullName + ".getDefaultViewTemplate" + "()");
                        } else if (eval(Alpaca.Router.ModuleFullName + ".getDefaultViewTemplate")) {
                            view.Template = eval(Alpaca.Router.ModuleFullName + ".getDefaultViewTemplate" + "()");
                        } else {
                            view.Template = Alpaca.ViewModel.getDefaultViewTemplate(this);
                        }
                    }


                    //View - CaptureTo
                    if (!view.CaptureTo) {
                        if (eval(Alpaca.Router.ControllerFullName + ".getDefaultViewCaptureTo")) {
                            view.CaptureTo = eval(Alpaca.Router.ControllerFullName + ".getDefaultViewCaptureTo" + "()");
                        } else if (eval(Alpaca.Router.ModuleFullName + ".getDefaultViewCaptureTo")) {
                            view.CaptureTo = eval(Alpaca.Router.ModuleFullName + ".getDefaultViewCaptureTo" + "()");
                        } else {
                            if (view.UseLayout) {
                                view.CaptureTo = Alpaca.ViewModel.getDefaultViewCaptureTo(this);
                            } else {
                                view.CaptureTo = Alpaca.ViewModel.getDefaultLayoutCaptureTo(this);
                            }
                        }
                    }

                    //Layout
                    if (view.UseLayout) {
                        //Layout
                        if (!view.Layout) {
                            if (eval(Alpaca.Router.ControllerFullName + ".getDefaultLayout")) {
                                view.setLayout(eval(Alpaca.Router.ControllerFullName + ".getDefaultLayout" + "(view.Layout)"));
                            } else if (eval(Alpaca.Router.ControllerFullName + ".getDefaultLayout")) {
                                view.setLayout(eval(Alpaca.Router.ModuleFullName + ".getDefaultLayout" + "(view.Layout)"));
                            } else {
                                view.setLayout(Alpaca.ViewModel.getDefaultLayout(view.Layout));
                            }
                        }

                        //Layout - Template
                        if (!view.Layout.Template) {
                            if (eval(Alpaca.Router.ControllerFullName + ".getDefaultLayoutTemplate")) {
                                view.Layout.Template = eval(Alpaca.Router.ControllerFullName + ".getDefaultLayoutTemplate" + "()");
                            } else if (eval(Alpaca.Router.ModuleFullName + ".getDefaultLayoutTemplate")) {
                                view.Layout.Template = eval(Alpaca.Router.ModuleFullName + ".getDefaultLayoutTemplate" + "()");
                            } else {
                                view.Layout.Template = Alpaca.ViewModel.getDefaultLayoutTemplate();
                            }
                        }

                        //Layout- CaptureTo
                        if (!view.Layout.CaptureTo) {
                            if (eval(Alpaca.Router.ControllerFullName + ".getDefaultLayoutCaptureTo")) {
                                view.Layout.CaptureTo = eval(Alpaca.Router.ControllerFullName + ".getDefaultLayoutCaptureTo" + "()");
                            } else if (eval(Alpaca.Router.ModuleFullName + ".getDefaultLayoutCaptureTo")) {
                                view.Layout.CaptureTo = eval(Alpaca.Router.ModuleFullName + ".getDefaultLayoutCaptureTo" + "()");
                            } else {
                                view.Layout.CaptureTo = Alpaca.ViewModel.getDefaultLayoutCaptureTo();
                            }
                        }
                    }

                    if (view.Final == false) {
                        //执行控制器onDisplay方法，如果该方法存在
                        if (eval(Alpaca.Router.ControllerFullName + ".onDisplay")) {
                            view = eval(Alpaca.Router.ControllerFullName + ".onDisplay" + "(view)");
                        }
                    }

                    if (view.Final == false) {
                        //执行模块onDisplay方法，如果该方法存在
                        if (eval(Alpaca.Router.ModuleFullName + ".onDisplay")) {
                            view = eval(Alpaca.Router.ModuleFullName + ".onDisplay" + "(view)");
                        }
                    }

                    return view;
                },

                release: function () {

                    //执行控制器release方法，如果该方法存在
                    if (eval(Alpaca.Router.ModuleFullName) && eval(Alpaca.Router.ControllerFullName) && eval(Alpaca.Router.ControllerFullName + ".release")) {
                        eval(Alpaca.Router.ControllerFullName + ".release" + "()");
                    } else {
                        eval("Alpaca.AlpacaModule.AlpacaController.release()");
                    }

                    //执行模块release方法，如果该方法存在
                    if (eval(Alpaca.Router.ModuleFullName) && eval(Alpaca.Router.ModuleFullName + ".release")) {
                        eval(Alpaca.Router.ModuleFullName + ".release" + "()");
                    } else {
                        eval("Alpaca.AlpacaModule.release()");
                    }
                },
            };
        },
    },

    ViewModel: {

        DefaultViewCaptureTo: "#content",

        DefaultLayoutCaptureTo: "body",

        TemplatePostfix: 'html',

        getTemplate: function (url) {
            try {
                var tpl = localStorage.getItem(url);
            } catch (e) {
                var tpl = null;
            }

            if (tpl == null) {
                htmlobj = $.ajax({
                    type: "get",
                    url: url,
                    async: false
                });
                tpl     = htmlobj.responseText;
                try {
                    localStorage.setItem(url, tpl);
                } catch (e) {

                }
            }
            return tpl;
        },

        loadData: function (tpl, data) {
            var interText = doT.template(tpl);
            return interText(data);
        },

        show: function (captureTo, html) {
            $(captureTo).html(html);
            this.onLoad();
            return true;
        },

        onLoad: function () {
        },

        getDefaultView: function (view) {
            return undefined;
        },

        getDefaultViewCaptureTo: function () {
            return Alpaca.ViewModel.DefaultViewCaptureTo;
        },

        getDefaultViewTemplate: function () {
            return Alpaca.config.baseUrl + Alpaca.Router.Module + "/view/" + Alpaca.Router.Controller + "/" + Alpaca.Router.Action + "." + Alpaca.ViewModel.TemplatePostfix;
        },

        getDefaultLayout: function (layout) {
            return new View();
        },

        getDefaultLayoutTemplate: function () {
            return Alpaca.config.baseUrl + Alpaca.Router.Module + "/view/layout/layout." + Alpaca.ViewModel.TemplatePostfix;
        },

        getDefaultLayoutCaptureTo: function () {
            return Alpaca.ViewModel.DefaultLayoutCaptureTo;
        },

        layout: function (name) {
            var view = new View();
            if (!name) {
                name = "layout";
            }
            view.setCaptureTo(Alpaca.ViewModel.DefaultLayoutCaptureTo);
            view.setTemplate(Alpaca.config.baseUrl + Alpaca.Router.Module + "/view/layout/" + name + "." + Alpaca.ViewModel.TemplatePostfix);
            return view;
        },

        part: function (name, captureTo) {
            var view = new View();
            if (!name) {
                name = "part";
            }
            if (!captureTo) {
                captureTo = name;
            }

            view.setTemplate(Alpaca.config.baseUrl + Alpaca.Router.Module + "/view/layout/part/" + name + "." + Alpaca.ViewModel.TemplatePostfix);
            view.setCaptureTo(captureTo);
            return view;
        },

        child: function (name, captureTo) {
            var view = new View();
            if (!name) {
                name = "part";
            }
            if (!captureTo) {
                captureTo = name;
            }

            view.setTemplate(Alpaca.config.baseUrl + Alpaca.Router.Module + "/view/layout/part/" + name + "." + Alpaca.ViewModel.TemplatePostfix);
            view.setCaptureTo(captureTo);
            return view;
        },

        create: function (data) {
            return {
                CaptureTo: null,
                EnableView: true,
                Template: '',
                UseLayout: false,
                Final: false,
                Data: data,
                Layout: null,
                LayoutData: null,
                Children: new Array(),
                ChildrenData: new Array(),
                LoadEvent: new Array(),
                ReadyEvent: new Array(),
                getTemplate: Alpaca.ViewModel.getTemplate,
                loadData: Alpaca.ViewModel.loadData,
                show: Alpaca.ViewModel.show,

                disableView: function () {
                    this.EnableView = false;
                    return this;
                },

                enableView: function () {
                    this.EnableView = true;
                    return this;
                },

                setData: function (data) {
                    if(this.Data == null){
                        this.Data = data;
                    }else{
                        for (var i in data) {  // jshint ignore:line
                            this.Data[i] = data[i];
                        }
                    }
                    return this;
                },

                setCaptureTo: function (captureTo) {
                    this.CaptureTo = captureTo;
                    return this;
                },

                setTemplate: function (template) {
                    this.Template = template;
                    return this;
                },

                setUseLayout: function (value) {
                    this.UseLayout = Boolean(value);
                    if (value && !this.Layout) {
                        this.setLayout(Alpaca.ViewModel.layout());
                    }
                    return this;
                },

                setFinal: function (value) {
                    this.Final = Boolean(value);
                    return this;
                },

                setLayout: function (layout) {
                    this.Layout = layout;
                    this.Layout.addChild(this);
                    this.UseLayout = true;
                    return this;
                },

                setLayoutData: function (data) {

                    if(this.LayoutData == null){
                        this.LayoutData = data;
                    }else{
                        for (var i in data) {  // jshint ignore:line
                            this.LayoutData[i] = data[i];
                        }
                    }

                    if (this.Layout) {
                        this.Layout.setData(data);
                    }
                    return this;
                },

                setLayoutCaptureTo: function (captureTo) {
                    this.Layout.CaptureTo = captureTo;
                    return this;
                },

                setLayoutTemplate: function (template) {
                    this.Layout.Template = template;
                    return this;
                },

                addPart: function (part, captureTo) {
                    if (captureTo) {
                        part.setCaptureTo(captureTo);
                    }
                    this.Layout.addChild(part);
                    return this;
                },

                addChild: function (child, captureTo) {

                    if (captureTo) {
                        child.setCaptureTo(captureTo);
                    }

                    this.Children.push(child);
                    return this;
                },

                setChildData: function (child, data) {
                    this.Children.push(child);
                    return this;
                },

                hasChildren: function () {
                    return (0 < (this.Children).length);
                },

                setFuncGetTemplate: function (func) {
                    this.getTemplate = func;
                    return this;
                },

                setFuncLoadData: function (func) {
                    this.loadData = func;
                    return this;
                },

                setFuncShow: function (func) {
                    this.show = func;
                    return this;
                },

                bind: function (event, func) {
                    if (!this.Events[event]) {
                        this.Events[event] = new Array();
                    }
                    this.Events[event].push(func);
                    return this;
                },

                load:function(func){
                    this.LoadEvent.push(func);
                    return this;
                },

                ready: function (func) {
                    this.ReadyEvent.push(func);
                    return this;
                },

                onReady: function () {
                    if (this.ReadyEvent) {
                        for (var index in this.ReadyEvent) {
                            this.ReadyEvent[index](this);
                        }
                    }
                    return this;
                },

                onLoad: function () {
                    if (this.LoadEvent) {
                        for (var index in this.LoadEvent) {
                            this.LoadEvent[index](this);
                        }
                    }
                    this.onReady();
                    return this;
                },

                childRender: function (view) {
                    if (view.hasChildren) {
                        for (var index in view.Children) {
                            view.Children[index].render();
                        }
                    }
                },

                render: function () {

                    this.load(this.childRender);

                    var tpl = this.getTemplate(this.Template);

                    var html = this.loadData(tpl, this.Data);

                    var show = this.show(this.CaptureTo, html);

                    return html;
                },

                display: function () {

                    if (!this.EnableView) {
                        return;
                    }

                    if (this.Layout && this.UseLayout) {
                        if(this.LayoutData){
                            if(!this.Layout.Data){
                                this.Layout.Data = {};
                            }
                            for(var index in this.LayoutData){
                                this.Layout.Data[index] = this.LayoutData[index];
                            }
                        }
                        this.Layout.render();
                    } else {
                        this.render();
                    }
                    return;
                },
            };
        },
    },

    AlpacaModule: {

        init: function () {
            //console.log("AlpacaModule init");
        },

        release: function () {
            //console.log("AlpacaModule release");
        },

        AlpacaController: {

            init: function () {
                //console.log("AlpacaModule AlpacaController init");
            },

            release: function () {
                //console.log("AlpacaModule AlpacaController release");
            },

            indexAction: function () {
                alert("This is index action !");
            },

            actionNotFoundAction: function () {
                alert("The action is not found !");
            },

            controllerNotFoundAction: function () {
                alert("The controller is not found !");
            },

            moduleNotFoundAction: function () {
                alert("The module is not found !");
            },
        },
    },

    IndexModule: {
        IndexController: {
            indexAction: function () {
                document.write("Welcome to use Alpaca SPA.");
            },
        },
    },
}

var View = Alpaca.ViewModel.create;

var ViewLayout = Alpaca.ViewModel.layout;

var ViewPart = Alpaca.ViewModel.part;

//The following is doT.js
//2011-2014, Laura Doktorova, https://github.com/olado/doT
//Licensed under the MIT license.

(function () {
    "use strict";

    var doT = {
        version: "1.0.3",
        templateSettings: {
            evaluate: /<\?spa \s*([\s\S]+?(\}?)+) \s*\?>/g,
            interpolate: /<\?spa echo ([\s\S]+?) \?>/g,
            encode: /\{\{!([\s\S]+?)\}\}/g,
            use: /\{\{#([\s\S]+?)\}\}/g,
            useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
            define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
            defineParams: /^\s*([\w$]+):([\s\S]+)/,
            conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
            iterate: /<\?spa \s*foreach\(\s*([\s\S]+?)\s*as\s*([\w$]+)\s*(?:=>\s*([\w$]+))?\s*\)(|:) \s*\?>/g,
            endIterate: /<\?spa \s*endForeach(|;) \s*\?>/g,
            for: /<\?spa for\(\s*var\s*([\s\S]+?)\s*in\s*([\s\S]+?)\s*\) \s*\?>/g,
            endFor: /<\?spa \s*endFor(|;) \s*\?>/g,
            varname: "it",
            strip: true,
            append: true,
            selfcontained: false,
            doNotSkipEncoded: false
        },
        template: undefined, //fn, compile template
        compile: undefined  //fn, for express
    }, _globals;

    doT.encodeHTMLSource = function (doNotSkipEncoded) {
        var encodeHTMLRules = {"&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;"},
            matchHTML       = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
        return function (code) {
            return code ? code.toString().replace(matchHTML, function (m) {
                return encodeHTMLRules[m] || m;
            }) : "";
        };
    };

    _globals = (function () {
        return this || (0, eval)("this");
    }());

    if (typeof module !== "undefined" && module.exports) {
        module.exports = doT;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return doT;
        });
    } else {
        _globals.doT = doT;
    }

    var startend = {
        append: {start: "'+(", end: ")+'", startencode: "'+encodeHTML("},
        split: {start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML("}
    }, skip      = /$^/;

    function resolveDefs(c, block, def) {
        return ((typeof block === "string") ? block : block.toString())
            .replace(c.define || skip, function (m, code, assign, value) {
                if (code.indexOf("def.") === 0) {
                    code = code.substring(4);
                }
                if (!(code in def)) {
                    if (assign === ":") {
                        if (c.defineParams) value.replace(c.defineParams, function (m, param, v) {
                            def[code] = {arg: param, text: v};
                        });
                        if (!(code in def)) def[code] = value;
                    } else {
                        new Function("def", "def['" + code + "']=" + value)(def);
                    }
                }
                return "";
            })
            .replace(c.use || skip, function (m, code) {
                if (c.useParams) code = code.replace(c.useParams, function (m, s, d, param) {
                    if (def[d] && def[d].arg && param) {
                        var rw        = (d + ":" + param).replace(/'|\\/g, "_");
                        def.__exp     = def.__exp || {};
                        def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
                        return s + "def.__exp['" + rw + "']";
                    }
                });
                var v = new Function("def", "return " + code)(def);
                return v ? resolveDefs(c, v, def) : v;
            });
    }

    function unescape(code) {
        return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
    }

    doT.template = function (tmpl, c, def) {
        c                                                                          = c || doT.templateSettings;
        var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
            str                                                                    = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

        str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, " ")
            .replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, "") : str)
            .replace(/'|\\/g, "\\$&")
            .replace(c.interpolate || skip, function (m, code) {
                return cse.start + unescape(code) + cse.end;
            })
            .replace(c.encode || skip, function (m, code) {
                needhtmlencode = true;
                return cse.startencode + unescape(code) + cse.end;
            })
            .replace(c.conditional || skip, function (m, elsecase, code) {
                return elsecase ?
                    (code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
                    (code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
            })
            .replace(c.iterate || skip, function (m, iterate, iname, vname) {
                if (!iterate) return "';} } out+='";
                sid += 1;
                indv    = iname || "i" + sid;
                iterate = unescape(iterate);
                return "';var arr" + sid + "=" + iterate + ";if(arr" + sid + "){var " + vname + "," + indv + "=-1,l" + sid + "=arr" + sid + ".length-1;while(" + indv + "<l" + sid + "){"
                    + vname + "=arr" + sid + "[" + indv + "+=1];out+='";
            })
            .replace(c.endIterate || skip, function () {
                return "';} } out+='";
            })
            .replace(c.for || skip, function (m, key, iterate) {
                return "';for(var " + key + " in " + iterate + "){;out+='";
            })
            .replace(c.endFor || skip, function () {
                return "'; } out+='";
            })
            .replace(c.evaluate || skip, function (m, code) {
                return "';" + unescape(code) + "out+='";
            })
        + "';return out;")
            .replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r")
            .replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");
        //.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');
        if (needhtmlencode) {
            if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = doT.encodeHTMLSource(c.doNotSkipEncoded);
            str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
                + doT.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));"
                + str;
        }
        try {
            return new Function(c.varname, str);
        } catch (e) {
            if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
            throw e;
        }
    };

    doT.compile = function (tmpl, def) {
        return doT.template(tmpl, null, def);
    };
}());

window.onhashchange = Alpaca.changeHash;

//Alpaca  extend
Alpaca.extend(Alpaca,{
    getUrlVars: function () {
        var vars   = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = decodeURI(hash[1]);
        }
        return vars;
    },

    getUrlVar: function (name) {
        return Alpaca.getUrlVars()[name];
    },

    //获取滚动条当前的位置
    getScrollTop: function () {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        }
        else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    },

    //获取当前可视范围的高度
    getClientHeight: function () {
        var clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
        }
        else {
            clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        }
        return clientHeight;
    },

    //获取文档完整的高度
    getScrollHeight: function () {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    },

    setCookie: function (name, value) {
        var Days = 30; //此 cookie 将被保存 30 天
        var exp  = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    ///删除cookie
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    //读取cookie
    getCookie: function (name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null)
            return unescape(arr[2]);
        return 99;
    }
});

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents        = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag          = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
};

var DropDown = {
    mouseDown: function (event) {
        this.start = event.pageY;
        $(this).bind("mousemove", this.move);
        $(this).bind("mouseup", this.up);
    },
    mouseMove: function (event) {
        if (this.origin > $("#id-content").offset().top) {
            return;
        }

        var move = parseFloat(event.pageY) - parseFloat(this.start);
        if (move > 0 && move < this.max) {
            this.content.css({position: "relative", top: move / 2,});
        }
    },
    mouseUp: function (event) {
        this.content.animate({top: 0});
        $(this).unbind("mousemove", this.move);
        $(this).unbind("mouseup", this.up);
        var move = parseFloat(event.pageY) - parseFloat(this.start);
        if (move > this.space) {
            this.onUp();
        }
    },

    touchDown: function (event) {
        var touch     = event.originalEvent.targetTouches[0];
        this.distance = 0;
        this.baseTop  = this.content.offset().top;
        this.start    = touch.pageY;
        $(this).bind("touchmove", this.move);
        $(this).bind("touchend", this.up);
    },
    touchMove: function (event) {
        if (this.origin > $("#id-content").offset().top) {
            return;
        }

        var touch = event.originalEvent.targetTouches[0];
        var move  = parseFloat(touch.pageY) - parseFloat(this.start);
        if (move > 0) {
            event.preventDefault();
        }
        this.distance = move;
        var newTop    = (parseFloat(this.origin) + move);
        var offset    = new Object();
        offset.top    = this.baseTop + newTop;
        if (move > this.min && move < this.max) {
            this.content.css({position: "relative", top: move / 2,});
        }
    },
    touchUp: function (event) {
        this.content.animate({top: 0});
        $(this).unbind("touchmove", this.move);
        $(this).unbind("touchend", this.up);
        if (this.distance > this.space) {
            this.onUp();
        }
    },

    down: null,
    move: null,
    up: null,

    bind: function (ground) {
        var _ground = ground;

        if (!_ground.direction) {
            _ground.direction = 'down';
        }
        if (!_ground.min) {
            _ground.min = 0;
        }

        if (_ground.direction == 'down' || _ground.direction == 'up') {
            if (!_ground.max) {
                _ground.max = ($(document).height() * 0.382);
            }
        } else {
            if (!_ground.max) {
                _ground.max = ($(document).Width() * 0.382);
            }
        }

        if (IsPC()) {
            this.down = this.mouseDown;
            this.up   = this.mouseUp;
            this.move = this.mouseMove;
        } else {
            this.down = this.touchDown;
            this.up   = this.touchUp;
            this.move = this.touchMove;
        }

        if (!_ground.space) {
            _ground.space = 100;
        }

        _ground[0].content   = _ground.move;
        _ground[0].min       = _ground.min;
        _ground[0].max       = _ground.max;
        _ground[0].down      = this.down;
        _ground[0].up        = this.up;
        _ground[0].move      = this.move;
        _ground[0].origin    = parseFloat(_ground[0].content.offset().top);
        _ground[0].direction = _ground.direction;
        _ground[0].space     = _ground.space;
        _ground[0].onUp      = _ground.onUp;

        if (IsPC()) {
            _ground.bind("mousedown", _ground[0].down);
        } else {
            _ground.bind("touchstart", _ground[0].down);
        }
    },
};
/*
 *插件作者:周祥
 *发布时间:2014年12月12日
 *插件介绍:图片上传本地预览插件 兼容浏览器(IE 谷歌 火狐) 不支持safari 当然如果是使用这些内核的浏览器基本都兼容
 *插件网站:http://jquery.decadework.com
 *作  者QQ:200592114
 *使用方法:
 *界面构造(IMG标签外必须拥有DIV 而且必须给予DIV控件ID)
 * <div id="imgdiv"><img id="imgShow" width="120" height="120" /></div>
 * <input type="file" id="up_img" />
 *调用代码:
 * new uploadPreview({ UpBtn: "up_img", DivShow: "imgdiv", ImgShow: "imgShow" });
 *参数说明:
 *UpBtn:选择文件控件ID;
 *DivShow:DIV控件ID;
 *ImgShow:图片控件ID;
 *Width:预览宽度;
 *Height:预览高度;
 *ImgType:支持文件类型 格式:["jpg","png"];
 *callback:选择文件后回调方法;

 *版本:v1.4
 更新内容如下:
 1.修复回调.

 *版本:v1.3
 更新内容如下:
 1.修复多层级框架获取路径BUG.
 2.去除对jquery插件的依赖.
 */

/*
 *author:周祥
 *date:2014年12月12日
 *work:图片预览插件
 */
var uploadPreview = function (setting) {
    /*
     *author:周祥
     *date:2014年12月11日
     *work:this(当前对象)
     */
    var _self = this;
    /*
     *author:周祥
     *date:2014年12月11日
     *work:判断为null或者空值
     */
    _self.IsNull = function (value) {
        if (typeof (value) == "function") {
            return false;
        }
        if (value == undefined || value == null || value == "" || value.length == 0) {
            return true;
        }
        return false;
    }
    /*
     *author:周祥
     *date:2014年12月11日
     *work:默认配置
     */
    _self.DefautlSetting = {
        UpBtn: "",
        DivShow: "",
        ImgShow: "",
        Width: 100,
        Height: 100,
        ImgType: ["gif", "jpeg", "jpg", "bmp", "png", "txt", "rp"],
        ErrMsg: "选择文件错误,图片类型必须是(gif,jpeg,jpg,bmp,png)中的一种",
        callback: function () {
        }
    };
    /*
     *author:周祥
     *date:2014年12月11日
     *work:读取配置
     */
    _self.Setting = {
        UpBtn: _self.IsNull(setting.UpBtn) ? _self.DefautlSetting.UpBtn : setting.UpBtn,
        DivShow: _self.IsNull(setting.DivShow) ? _self.DefautlSetting.DivShow : setting.DivShow,
        ImgShow: _self.IsNull(setting.ImgShow) ? _self.DefautlSetting.ImgShow : setting.ImgShow,
        Width: _self.IsNull(setting.Width) ? _self.DefautlSetting.Width : setting.Width,
        Height: _self.IsNull(setting.Height) ? _self.DefautlSetting.Height : setting.Height,
        ImgType: _self.IsNull(setting.ImgType) ? _self.DefautlSetting.ImgType : setting.ImgType,
        ErrMsg: _self.IsNull(setting.ErrMsg) ? _self.DefautlSetting.ErrMsg : setting.ErrMsg,
        callback: _self.IsNull(setting.callback) ? _self.DefautlSetting.callback : setting.callback
    };
    /*
     *author:周祥
     *date:2014年12月11日
     *work:获取文本控件URL
     */
    _self.getObjectURL = function (file) {
        var url = null;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
    /*
     *author:周祥
     *date:2014年12月11日
     *work:绑定事件
     */
    _self.Bind = function () {
        document.getElementById(_self.Setting.UpBtn).onchange = function () {
            if (this.value) {
                if (!RegExp("\.(" + _self.Setting.ImgType.join("|") + ")$", "i").test(this.value.toLowerCase())) {
                    alert(_self.Setting.ErrMsg);
                    this.value = "";
                    return false;
                }
                if (navigator.userAgent.indexOf("MSIE") > -1) {
                    try {
                        document.getElementById(_self.Setting.ImgShow).src = _self.getObjectURL(this.files[0]);
                    } catch (e) {
                        var div = document.getElementById(_self.Setting.DivShow);
                        this.select();
                        top.parent.document.body.focus();
                        var src = document.selection.createRange().text;
                        document.selection.empty();
                        document.getElementById(_self.Setting.ImgShow).style.display        = "none";
                        div.style.filter                                                    = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                        div.style.width                                                     = _self.Setting.Width + "px";
                        div.style.height                                                    = _self.Setting.Height + "px";
                        div.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = src;
                    }
                } else {
                    document.getElementById(_self.Setting.ImgShow).src = _self.getObjectURL(this.files[0]);
                }
                _self.Setting.callback(this.files[0]);
            }
        }
    }
    /*
     *author:周祥
     *date:2014年12月11日
     *work:执行绑定事件
     */
    _self.Bind();
}

/*
 *author:ChengCheng
 *date:2016年12月11日
 *work:暂停
 */
function sleep(time) {
    for (var t = Date.now(); Date.now() - t <= time;);
}