import Header from '../components/Header'
import SideNavbar from '../components/SideNavbar'
import {AiOutlineRight} from 'react-icons/ai'
import Link from 'next/link'
import { useRouter } from "next/router";
import axios from "axios";
import {useEffect,useState } from 'react'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Cookies from 'universal-cookie';
import {useAuth} from '../context/AuthContext'
import styles from '../../styles/Home.module.css'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
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
	const data = await authaxios.get(`${api}/radiology/pendingresult/${patient_id_Medical_Record}`)
  	return {
    	props: {
	    	PendingResult:data.data,
	    }, // will be passed to the page component as props
	}
}


export default function AllRequestImaging({PendingResult}){
	const Pending_Result = PendingResult['all']
	const ptientMRN = PendingResult['info'].MRN
	const [id,setid] = useState()
	const [Result, setResult] =useState("")
	const [show, setShow] = useState(false);
  	const handleClose = () => {setShow(false);}
  	const handleShow = () => setShow(true);
  	const [fullscreen, setFullscreen] = useState(true);
  	const cookies = new Cookies();
    const accesstoken = cookies.get('token')
    const authaxios = axios.create({
        baseURL : api,
        headers :{
            Authorization : `Bearer ${accesstoken} `
        }
    })
	const SubmitUpdate = async(e)=>{
        e.preventDefault()
        console.log(id)
        await authaxios.patch(`${api}/radiology/pendingresult/${id}`,{
        	Result
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
				<Container >
					<div className="bg-white border my-3 rounded">
						<Row className="p-3">
							<Col md={4} className="text-center">
								<p>MRN</p>
								<p>{PendingResult['info'].MRN}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Name</p>
								<p>{PendingResult['info'].Name}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Age</p>
								<p>{PendingResult['info'].DateOfBirth}</p>
							</Col>
						</Row>

						<Row className="p-3">
							<Col md={4} className="text-center">
								<p>Gender</p>
								<p>{PendingResult['info'].Gender}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Phone Number</p>
								<p>{PendingResult['info'].PhoneNumber}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Occupation</p>
								<p>{PendingResult['info'].Occupation}</p>
							</Col>
						</Row>
					</div>

					{Pending_Result.map((data,index)=>(
						<div key={index} className="bg-white border my-3 rounded">
							<div className="bg-light border my-3 rounded">
								<Row className="p-3">
									<Col md={3} >
										<h5>Request Id</h5>
										<p>{data.Requestid}</p>
									</Col>

									<Col md={3} >
										<h5>Created By</h5>
										<p>{data.CreatedBy}</p>
									</Col>
									<Col md={3}>
										<h5>Requested Date</h5>
										<p>{data.Requested_Date}</p>
									</Col>

									<Col md={3}>
										<h5>Clinic</h5>
										<p>{data.Clinic}</p>
									</Col>
								</Row>

								<Row className="p-3">
									<Col md={12}>
										<h5>Request</h5>
										<p>{data.Request}</p>
									</Col>
								</Row>
								<Button className="m-3"
									variant="primary" 
									onClick={(index)=>{
						        		handleShow()
						        		setid(data.Requestid)
						        	}}
						        >
						        	Update
     						 	</Button>
							</div>
						</div>
					))}	
						
						<Modal size="lg" show={show} onHide={handleClose} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
							<Modal.Header closeButton>
								<Modal.Title>Modal title</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<FloatingLabel controlId="floatingTextarea2" label="History">
		                            <Form.Control
		                                as="textarea"
		                                placeholder="History"
		                                style={{ height: '200px' }}
		                                value={Result}
		                                onChange={(e) => setResult(e.target.value)}
		                            />
                           		</FloatingLabel>
							</Modal.Body>
							<Modal.Footer>
								<Button onClick={SubmitUpdate}>
									submit
								</Button>
								<Button variant="secondary" onClick={handleClose}>
									Close
								</Button>
							</Modal.Footer>
						</Modal>
				</Container>
			</div>	
		</div>
	)	
}





