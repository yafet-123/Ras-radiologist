import Header from '../components/Header'
import SideNavbar from '../components/SideNavbar'
import {AiOutlineRight} from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from "next/router";
import axios from "axios";
import {useEffect,useState ,useRef} from 'react'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Cookies from 'universal-cookie';
import {useAuth} from '../context/AuthContext'
import styles from '../../styles/Home.module.css'
import moment from 'moment';
import style from '../../styles/SickLeavePrint.module.css'
import {useReactToPrint} from "react-to-print";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import api from '../components/api.js'

export async function getServerSideProps(context) {
	const {params,req,res,query} = context
	const patient_id_Medical_Record = query.mrn
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
	const data = await authaxios.get(`${api}/radiology/result/${patient_id_Medical_Record}`)
  	return {
    	props: {
	    	Imaging_Result:data.data,
	    }, // will be passed to the page component as props
	}
}


export default function ImagingResult({Imaging_Result}){
	const Imagingresult = Imaging_Result['all']
	const ptientMRN = Imaging_Result['info'].MRN

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
	const [show1, setShow1] = useState(false);
  	const handleClose1 = () => {
  		setShow1(false);
  	}
  	const handleShow1 = () => setShow1(true);
  	console.log(PrintData)
	return(
		<div className={styles.home}>
            <SideNavbar mrn={ptientMRN}/>
            <div className={styles.homeContainer}>
				<Header />
				<Container >
					<div className="bg-white border my-3 rounded">
						<Row className="p-3">
							<Col md={4} className="text-center">
								<p>MRN</p>
								<p>{Imaging_Result['info'].MRN}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Name</p>
								<p>{Imaging_Result['info'].Name}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Age</p>
								<p>{Imaging_Result['info'].DateOfBirth}</p>
							</Col>
						</Row>

						<Row className="p-3">
							<Col md={4} className="text-center">
								<p>Gender</p>
								<p>{Imaging_Result['info'].Gender}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Phone Number</p>
								<p>{Imaging_Result['info'].PhoneNumber}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Occupation</p>
								<p>{Imaging_Result['info'].Occupation}</p>
							</Col>
						</Row>
					</div>

					{Imagingresult.map((data,index)=>(
						<div key={index} className="bg-white border my-3 rounded">
							<div className="bg-light border m-3 rounded">
								<Row className="p-3">

									<Col md={4} >
										<h5>Created By</h5>
										<p>{data.CreatedBy}</p>
									</Col>
									<Col md={4}>
										<h5>Requested Date</h5>
										<p>{data.Requested_Date}</p>
									</Col>

									<Col md={4}>
										<h5>Clinic</h5>
										<p>{data.Clinic}</p>
									</Col>
								</Row>

								<Row className="p-3">
									<Col md={6}>
										<h5>Request</h5>
										<p>{data.Request}</p>
									</Col>

									<Col md={6}>
										<h5>Result</h5>
										<p>{data.Result}</p>
									</Col>
								</Row>

								<Button className="m-3"
									variant="primary" 
									onClick={(index)=>{
										handleShow1()
										setPrintData(data)
									}}
								>
						    		Print
     							</Button>
								
							</div>
						</div>

					))}

					<Modal size="lg" show={show1} onHide={handleClose1} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
							<Modal.Header closeButton>
								<Modal.Title>Modal title</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<div className={style.Print} ref={componentRef}>
			        				<Container>
							            <h4 className="d-flex justify-content-center">
					            			Ras Hospital Management System
					          			</h4>

					          			<h5 className="d-flex justify-content-center">
					          				Radiology Request
					          			</h5>

					          			<div className="d-flex justify-content-between">
						          				<div className="d-flex flex-column">
											      	<h6>Address</h6>
											      	<p>
											      		Addis Ababa, Ethiopia
											      	</p>
											    </div>
											    <div className="d-flex flex-column">
											        <h6>Phone</h6>
											        <p>
											          	+251-911-123-456
											        </p>
											    </div>

											    <div className="d-flex flex-column">
											        <h6>Email</h6>
											        <p>
														someone@gmail.com
											        </p>
											    </div>
											    <div className="d-flex flex-column">
											        <h6>Postal</h6>
											        <p>
											          	01234
											        </p>
											    </div>
					      				</div>

						      			<div className="d-flex justify-content-between">
						          				<div md={3} className="d-flex flex-column">
											      	<h6>MRN</h6>
											      	<p>
											      		{Imaging_Result['info'].MRN}
											      	</p>
											    </div>
											    <div md={3} className="d-flex flex-column">
											        <h6>Full Name</h6>
											        <p>
											          	{Imaging_Result['info'].Name}
											        </p>
											    </div>
											    <div md={3} className="d-flex flex-column">
											        <h6>Age</h6>
											        <p>
														{Imaging_Result['info'].DateOfBirth}
											        </p>
											    </div>
											    <div md={3} className="d-flex flex-column">
											        <h6>Gender</h6>
											        <p>
											          	{Imaging_Result['info'].Gender}
											        </p>
											    </div>
						      			</div>

					      				<div className="d-flex justify-content-between">
										        <div>
										        	<h6>Request</h6>
													<p className="d-flex flex-column">
													    {PrintData.Request}
													</p>
										        </div>

										         <div>
										        	<h6>Result</h6>
													<p className="d-flex flex-column">
													    {PrintData.Result}
													</p>
										        </div>
					      				</div>

					      				<div className="d-flex justify-content-between">
					      					<div className="d-flex flex-column">
										        <h6>Date of Examination</h6>
										        <p>
													{moment(PrintData.Requested_Date).utc().format('YYYY-MM-DD')}
										        </p>
										    </div>

					      					<div className="d-flex flex-column">
										        <h6>Doctor's Name</h6>
										        <p>
													{PrintData.CreatedBy}
										        </p>
										    </div>
										</div>
	      							</Container>
	        					</div>	
							</Modal.Body>
							<Modal.Footer>
								<Button variant="primary" onClick={handlePrint}>
									Print
								</Button>
								<Button variant="secondary" onClick={handleClose1}>
									Close
								</Button>
							</Modal.Footer>
						</Modal>		
						
					
				</Container>
			</div>	
		</div>
	)	
}





