import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { EnumTypeDatatable } from '@/interfaces/enums';

import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
// import * as XLSX from 'xlsx';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import YVEAApi from '@config/axios.conf';
import { FlatTableBody } from '@components/table-bodies/TableBody';
import { DocumentsTableBody } from '@components/table-bodies/DocumentsTableBody';
import { UserTableBody } from '@components/table-bodies/UserTableBody';
import { IPagination } from '@/interfaces/common';
import BuyerEditionModal from '@components/BuyerEditionModal';
import SellerEditionModal from '@components/SellerEditionModal';
import { NomenclatureDocsTableBody } from '@components/table-bodies/NomenclatureDocsTableBody';
import PlaceEditorModal from '@components/PlaceEditionModal';
import { CertificatesTableBody } from './table-bodies/CertificatesTableBody';
import { NomenclatureCodeTableBody } from './table-bodies/NomenclatureCodeTableBody';
import { useRouter } from 'next/router';
import { appState } from '@/store';
import { useSelector } from 'react-redux';
import { setStep } from '@/store/requests/reducer';
import { useAppDispatch } from '@/hooks/redux';
import requestService from '@/services/request.service';
import showNotification from './atoms/Notification';
import { useTranslation } from 'react-i18next';
import { i18n } from 'next-i18next';
import { DeleteAlertModal } from './DeleteAlertModal';

type Order = 'asc' | 'desc';

export interface Header {
  id: number;
  displayName: string;
  orderBy: boolean;
  orderField?: string;
}

type DatatableProps = {
  type: EnumTypeDatatable;
  headers: Header[];
  localData?: Array<object>;
  withoutPagination?: boolean;
};

export const paginationInitialState: IPagination = {
  take: 10,
  page: 1,
  page_count: 2,
  item_count: 0,
  has_next_page: false,
  has_previous_page: false
};

