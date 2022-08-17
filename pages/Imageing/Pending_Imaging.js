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
import moment from 'moment';
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
	const data = await authaxios.get(`${api}/radiology/payment/${patient_id_Medical_Record}`)
  	return {
    	props: {
	    	RadiologyPayment:data.data,
	    }, // will be passed to the page component as props
	}
}

export default function PendingImaging({RadiologyPayment}){
	const patientRadiology = RadiologyPayment['all']
	const ptientMRN = RadiologyPayment['info'].MRN
	console.log(patientRadiology)
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
								<p>{RadiologyPayment['info'].MRN}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Name</p>
								<p>{RadiologyPayment['info'].Name}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Age</p>
								<p>{RadiologyPayment['info'].DateOfBirth}</p>
							</Col>
						</Row>

						<Row className="p-3">
							<Col md={4} className="text-center">
								<p>Gender</p>
								<p>{RadiologyPayment['info'].Gender}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Phone Number</p>
								<p>{RadiologyPayment['info'].PhoneNumber}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Occupation</p>
								<p>{RadiologyPayment['info'].Occupation}</p>
							</Col>
						</Row>
					</div>

					{ patientRadiology.map((data,index)=>(
						<div key={index} className="bg-white border my-3 rounded">
							<div className="bg-light border m-3 rounded">
				            	<Row className="p-3">
				            		<Col md={3} >
										<h5>Created By</h5>
										<p>{data.CreatedBy}</p>
									</Col>
									<Col md={3} >
										<h5>Requested Date</h5>
										<p>{moment(data.Requested_Date).utc().format('YYYY-MM-DD')}</p>
									</Col>
									<Col md={3}>
										<h5>Clinic</h5>
										<p>{data.Clinic}</p>
									</Col>

									<Col md={3}>
										<h5>Request</h5>
										<p>{data.Request}</p>
									</Col>
								</Row>
							</div>
						</div>
					))}

						
					
				</Container>
			</div>	
		</div>
	)	
}





