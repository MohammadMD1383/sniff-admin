import "./App.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {ReportCollection} from "./model/models";
import {Accordion, AccordionDetails, AccordionSummary, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import {ExpandMoreRounded} from "@mui/icons-material";
import {calculateUsage, humanReadableSize} from "./util/util";

export default function App() {
	let [data, setData] = useState({} as ReportCollection);
	useEffect(() => {
		axios.get<ReportCollection>("http://localhost:8000/reports", {
			headers: {accept: "application/json"}
		}).then((response) => {
			setData(response.data);
		});
	}, []);
	
	return <>
		{Object.keys(data).map(user =>
			<Accordion key={user}>
				<AccordionSummary expandIcon={<ExpandMoreRounded/>}>
					<Typography variant={"h6"}>{user}</Typography>
				</AccordionSummary>
				
				<AccordionDetails>
					{data[user].sort((x, y) => x.servertime - y.servertime).map(report =>
						<Accordion key={report.servertime}>
							<AccordionSummary expandIcon={<ExpandMoreRounded/>}>
								<Typography fontStyle={"italic"}>{new Date(report.servertime).toLocaleString()}</Typography>
							</AccordionSummary>
							
							<AccordionDetails>
								<>
									<Typography fontWeight={"bold"}>Boot Time:</Typography>
									<Typography>{new Date(report.boottime).toLocaleString()}</Typography>
									
									<br/>
									
									<Typography fontWeight={"bold"}>Report Generated Time:</Typography>
									<Typography>{new Date(report.time).toLocaleString()}</Typography>
									
									<br/>
									
									<Typography fontWeight={"bold"}>Drive Status:</Typography>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Name</TableCell>
												<TableCell>Total Size</TableCell>
												<TableCell>Available Free Space</TableCell>
												<TableCell>% Usage</TableCell>
											</TableRow>
										</TableHead>
										
										<TableBody>
											{report.driveinfo.map(info =>
												<TableRow key={info.Name}>
													<TableCell>{info.Name}</TableCell>
													<TableCell>{humanReadableSize(info.TotalSize)}</TableCell>
													<TableCell>{humanReadableSize(info.AvailableFreeSpace)}</TableCell>
													<TableCell>{calculateUsage(info.TotalSize, info.AvailableFreeSpace)}%</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
									
									<br/>
									
									<Typography fontWeight={"bold"}>Device IPs:</Typography>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Interface Index</TableCell>
												<TableCell>Interface Alias</TableCell>
												<TableCell>Address Family</TableCell>
												<TableCell>IP Address</TableCell>
											</TableRow>
										</TableHead>
										
										<TableBody>
											{report.ipinfo.sort((a, b) => a.InterfaceIndex - b.InterfaceIndex).map(info =>
												<TableRow key={info.IPAddress}>
													<TableCell>{info.InterfaceIndex}</TableCell>
													<TableCell>{info.InterfaceAlias}</TableCell>
													<TableCell>{info.AddressFamily}</TableCell>
													<TableCell>{info.IPAddress}</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
									
									<br/>
									
									<Typography fontWeight={"bold"}>Network Usage Statistics:</Typography>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Interface Alias</TableCell>
												<TableCell>Received</TableCell>
												<TableCell>Sent</TableCell>
											</TableRow>
										</TableHead>
										
										<TableBody>
											{report.netinfo.map(info =>
												<TableRow key={info.InterfaceAlias}>
													<TableCell>{info.InterfaceAlias}</TableCell>
													<TableCell>{humanReadableSize(info.ReceivedBytes)}</TableCell>
													<TableCell>{humanReadableSize(info.SentBytes)}</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</>
							</AccordionDetails>
						</Accordion>
					)}
				</AccordionDetails>
			</Accordion>
		)}
	</>;
}
