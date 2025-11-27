import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeListBoard from '@/components/list-board/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeBranch from '@/views/branch/locale/zh-CN';
import localePersonal from '@/views/personal/locale/zh-CN';
import localePersonnel from '@/views/personnel/locale/zh-CN';
import localeLogPage from '@/views/logPage/log-page/locale/zh-CN';
import localeDoctorWorkspace from '@/views/doctor-workspace/locale/zh-CN';

import localeSystem from '@/views/system/locale/zh-CN';
import localeState from '@/utils/state/locale/zh-CN';
import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',

  'menu.announcement': '公告中心',
  'menu.personal': '个人中心',
  'menu.personnel': '人事管理中心',
  'menu.score': '积分管理中心',
  'menu.logPage': '系统日志',
  'menu.project': '项目中心',
  'menu.branch': '部门中心',
  'menu.competition': '比赛报名中心',
  'menu.system': '系统管理',
  'menu.system.departmentPage': '科室管理中心',
  'menu.system.importPage': '批量用户导入',
  'menu.system.personnelPage': '人事管理中心',
  'menu.system.logPage': '系统日志查询',
  'menu.system.doctorProfilePage': '医生档案管理',
  'menu.system.patientProfilePage': '患者档案管理',
  'menu.system.schedulePage': '医生排班管理',
  'menu.system.scheduleTemplatePage': '排班模板管理',
  'menu.system.operationRulePage': '运营规则配置',
  'menu.medical': '医疗业务管理中心',
  'menu.medical.departmentPage': '科室管理中心',
  'menu.medical.doctorProfilePage': '医生档案管理',
  'menu.medical.operationRulePage': '运营规则配置',
  'menu.medical.patientProfilePage': '患者档案管理',
  'menu.medical.schedulePage': '医生排班管理',
  'menu.medical.scheduleTemplatePage': '排班模板管理',
  'menu.doctorWorkspace': '医生工作台',
  'menu.schedulePatients': '时段患者管理',
  'menu.system.scheduleRequestApproval': '排班申请审批',
  'menu.scheduleRequestList': '我的排班申请',
  'menu.display': '项目展示',
  'menu.about': '关于',

  // 医生工作台
  'workspace.doctorProfile': '医生档案',
  'workspace.name': '姓名',
  'workspace.userName': '用户名',
  'workspace.department': '科室',
  'workspace.title': '职称',
  'workspace.specialty': '专长',
  'workspace.bio': '个人简介',
  'workspace.editProfile': '编辑档案',
  'workspace.scheduleCalendar': '排班日历',
  'workspace.morning': '上午',
  'workspace.afternoon': '下午',
  'workspace.evening': '晚上',
  'workspace.today': '今天',
  'workspace.fetchProfileError': '获取医生档案失败',
  'workspace.fetchScheduleError': '获取排班信息失败',
  'workspace.saveSuccess': '保存成功',
  'workspace.saveError': '保存失败',
  'workspace.departmentNotEditable': '科室不可编辑',
  'workspace.titleNotEditable': '职称不可编辑',
  'workspace.titlePlaceholder': '请输入职称，如：主任医师',
  'workspace.specialtyPlaceholder': '请输入专长，如：心血管疾病诊治',
  'workspace.bioPlaceholder': '请输入个人简介',
  'workspace.applyScheduleChange': '申请修改排班',
  'workspace.applyScheduleChangeComingSoon': '申请修改排班功能即将上线',

  ...localeSystem,
  ...localeState,
  ...localeSettings,
  ...localeMessageBox,
  ...localeListBoard,
  ...localeLogin,
  ...localeBranch,
  ...localePersonal,
  ...localePersonnel,
  ...localeLogPage,
  ...localeDoctorWorkspace,
};
