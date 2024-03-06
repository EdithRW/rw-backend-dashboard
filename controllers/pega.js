const User = require('../models/user');
const Case = require('../models/case');
const { response } = require ('express');

const bcrypt = require('bcryptjs');
const { signToken } = require('../helpers/jwt');


const cases = [
    {
        caseID: 'C-0001',
        operator: 'John Doe',
        createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // one week ago
        status: 'pending'
      },
      {
        caseID: 'C-0002',
        operator: 'Jane Smith',
        createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // five days ago
        status: 'delivered'
      },
      {
        caseID: 'C-0003',
        operator: 'Alice Johnson',
        createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // three days ago
        status: 'refunded'
      },
      {
        caseID: 'C-0004',
        operator: 'Bob Brown',
        createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // two days ago
        status: 'pending'
      },
      {
        caseID: 'C-0005',
        operator: 'Charlie Green',
        createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // one day ago
        status: 'delivered'
      },
      {
        caseID: 'C-0006',
        operator: 'David White',
        createdAt: Date.now(), // today
        status: 'refunded'
      },
      {
        caseID: 'C-0007',
        operator: 'Eva Lee',
        createdAt: Date.now() - 1.5 * 24 * 60 * 60 * 1000, // one and a half days ago
        status: 'pending'
      },
      {
        caseID: 'C-0008',
        operator: 'Frank Nguyen',
        createdAt: Date.now() - 2.5 * 24 * 60 * 60 * 1000, // two and a half days ago
        status: 'delivered'
      },
      {
        caseID: 'C-0009',
        operator: 'Grace Kim',
        createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000, // four days ago
        status: 'refunded'
      },
      {
        caseID: 'C-0010',
        operator: 'Harry Chen',
        createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000, // six days ago
        status: 'pending'
      },
];

const appDetails = {
	"appAlias": "LEXDev",
	"name": "Mesh-LEXDev",
	"pxObjClass": "Pega-API-ApplicationManagement-Application",
	"statusValue": "OK",
	"version": "01.01.01",
	"builtOnApplications": [
		{
			"name": "Mesh-LEXAUT",
			"pxObjClass": "Embed-DependsOnApplication",
			"version": "01.01.01"
		}
	],
	"components": [
		{
			"name": "TestDataUtility_20211207T182212683",
			"pxObjClass": "Embed-DependsOnApplication",
			"version": "01.01.01"
		},
		{
			"name": "RW_PDFCreation_20220209T210725479",
			"pxObjClass": "Embed-DependsOnApplication",
			"version": "01.01.01"
		},
		{
			"name": "DocumentContentEngine_20210212T150804760",
			"pxObjClass": "Embed-DependsOnApplication",
			"version": "01.01.01"
		},
		{
			"name": "RW_AbbyyVantage_20220210T212450723",
			"pxObjClass": "Embed-DependsOnApplication",
			"version": "01.01"
		},
		{
			"name": "SuperuserUtilities",
			"pxObjClass": "Embed-DependsOnApplication",
			"version": "01.01.01"
		}
	],
	"rulesets": [
		{
			"name": "RW-FormsBase_Branch_ExceptionCase:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "Mesh-LEXDev_Branch_ExceptionCase:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "Mesh-LEXDev_Branch_temp:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "Mesh-LEXDev_Branch_DQCException:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "Mesh-LEXDev_Branch_UWException:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "Mesh-LEXDev_Branch_StaticCasePortal:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "Mesh-LEXDev_Branch_DemoQuestions:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "Mesh-LEXDev_Branch_DocManagement:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "Mesh-LEXDev_Branch_LookAndFeel:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "DevUtilities_Branch_yaml:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_DocumentViewer_Branch_DocPreView:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_DocumentViewer_Branch_DocManagement:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_ExceptionCase:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_temp:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_DQCException:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_CLDocs:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_AltExStage:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_UWException:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_Auditchanges:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_DocPreView:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_UIPortalLabels:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_StaticCasePortal:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_DemoQuestions:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_QuestionResearch:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_DocManagement:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_LookAndFeel:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor_Branch_TimelinessRep:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_QuestionExpeditor_Branch_QuestionResearch:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_QuestionExpeditor_Branch_DocManagement:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LEXData_Branch_LookAndFeel:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RwpFs_Branch_DemoQuestions:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RwpFs_Branch_LookAndFeel:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_ProcessExpeditor_Branch_DocPreView:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_ProcessExpeditor_Branch_DemoQuestions:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_ProcessExpeditor_Branch_DocManagement:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_DocumentExpeditor_Branch_DocPreView:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_DocumentExpeditor_Branch_LookAndFeel:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_BSX_Config_Branch_yaml:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_BSX_Config_Branch_LookAndFeel:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "Theme-Cosmos_Branch_LookAndFeel:01-01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW-FormsBase:01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "Mesh-LEXDev:01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "DevUtilities:01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "PrefillData:01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "Fulfillment:01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "SuperuserUtilities:01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "ProductRules:01-02",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "TestDataForDev:01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_Unauthenticated:01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_DocumentViewer:02-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_LoanExpeditor:01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_QuestionExpeditor:01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "RW_Backstage:01-01",
			"pxObjClass": "Embed-RuleSet"
		},
		{
			"name": "Pega-Survey:08-08",
			"pxObjClass": "Embed-RuleSet"
		}
	]
}

