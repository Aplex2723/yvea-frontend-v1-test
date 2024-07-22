import { MuiSelect } from './Select';

import { Components } from '@mui/material';
import { Theme } from '@mui/system';
import { MuiTextField } from './TextField';
import {MuiTableBody} from "./TableBody";

export const OverridedComponents: Components<Omit<Theme, 'components'>> = {
  MuiSelect,
  MuiTextField,
  MuiTableBody
};
