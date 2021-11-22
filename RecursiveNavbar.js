import React, { useState, useEffect } from 'react'
import {
    Collapse,
    Navbar,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';

import "../css/NavBar.css";
import { Link, NavLink as RRNavLink } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { BiDoorOpen } from "react-icons/bi";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import AuthenServices from '../services/authenServices'

var url = process.env.REACT_APP_DWR_API;
var auth = new AuthenServices()

//*****************************************************************************************************************************

export default function NavBar(props) {
    const [isOpen] = useState(false);
    const [topNavBar, setTopNavBar] = useState(false);
    const [menuList, setMenuList] = useState([])

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 992px)'
    })

    const isTabletOrMobileDevice = useMediaQuery({
        query: '(max-width: 991px)'
    })

    const toggleTopNavBar = () => {
        setTopNavBar(!topNavBar)
    }

    const logout = () => {
        auth.logout()
        window.location.href = '/login'
    }

    //*********************************************************************************************************************

    useEffect(() => {
            getMenu()
    }, [])

    //*********************************************************************************************************************

    function getMenu() {
        auth.fetchWithToken(url + '/api/v1/HydroFunction/Menu', "method:'GET'")
            .then(res => {
                if (res.data && res.data.children[0] && res.data.children[0].children) {
                    setMenuList(res.data.children[0].children)
                }
            })
            .catch(e => {
                console.log(e)
                setMenuList([])
            })
    }

    //*********************************************************************************************************************

    return (
        <div>
            {isDesktopOrLaptop &&
                <Navbar color={props.name === 'gmap' ? 'transparent' : ''} expand="sm" className={props.name === 'gmap' ? 'navBtnGmap' : 'navBtnNotGmap'} style={{ whiteSpace: 'nowrap' }}>
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {props.name !== 'gmap' ?
                                <React.Fragment>
                                    <img src={process.env.PUBLIC_URL + '/img/Logodwr.png'} style={{ width: '40px', height: 'auto', zIndex: '1000', position: 'absolute', left: '15px', top: '-3px' }} />
                                    <span style={{ color: '#EAEAEA', left: '65px', top: '5px', position: 'absolute' }}>กรมทรัพยากรน้ำ <span style={{ display: 'block', marginBottom: '-.3em' }}></span>Department of Water Resources</span>
                                </React.Fragment>
                                : ''}

                            <NavItem className='navBtn'>
                                <NavLink activeClassName="navActive" tag={RRNavLink} exact to="/home">แผนที่ติดตั้งสถานี</NavLink>
                            </NavItem>
                            <NavItem className='navBtn'>
                                <NavLink activeClassName="navActive" tag={RRNavLink} exact to="/news">ข่าวประชาสัมพันธ์</NavLink>
                            </NavItem>
                            <NavItem className='navBtn'>
                                <NavLink activeClassName="navActive" tag={RRNavLink} exact to="/admin/webboard/webboard">กระดานสนทนา</NavLink>
                            </NavItem>

                            <NavItem className='navBtnSmall'>
                            <div style={{ padding: '5px' }} onClick={logout}>
                                <BiDoorOpen  color='white' />
                            </div>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            }

            {
                isTabletOrMobileDevice &&
                <React.Fragment>
                    <div
                        style={{
                            position: "fixed",
                            top: "0px",
                            right:'60px',
                            zIndex: "1500",
                        }}
                    >
                        <div
                            id="nav-icon3"
                            onClick={toggleTopNavBar}
                            className={topNavBar ? "open" : ""}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>

                        </div>

                    </div>

                    <ProSidebar className={topNavBar ? 'NavBar open' : 'NavBar hide'}>
                        {auth.loggedIn() ? <div style={{ position: 'absolute', left: '10px', fontWeight: 'bold',color:'blue', textDecoration: 'underline', cursor:'pointer' }} onClick={logout} >ออกจากระบบ</div> : ''}
                        <Menu>
                            <MenuItem style={{ marginTop: '30px', fontWeight: 'bold' }}>
                                แผนที่ติดตั้งสถานี
                            <Link onClick={toggleTopNavBar} to="/home" />
                            </MenuItem>
                            <MenuItem style={{ fontWeight: 'bold' }}>ข่าวประชาสัมพันธ์
                            <Link onClick={toggleTopNavBar} to="/news" />
                            </MenuItem>
                            <MenuItem style={{ fontWeight: 'bold' }}>กระดานสนทนา
                            <Link onClick={toggleTopNavBar} to="/admin/webboard/webboard" />
                            </MenuItem>

                            {menuList.map((submenu) => (
                                <RenderSubMenu
                                    key={submenu.data.functionId}
                                    submenu={submenu}
                                    index={submenu.data.functionId}
                                    currentpath={props.currentpath}
                                    toggleTopNavBar={toggleTopNavBar}
                                />
                            ))}
                        </Menu>
                    </ProSidebar>

                </React.Fragment>

            }
        </div >
    )
}

const RenderSubMenu = React.memo(({ submenu, currentpath, index, toggleTopNavBar }) => {
    let resultEle = []

    if (submenu) {
        resultEle.push(
            <div key={index}>
                {
                    submenu.isLeaf && submenu.data.menuPath ?
                        <MenuItem className={currentpath == submenu.data.menuPath ? 'menuActive' : ''}>{submenu.data.functionName}
                            <Link to={submenu.data.menuPath} onClick={toggleTopNavBar} />
                        </MenuItem>
                        :
                        <SubMenu style={{ fontWeight: submenu.level == 2 ? 'bold' : '' }} title={submenu.data.functionName}>
                            {
                                submenu.children.map((nextsubmenu, i) => {
                                    return (
                                        <RenderSubMenu
                                            key={i}
                                            index={nextsubmenu.data.functionId}
                                            submenu={nextsubmenu}
                                            currentpath={currentpath}
                                            toggleTopNavBar={toggleTopNavBar}
                                        />
                                    )
                                })
                            }
                        </SubMenu>
                }
            </div>

        )
    }

    return (
        <>
            {resultEle}
        </>
    )
})
