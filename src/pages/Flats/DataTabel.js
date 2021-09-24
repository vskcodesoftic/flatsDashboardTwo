import React, {useState, useEffect, forwardRef} from 'react';
/* eslint-disable */

import Grid from '@material-ui/core/Grid';

import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
        <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
        <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
        <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
        <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const api = axios.create({
    baseURL: `https://flatsapi.herokuapp.com`
});

const DataTable = () => {
    const columns = [
        {title: 'id', field: 'id', hidden: true},
        {title: 'Block Number', field: 'BlockNumber'},
        {title: 'Flat no', field: 'flatno'},
        {title: 'residence title', field: 'title'},
        {title: 'Name of Owner', field: 'ownerName'},
        {title: 'Email of Owner', field: 'ownerEmail'},
        {title: 'Contact number of Owner', field: 'ownerContactNumber'},
        {title: 'Number Of Family Members', field: 'NumberOfFamilyMembers'}
    ];
    const [data, setData] = useState([]); // table data

    // for error handling
    const [iserror, setIserror] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        api.get('/api/admin/getListofFlats')
            .then((res) => {
                setData(res.data.Flats);
            })
            .catch((error) => {
                console.log('Error');
            });
    }, []);

    const handleRowUpdate = (newData, oldData, resolve) => {
        // validation
        const errorList = [];
        if (newData.status === '') {
            errorList.push('Please select valid status');
        }

        if (errorList.length < 1) {
            api.patch(`/api/admin/users/u/${newData.id}`, newData)
                .then((res) => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    resolve();
                    setIserror(false);
                    setErrorMessages([]);
                })
                .catch((error) => {
                    setErrorMessages([`Update failed! Server error${error}`]);
                    setIserror(true);
                    resolve();
                });
        } else {
            setErrorMessages(errorList);
            setIserror(true);
            resolve();
        }
    };

    // const handleRowAdd = (newData, resolve) => {
    //     // validation
    //     const errorList = [];
    //     if (newData.first_name === undefined) {
    //         errorList.push('Please enter first name');
    //     }
    //     if (newData.last_name === undefined) {
    //         errorList.push('Please enter last name');
    //     }
    //     if (
    //         newData.email === undefined ||
    //         validateEmail(newData.email) === false
    //     ) {
    //         errorList.push('Please enter a valid email');
    //     }

    //     if (errorList.length < 1) {
    //         // no error
    //         api.post('/users', newData)
    //             .then((res) => {
    //                 const dataToAdd = [...data];
    //                 dataToAdd.push(newData);
    //                 setData(dataToAdd);
    //                 resolve();
    //                 setErrorMessages([]);
    //                 setIserror(false);
    //             })
    //             .catch((error) => {
    //                 setErrorMessages(['Cannot add data. Server error!']);
    //                 setIserror(true);
    //                 resolve();
    //             });
    //     } else {
    //         setErrorMessages(errorList);
    //         setIserror(true);
    //         resolve();
    //     }
    // };

    const handleRowDelete = (oldData, resolve) => {
        const pid = api
            .delete(`/api/admin/users/${oldData.id}`)
            .then((res) => {
                console.log(oldData.id);
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve();
            })
            .catch((error) => {
                setErrorMessages(['Delete failed! Server error']);
                setIserror(true);
                resolve();
            });
    };

    return (
        <div className="App">
            <Grid container spacing={2}>
                <Grid item />
                <Grid item md={12}>
                    <div>
                        {iserror && (
                            <Alert severity="error">
                                {errorMessages.map((msg, i) => {
                                    return <div key={i}>{msg}</div>;
                                })}
                            </Alert>
                        )}
                    </div>
                </Grid>
            </Grid>
            <div className="row">
                <div className="col-lg-12 col-12">
                    <MaterialTable
                        options={{
                            exportButton: true
                        }}
                        title="List of Flats"
                        columns={columns}
                        data={data}
                        icons={tableIcons}
                        // editable={{
                        //     onRowUpdate: (newData, oldData) =>
                        //         new Promise((resolve) => {
                        //             handleRowUpdate(newData, oldData, resolve);
                        //         }),
                        //     // onRowAdd: (newData) =>
                        //     //     new Promise((resolve) => {
                        //     //         handleRowAdd(newData, resolve);
                        //     //     }),
                        //     onRowDelete: (oldData) =>
                        //         new Promise((resolve) => {
                        //             handleRowDelete(oldData, resolve);
                        //         })
                        // }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DataTable;
