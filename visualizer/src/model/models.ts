export interface ReportCollection {
	[key: string]: Report[];
}

export interface Report {
	boottime: number;
	driveinfo: DriveInfo[];
	ipinfo: IpInfo[];
	netinfo: NetInfo[];
	userinfo: string;
	time: number;
	servertime: number;
}

export interface DriveInfo {
	Name: string;
	TotalSize: number;
	AvailableFreeSpace: number;
}

export interface IpInfo {
	InterfaceIndex: number;
	InterfaceAlias: string;
	AddressFamily: string;
	IPAddress: string;
}

export interface NetInfo {
	InterfaceAlias: string;
	ReceivedBytes: number;
	SentBytes: number;
}
