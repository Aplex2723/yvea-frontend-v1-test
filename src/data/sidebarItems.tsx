import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import { ROUTES } from '@/constans/routes';
import { ROLES } from '@/constans/roles';

export const sideBarMenuItems = [
  {
    id: 0,
    title: 'request_tracking',
    icon: <InsertChartOutlinedIcon />,
    role: ROLES.USER,
    link: ROUTES.USER_DASHBOARD
  },
  {
    id: 1,
    title: 'address_book',
    role: ROLES.USER,
    icon: <FindInPageOutlinedIcon />,
    link: ROUTES.USER_DIRECTIONS_BOOK
  },
  {
    id: 2,
    title: 'documents',
    icon: <FolderOpenOutlinedIcon />,
    role: ROLES.USER,
    link: ROUTES.USER_DOCUMENTS
  },
  {
    id: 9,
    title: 'countries',
    icon: <FlagOutlinedIcon />,
    role: ROLES.ADMIN,
    link: ROUTES.ADMIN_DASHBOARD_PAYS
  },
  // {
  //   id: 17,
  //   title: 'Prestataires',
  //   role: ROLES.ADMIN,
  //   icon: <PeopleOutlinedIcon />,
  //   link: ROUTES.COMING_SOON_ADMIN
  // },
  {
    id: 22,
    title: 'users',
    icon: <PeopleOutlinedIcon />,
    role: ROLES.ADMIN,
    link: ROUTES.ADMIN_DASHBOARD_USERS
  },
  {
    id: 32,
    title: 'requests',
    icon: <FolderSharedOutlinedIcon />,
    role: ROLES.ADMIN,
    link: ROUTES.ADMIN_DASHBOARD_DEMANDES
  },
  {
    id: 33,
    title: 'marketplace',
    icon: <HandshakeOutlinedIcon />,
    role: ROLES.USER,
    link: ROUTES.USER_MARKETPLACE
  },
  {
    id: 34,
    title: 'marketplace',
    icon: <HandshakeOutlinedIcon />,
    role: ROLES.ADMIN,
    link: ROUTES.ADMIN_MARKETPLACE
  },
];