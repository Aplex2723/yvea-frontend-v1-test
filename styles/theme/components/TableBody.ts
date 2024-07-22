import { ComponentsOverrides, ComponentsProps } from '@mui/material';

import { Theme as MUITheme } from '@mui/system';

type ComponentsOverride = {
    defaultProps: ComponentsProps['MuiTableBody'];
    styleOverrides: ComponentsOverrides<MUITheme> | any;
};

export const MuiTableBody: ComponentsOverride = {
    defaultProps: {},
    styleOverrides: {
        root: ({}: any) => ({
            '& tr:nth-of-type(even)': {
                backgroundColor: '#F9FAFB'
            }
        })
    }
};
