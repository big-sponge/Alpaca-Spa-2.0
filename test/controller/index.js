/* 1 定义Test模块中的InitController ,并且定义两个action方法，test3，test4*/
Alpaca.TestModule.IndexController = {

	//index,  默认渲染到
	indexAction : function (){
		//视图默认渲染到#content位置，可以通过to对象改变渲染位置
		var view = new Alpaca.View({to:"body"});
		view.ready(function(){

		});
		return view;
	},

	//test1，测试layout，layout视图默认渲染到 body位置, 默认layout文件路径是view/layout/layout.html
	test1Action : function (){

		//视图
		var view = new Alpaca.View();

		//layout 布局视图
		var layout = new Alpaca.Layout();

		//part 部件视图，默认路由位于view/layout/part中，文件名默认与name属性相同
		//part 的默认渲染位置与其name属性相同，当然也可以通过to属性指定
		var part = new Alpaca.Part({name:'leftMenu'});

		//将part添加到layout中，part的默认渲染位置与其name属性相同，也可以通过to属性指定
		layout.addChild(part);

		//设置视图的layout
		view.setLayout(layout);

		//在view中，向layout中传递数据
		view.setLayoutData({'layoutData':666});

		//在view中，向part中传递数据
		view.setPartData({leftMenu:{'partData':888}});

		return view;
	},

	//test1，改变view的默认配置
	test2Action : function (){

		//视图，view对应的魔板默认与action同名
		//var view = new Alpaca.View();

		//可以通过 template 属性重新指定模板路径
		//var view = new Alpaca.View({template:"/test2-other",to:"body"});

		//可以通过设置from 属性，重新指定模板的来源位页面的dom元素
		//与Alpaca.Tpl()类似
		var view = new Alpaca.View({from:"#template",to:"#content"});
		return view;
	},

};