const appList = {
	"pxObjClass": "RW-Backstage-API-Application",
	"statusValue": "OK",
	"applications": [
		{
			"description": "LoanExpediter",
			"ID": "RULE-APPLICATION MESH-LEXDEV 01.01.01",
			"name": "Mesh-LEXDev",
			"pxObjClass": "Pega-API-ApplicationManagement-Application"
		},
		{
			"description": "Mesh Developer Application",
			"ID": "RULE-APPLICATION MESH-APPDEV 01.01.01",
			"name": "Mesh-AppDev",
			"pxObjClass": "Pega-API-ApplicationManagement-Application"
		},
		{
			"description": "Mesh-AppAUT",
			"ID": "RULE-APPLICATION MESH-APPAUT 01.01.01",
			"name": "Mesh-AppAUT",
			"pxObjClass": "Pega-API-ApplicationManagement-Application"
		},
		{
			"description": "Mesh Business Architecture Application - BA",
			"ID": "RULE-APPLICATION MESH-APPBA 01.01.01",
			"name": "Mesh-AppBA",
			"pxObjClass": "Pega-API-ApplicationManagement-Application"
		},
		{
			"description": "LexAccel",
			"ID": "RULE-APPLICATION LEXACCEL 01.01.01",
			"name": "LexAccel",
			"pxObjClass": "Pega-API-ApplicationManagement-Application"
		},
		{
			"description": "Solution Architect APP for PX",
			"ID": "RULE-APPLICATION MESH-ARCHAPP 01.01.01",
			"name": "Mesh-ArchApp",
			"pxObjClass": "Pega-API-ApplicationManagement-Application"
		},
		{
			"description": "RW_Forms",
			"ID": "RULE-APPLICATION RW_FORMS 01.01.01",
			"name": "RW_Forms",
			"pxObjClass": "Pega-API-ApplicationManagement-Application"
		},
		{
			"description": "RW Launch Point",
			"ID": "RULE-APPLICATION RW_LAUNCHPOINT 22.02.01",
			"name": "RW_LaunchPoint",
			"pxObjClass": "Pega-API-ApplicationManagement-Application"
		},
		{
			"description": "Pega DevOps Foundation",
			"ID": "RULE-APPLICATION PEGADEVOPSFOUNDATION 5",
			"name": "PegaDevOpsFoundation",
			"pxObjClass": "Pega-API-ApplicationManagement-Application"
		}
	]
}

const getAppDetails = async(req, res)=>{
    
    res.json({
        appDetails
    });
    
} 

const getAppList = async(req, res)=>{
    
    res.json({
        appList
    });
    
}

const chatResponse = async(req, res = response)=>{
    
    const{message} = req.body;
    
    res.json({
        ok: true,
        resp: "respuesta a: " + message
    });
    
    
} 

const getCases = async(req, res)=>{
    
    const resultCount = cases.length;
    
    
    res.json({
        ok:true,
        name:'testapp1',
        resultCount,
        cases
    });
    
} 

const getCompliance = async(req, res)=>{
    
    res.json({
        ok:true,
        compliance: 89
    });
    
} 

const createUser = async(req, res = response)=>{
    
    const{email,password} = req.body;
    
    try{
        
        const existEmail = await User.findOne({email});
        
        if(existEmail){
            return res.status(400).json({
                ok: false,
                msg:'El correo electronico ya existe'
            })
        };
        
        const user = new User(req.body);
        
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password= bcrypt.hashSync(password,salt);
        
        //Guardar Usuario
        await user.save();
        
        const token = await signToken(user);
        
        res.json({
            ok:true,
            user,
            token
        });
        
    } catch {
        return res.status(500).json({
            ok: false,
            msg: 'Error en creacion',
            err
        })
    };
    
} 

const updateUser = async (req, res = response) => {
    
    const userId = req.params.id;
    
    try {
        
        const userDB = await User.findById(userId);
        
        if(!userDB){
            return res.status(404).json({
                ok:false,
                msg:"Usuario no encontrado",
            });
        }
        
        //Actualizacion de db
        const userUpdate = await User.updateOne({_id : userId}, req.body );
        const userNew = await User.findById(userId);
        
        
        res.json({
            ok: true,
            msg:"Usuario actualizado",
            id: userId,
            userNew
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Error al actualizar el usuario",
            error
        });
        
    }
    
    
}

const deleteUser = async (req, res = response) => {
    
    const userId = req.params.id;
    
    try {
        
        const userDB = await User.findById(userId);
        
        if(!userDB){
            return res.status(404).json({
                ok:false,
                msg:"Usuario no encontrado",
            });
        }
        
        //Actualizacion de db
        const userDelete = await User.findByIdAndDelete(userId);
        
        res.json({
            ok: true,
            msg:"Usuario borrado",
            id: userId,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Error al borrar el usuario",
            error
        });
        
    }
    
    
}

module.exports = {
    getCases,
    getCompliance,
    createUser,
    updateUser, 
    deleteUser,
    getAppDetails,
    getAppList,
    chatResponse
}