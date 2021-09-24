import React, {useState, useEffect} from 'react';
import {Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import {Gatekeeper} from 'gatekeeper-client-sdk';

import Dashboard from '@pages/Dashboard';
import Profile from '@pages/profile/Profile';

import Users from '@app/pages/Block/Blocks';

import AddFlatsPage from '@app/pages/Flats/AddFlatsPage';
import Header from './header/Header';
import Footer from './footer/Footer';
import MenuSidebar from './menu-sidebar/MenuSidebar';
import PageLoading from '../../components/page-loading/PageLoading';
import * as ActionTypes from '../../store/actions';
import ChangePassword from '../../pages/ChangePassword/ChangePassword';

import AddBlockPage from '../../pages/Block/AddBlockPage';
import Blocks from '../../pages/Block/Blocks';

import FlatsPage from '../../pages/Flats/FlatsPage';

const Main = ({onUserLoad}) => {
    const [appLoadingState, updateAppLoading] = useState(false);
    const [menusidebarState, updateMenusidebarState] = useState({
        isMenuSidebarCollapsed: false
    });

    const toggleMenuSidebar = () => {
        updateMenusidebarState({
            isMenuSidebarCollapsed: !menusidebarState.isMenuSidebarCollapsed
        });
    };

    useEffect(() => {
        updateAppLoading(true);
        const fetchProfile = async () => {
            try {
                const response = await Gatekeeper.getProfile();
                onUserLoad({...response});
                updateAppLoading(false);
            } catch (error) {
                updateAppLoading(false);
            }
        };
        fetchProfile();
        return () => {};
    }, [onUserLoad]);

    document.getElementById('root').classList.remove('register-page');
    document.getElementById('root').classList.remove('login-page');
    document.getElementById('root').classList.remove('hold-transition');

    document.getElementById('root').className += ' sidebar-mini';

    if (menusidebarState.isMenuSidebarCollapsed) {
        document.getElementById('root').classList.add('sidebar-collapse');
        document.getElementById('root').classList.remove('sidebar-open');
    } else {
        document.getElementById('root').classList.add('sidebar-open');
        document.getElementById('root').classList.remove('sidebar-collapse');
    }

    let template;

    if (appLoadingState) {
        template = <PageLoading />;
    } else {
        template = (
            <>
                <Header toggleMenuSidebar={toggleMenuSidebar} />

                <MenuSidebar />
                <div className="content-wrapper">
                    <div className="pt-3" />
                    <section className="content">
                        <Switch>
                            <Route
                                exact
                                path="/changePassword"
                                component={ChangePassword}
                            />

                            <Route exact path="/blocks" component={Blocks} />
                            <Route exact path="/flats" component={FlatsPage} />

                            <Route
                                exact
                                path="/AddBlock"
                                component={AddBlockPage}
                            />
                            <Route
                                exact
                                path="/AddFlat"
                                component={AddFlatsPage}
                            />

                            <Route exact path="/profile" component={Profile} />
                            <Route exact path="/users" component={Users} />
                            <Route exact path="/" component={Dashboard} />
                        </Switch>
                    </section>
                </div>
                <Footer />
                <div
                    id="sidebar-overlay"
                    role="presentation"
                    onClick={toggleMenuSidebar}
                    onKeyDown={() => {}}
                />
            </>
        );
    }

    return <div className="wrapper">{template}</div>;
};

const mapStateToProps = (state) => ({
    user: state.auth.currentUser
});

const mapDispatchToProps = (dispatch) => ({
    onUserLoad: (user) =>
        dispatch({type: ActionTypes.LOAD_USER, currentUser: user})
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
