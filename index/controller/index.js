/* 1 定义Index模块中的IndexController */
Alpaca.IndexModule.IndexController = {
	//index动作，创建一个视图
	indexAction : function (){
		//视图默认渲染到#content位置，可以通过参数中传递to字段改变渲染位置
		//视图模板默认位于index/view/index/index.html,可以通过参数中传递template字段改变模块路径
		//即：默认模板位置为：[模块名]/view/[控制器名]/[动作名].html
		var view = new Alpaca.View();

		//视图渲染完成后执行ready方法。
		view.ready(function () {
			console.log('视图渲染完成了...');
		});

		return view;
	},

	//test，测试layout。layout视图默认渲染到body位置, 默认layout文件路径是view/layout/layout.html
	testAction : function (){

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
};