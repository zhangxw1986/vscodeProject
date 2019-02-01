PJF.spa.registerPage("schedule", {
    data: function () {
        return {
            //保存服务单号的值
            serviceId:"",  //对应orderNam
            //保存系统英文简称的值
            systemEn:"",  //appSys
            //保存所选工单类型的值
            workType:"",   //orderTypeId
            //
            saveGetType:3,   //getType
            saveGetTaskStatus:3,

        	userId: this.$route.params.userId,
	        workTypeOPtions: [],
        	workTypeWindow: false, 
        	  //状态占位
            virtualstatusName:"请选择",
            //事项类别选择占位
            virtualmatterName:'全部工单',
            matterWindow:false,
            matterOPtions:[{
                name:"全部工单",
                getType:3,
                getTaskStatus:3
            },{
                name:"个人待办",
                getType:0,
                getTaskStatus:""
            },{
                name:"组内待办",
                getType:1,
                getTaskStatus:""
            },{
                name:"个人已办",
                getType:0,
                getTaskStatus:2
            },{
                name:"组内已办",
                getType:1,
                getTaskStatus:2
            }], 
        	//-------------------------------------------       
            rightBtnData:{
                
                text: "查询"
            },
            isShow:false,
             //选项卡名称
            tabarTitles: ["个人待办","组内待办","个人已办","组内已办"],
            tabarActiveIndex: 0 ,
            //所有table数据         
            perDataList: [],          
            //工单信息窗口控制显示
            backlogWorkSheetWindowIsShow:false,
            backlogCzWindowIsShow:false,
            //talbes title配置
            tablesTitles:[
                  {width: "1.8rem", title: "服务请求id"},
                  {width: "1.8rem", title: "所属系统"},
                  {width: "3rem", title: "概述"},
                  {width: "1.8rem", title: "当前环节"},
                  {width: "2rem", title: "工单类型"},
                  {width: "2.5rem", title: "所属数据中心"},
                 
                  {width: "1.5rem", title: "紧急程度"},
                  {width: "1.5rem", title: "创建人"},
                  {width: "2.5rem", title: "创建时间"},
                  {width: "1.5rem", title: "处理人"},
                  {width: "1.5rem", title: "状态"}
            ],
            nd: "",
            orderId:"",
            orderName:"",
    		appSys:"",    		
    		orderTypeId:"",
            currentPage:1,
            perNum:0,
            groupNum:0,
            perDoNum:0,
            groupDoNum:0,
            getType:"",
            getTaskStatus:"", 
            classB:[true,false,false,false],
            workSheetRow:[],
        }
    },
    methods: { 
        matterChoose(value){
            this.matterWindow = !this.matterWindow;
            this.virtualmatterName = value.name;
            this.saveGetType = value.getType;
            this.saveGetTaskStatus = value.getTaskStatus;
        },

        //事项类别显示
        matterShow(){
           this.matterWindow = true;
        },
    	emptyval:function(){
    		this.workType = "";
    		this.virtualstatusName = "请选择"
    	},
    	reset:function(){
    		this.serviceId = "";
    		this.systemEn = "";
    		this.workType = "";
    		this.virtualstatusName = "请选择";
            this.virtualmatterName = '全部工单';
            this.saveGetType = 3;
            this.saveGetTaskStatus = 3;
    	},
    	finding:function(){
    		this.isShow = !this.isShow;
            this.classB = [false,false,false,false];
            this.currentPage=1;
            this.orderName = this.serviceId;
            this.appSys = this.systemEn;
            this.orderTypeId = this.workType;
            this.getType=this.saveGetType;
            this.getTaskStatus=this.saveGetTaskStatus;
    		this.getBmTodoAct(this.getType,this.getTaskStatus);
    	},
    	workTypeChoose(name,id){
    		this.workTypeWindow = !this.workTypeWindow;
    		this.virtualstatusName = name;
            this.workType = id;
    	},
    	//工单类型控制
        workTypeShow:function(){
            this.workTypeWindow = !this.workTypeWindow;
        },
    	//----------------------------------------------
    	 //子系统下拉刷新
        loadBottomlistPer:function(){
            this.currentPage++;
            if(this.currentPage<=this.perPageCount){
                this.getBmTodoAct(this.getType,this.getTaskStatus);
            }else{
                PJF.ui.toast({message: "数据加载完毕"});
            }
         	this.$refs.loadmorePer.onBottomLoaded();
        },       
        loadToplistPer:function(){
        	this.currentPage=1;
        	this.getBmTodoAct(this.getType,this.getTaskStatus);
        	this.$refs.loadmorePer.onTopLoaded();
        },
    	//table数据
    	getBmTodoAct:function(type,taskStatus){    		
    		PJF.ui.loading.show();//loading 图标
    		
        	var jsonData = {
		    	currentPage:this.currentPage,
		    	pageSize:10,
		    	orderField:"createTime",
		    	orderType:"desc",
		    	params:{
		    		type:type,
		    		orderName:this.orderName,
		    		appSys:this.appSys,
		    		taskStatus:taskStatus,
		    		orderTypeId:this.orderTypeId
		    	}	    	
		    };
		    jsonData = JSON.stringify(jsonData);

		    var data = {
		    	_search: false,
		    	nd: this.nd,
		    	rows: 10,
		    	page:  1,
		    	sidx: "createTime",
		    	sord: "desc",
		    	_fw_service_id: "getTodoUserListSrv",
		    	jsonData: jsonData,
		    	jsonClass: "com.ccb.iomp.openframework.common.PaginationParam"
		    };
		    var _this = this;
    		$.ajax({
                url: "/iomp-cloud-web/pages/todo/getBmTodoAct.action",
                type: 'post',
                dataType: 'json',
                data: data,
                cache: true,
                success: function (data) {
                	PJF.ui.loading.hide();
                	_this.perPageCount = data.pageCount                	
                    if(_this.currentPage ==1){
                       _this.perDataList = [];               
	                   _this.perDataList = _this.getBmTodoActResponse(data.data);
                    }else{
                        _this.perDataList =_this.perDataList.concat(_this.getBmTodoActResponse(data.data)) 
                    };
                },

                error: function (err) {
                	PJF.ui.loading.hide();
                    PJF.ui.toast({message: "网络错误"});
                }
            });
    	},

    	//table生成
    	getBmTodoActResponse:function(data){
    		var newDataList = [];
    		for(var i = 0; i < data.length; i++){
    			if(data[i].todoName=="CreatorRedo"){
    				data[i].todoName="提交服务申请"
	    		}
    			var row = [];
				row[0] = data[i].orderId || "";
				row[1] = data[i].appName || "";
				row[2] = data[i].summary ||"";
				row[3] = data[i].todoName|| "";
				row[4] = data[i].orderTypeName||"";
				row[5] = data[i].datacenterName||"";
				row[6] = data[i].urgencyLevel ||"";				
				row[7] = data[i].createUserName|| "";
				row[8] = data[i].tocreateDate ||"";				
				row[9] = data[i].currentUserName|| "";
				row[10] = data[i].todoStatus|| "";

    			newDataList.push(row)
    		}
    		return newDataList
    	},

    	//请求类型
    	getOrderTypeTreeAct:function(){
    		var _this = this;
        	PJF.ui.loading.show();
    		$.ajax({
                url: "/iomp-cloud-web/wfdcm/getOrderTypeTreeAct.action",
                type: 'get',
                dataType: 'json',
                data: {
	    			_fw_service_id: "getOrderTypeTreeSrv",
	    			isAll: 0
	    		},
                cache: true,
                success: function (data) { 
                	PJF.ui.loading.hide();
                	_this.workTypeOPtions = data;
                },
                error: function (err) {
                	PJF.ui.loading.hide();
                    PJF.ui.toast({message: "网络错误"});
                    PJF.router.push({
                    	name: "scheduleLogin"
                    })
                }
            });
    	}, 

    	//请求总条数
    	getBmTodoActTotalCount:function(){
    		var _this = this;
        	PJF.ui.loading.show();
    		$.ajax({
                url: "/iomp-cloud-web/pages/todo/getBmTodoAct.action",
                type: 'POST',
                dataType: 'json',
                data: {
	    			_fw_service_id: "getTaskCountSrv",
	    			userId: _this.userId
	    		},
                cache: true,
                success: function (data) { 
                	PJF.ui.loading.hide();
                	data=JSON.parse(data);    
            	  	_this.perNum=data.p_task;
            	  	_this.groupNum=data.g_task;
            	  	_this.perDoNum=data.p_tasked;
            	  	_this.groupDoNum=data.g_tasked;
                },
                error: function (err) {
                	PJF.ui.loading.hide();
                    //PJF.ui.toast({message: "网络错误"});
                    PJF.router.push({
                    	name: "scheduleLogin"
                    })
                }
            });
    	}, 	

        PerRowClick:function(row){
        	//行选择
        	console.info(arguments)
        	console.info(row)
        	console.info(row.__ob__.dep.subs[1].vm.$el.children[0].children[0].children[0])
        	var rowNum = arguments[2] + 1;
        	row.__ob__.dep.subs[1].vm.$el.children[0].children[0].children[rowNum].className = "menglingqing"
        	row.__ob__.dep.subs[1].vm.$el.children[1].children[0].children[rowNum].className = "menglingqing"
        	this.workSheetRow=row; 
        	if(this.getTaskStatus==""){
        		//处理操作按钮
        		this.backlogCzWindowIsShow=!this.backlogCzWindowIsShow;
        	}else{
        		this.backlogWorkSheetWindowIsShow=!this.backlogWorkSheetWindowIsShow;
        	}
        },

        backClick: function () {
            var ret = PJF.client.webview.getID();
            PJF.client.webview._close(ret.result.webviewID, ret.result.creatorID);
        },

         //跳转工单信息页
        tobacklogWorkSheetInfo:function(){
        	PJF.router.push({
                name: "scheduleWorksheet",
		        params: {
		            workSheetRow:this.workSheetRow
		        }
            });        	
	        this.backlogWorkSheetWindowIsShow = false;
        },	

	    perDogetDataList:function(type,taskStatus,num){
            this.currentPage=1;
            this.orderName = "";
            this.appSys = "";
            this.orderTypeId = "";
            if(this.classB[num]){
                this.classB=[false,false,false,false];
                this.getType = 3;
                this.getTaskStatus = 3;
                this.getBmTodoAct(3,3); 
            }else{
                //this.reset();
                this.classB=[false,false,false,false];
                this.classB[num]=true;
                this.getType=type;
                this.getTaskStatus=taskStatus;
                this.getBmTodoAct(type,taskStatus);  
            }
	    },

		initPage:function(){
        	var initTime = new Date();
	    	this.nd = initTime.getTime();
	    	var sTime = Math.floor(this.nd - 604800000);
	    	var startTime = new Date(sTime);
	    	var eTime = Math.floor(this.nd + 604800000);
	    	var endTime = new Date(eTime);
	    	this.startTime = PJF.client.storage.sessionGet("startTime") || PJF.util.formatDate(startTime, 'yyyy-MM-dd hh:mm:ss');
	    	this.endTime = PJF.client.storage.sessionGet("endTime") || PJF.util.formatDate(endTime, 'yyyy-MM-dd hh:mm:ss');
        	PJF.client.storage.sessionSet("startTime",this.startTime,true);
        	PJF.client.storage.sessionSet("endTime",this.endTime,true);
        },

    },
    rendered: function(){
    	if(this.workTypeOPtions.length == 0){
    		this.initPage();
	    	this.getOrderTypeTreeAct();
	    	this.getBmTodoActTotalCount();
	    	this.perDogetDataList(0,'',0);
	    	//this.getBmTodoAct(0,"",this.perCurrentPage);
	    	//this.getBmTodoAct(1,"",this.groupCurrentPage);
	    	//this.getBmTodoAct(0,2,this.perDoCurrentPage);
	    	//this.getBmTodoAct(1,2,this.groupDoCurrentPage);
    	}    	
    }
});


