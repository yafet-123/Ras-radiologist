import {useEffect,useState} from 'react'
import Link from 'next/link'
import styles from '../../styles/Sidebar.module.css'
import { FaGreaterThan } from 'react-icons/fa';

export default function SideNavbar({mrn}){
	return(
		<div className={styles.sidebar}>
            <div className={styles.top}>
                <h5>Radiology</h5>
            </div>
            <hr className={styles.horizontal}/>
            <div className={styles.center}>
                <ul className={styles.ullist}>
                   	<li className={styles.list}>
                        <Link href={{pathname: `/Imageing/All_Request_Imaging`, query:{ mrn: mrn }}} >
                            <a style={{ textDecoration: "none" }}>
                                <span className={styles.spanstyle}>Request Imaging</span>
                            </a>
                        </Link>
                    </li>

                    <li className={styles.list}>
                        <Link href={{pathname: `/Imageing/Pending_Imaging`, query:{ mrn: mrn }}} >
                            <a style={{ textDecoration: "none" }}>
                                <span className={styles.spanstyle}>Pending Imaging</span>
                            </a>
                        </Link>
                    </li>

                    <li className={styles.list}>
                        <Link href={{pathname: `/Imageing/Pending_Result_Imaging`, query:{ mrn: mrn }}} >
                            <a style={{ textDecoration: "none" }}>
                                <span className={styles.spanstyle}>Pending Result Imaging</span>
                            </a>
                        </Link>
                    </li>

                    <li className={styles.list}>
                        <Link href={{pathname: `/Imageing/Imaging_Result`, query:{ mrn: mrn }}} >
                            <a style={{ textDecoration: "none" }}>
                                <span className={styles.spanstyle}>Imaging Result</span>
                            </a>
                        </Link>
                    </li>

                    <li className={styles.dropdown}>
                        <input id="drop6" type="checkbox"/>
                        <label htmlFor="drop6" className="d-flex justify-content-between">
                            <span className={styles.spanstyle}>Laboratory</span>
                            <FaGreaterThan className={styles.icon} />
                        </label>
                        <ul className={styles.ullist}>
                            <li className={styles.dropdownlist}>
                                <Link  href={{ pathname: `/Lab/addLab`, query:{ mrn: mrn }}}  >   
                                    <a style={{ textDecoration: "none" }}>
                                        <span className={styles.spanstyle}>Order Lab</span> 
                                    </a>          
                                </Link>
                            </li>

                            <li className={styles.dropdownlist}>
                                <Link href={{pathname: `/Lab/${encodeURIComponent(mrn)}`}}  >   
                                    <a style={{ textDecoration: "none" }}>
                                        <span className={styles.spanstyle}>Lab Order</span> 
                                    </a>          
                                </Link>
                            </li> 

                            <li className={styles.dropdownlist}>
                                <Link  href={{ pathname: `/Lab/result`, query:{ mrn: mrn }}}  >   
                                    <a style={{ textDecoration: "none" }}>
                                        <span className={styles.spanstyle}>Lab Result</span> 
                                    </a>          
                                </Link>
                            </li>     
                        </ul>
                    </li>
                </ul>
            </div> 
        </div>
	)
}
