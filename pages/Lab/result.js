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
	const data = await authaxios.get(`${api}/orderlab/${patient_id_Medical_Record}`)
	
  	return {
    	props: {
	    	OrderLab:data.data,
	    }, // will be passed to the page component as props
	}
}


export default function OrderLabWithResult({OrderLab}){
	const OrderLabRecord = OrderLab['all']
	const ptientMRN = OrderLab['info'].MRN
	const router = useRouter();
	const IdList = []

	OrderLabRecord.map((data)=>(
		IdList.push(data.Id)
	))
	const groupBy = keys => array =>
  		array.reduce((objectsByKeyValue, obj) => {
    		const value = keys.map(key => obj[key]).join('-');
    		objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    		return objectsByKeyValue;
  	}, {});
  	const withOutDuplicateId = [...new Set(IdList)];
  	const groupById = groupBy(['Id']);
  	const OrderLabRecordGroupById = groupById(OrderLabRecord)

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
								<p>{OrderLab['info'].MRN}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Name</p>
								<p>{OrderLab['info'].Name}</p>
							</Col>
							<Col md={4} className="text-center">
								<p>Age</p>
								<p>{OrderLab['info'].DateOfBirth}</p>
							</Col>
						</Row>

						<Row className="p-3">

							<Col md={4} className="text-center">
								<p>Gender</p>
								<p>{OrderLab['info'].Gender}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Phone Number</p>
								<p>{OrderLab['info'].PhoneNumber}</p>
							</Col>

							<Col md={4} className="text-center">
								<p>Occupation</p>
								<p>{OrderLab['info'].Occupation}</p>
							</Col>
						</Row>
					</div>
					<div>
						{withOutDuplicateId.map((number,id)=>(
							<div className="bg-white border my-5 rounded">
								<Row className="px-5 py-3">
										<Col md={6} className="">
											<h5>Created By</h5>
											<p>{OrderLabRecordGroupById[number][0].CreatedBy}</p>
										</Col>

										<Col md={6} className="">
											<h5>Created Date</h5>
											<p>{moment(OrderLabRecordGroupById[number][0].Requested_Date).utc().format('YYYY-MM-DD')}</p>
										</Col>
									</Row>

									<Row className="py-3 px-5">
											<Col md={2} >
												<h5>Panel</h5>
											</Col>
											<Col md={2}>
												<h5>Test</h5>
											</Col>

											<Col md={3} >
												<h5>Result</h5>
											</Col>
											<Col md={5}>
												<h5>Release</h5>
											</Col>
										</Row>
								<div className="bg-light border m-3 rounded">
							
									{OrderLabRecordGroupById[number].map((data,index)=>(
										<Row className="py-3 px-5">
											<Col md={2} >
												<p>{data.Panel}</p>
											</Col>
											<Col md={2}>
												<p>{data.Test}</p>
											</Col>

											<Col md={3} >
												<p>{data.Result}</p>
											</Col>
											<Col md={5}>
												<p>{data.Release}</p>
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





