/* eslint-disable */
import {Formik, Field, Form} from 'formik';
import {useForm} from 'react-hook-form';
import React, {useState, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import axios from 'axios';
import Input from '@app/../node_modules/reactstrap/es/Input';
import Loader from 'react-js-loader';
import {Redirect} from 'react-router-dom';
var form = new FormData();

export const GetCurrentUser = () => {
    const C = JSON.parse(localStorage.getItem('user'));
    return C;
};

const AddEmergencyContact = (props) => {
    const {register, handleSubmit} = useForm();
    const [ImageValue, setImageValue] = useState('');
    const [t] = useTranslation();
    const fileInput = React.createRef();

    const [Spinner, setSpinner] = useState(false);

    const [redirect, setredirect] = useState(false);

    const onSubmit = (data) => {
        // still to resolve promise

        setSpinner(true);

        axios
            .post('https://flatsapi.herokuapp.com/api/admin/addListOfContacts', data)
            .then((res) => {
                console.log(res.data);
                toast.success(`Emergency contact Added sucessfully !`);
                setSpinner(false);
                setredirect(true);
            })
            .catch((error) => {
                console.log('Error', error);
                toast.error(`something went wrong`);
            });
    };
    if (redirect) {
        return <Redirect to="/emergency" />;
    }
    return (
        <>
            <section className="content-header">
                <div className="container-fluid">
                    <div>
                        <div className="login-box">
                            <div className="card card-outline card-warning">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="input-group mb-3">
                                            <input
                                                {...register('name', {
                                                    required: true
                                                })}
                                                className="form-control"
                                                placeholder="name"
                                            />
                                        </div>
                                        <div className="Field-group mb-3">
                                            <input
                                                {...register(
                                                    'email',
                                                    {
                                                        required: true
                                                    }
                                                )}
                                                className="form-control"
                                                placeholder="email"
                                            />
                                        </div>
                                        <div className="Field-group mb-3">
                                            <input
                                                {...register('ContactNumber', {
                                                    required: true
                                                })}
                                                className="form-control"
                                                placeholder="ContactNumber"
                                            />
                                        </div>
                                        <div className="Field-group mb-3">
                                            <input
                                                {...register('designation', {
                                                    required: true
                                                })}
                                                className="form-control"
                                                placeholder="designation"
                                            />
                                        </div>
                                    <div className="Field-group mb-3">
                                            <input
                                                {...register('BlockNumber', {
                                                    required: true
                                                })}
                                                className="form-control"
                                                placeholder="BlockNumber"
                                            />
                                        </div>
                                        <div className="Field-group mb-3">
                                            <input
                                                {...register('FlatNumber', {
                                                    required: true
                                                })}
                                                className="form-control"
                                                placeholder="FlatNumber"
                                            />
                                        </div> 
                                        <div className="row">
                                            <div className="col-12">
                                                <button
                                                    type="submit"
                                                    className="btn btn-warning btn-block"
                                                >
                                           Add Emergency Contact
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    {Spinner ? (
                                        <Loader
                                            type="spinner-circle"
                                            className="mt-5"
                                            bgColor={'#000000'}
                                            title={'...loading'}
                                            size={50}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AddEmergencyContact;