export const Datatable = React.forwardRef(
  ({ headers, type, localData, withoutPagination }: DatatableProps, ref) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const router = useRouter();
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<string>('createdAt');
    const [serviceSelected, setServiceSelected] = useState(null);
    const [data, setData] = useState([]);
    const [activeBuyer, setActiveBuyer] = useState(null);
    const [activeSeller, setActiveSeller] = useState(null);
    const [activePlace, setActivePlace] = useState(null);
    const { roleName } = useSelector(({ users }: appState) => users);
    const actualLanguage = i18n.language;
    const [pagination, setPagination] = useState<IPagination>({
      ...paginationInitialState
    });
    const [isBuyerEditorModalOpen, setIsBuyerEditorModalOpen] =
      useState<boolean>(false);
    const [isSellerEditorModalOpen, setIsSellerEditorModalOpen] =
      useState<boolean>(false);
    const [isPlaceEditorModalOpen, setIsPlaceEditorModalOpen] =
      useState<boolean>(false);
    const tableRef = useRef(null);
    const [toBeDeleted,setToBeDeleted] = useState<string|null>(null)    
    const [showDeleteAlert,setShowDeleteAlert] = useState<boolean>(false)    

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setPagination({
        ...pagination,
        take: +event.target.value,
        page: 1
      });
    };

    const handleChangePage = (_: unknown, newPage: number) => {
      setPagination({ ...pagination, page: newPage + 1 });
    };

    const fetcher = ([serviceSelected, pagination]) => {
      /*transform object filter to string */
      return YVEAApi.get(
        `${serviceSelected}` +
          `?take=${pagination.take}&page=${pagination.page}`
      );
    };

    const {
      data: swrData,
      isLoading,
      mutate
    } = useSWR(
      serviceSelected
        ? [
            serviceSelected,
            pagination
            // searchValue
          ]
        : null,
      fetcher,
      {
        revalidateOnFocus: false
      }
    );

    const handleClickEditBuyer = (uuid: string) => {
      if (!data.length) return;
      const buyer = data.find((item) => item.id === uuid);
      setActiveBuyer(buyer);
      setIsBuyerEditorModalOpen(true);
    };

    const handleClickEditSeller = (uuid: string) => {
      if (!data.length) return;
      const seller = data.find((item) => item.id === uuid);
      setActiveSeller(seller);
      setIsSellerEditorModalOpen(true);
    };

    const handleClickEditPlace = (uuid: string) => {
      if (!data.length) return;
      const place = data.find((item) => item.id === uuid);
      setActivePlace(place);
      setIsPlaceEditorModalOpen(true);
    };

    const handleClickSeeCertficiate = (row: any) => {
      if (!data.length) return;
      if (row?.status == 'DRAFT') {
        dispatch(setStep(0));
        return router.push({
          pathname: '/dashboard/user/request',
          query: { certificateId: row?.id }
        });
      }
      router.push({
        pathname: 'certificate-detail',
        query: { certificateId: row?.id }
      });
    };

    const handleDeleteAlert = (id:any) => {
      setToBeDeleted(id)
      setShowDeleteAlert(true)
    };  
    
    const handleCloseModal = () => {
      setShowDeleteAlert(false)
      setToBeDeleted(null)
    };

    const handleClickDeleteCertficate = async () => {
      if (!data.length) return;

      try {
        const { status } = await requestService.deleteCertificate(toBeDeleted);
        if (status === 200 || status === 201) {
          mutate().then();
          showNotification({
            type: 'success',
            message: t('request_deleted'),
            timeout: 2000
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        handleCloseModal()
      }
    };

    const selectedTableBody = () => {
      switch (type) {
        case EnumTypeDatatable.BUYERS:
          return (
            <FlatTableBody
              data={data}
              onClickEdit={handleClickEditBuyer}
              headers={headers}
              align="left"
            />
          );
        case EnumTypeDatatable.SELLERS:
          return (
            <FlatTableBody
              data={data}
              onClickEdit={handleClickEditSeller}
              headers={headers}
              align="left"
            />
          );
        case EnumTypeDatatable.PLACES:
          return (
            <FlatTableBody
              data={data}
              onClickEdit={handleClickEditPlace}
              headers={headers}
              align="right"
            />
          );
        case EnumTypeDatatable.DOCUMENTS:
          return <DocumentsTableBody data={data} headers={headers} />;
        case EnumTypeDatatable.DOCUMENTS_BY_NOMENCLATURE:
          return <NomenclatureDocsTableBody data={data} headers={headers} />;
        case EnumTypeDatatable.DOCUMENTS_ADMIN:
          return <DocumentsTableBody data={data} headers={headers} />;
        case EnumTypeDatatable.PAYS:
          return <FlatTableBody data={data} align={'left'} headers={headers} />;
        case EnumTypeDatatable.USERS:
          return <UserTableBody data={data} headers={headers} />;
        case EnumTypeDatatable.CERTIFICATES:
          return (
            <CertificatesTableBody
              data={data}
              onClickEdit={handleClickSeeCertficiate}
              onClickDelete={handleDeleteAlert}
            />
          );
        case EnumTypeDatatable.NOMENCLAUTRE_CODE:
          return <NomenclatureCodeTableBody data={data} />;
      }
    };

    React.useImperativeHandle(ref, () => ({
      refetch: mutate
    }));

    useEffect(() => {
      mutate();
    }, [actualLanguage]);

    useEffect(() => {
      if (swrData && type === EnumTypeDatatable.PAYS) {
        setData(swrData.data);
      }
      if (swrData && type !== EnumTypeDatatable.PAYS) {
        setData(swrData.data.data);
        setPagination(swrData.data.meta);
      }
    }, [swrData]);

    useEffect(() => {
      switch (type) {
        case EnumTypeDatatable.BUYERS:
          setServiceSelected('/buyers');
          break;
        case EnumTypeDatatable.SELLERS:
          setServiceSelected('/sellers');
          break;
        case EnumTypeDatatable.PLACES:
          setServiceSelected('/inspection-places');
          break;
        case EnumTypeDatatable.DOCUMENTS:
          localData
            ? setData(localData)
            : setServiceSelected('/certificates/documents');
          break;
        case EnumTypeDatatable.DOCUMENTS_BY_NOMENCLATURE:
          setServiceSelected(
            roleName == 'CLIENT'
              ? '/certificates/nomenclature-codes/documents'
              : '/certificates/nomenclature-codes/documents/all'
          );
          break;
        case EnumTypeDatatable.DOCUMENTS_ADMIN:
          setServiceSelected('/certificates/documents/all');
          break;
        case EnumTypeDatatable.PAYS:
          setServiceSelected('/countries');
          break;
        case EnumTypeDatatable.USERS:
          setServiceSelected('/users/all');
          break;
        case EnumTypeDatatable.CERTIFICATES:
          // router.pathname == 'dashboard/admin/certificate-detail'
          setServiceSelected(
            roleName == 'CLIENT' ? '/certificates' : '/certificates/all'
          );
          break;
        case EnumTypeDatatable.NOMENCLAUTRE_CODE:
          setData(localData);
          break;
        case EnumTypeDatatable.CERTIFICATES_USER:
          setData(localData);
          break;
      }
    }, [type, localData]);

    // const downloadExcel = async () => {
    //   const { data } = await CinchApi.get(
    //     `${serviceSelected}?takeAll=true` +
    //     `${orderBy !== ''
    //       ? `&orderBy=${orderBy}&direction=${order.toUpperCase()}`
    //       : ''
    //     }` +
    //     `${searchValue ? `&search=${searchValue}` : ''}` +
    //     `${Object.keys(filters).length
    //       ? `&${new URLSearchParams(filters).toString()}`
    //       : ''
    //     }`
    //   );
    //
    //   if (data) {
    //     const rows = data.data.map((item) => {
    //       let excelItem = {};
    //
    //       EXCEL_DATA[serviceSelected][1].forEach(
    //         ({ field, type }) => {
    //           let value = '';
    //           if (type === Types.COMBINED) {
    //             value = field
    //               .split(' ')
    //               .map((f) => result(item, f))
    //               .join(' ');
    //           } else {
    //             value = getValueByType(
    //               result(item, field),
    //               type
    //             );
    //           }
    //
    //           excelItem[field] = value;
    //         }
    //       );
    //
    //       return excelItem;
    //     });
    //
    //     const workbook = XLSX.utils.book_new();
    //     const worksheet = XLSX.utils.json_to_sheet(rows);
    //
    //     XLSX.utils.book_append_sheet(
    //       workbook,
    //       worksheet,
    //       'Information'
    //     );
    //
    //     XLSX.utils.sheet_add_aoa(worksheet, [
    //       EXCEL_DATA[serviceSelected][0]
    //     ]);
    //
    //     XLSX.writeFile(workbook, 'report.xlsx', { compression: true });
    //   }
    // };

    const createSortHandler =
      (property: keyof (typeof data)[0], hasOrderBy: boolean) =>
      (_: React.MouseEvent<unknown>) => {
        if (!hasOrderBy) return;
        setOrderBy(property.toString());
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
      };

    return (
      <>
        <BuyerEditionModal
          isModalOpen={isBuyerEditorModalOpen}
          setIsModalOpen={setIsBuyerEditorModalOpen}
          onSucceed={() => {
            setIsBuyerEditorModalOpen(false);
            mutate().then();
          }}
          buyer={activeBuyer}
        />
        <SellerEditionModal
          isModalOpen={isSellerEditorModalOpen}
          setIsModalOpen={setIsSellerEditorModalOpen}
          onSucceed={() => {
            setIsSellerEditorModalOpen(false);
            mutate().then();
          }}
          seller={activeSeller}
        />
        <PlaceEditorModal
          isModalOpen={isPlaceEditorModalOpen}
          setIsModalOpen={setIsPlaceEditorModalOpen}
          onSucceed={() => {
            setIsPlaceEditorModalOpen(false);
            mutate().then();
          }}
          place={activePlace}
        />
        <Paper
          sx={{
            width: '100%',
            overflow: 'hidden',
            minHeight: '40rem',
            borderRadius: '20px',
            margin: 0,
            mt: '3rem',
            boxShadow: '0px 4px 6px 0px #2623410F'
          }}
        >
          <TableContainer ref={tableRef}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                <TableRow sx={{ 'td, th': { border: 0 } }}>
                  {headers.map((header: Header, index: number) => (
                    <TableCell
                      key={index}
                      align={'left'}
                      style={{ width: 'maxContent !important' }}
                    >
                      {header.orderBy ? (
                        <TableSortLabel
                          active={orderBy === header.orderField}
                          direction={
                            orderBy === header.orderField ? order : 'asc'
                          }
                          onClick={createSortHandler(
                            header.orderField,
                            header.orderBy
                          )}
                        >
                          <Typography
                            variant="body2"
                            color={'grey.500'}
                            sx={{ paddingX: '1rem' }}
                            fontSize={16}
                            fontWeight={'bold'}
                          >
                            {t(header.displayName)}
                          </Typography>
                          {orderBy === header.orderField ? (
                            <Box sx={visuallyHidden}>
                              {order === 'desc'
                                ? 'sorted descending'
                                : 'sorted ascending'}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ fontSize: 16, paddingX: '1rem' }}
                          color={'text.secondary'}
                        >
                          {t(header.displayName)}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {!isLoading && data?.length > 0 ? selectedTableBody() : null}
            </Table>

            {!isLoading && data?.length === 0 ? (
              <Box
                alignItems={'center'}
                display={'flex'}
                justifyContent={'center'}
                minHeight={'250px'}
                textAlign={'center'}
                width={'100%'}
              >
                <Typography sx={{ color: 'text.secondary' }}>
                  {t('no_results')}
                </Typography>
              </Box>
            ) : null}

            {isLoading && (
              <Box
                alignItems={'center'}
                display={'flex'}
                justifyContent={'center'}
                minHeight={'200px'}
                width={'100%'}
              >
                <CircularProgress />
              </Box>
            )}
          </TableContainer>
        </Paper>

        {!isLoading && type !== EnumTypeDatatable.PAYS && (
          <Box
            width="100%"
            display="flex"
            justifyContent="flex-end"
            marginTop={2}
          >
            {!withoutPagination && (
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={pagination.item_count}
                labelRowsPerPage={t('results_displayed')}
                rowsPerPage={pagination.take}
                page={pagination.page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Box>
        )}
        <DeleteAlertModal           
          isOpen={showDeleteAlert}
          closingAction={handleCloseModal}
          confirmAction={handleClickDeleteCertficate}
        />
      </>
    );
  }
);

Datatable.displayName = 'Datatable';
