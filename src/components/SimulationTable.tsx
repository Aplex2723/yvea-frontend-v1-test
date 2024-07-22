import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { FC, useState } from 'react';
import { Add, DeleteOutline } from '@mui/icons-material';
import { TextField, Typography } from '@mui/material';
import {
  INomenclatureCode,
  INomenclatureProduct
} from '@/interfaces/simulation';

import { NumericFormat } from 'react-number-format';
import { useTranslation } from 'react-i18next';

interface RowProps {
  row: INomenclatureCode;
  rows: INomenclatureCode[];
  setRows: (rows: INomenclatureCode[]) => void;
}
const Row: FC<RowProps> = ({ row, rows, setRows }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation()

  const addNewProduct = () => {
    const rowToUpdate = rows.find((item) => item.code === row.code);
    if (rowToUpdate) {
      setOpen(true);
      const newProduct: INomenclatureProduct = {
        name: `Produit ${(rowToUpdate?.products?.length ?? 0) + 1}`,
        unit_price: 0,
        quantity: (rowToUpdate?.products?.length ?? 0) + 1
      };
      const newProducts = [...(rowToUpdate?.products ?? []), newProduct];
      const newRows = rows.map((item) => {
        if (item.code === row.code) {
          return {
            ...item,
            products: newProducts
          };
        }
        return item;
      });
      setRows([...newRows]);
    }
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    code: string
  ) => {
    const rowToUpdate = rows.find((item) => item.code === code);
    if (rowToUpdate) {
      const newProducts = rowToUpdate.products?.map((item) => {
        if (item.name === e.target.name) {
          return {
            ...item,
            unit_price: parseNumberWithString(e.target.value)
          };
        }
        return item;
      });
      const newRowAmount = newProducts.reduce(
        (acc, item) => acc + item.unit_price,
        0
      );
      const newRows = rows.map((item) => {
        if (item.code === code) {
          return {
            ...item,
            products: newProducts,
            amount: newRowAmount
          };
        }
        return item;
      });
      setRows([...newRows]);
    }
  };

  const deleteProduct = (itemName: string) => {
    const rowToUpdate = rows.find((item) => item.code === row.code);
    if (rowToUpdate) {
      const productsWithoutDeleted = rowToUpdate.products.filter(
        (item) => item.name !== itemName
      );
      /*update products name*/
      const newProducts = productsWithoutDeleted.map((product, index) => {
        return {
          name: `Produit ${index + 1}`,
          unit_price: product.unit_price,
          quantity: product.quantity,
          standalone: product.standalone
        };
      });
      const newRowAmount = newProducts.reduce(
        (acc, item) => acc + item.unit_price,
        0
      );
      const newRows = rows.map((item) => {
        if (item.code === row.code) {
          return {
            ...item,
            products: newProducts,
            amount: newRowAmount
          };
        }
        return item;
      });

      setRows([...newRows]);
    }
  };

  const deleteNomenclature = (code: string) => {
    const newRows = rows.filter((row) => row.code !== code);
    setRows(newRows);
  };

  const renameProduct = (name: string) => {
    return name.replace('Produit', t('total_value_item'));
  };

  function parseNumberWithString(inputString) {
    // Replace commas with dots for proper parsing
    const stringWithDot = inputString.replace(/,/g, '.');

    // Parse the string to a number
    const parsedNumber = parseFloat(stringWithDot);

    // Check if the parsing was successful
    if (isNaN(parsedNumber)) {
        console.error('Invalid input. Unable to parse the number.');
        return null; // or any other appropriate value indicating an error
    }

    return parsedNumber;
}

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.code}
        </TableCell>
        <TableCell sx={{ color: 'grey.500' }} align="left">
          €{row.amount}
          {/*<HighlightOffIcon sx={{color: 'error.main' , marginLeft:'3rem', marginBottom:'-.2rem'}}/>*/}
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right">
          <IconButton
            sx={{
              border: '1px dashed lightgrey ',
              height: '1.5rem',
              width: '1.5rem'
            }}
          >
            <Add onClick={addNewProduct} />
          </IconButton>
          <IconButton onClick={() => deleteNomenclature(row.code)}>
            <DeleteOutline />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {row?.products?.map((item, index: string | number) => {
              if (item?.standalone) return null;
              return (
                <Box
                  key={index}
                  sx={{
                    margin: 0,
                    minHeight: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid lightgrey',
                    maxHeight: '6rem'
                  }}
                >
                  <Typography
                    variant={'body2'}
                    sx={{
                      width: '30%',
                      marginLeft: '64%'
                    }}
                  >
                    {renameProduct(item.name)}
                  </Typography>
                  <Box
                    sx={{
                      width: '27%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'end'
                    }}
                  >
                    <Box display={'flex'} flexDirection={'column'}>
                      <TextField
                        name={item.name}
                        value={item.unit_price}
                        onChange={(e) => handlePriceChange(e, row.code)}                        
                        InputProps={{
                          inputComponent: NumberFormatCustom as any
                        }}
                        sx={{
                          maxWidth: '3rem',
                          width: '3rem',
                          '& .MuiOutlinedInput-root .MuiOutlinedInput-input': {
                            height: '.4rem',
                            justifySelf: 'end',
                            width: '3rem'
                          }
                        }}
                      />
                    </Box>
                    <IconButton onClick={() => deleteProduct(item.name)}>
                      <DeleteOutline />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

interface Props {
  nomenclatureCodes: INomenclatureCode[];
  setNomenclatureCodes: (nomenclatureCodes: INomenclatureCode[]) => void;
}
const SimulationTable: FC<Props> = ({
  nomenclatureCodes = [],
  setNomenclatureCodes
}) => {
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead sx={{ backgroundColor: 'grey.50' }}>
          <TableRow>
            <TableCell />
            <TableCell sx={{ color: 'grey.500' }}>{t('code')}</TableCell>
            <TableCell sx={{ color: 'grey.500' }} align="left">
              {t('total_code_value')}
            </TableCell>
            <TableCell sx={{ color: 'grey.500' }} align="left">
              {t('article')}
            </TableCell>
            <TableCell sx={{ color: 'grey.500' }} align="right">
              {t('enter_amount_per_item')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nomenclatureCodes.map((row) => (
            <Row
              key={row.code}
              row={row}
              rows={nomenclatureCodes}
              setRows={setNomenclatureCodes}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SimulationTable;

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props) {
  const { ...other } = props;
  return (
    <NumericFormat
      {...other}
      type="text"
      decimalSeparator=","
      decimalScale={2}
      isAllowed={(values) => {        
        const { floatValue } = values;
        return floatValue < 999999999 || floatValue===undefined;
      }}
    />
  );
});
