import Pagination from 'react-bootstrap/Pagination';
import { useState,useEffect, useContext} from 'react'
import Header from './components/Header'
import Image from 'next/image'
import axios from "axios";
import Link from "next/link";
import {AiOutlineArrowRight} from 'react-icons/ai';
import {AiOutlineDown} from 'react-icons/ai'
import {AiOutlineSearch} from 'react-icons/ai'
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router'
import moment from 'moment';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import {AiOutlineEye} from 'react-icons/ai';
import {useAuth} from './context/AuthContext'
import Nav from 'react-bootstrap/Nav';

export default function ImagingRequest() {
	const router = useRouter();
	const [patients,setpatients] = useState([])
	const [searchValue, setsearchValue] = useState('')
	const [searchParameter, setsearchParameter] = useState(1)
	const [placeholder,setPlaceholder] = useState("")	
	const [getSearchValue,setgetSearchValue] = useState("")
	const {currentUser} = useAuth()
    useEffect(()=>{
        if(!currentUser){
            router.push('/login')
        }else{
        	
        }
    },[currentUser, router])
	
	return(
		<div className="w-100 h-100">
			<Header />
			<div className="container" style={{"background-color": "#f5f6fa"}}>
				<Nav defaultActiveKey="/home" className="flex-column">
					<Nav.Link href="/home">Active</Nav.Link>
					<Nav.Link eventKey="link-1">Link</Nav.Link>
					<Nav.Link eventKey="link-2">Link</Nav.Link>
					<Nav.Link eventKey="disabled" disabled>
					    Disabled
					</Nav.Link>
				</Nav>
			</div>
		</div>
	)
}