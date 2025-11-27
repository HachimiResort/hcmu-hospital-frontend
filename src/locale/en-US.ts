import localeMessageBox from '@/components/message-box/locale/en-US';
import localeListBoard from '@/components/list-board/locale/en-US';

import localeLogin from '@/views/login/locale/en-US';
import localeBranch from '@/views/branch/locale/en-US';
import localePersonal from '@/views/personal/locale/en-US';
import localeLogPage from '@/views/logPage/log-page/locale/en-US';
import localeDoctorWorkspace from '@/views/doctor-workspace/locale/en-US';

import localePersonnel from '@/views/personnel/locale/en-US';
import localeSystem from '@/views/system/locale/en-US';
import localeState from '@/utils/state/locale/en-US';
import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',

  'menu.announcement': 'Announcement center',
  'menu.personal': 'Personal center',
  'menu.personnel': 'Personnel Management Center',
  'menu.score': 'Score center',
  'menu.logPage': 'System logs',
  'menu.project': 'Project center',
  'menu.branch': 'Branch center',
  'menu.competition': 'Contest center',
  'menu.system': 'System Management',
  'menu.system.departmentPage': 'Department Management Center',
  'menu.system.importPage': 'Batch User Import',
  'menu.system.personnelPage': 'Personnel Management Center',
  'menu.system.logPage': 'System Log Query',
  'menu.system.doctorProfilePage': 'Doctor Profile Management',
  'menu.system.patientProfilePage': 'Patient Profile Management',
  'menu.system.schedulePage': 'Doctor Schedule Management',
  'menu.system.scheduleTemplatePage': 'Schedule Template Management',
  'menu.system.operationRulePage': 'Operation Rule Settings',
  'menu.medical': 'Medical Business Management Center',
  'menu.medical.departmentPage': 'Department Management Center',
  'menu.medical.doctorProfilePage': 'Doctor Profile Management',
  'menu.medical.operationRulePage': 'Operation Rule Settings',
  'menu.medical.patientProfilePage': 'Patient Profile Management',
  'menu.medical.schedulePage': 'Doctor Schedule Management',
  'menu.medical.scheduleTemplatePage': 'Schedule Template Management',
  'menu.doctorWorkspace': 'Doctor Workspace',
  'menu.schedulePatients': 'Schedule Patients Management',
  'menu.scheduleRequestList': 'My Schedule Requests',
  'menu.display': 'Project display',
  'menu.about': 'About',

  // Doctor Workspace
  'workspace.doctorProfile': 'Doctor Profile',
  'workspace.name': 'Name',
  'workspace.userName': 'Username',
  'workspace.department': 'Department',
  'workspace.title': 'Title',
  'workspace.specialty': 'Specialty',
  'workspace.bio': 'Bio',
  'workspace.editProfile': 'Edit Profile',
  'workspace.scheduleCalendar': 'Schedule Calendar',
  'workspace.morning': 'Morning',
  'workspace.afternoon': 'Afternoon',
  'workspace.evening': 'Evening',
  'workspace.today': 'Today',
  'workspace.fetchProfileError': 'Failed to fetch doctor profile',
  'workspace.fetchScheduleError': 'Failed to fetch schedule',
  'workspace.saveSuccess': 'Saved successfully',
  'workspace.saveError': 'Failed to save',
  'workspace.departmentNotEditable': 'Department is not editable',
  'workspace.titleNotEditable': 'Title is not editable',
  'workspace.titlePlaceholder': 'Enter title, e.g.: Chief Physician',
  'workspace.specialtyPlaceholder':
    'Enter specialty, e.g.: Cardiovascular diseases',
  'workspace.bioPlaceholder': 'Enter your bio',
  'workspace.applyScheduleChange': 'Apply for Schedule Change',
  'workspace.applyScheduleChangeComingSoon':
    'Schedule change application feature coming soon',

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
