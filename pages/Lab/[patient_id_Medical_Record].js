import { useRouter } from "next/router";
import axios from "axios";
import {useEffect,useState,useRef } from 'react'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Header from '../components/Header'
import SideNavbar from '../components/SideNavbar'
import styles from '../../styles/Home.module.css'
import {useAuth} from '../context/AuthContext'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import style from '../../styles/SickLeavePrint.module.css'
import {useReactToPrint} from "react-to-print";
import moment from 'moment';
import Cookies from 'universal-cookie';
import api from '../components/api.js'

export async function getServerSideProps(context) {
	const {params,req,res,query} = context
	const {patient_id_Medical_Record} = params
	const token = req.cookies.token
	if (!token) {
    	return {
      		redirect: {
        		destination: '/login',
        		permanent: false,
      		},
      	}
    }
	const accesstoken = token
	const authaxios = axios.create({
		baseURL : api,
		headers :{
			Authorization : `Bearer ${accesstoken} `
		}
	})
	const data = await authaxios.get(`${api}/laboratory/${patient_id_Medical_Record}`)
	
  	return {
    	props: {
	    	LabOrder :data.data,
	    }, // will be passed to the page component as props
	}
}

export default function DisplayLab({LabOrder}) {
	const {currentUser} = useAuth()
	const router = useRouter();
	useEffect(()=>{
        if(!currentUser){
            router.push('/login')
        }
    },[currentUser,router])
	const componentRef = useRef();
	const handlePrint = useReactToPrint({
		content:()=> componentRef.current
	})
	const [PrintData, setPrintData] = useState([])
	const LabOrderRecord = LabOrder['all']
	const OrderData=[]
	const ptientMRN = LabOrder['info'].MRN
	const [RequestId, setRequestId] =  useState([])
	const [RequestName, setRequestName] =  useState([])
	const [Infoid, setInfoid]= useState()
	const cookies = new Cookies();
    const accesstoken = cookies.get('token')
    const authaxios = axios.create({
        baseURL : api,
        headers :{
            Authorization : `Bearer ${accesstoken} `
        }
    })
	const IdList = []
	LabOrderRecord.map((LabOrderRecordOrder,index)=>{
		LabOrderRecordOrder.map((data,index)=>{
			IdList.push(data.InfoId)
			OrderData.push(data);
		})
	})

	const [show, setShow] = useState(false);
  	const handleClose = () => {
  		setShow(false);
  		setRequestId([])
  	}
  	const handleShow = () => setShow(true);
  	const [fullscreen, setFullscreen] = useState(true);

  	const [show1, setShow1] = useState(false);
  	const handleClose1 = () => {
  		setShow1(false);
  	}
  	const handleShow1 = () => setShow1(true);

	const withOutDuplicateId = [...new Set(IdList)];
	const groupBy = keys => array =>
  		array.reduce((objectsByKeyValue, obj) => {
    		const value = keys.map(key => obj[key]).join('-');
    		objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    		return objectsByKeyValue;
  	}, {});
  	const groupById = groupBy(['InfoId']);
  	const [Dates,setDates] = useState("")
  	const [createdBy,setCreatedBy] = useState("")
  	
  	const LabOrderGroupById = groupById(OrderData)
  	const AddToTheRequestId = (number)=>{
  		setRequestName([])
  		setInfoid(number)
  		LabOrderGroupById[number].map((data,index)=>{
  			setRequestName(RequestName=>[...RequestName, { id: data.id , Panel: data.Panel }]);
  		})
  	}

  	const SubmitUpdate = async(e)=>{
        e.preventDefault()
        console.log(RequestId)
        await authaxios.patch(`${api}/laboratory/`,{
        	InfoId:Infoid,
            RequestId:RequestId,
        }).then(function (response) {
            router.reload()
        }).catch(function (error) {
            console.log(error);
        });
  	}
	return(
		<div className={styles.home}>
            <SideNavbar mrn={ptientMRN}/>
            <div className={styles.homeContainer}>
				<Header />
				<Container className="px-4" >
					<div className="bg-white border my-3 rounded">
						<Row className="p-3">
							<Col md={4} className="text-center">
								<p>MRN</p>
								<p>{LabOrder['info'].MRN}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Name</p>
								<p>{LabOrder['info'].Name}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Age</p>
								<p>{LabOrder['info'].DateOfBirth}</p>
							</Col>
						</Row>

						<Row className="p-3">

							<Col md={4} className="text-center">
								<p>Gender</p>
								<p>{LabOrder['info'].Gender}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Phone Number</p>
								<p>{LabOrder['info'].PhoneNumber}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Occupation</p>
								<p>{LabOrder['info'].Occupation}</p>
							</Col>
						</Row>
					</div>
					<div>
						{withOutDuplicateId.map((number,id)=>(
							<div className="bg-white border my-5 rounded">
								<Row className="px-5 py-3">
									<Col md={6} className="">
										<h5>Created By</h5>
										<p>{LabOrderGroupById[number][0].CreatedBy}</p>
									</Col>

									<Col md={6} className="">
										<h5>Created Date</h5>
										<p>{moment(LabOrderGroupById[number][0].Requested_Date).utc().format('YYYY-MM-DD')}</p>
									</Col>
								</Row>
								<Row className="py-2 px-3">
									<Col md={12} className="d-flex justify-content-between px-5">
										<h5>Panel</h5>
									</Col>
								</Row>
								<div className="bg-light border m-3 rounded">
							    	{LabOrderGroupById[number].map((data,index)=>(
										<Row className="p-3">
											<Col md={12} className="d-flex justify-content-between px-5">
												<p>{data.Panel}</p>
											</Col>
										</Row>
									))}
								</div>
							</div>	
						))}
					</div>		
				</Container>
			</div>
		</div>
	)	
}